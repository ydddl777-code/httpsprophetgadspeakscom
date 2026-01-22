import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronDown, Volume2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, DoctrineQuestion } from '@/lib/types';
import { DOCTRINE_QUESTIONS } from '@/lib/data';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface DoctrinePillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const DoctrinePillar = ({ profile, onLogout }: DoctrinePillarProps) => {
  const navigate = useNavigate();
  const { speak, isSpeaking } = useTextToSpeech();
  const [selectedQuestion, setSelectedQuestion] = useState<DoctrineQuestion | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter questions by age group
  const availableQuestions = DOCTRINE_QUESTIONS.filter((q) =>
    q.ageGroups.includes(profile.ageGroup)
  );

  const handleSelectQuestion = (question: DoctrineQuestion) => {
    setSelectedQuestion(question);
    setIsDropdownOpen(false);
  };

  const handleReadAloud = () => {
    if (selectedQuestion) {
      speak(
        `${selectedQuestion.question}. ${selectedQuestion.answer}. Scripture reference: ${selectedQuestion.verse}. ${selectedQuestion.verseText}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userName={profile.name} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-pillar-doctrine/10 p-4 rounded-2xl mb-4">
            <BookOpen className="w-12 h-12 text-pillar-doctrine" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-2">DOCTRINE PILLAR</h1>
          <p className="text-muted-foreground">Ask Counsel</p>
        </div>

        {/* Question Selector */}
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6 mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Select a Question
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                'bg-background hover:border-accent text-left',
                isDropdownOpen ? 'border-accent' : 'border-input'
              )}
            >
              <span className={selectedQuestion ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedQuestion ? selectedQuestion.question : 'Choose a question...'}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {availableQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-muted transition-colors',
                      'first:rounded-t-xl last:rounded-b-xl',
                      selectedQuestion?.id === q.id && 'bg-accent/10'
                    )}
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Answer Display */}
        {selectedQuestion && (
          <div className="space-y-4 animate-slide-up">
            {/* Scripture Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-accent font-semibold uppercase tracking-wide">
                  Scripture
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  className="gap-2 text-accent hover:bg-accent/10"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  Read Aloud
                </Button>
              </div>
              <blockquote className="text-lg font-medium text-foreground mb-3 leading-relaxed">
                "{selectedQuestion.verseText}"
              </blockquote>
              <p className="text-right text-muted-foreground font-display">
                — {selectedQuestion.verse} (KJV)
              </p>
            </div>

            {/* Answer Card */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-display text-lg text-primary mb-3">Answer</h3>
              <p className="text-foreground/80 leading-relaxed">{selectedQuestion.answer}</p>
            </div>

            {/* Practical Tip (if available) */}
            {selectedQuestion.practicalTip && (
              <div className="bg-success/5 rounded-2xl p-6 border border-success/10">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-success">Practical Tip</h3>
                </div>
                <p className="text-foreground/80">{selectedQuestion.practicalTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedQuestion && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Select a question above to receive counsel</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctrinePillar;
