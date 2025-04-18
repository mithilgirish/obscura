import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Book from '@/models/Book';

// GET a specific book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const book = await Book.findOne({ _id: id, userId });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({ book }, { status: 200 });
}

// PATCH to update a specific book by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { title, author, status, notes } = await request.json();

  await connectDB();
  const updatedBook = await Book.findOneAndUpdate(
    { _id: id, userId },
    { title, author, status, notes },
    { new: true }
  );

  if (!updatedBook) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({ book: updatedBook }, { status: 200 });
}

// DELETE a specific book by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const deletedBook = await Book.findOneAndDelete({ _id: id, userId });
  if (!deletedBook) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({ book: deletedBook }, { status: 200 });
}
