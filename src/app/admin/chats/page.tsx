import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminChatsPage() {
  const supabase = await createClient();
  
  // Check if user is admin (you can implement proper admin check)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // Fetch all messages with user info
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      user_profiles:user_id (
        id,
        country,
        destination_country,
        visa_type
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching messages:', error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Chat History - All Users</h1>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Messages ({messages?.length || 0})</h2>
        </div>
        
        <div className="divide-y">
          {messages?.map((message) => (
            <div key={message.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {message.role === 'user' ? 'USER' : 'GENIE'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {message.user_profiles ? 
                      `${message.user_profiles.country || 'No country'} → ${message.user_profiles.destination_country || 'No destination'}` 
                      : 'No profile'
                    }
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              
              <div className={`p-3 rounded ${
                message.role === 'user' ? 'bg-blue-50 border border-blue-100' : 'bg-green-50 border border-green-100'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {!messages?.length && (
          <div className="p-8 text-center text-gray-500">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}
