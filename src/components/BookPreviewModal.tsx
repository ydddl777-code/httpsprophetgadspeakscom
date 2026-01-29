import { Book } from '@/lib/bookData';
import { X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookPreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (book: Book) => void;
}

export const BookPreviewModal = ({ book, isOpen, onClose, onPurchase }: BookPreviewModalProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Preview pages - placeholder content until PDFs are uploaded
  const previewPages = [
    { type: 'cover', label: 'Cover' },
    { type: 'inside', label: 'Inside Cover' },
    { type: 'dedication', label: 'Dedication' },
  ];

  const nextPage = () => {
    if (currentPage < previewPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{book.title} - Preview</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {/* Book Preview Area */}
          <div className="relative w-full aspect-[3/4] max-h-[60vh] bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center border border-border">
            {/* Placeholder page content */}
            <div className="text-center p-8">
              <p className="text-lg font-bold text-card-foreground mb-2">
                {previewPages[currentPage].label}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentPage === 0 && book.title}
                {currentPage === 1 && `By ${book.author}`}
                {currentPage === 2 && 'To the remnant seed...'}
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                (PDF preview coming soon)
              </p>
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === previewPages.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Page Indicators */}
          <div className="flex gap-2 mt-4">
            {previewPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {/* Preview Limit Notice */}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Preview includes cover, inside cover, and dedication page.
          </p>
          
          {/* Purchase Section */}
          <div className="w-full mt-6 p-4 bg-muted/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-bold text-card-foreground">{book.title}</p>
              <p className="text-sm text-muted-foreground">{book.pageCount} pages</p>
            </div>
            <button
              onClick={() => onPurchase(book)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy for ${book.price}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
