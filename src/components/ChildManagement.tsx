import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Settings, User, Clock, MessageCircle, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ChildProfile } from '@/hooks/useAuth';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface ChildManagementProps {
  children: ChildProfile[];
  onAddChild: (name: string, age: number, settings?: Partial<ChildProfile>) => Promise<{ error: Error | null }>;
  onUpdateChild: (childId: string, updates: Partial<ChildProfile>) => Promise<{ error: Error | null }>;
  onDeleteChild: (childId: string) => Promise<{ error: Error | null }>;
  onBack: () => void;
}

export const ChildManagement = ({ 
  children, 
  onAddChild, 
  onUpdateChild, 
  onDeleteChild, 
  onBack 
}: ChildManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddChild = async () => {
    if (!newChildName.trim() || !newChildAge) {
      toast({
        title: "Missing information",
        description: "Please enter the child's name and age.",
        variant: "destructive"
      });
      return;
    }

    const age = parseInt(newChildAge);
    if (isNaN(age) || age < 1 || age > 17) {
      toast({
        title: "Invalid age",
        description: "Please enter an age between 1 and 17.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await onAddChild(newChildName.trim(), age, {
      message_tone: 'gentle',
      counseling_access: false,
      doctrine_access: false
    });

    if (error) {
      toast({
        title: "Error adding child",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Child added!",
        description: `${newChildName} has been added to your family.`
      });
      setNewChildName('');
      setNewChildAge('');
      setIsAdding(false);
    }
    setIsLoading(false);
  };

  const handleUpdateSetting = async (childId: string, updates: Partial<ChildProfile>) => {
    const { error } = await onUpdateChild(childId, updates);
    if (error) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (!confirm(`Are you sure you want to remove ${childName}?`)) return;
    
    const { error } = await onDeleteChild(childId);
    if (error) {
      toast({
        title: "Error removing child",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Child removed",
        description: `${childName} has been removed from your family.`
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      <div className="fixed inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-white">Manage Children</h1>
          </div>

          {/* Children List */}
          <div className="space-y-4 mb-6">
            {children.length === 0 ? (
              <div 
                className="p-6 rounded-xl border-2 border-accent/50 text-center"
                style={{ background: 'rgba(88, 28, 135, 0.85)', backdropFilter: 'blur(8px)' }}
              >
                <User className="w-12 h-12 text-accent mx-auto mb-3" />
                <p className="text-white/70">No children added yet.</p>
                <p className="text-white/50 text-sm">Add a child to set up their personalized experience.</p>
              </div>
            ) : (
              children.map((child) => (
                <div 
                  key={child.id}
                  className="p-4 rounded-xl border-2 border-accent/50"
                  style={{ background: 'rgba(88, 28, 135, 0.85)', backdropFilter: 'blur(8px)' }}
                >
                  {/* Child Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{child.name}</h3>
                      <p className="text-sm text-white/60">Age: {child.age}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(editingId === child.id ? null : child.id)}
                        className="text-white hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChild(child.id, child.name)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Settings (expandable) */}
                  {editingId === child.id && (
                    <div className="space-y-4 pt-4 border-t border-white/20">
                      {/* Message Tone */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm">Message Tone</span>
                        </div>
                        <select
                          value={child.message_tone}
                          onChange={(e) => handleUpdateSetting(child.id, { 
                            message_tone: e.target.value as 'gentle' | 'encouraging' 
                          })}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="gentle">Gentle</option>
                          <option value="encouraging">Encouraging</option>
                        </select>
                      </div>

                      {/* Counseling Access */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm">Counseling Access</span>
                        </div>
                        <Switch
                          checked={child.counseling_access}
                          onCheckedChange={(checked) => handleUpdateSetting(child.id, { 
                            counseling_access: checked 
                          })}
                        />
                      </div>

                      {/* Doctrine Access */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm">Doctrine Access</span>
                        </div>
                        <Switch
                          checked={child.doctrine_access}
                          onCheckedChange={(checked) => handleUpdateSetting(child.id, { 
                            doctrine_access: checked 
                          })}
                        />
                      </div>

                      {/* Alarm Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm">Alarm Time</span>
                        </div>
                        <input
                          type="time"
                          value={child.alarm_time}
                          onChange={(e) => handleUpdateSetting(child.id, { alarm_time: e.target.value })}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>

                      {/* Alarm Enabled */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-white text-sm">Alarm Enabled</span>
                        </div>
                        <Switch
                          checked={child.alarm_enabled}
                          onCheckedChange={(checked) => handleUpdateSetting(child.id, { 
                            alarm_enabled: checked 
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Child Form */}
          {isAdding ? (
            <div 
              className="p-4 rounded-xl border-2 border-accent/50"
              style={{ background: 'rgba(88, 28, 135, 0.85)', backdropFilter: 'blur(8px)' }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Add Child</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Child's Name</Label>
                  <Input
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Enter name"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-white">Age</Label>
                  <Input
                    type="number"
                    min="1"
                    max="17"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="1-17"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddChild} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Child'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAdding(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => setIsAdding(true)} 
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
