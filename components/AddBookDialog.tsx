// components/AddBookDialog.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { IBook } from '@/models/Book';

interface AddBookDialogProps {
  onAdd: (book: Partial<IBook>) => void;
}

export default function AddBookDialog({ onAdd }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IBook>>({
    title: '',
    author: '',
    status: 'to-read' as 'to-read' | 'reading' | 'completed',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onAdd(formData);
      // Reset form after successful submission
      setFormData({
        title: '',
        author: '',
        status: 'to-read',
        notes: '',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="h-5 w-5 mr-2" /> Add New Book
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Add a new book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the book you want to add to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-gray-300">Book Title</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author" className="text-gray-300">Author</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-gray-300">Reading Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'to-read' | 'reading' | 'completed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="to-read">To Read</SelectItem>
                  <SelectItem value="reading">Currently Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-gray-300">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add your thoughts or notes about this book"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white resize-none min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
