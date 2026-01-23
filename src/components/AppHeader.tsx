import { forwardRef } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  showLogout?: boolean;
}

export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(
  ({ userName, onSettingsClick, onLogout, showLogout }, ref) => {
    return (
      <header ref={ref} className="w-full bg-primary text-primary-foreground py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide">THE PILLAR</h1>
            <p className="text-xs text-primary-foreground/70">Prophet Gad Speaks</p>
          </div>

          <div className="flex items-center gap-2">
            {userName && (
              <span className="hidden sm:block text-sm text-primary-foreground/80 mr-2">
                Good morning, {userName}
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
  }
);

AppHeader.displayName = 'AppHeader';