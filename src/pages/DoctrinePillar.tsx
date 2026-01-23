import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronDown, Volume2, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, DoctrineQuestion } from '@/lib/types';
import { DOCTRINE_QUESTIONS } from '@/lib/data';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { cn } from '@/lib/utils';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface DoctrinePillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const DoctrinePillar = ({ profile, onLogout }: DoctrinePillarProps) => {
  const navigate = useNavigate();
  const { speak, isSpeaking, isLoading } = useElevenLabsTTS();
  const [selectedQuestion, setSelectedQuestion] = useState<DoctrineQuestion | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const firstName = profile.name.split(' ')[0];

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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader userName={firstName} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2 text-purple-900 hover:text-purple-700 hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-purple-600/20 backdrop-blur-sm p-3 rounded-xl mb-3">
            <BookOpen className="w-10 h-10 text-purple-800" />
          </div>
          <h1 className="text-2xl text-purple-900 font-bold mb-1">DOCTRINE PILLAR</h1>
          <p className="text-purple-800/80 text-sm">Ask Counsel</p>
        </div>

        {/* Question Selector */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-300/30 p-5 mb-4">
          <label className="block text-sm font-medium text-purple-900 mb-3">
            Select a Question
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-xl border',
                'bg-white/50 hover:border-purple-400 text-left',
                isDropdownOpen ? 'border-purple-500' : 'border-purple-300/50'
              )}
            >
              <span className={selectedQuestion ? 'text-purple-900' : 'text-purple-600/70'}>
                {selectedQuestion ? selectedQuestion.question : 'Choose a question...'}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-purple-700',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-sm border border-purple-300/50 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {availableQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-purple-100/50 text-purple-900',
                      'first:rounded-t-xl last:rounded-b-xl',
                      selectedQuestion?.id === q.id && 'bg-purple-200/50'
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
          <div className="space-y-4">
            {/* Scripture Card */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-300/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-purple-900 font-semibold uppercase tracking-wide">
                  Scripture
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  disabled={isLoading || isSpeaking}
                  className="gap-2 text-purple-700 hover:bg-purple-500/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  Read Aloud
                </Button>
              </div>
              <blockquote className="text-lg font-medium text-purple-900 mb-3 leading-relaxed italic">
                "{selectedQuestion.verseText}"
              </blockquote>
              <p className="text-right text-purple-800 font-bold text-sm">
                — {selectedQuestion.verse} (KJV)
              </p>
            </div>

            {/* Answer Card */}
            <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <h3 className="text-base text-purple-900 font-bold mb-2">Answer</h3>
              <p className="text-purple-900/90 leading-relaxed text-sm">{selectedQuestion.answer}</p>
            </div>

            {/* Practical Tip (if available) */}
            {selectedQuestion.practicalTip && (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-green-700" />
                  <h3 className="font-semibold text-green-800 text-sm">Practical Tip</h3>
                </div>
                <p className="text-purple-900/80 text-sm">{selectedQuestion.practicalTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedQuestion && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-700/30" />
            <p className="text-purple-800/70">Select a question above to receive counsel</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctrinePillar;
