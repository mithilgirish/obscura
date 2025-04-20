// components/BookCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IBook } from '@/models/Book';
import EditBookDialog from './EditBookDialog';

interface BookCardProps {
  book: IBook;
  onDelete: (_id: string) => void;
  onUpdate: (_id: string, updatedBook: Partial<IBook>) => void;
}

export default function BookCard({ book, onDelete, onUpdate }: BookCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const statusIcons = {
    'reading': <BookOpen className="text-blue-400" />,
    'completed': <CheckCircle className="text-green-400" />,
    'to-read': <Clock className="text-amber-400" />
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden bg-opacity-10 bg-neutral-800 backdrop-blur-lg border border-white/10 hover:border-purple-400/30 transition-all shadow-lg">
          <CardHeader className="relative pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-white">{book.title}</CardTitle>
                <CardDescription className="text-gray-300">{book.author}</CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {statusIcons[book.status as keyof typeof statusIcons]}
                <span className="text-sm capitalize text-gray-300">{book.status}</span>
              </div>
            </div>
          </CardHeader>
          
          {book.notes && (
            <CardContent className="pt-0">
              <p className="text-sm text-gray-300 line-clamp-3">
                {book.notes}
              </p>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-end space-x-2 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditOpen(true)}
                className="bg-transparent border-white/20 hover:bg-white/10 text-gray-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  if (typeof book._id === 'string') {
                    onDelete(book._id);
                    window.location.reload();
                  } else {
                    console.error('Cannot delete book: ID is undefined');
                  }
                }}
                
                
                className="bg-red-900/30 hover:bg-red-800/50 text-red-200 border-red-900/50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      
      <EditBookDialog
        book={book}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={(updatedBook) => {
          if (typeof book._id === 'string') {
            onUpdate(book._id, updatedBook);
            window.location.reload();
          } else {
            console.error('Cannot update book: ID is undefined');
          }
          setIsEditOpen(false);
        }}
      />
    </>
  );
}
