'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  source: 'ai-extraction' | 'manual' | 'system';
  createdAt: string;
  completedAt?: string;
  userId: string;
  messageId?: string;
  topic?: string;
}

interface ActionItemsWidgetProps {
  userId: string;
  className?: string;
}

export function ActionItemsWidgetFixed({ userId, className }: ActionItemsWidgetProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        const supabase = createClient();
        
        // Fetch existing action items
        const { data: items, error: fetchError } = await supabase
          .from('action_items')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        setActionItems(items || []);
        
        // Extract new action items from recent messages
        await extractActionItemsFromMessages();
        
      } catch (err) {
        console.error('Error fetching action items:', err);
        setError('Failed to load action items');
      } finally {
        setLoading(false);
      }
    };

    const extractActionItemsFromMessages = async () => {
      try {
        const supabase = createClient();
        
        // Get recent messages from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const { data: messages, error: msgError } = await supabase
          .from('chat_messages')
          .select('id, content, role, topic, event, payload, created_at')
          .eq('user_id', userId)
          .gte('created_at', twentyFourHoursAgo)
          .order('created_at', { ascending: false })
          .limit(50);

        if (msgError) throw msgError;

        // Extract action items using your existing visa-chat-assistant patterns
        const extractedItems = await extractTasksFromMessages(messages || []);
        
        // Save extracted items
        for (const item of extractedItems) {
          const { error: insertError } = await supabase
            .from('action_items')
            .upsert(item, { onConflict: 'message_id,title' });

          if (insertError) console.error('Error inserting action item:', insertError);
        }

      } catch (err) {
        console.error('Error extracting action items:', err);
      }
    };

    fetchActionItems();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`action_items_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'action_items',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setActionItems(prev => [payload.new as ActionItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setActionItems(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as ActionItem : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setActionItems(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const extractTasksFromMessages = async (messages: any[]): Promise<Partial<ActionItem>[]> => {
    // Build on your existing visa-chat-assistant extraction patterns
    const extractedItems: Partial<ActionItem>[] = [];
    
    // Pattern matching based on role and content
    const taskPatterns = [
      // User expressing concerns or asking about actions
      { 
        role: 'user', 
        patterns: [
          /need to\s+(.+?)(?:\.|$)/i,
          /should i\s+(.+?)(?:\?|$)/i,
          /when should i\s+(.+?)(?:\?|$)/i,
          /do i need to\s+(.+?)(?:\?|$)/i,
          /remind me to\s+(.+?)(?:\.|$)/i
        ],
        priority: 'medium' as const 
      },
      // AI giving recommendations
      { 
        role: 'assistant', 
        patterns: [
          /you should\s+(.+?)(?:\.|$)/i,
          /make sure to\s+(.+?)(?:\.|$)/i,
          /don't forget to\s+(.+?)(?:\.|$)/i,
          /it's important to\s+(.+?)(?:\.|$)/i,
          /complete\s+(.+?)by\s+(.+?)(?:\.|$)/i
        ],
        priority: 'high' as const 
      }
    ];

    messages.forEach(message => {
      const rolePatterns = taskPatterns.find(tp => tp.role === message.role);
      if (!rolePatterns) return;

      rolePatterns.patterns.forEach(pattern => {
        const match = message.content.match(pattern);
        if (match) {
          const task = match[1]?.trim();
          if (task && task.length > 10 && task.length < 200) {
            extractedItems.push({
              title: `${message.role === 'user' ? 'Consider: ' : ''}${task}`,
              description: `From ${message.role} message: "${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}"`,
              status: 'pending',
              priority: rolePatterns.priority,
              source: 'ai-extraction',
              userId: userId,
              messageId: message.id,
              topic: message.topic,
              createdAt: new Date().toISOString(),
              dueDate: extractDateFromText(message.content, message.payload)
            });
          }
        }
      });
    });

    return extractedItems;
  };

  const extractDateFromText = (content: string, payload: any): string | undefined => {
    // Check both content and payload for dates
    const datePatterns = [
      /by\s+(\w+\s+\d+)/i,
      /before\s+(\w+\s+\d+)/i,
      /on\s+(\w+\s+\d+)/i,
      /(\d+\/\d+\/\d+)/i,
      /(\d{4}-\d{2}-\d{2})/i
    ];

    const textToSearch = `${content} ${JSON.stringify(payload || {})}`;
    
    for (const pattern of datePatterns) {
      const match = textToSearch.match(pattern);
      if (match) {
        const parsedDate = new Date(match[1] + ' ' + new Date().getFullYear());
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
      }
    }
    return undefined;
  };

  const toggleItemStatus = async (itemId: string, currentStatus: string) => {
    try {
      const supabase = createClient();
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('action_items')
        .update({ 
          status: newStatus, 
          completed_at: completedAt 
        })
        .eq('id', itemId);

      if (error) throw error;

    } catch (err) {
      console.error('Error updating action item:', err);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

    } catch (err) {
      console.error('Error deleting action item:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const pendingItems = actionItems.filter(item => item.status === 'pending');
  const completedItems = actionItems.filter(item => item.status === 'completed');

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} pb-4`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <MessageSquare className="w-5 h-5" />
            Action Items
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {pendingItems.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className={`font-semibold text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
              To Do ({pendingItems.length})
            </h4>
            {pendingItems.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                  item.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItemStatus(item.id, item.status)}
                  className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {getStatusIcon(item.status)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h5 className={`font-medium ${item.status === 'completed' ? 'line-through text-gray-500' : ''} ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {item.title}
                      </h5>
                      {item.description && (
                        <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {item.description}
                        </p>
                      )}
                      {item.topic && (
                        <Badge variant="outline" className={`mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          {item.topic}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPriorityColor(item.priority)} ${isMobile ? 'text-xs' : 'text-xs'}`}>
                        {item.priority}
                      </Badge>
                      {item.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="space-y-3">
            <h4 className={`font-semibold text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
              Completed ({completedItems.length})
            </h4>
            {completedItems.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
              >
                <button
                  onClick={() => toggleItemStatus(item.id, item.status)}
                  className="mt-1 flex-shrink-0"
                >
                  {getStatusIcon(item.status)}
                </button>
                
                <div className="flex-1">
                  <h5 className="font-medium text-gray-500 line-through ${isMobile ? 'text-sm' : 'text-base'}">
                    {item.title}
                  </h5>
                  <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Completed {new Date(item.completedAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {completedItems.length > 3 && (
              <p className={`text-center text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                +{completedItems.length - 3} more completed items
              </p>
            )}
          </div>
        )}

        {actionItems.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
              No action items yet. Chat with our AI assistant to get personalized tasks!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
