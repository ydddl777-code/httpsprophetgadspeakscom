import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { BOOKS, Book } from '@/lib/bookData';
import { BookCard } from '@/components/BookCard';
import { BookPreviewModal } from '@/components/BookPreviewModal';
import { toast } from 'sonner';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

export const BookStore = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (book: Book) => {
    setSelectedBook(book);
    setIsPreviewOpen(true);
  };

  const handlePurchase = (book: Book) => {
    // TODO: Integrate with payment system
    toast.info(`Purchase flow for "${book.title}" coming soon!`, {
      description: 'Payment integration will be added.',
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-2xl font-bold text-white">Book Store</h1>
              <p className="text-sm text-white/70">Wisdom & Teachings by Prophet Gad</p>
            </div>
          </div>
        </header>
        
        {/* Books Grid - 5 per row on desktop, responsive on mobile */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {BOOKS.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPreview={handlePreview}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
          
          {/* Empty State for future books */}
          {BOOKS.length < 10 && (
            <p className="text-center text-white/50 text-sm mt-8">
              More books coming soon...
            </p>
          )}
        </div>
        
        {/* Footer */}
        <footer className="text-center py-8 mt-8">
          <p className="text-xs text-white/50">
            All books are digital PDF format • Instant download after purchase
          </p>
        </footer>
      </div>
      
      {/* Preview Modal */}
      <BookPreviewModal
        book={selectedBook}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default BookStore;
