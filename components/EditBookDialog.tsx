// components/EditBookDialog.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { IBook } from '@/models/Book';

interface EditBookDialogProps {
  book: IBook;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Partial<IBook>) => void;
}

export default function EditBookDialog({
  book,
  open,
  onOpenChange,
  onSave,
}: EditBookDialogProps) {
  const [formData, setFormData] = useState<Partial<IBook>>({
    title: '',
    author: '',
    status: 'to-read',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Update form data when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        status: book.status,
        notes: book.notes,
      });
    }
  }, [book]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Edit book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Make changes to your book details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-gray-300">Book Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author" className="text-gray-300">Author</Label>
              <Input
                id="edit-author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status" className="text-gray-300">Reading Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'reading' | 'completed' | 'to-read' })}
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
              <Label htmlFor="edit-notes" className="text-gray-300">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                placeholder="Add your thoughts or notes about this book"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white resize-none min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}