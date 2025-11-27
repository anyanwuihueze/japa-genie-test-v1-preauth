// src/components/dashboard/enhanced-profile-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Edit,
  Target,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface EnhancedProfileCardProps {
  userProfile: any;
  userId: string;
  onProfileUpdate?: () => void;
}

export function EnhancedProfileCard({ userProfile, userId, onProfileUpdate }: EnhancedProfileCardProps) {
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    country: '',
    destination_country: '',
    age: '',
    visa_type: '',
    profession: '',
    user_type: '',
    timeline_urgency: '',
    budget: '',
    alternative_countries: [] as string[],
  });

  useEffect(() => {
    setMounted(true);
    if (userProfile) {
      setFormData({
        country: userProfile.country || '',
        destination_country: userProfile.destination_country || '',
        age: userProfile.age?.toString() || '',
        visa_type: userProfile.visa_type || '',
        profession: userProfile.profession || '',
        user_type: userProfile.user_type || '',
        timeline_urgency: userProfile.timeline_urgency || '',
        budget: userProfile.budget || '',
        alternative_countries: userProfile.alternative_countries || [],
      });
    }
  }, [userProfile]);

  if (!mounted) return null;

  const requiredFields = [
    { key: 'country', label: 'Country', icon: MapPin },
    { key: 'destination_country', label: 'Destination', icon: Target },
    { key: 'age', label: 'Age', icon: Calendar },
    { key: 'visa_type', label: 'Visa Type', icon: GraduationCap },
    { key: 'user_type', label: 'Profile Type', icon: User },
    { key: 'timeline_urgency', label: 'Timeline', icon: Clock },
  ];

  const filledFields = requiredFields.filter(field => 
    userProfile?.[field.key] && userProfile[field.key].toString().trim() !== ''
  ).length;

  const totalFields = requiredFields.length;
  const completion = Math.round((filledFields / totalFields) * 100);
  const missingFields = requiredFields.filter(field => 
    !userProfile?.[field.key] || userProfile[field.key].toString().trim() === ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const updateData = {
        country: formData.country,
        destination_country: formData.destination_country,
        age: parseInt(formData.age) || null,
        visa_type: formData.visa_type,
        profession: formData.profession,
        user_type: formData.user_type,
        timeline_urgency: formData.timeline_urgency,
        budget: formData.budget,
        alternative_countries: formData.alternative_countries,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        if (onProfileUpdate) onProfileUpdate();
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeDisplay = (type: string) => {
    const types: Record<string, { icon: string; label: string }> = {
      student: { icon: '🎓', label: 'Student' },
      professional: { icon: '💼', label: 'Working Professional' },
      business_owner: { icon: '🏢', label: 'Business Owner' },
      tourist: { icon: '✈️', label: 'Tourist/Visitor' },
      career_changer: { icon: '🔄', label: 'Career Changer' },
      family_migrant: { icon: '🏠', label: 'Family Migrant' },
    };
    return types[type] || { icon: '👤', label: type };
  };

  const getTimelineDisplay = (timeline: string) => {
    const timelines: Record<string, string> = {
      asap: '🚀 ASAP (0-3 months)',
      '3-6_months': '📅 3-6 months',
      '6-12_months': '🗓️ 6-12 months',
      exploring: '🔍 Exploring options',
    };
    return timelines[timeline] || timeline;
  };

  const renderCompleteStatus = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <MapPin className="w-4 h-4 text-blue-600" />
          <div>
            <div className="text-xs text-muted-foreground">From</div>
            <div className="font-medium">{userProfile?.country || 'N/A'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <Target className="w-4 h-4 text-green-600" />
          <div>
            <div className="text-xs text-muted-foreground">Destination</div>
            <div className="font-medium">{userProfile?.destination_country || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <Calendar className="w-4 h-4 text-purple-600" />
          <div>
            <div className="text-xs text-muted-foreground">Age</div>
            <div className="font-medium">{userProfile?.age ? `${userProfile.age} years` : 'N/A'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <Briefcase className="w-4 h-4 text-purple-600" />
          <div>
            <div className="text-xs text-muted-foreground">Profession</div>
            <div className="font-medium">{userProfile?.profession || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <div>
            <div className="text-xs text-muted-foreground">Visa Type</div>
            <div className="font-medium">{userProfile?.visa_type || 'N/A'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
          <Clock className="w-4 h-4 text-orange-600" />
          <div>
            <div className="text-xs text-muted-foreground">Timeline</div>
            <div className="font-medium text-xs">{getTimelineDisplay(userProfile?.timeline_urgency) || 'N/A'}</div>
          </div>
        </div>
      </div>

      {userProfile?.alternative_countries && userProfile.alternative_countries.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold">Alternative Destinations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.alternative_countries.map((country: string) => (
              <Badge key={country} variant="secondary" className="text-sm">
                {country}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Edit Modal
  const EditModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country of Origin</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select country</option>
                <option value="Nigeria">🇳🇬 Nigeria</option>
                <option value="Ghana">🇬🇭 Ghana</option>
                <option value="Kenya">🇰🇪 Kenya</option>
                <option value="South Africa">🇿🇦 South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destination Country</label>
              <select
                value={formData.destination_country}
                onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select destination</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="Australia">🇦🇺 Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="18"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visa Type</label>
              <select
                value={formData.visa_type}
                onChange={(e) => setFormData({ ...formData, visa_type: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select visa type</option>
                <option value="Study">🎓 Study</option>
                <option value="Work">💼 Work</option>
                <option value="Visit">✈️ Visit/Tourist</option>
                <option value="Business">🏢 Business</option>
                <option value="Family">👨‍👩‍👧 Family Reunion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profession</label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Type</label>
              <select
                value={formData.user_type}
                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select type</option>
                <option value="student">🎓 Student</option>
                <option value="professional">💼 Professional</option>
                <option value="business_owner">🏢 Business Owner</option>
                <option value="tourist">✈️ Tourist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timeline Urgency</label>
              <select
                value={formData.timeline_urgency}
                onChange={(e) => setFormData({ ...formData, timeline_urgency: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select timeline</option>
                <option value="asap">🚀 ASAP (0-3 months)</option>
                <option value="3-6_months">📅 3-6 months</option>
                <option value="6-12_months">🗓️ 6-12 months</option>
                <option value="exploring">🔍 Just exploring</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select budget</option>
                <option value="under_5k">Under $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-20k">$10,000 - $20,000</option>
                <option value="20k_plus">$20,000+</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  // Incomplete profile state
  if (completion < 50) {
    return (
      <>
        <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg">
              {filledFields === 0 ? 'Get started with your visa journey' : `${filledFields}/${totalFields} fields completed`}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm text-muted-foreground mb-2">
                Complete your profile for personalized visa guidance
              </p>
              {missingFields.length > 0 && (
                <div className="text-xs text-orange-600 mb-3">
                  Missing: {missingFields.map(f => f.label).join(', ')}
                </div>
              )}
              <Progress value={completion} className="w-full h-2 mb-3" />
            </div>
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link href="/kyc-profile">
                <Target className="w-4 h-4 mr-2" />
                Complete Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
        {showEditModal && <EditModal />}
      </>
    );
  }

  // Partially complete state
  if (completion < 100) {
    return (
      <>
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Profile Progress
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Progress value={completion} className="w-20 h-2" />
                  <span>{completion}% complete</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                {filledFields}/{totalFields}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Complete your profile</span>
              </div>
              <p className="text-xs text-orange-600">
                Missing: {missingFields.map(f => f.label).join(', ')}
              </p>
            </div>
            {renderCompleteStatus()}
            <div className="flex gap-2">
              <Button asChild className="flex-1" variant="outline">
                <Link href="/kyc-profile">Complete Missing Fields</Link>
              </Button>
              <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {showEditModal && <EditModal />}
      </>
    );
  }

  // Complete profile state
  return (
    <>
      <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Profile Complete
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  ✅ All fields complete
                </Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/kyc-profile">
                  Quick Update
                </Link>
              </Button>
              <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCompleteStatus()}
        </CardContent>
      </Card>
      {showEditModal && <EditModal />}
    </>
  );
}