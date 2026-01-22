import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, AGE_GROUP_LABELS } from '@/lib/types';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const Settings = ({ profile, onUpdateProfile, onLogout }: SettingsProps) => {
  const navigate = useNavigate();
  const [alarmTime, setAlarmTime] = useState(profile.alarmTime);
  const [audioEnabled, setAudioEnabled] = useState(profile.audioEnabled);

  const handleSave = () => {
    onUpdateProfile({ alarmTime, audioEnabled });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userName={profile.name} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <h1 className="font-display text-3xl text-primary mb-8">Settings</h1>

        {/* Profile Info */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground font-medium">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Age Group</span>
              <span className="text-foreground font-medium">
                {AGE_GROUP_LABELS[profile.ageGroup]}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </span>
              <span className="text-foreground font-medium">
                {profile.location.city}, {profile.location.state}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            Audio Settings
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Audio Greeting</p>
              <p className="text-sm text-muted-foreground">
                Play audio greeting and read verses aloud
              </p>
            </div>
            <Switch
              checked={audioEnabled}
              onCheckedChange={setAudioEnabled}
            />
          </div>
        </div>

        {/* Alarm Settings */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Morning Alarm
          </h2>
          <div>
            <Label htmlFor="alarmTime" className="text-foreground">Wake-up Time</Label>
            <Input
              id="alarmTime"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="mt-2 w-40"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Note: Alarm functionality requires notification permissions (coming soon)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            Save Settings
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-12 text-danger border-danger hover:bg-danger/10"
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
