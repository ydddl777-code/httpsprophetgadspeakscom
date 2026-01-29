import { Book } from '@/lib/bookData';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onPreview: (book: Book) => void;
  onPurchase: (book: Book) => void;
}

export const BookCard = ({ book, onPreview, onPurchase }: BookCardProps) => {
  return (
    <div className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
      {/* Book Cover */}
      <div 
        className="relative aspect-[3/4] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center cursor-pointer"
        onClick={() => onPreview(book)}
      >
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-2" />
            <p className="text-xs text-primary-foreground/60 font-medium">
              Cover Coming Soon
            </p>
          </div>
        )}
        
        {/* Preview Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-accent/80">
            Preview Book
          </span>
        </div>
      </div>
      
      {/* Book Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-bold text-card-foreground text-sm leading-tight line-clamp-2">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{book.subtitle}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">by {book.author}</p>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-accent font-bold">${book.price}</span>
          <button
            onClick={() => onPurchase(book)}
            className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
