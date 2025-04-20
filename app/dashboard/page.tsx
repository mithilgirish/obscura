// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { Book, Loader2, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddBookDialog from '@/components/AddBookDialog';
import BookCard from '@/components/BookCard';
import { IBook } from '@/models/Book';

export default function Dashboard() {
  const { user } = useUser();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);
  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/books');
      const data: { books: IBook[]; error?: string } = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch books');
      }
      
      setBooks(data.books);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddBook = async (newBook: Partial<IBook>) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      
      const data: { book: IBook; error?: string } = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add book');
      }
      
      // Refresh books list
      fetchBooks();
      return data;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      console.error('Error adding book:', error);
      throw error;
    }
  };
  
  const handleUpdateBook = async (id: string, updatedBook: Partial<IBook>) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });
      
      const data: { book: IBook; error?: string } = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update book');
      }
      
      // Update local state
      setBooks(books.map(book => 
        book.id === id ? { ...book, ...updatedBook } as IBook : book
      ));
      
      return data;
    }catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
        console.error('Error updating book:', error);
        throw error;
    }
  };
  
  const handleDeleteBook = async (id: string) => {
    if (!id) {
      console.error('Cannot delete book with undefined ID');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // For non-OK responses, try to parse error message
      if (!response.ok) {
        // Only try to parse JSON if there's content
        if (response.headers.get('content-length') !== '0') {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete book');
        } else {
          throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
        }
      }
      
      // Update local state
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error deleting book:', error);
    }
  };
  
  // Filter books based on selected filter
  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });
  
  // Count books by status
  const bookCounts = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    toRead: books.filter(b => b.status === 'to-read').length,
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome{user ? `, ${user.firstName || 'Reader'}` : ''}
            </h1>
            <p className="text-gray-400 mt-1">Track and manage your reading journey</p>
          </div>
          
          <AddBookDialog onAdd={handleAddBook} />
        </div>
        
        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
              <Book className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Books</p>
              <h3 className="text-2xl font-bold text-white">{bookCounts.total}</h3>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Currently Reading</p>
              <h3 className="text-2xl font-bold text-white">{bookCounts.reading}</h3>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <h3 className="text-2xl font-bold text-white">{bookCounts.completed}</h3>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">To Read</p>
              <h3 className="text-2xl font-bold text-white">{bookCounts.toRead}</h3>
            </div>
          </div>
        </motion.div>
        
        {/* Filter Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`
              ${filter === 'all' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-transparent border-white/20 hover:bg-white/10 text-gray-300'}
            `}
          >
            All ({bookCounts.total})
          </Button>
          <Button
            variant={filter === 'reading' ? 'default' : 'outline'}
            onClick={() => setFilter('reading')}
            className={`
              ${filter === 'reading' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-transparent border-white/20 hover:bg-white/10 text-gray-300'}
            `}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Reading ({bookCounts.reading})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={`
              ${filter === 'completed' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-transparent border-white/20 hover:bg-white/10 text-gray-300'}
            `}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed ({bookCounts.completed})
          </Button>
          <Button
            variant={filter === 'to-read' ? 'default' : 'outline'}
            onClick={() => setFilter('to-read')}
            className={`
              ${filter === 'to-read' 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-transparent border-white/20 hover:bg-white/10 text-gray-300'}
            `}
          >
            <Clock className="h-4 w-4 mr-1" />
            To Read ({bookCounts.toRead})
          </Button>
        </div>
        
        {/* Books List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading your books...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
            <p>{error}</p>
            <Button 
              onClick={fetchBooks} 
              className="mt-2 bg-red-600/30 hover:bg-red-600/50 text-red-200"
            >
              Try Again
            </Button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              {books.length === 0 
                ? "Your book collection is empty" 
                : "No books found in this category"}
            </h3>
            <p className="text-gray-400 mb-6">
              {books.length === 0 
                ? "Start adding books to track your reading journey" 
                : "Try changing the filter or add new books"}
            </p>
            <AddBookDialog onAdd={handleAddBook} />
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BookCard 
                    book={book} 
                    onDelete={handleDeleteBook}
                    onUpdate={handleUpdateBook}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}