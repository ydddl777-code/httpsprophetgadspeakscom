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
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

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

  const firstName = profile.name.split(' ')[0];

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
    if (!isSupported) return { text: 'Not supported', color: 'text-purple-600/70' };
    if (permission === 'granted') return { text: 'Enabled', color: 'text-green-700' };
    if (permission === 'denied') return { text: 'Blocked', color: 'text-red-700' };
    return { text: 'Not set', color: 'text-yellow-700' };
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader userName={firstName} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2 text-purple-900 hover:text-purple-700 hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <h1 className="text-2xl text-purple-900 font-bold mb-6">Settings</h1>

        {/* Profile Info */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-purple-300/30 p-5 mb-4">
          <h2 className="font-semibold text-purple-900 mb-4 flex items-center gap-2 text-sm">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-purple-300/30">
              <span className="text-purple-800/80 text-sm">Name</span>
              <span className="text-purple-900 font-medium text-sm">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-purple-300/30">
              <span className="text-purple-800/80 text-sm">Age Group</span>
              <span className="text-purple-900 font-medium text-sm">
                {AGE_GROUP_LABELS[profile.ageGroup]}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-purple-800/80 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                Location
              </span>
              <span className="text-purple-900 font-medium text-sm">
                {profile.location.city}, {profile.location.state}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-purple-300/30 p-5 mb-4">
          <h2 className="font-semibold text-purple-900 mb-4 flex items-center gap-2 text-sm">
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            Audio Settings
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-900 font-medium text-sm">Audio Greeting</p>
              <p className="text-xs text-purple-800/70">
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
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-purple-300/30 p-5 mb-6">
          <h2 className="font-semibold text-purple-900 mb-4 flex items-center gap-2 text-sm">
            {alarmEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            Morning Alarm
          </h2>
          
          {/* Notification Permission Status */}
          <div className="flex items-center justify-between py-3 border-b border-purple-300/30 mb-4">
            <div>
              <p className="text-purple-900 font-medium text-sm">Notification Status</p>
              <p className="text-xs text-purple-800/70">
                {isSupported ? 'Push notifications for morning reminders' : 'Your browser does not support notifications'}
              </p>
            </div>
            <span className={`text-sm font-medium ${permissionStatus.color}`}>
              {permissionStatus.text}
            </span>
          </div>

          {/* Enable Alarm Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-purple-300/30 mb-4">
            <div>
              <p className="text-purple-900 font-medium text-sm">Enable Morning Alarm</p>
              <p className="text-xs text-purple-800/70">
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
            <Label htmlFor="alarmTime" className="text-purple-900 flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Wake-up Time
            </Label>
            <Input
              id="alarmTime"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="mt-2 w-40 bg-white/50 border-purple-300/50 text-purple-900"
            />
          </div>

          {/* Test Notification Button */}
          {isSupported && permission === 'granted' && (
            <Button
              variant="outline"
              onClick={handleTestNotification}
              className="gap-2 border-purple-400/50 text-purple-900 hover:bg-purple-500/20"
            >
              <Send className="w-4 h-4" />
              Send Test Notification
            </Button>
          )}

          {permission === 'denied' && (
            <p className="text-sm text-red-700 mt-3">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white"
          >
            Save Settings
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-12 text-red-700 border-red-400/50 hover:bg-red-500/20"
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
