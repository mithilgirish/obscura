// app/page.tsx
'use client'; // Add this line to make it a client component

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Home() {
  const { userId } = useAuth();
  const router = useRouter();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (userId) {
      router.push('/dashboard');
    }
  }, [userId, router]);
  
  if (userId) {
    return null; // Return null while redirecting
  }
  
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-950 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      
      {/* Glassmorphic card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 mx-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 mb-4 mx-auto" />
        
          <p className="text-gray-300 text-lg mb-8">
            Your personal book tracking companion with a sleek, modern interface.
            Keep track of your reading journey in style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-in" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg py-6">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="flex-1">
              <Button variant="outline" className="w-full border-purple-400/30 hover:bg-purple-900/20 text-purple-300 font-medium text-lg py-6">
                Sign Up
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()}  Obscura X <a href='https://www.mithilgirish.dev/'> @mithilgirish</a> 
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}