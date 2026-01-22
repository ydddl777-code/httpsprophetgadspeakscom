import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PillarIcon } from './PillarIcon';

interface AppHeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  showLogout?: boolean;
}

export const AppHeader = ({ userName, onSettingsClick, onLogout, showLogout }: AppHeaderProps) => {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded-lg">
            <PillarIcon className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wide">THE PILLAR</h1>
            <p className="text-xs text-primary-foreground/70">Prophet Gad Speaks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userName && (
            <span className="hidden sm:block text-sm text-primary-foreground/80 mr-2">
              Shalom, {userName}
            </span>
          )}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
          {showLogout && onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
