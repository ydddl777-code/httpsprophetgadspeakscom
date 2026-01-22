import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Clock, User, MapPin, Bell, BellOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, AGE_GROUP_LABELS } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const Settings = ({ profile, onUpdateProfile, onLogout }: SettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    permission, 
    isSupported, 
    requestPermission, 
    scheduleAlarm, 
    sendTestNotification 
  } = useNotifications();
  
  const [alarmTime, setAlarmTime] = useState(profile.alarmTime);
  const [alarmEnabled, setAlarmEnabled] = useState(profile.alarmEnabled ?? false);
  const [audioEnabled, setAudioEnabled] = useState(profile.audioEnabled);

  // Schedule alarm when enabled or time changes
  useEffect(() => {
    if (alarmEnabled && permission === 'granted') {
      scheduleAlarm(alarmTime, profile.name);
    }
  }, [alarmEnabled, alarmTime, permission, scheduleAlarm, profile.name]);

  const handleAlarmToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings to use the alarm feature.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setAlarmEnabled(enabled);
    
    if (enabled) {
      await scheduleAlarm(alarmTime, profile.name);
      toast({
        title: "Alarm Set",
        description: `Your morning devotion alarm is set for ${alarmTime}`,
      });
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    toast({
      title: "Test Sent",
      description: "Check your notifications!",
    });
  };

  const handleSave = () => {
    onUpdateProfile({ alarmTime, alarmEnabled, audioEnabled });
    navigate('/');
  };

  const getPermissionStatus = () => {
    if (!isSupported) return { text: 'Not supported', color: 'text-muted-foreground' };
    if (permission === 'granted') return { text: 'Enabled', color: 'text-green-600' };
    if (permission === 'denied') return { text: 'Blocked', color: 'text-destructive' };
    return { text: 'Not set', color: 'text-amber-600' };
  };

  const permissionStatus = getPermissionStatus();

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

        {/* Morning Alarm with Notifications */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            {alarmEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            Morning Alarm
          </h2>
          
          {/* Notification Permission Status */}
          <div className="flex items-center justify-between py-3 border-b border-border mb-4">
            <div>
              <p className="text-foreground font-medium">Notification Status</p>
              <p className="text-sm text-muted-foreground">
                {isSupported ? 'Push notifications for morning reminders' : 'Your browser does not support notifications'}
              </p>
            </div>
            <span className={`text-sm font-medium ${permissionStatus.color}`}>
              {permissionStatus.text}
            </span>
          </div>

          {/* Enable Alarm Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border mb-4">
            <div>
              <p className="text-foreground font-medium">Enable Morning Alarm</p>
              <p className="text-sm text-muted-foreground">
                Receive a notification at your set time
              </p>
            </div>
            <Switch
              checked={alarmEnabled}
              onCheckedChange={handleAlarmToggle}
              disabled={!isSupported || permission === 'denied'}
            />
          </div>

          {/* Alarm Time */}
          <div className="mb-4">
            <Label htmlFor="alarmTime" className="text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Wake-up Time
            </Label>
            <Input
              id="alarmTime"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="mt-2 w-40"
            />
          </div>

          {/* Test Notification Button */}
          {isSupported && permission === 'granted' && (
            <Button
              variant="outline"
              onClick={handleTestNotification}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send Test Notification
            </Button>
          )}

          {permission === 'denied' && (
            <p className="text-sm text-destructive mt-3">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
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
            className="w-full h-12 text-destructive border-destructive hover:bg-destructive/10"
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
