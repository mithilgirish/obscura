import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Book from '@/models/Book';

// GET all books for the logged-in user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const books = await Book.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new book
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { title, author, status, notes } = await request.json();
    
    if (!title || !author || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await connectDB();
    
    const newBook = await Book.create({
      userId,
      title,
      author,
      status,
      notes: notes || '',
    });
    
    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json({ error: 'You already have a book with this title' }, { status: 409 });
    }
    
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}