// app/dashboard/layout.tsx
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold text-white">Obscura</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "border-2 border-purple-500"
                }
              }}
            />
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900/60 backdrop-blur-md border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()}  Obscura X <a href='https://www.mithilgirish.dev/'> @mithilgirish</a> 
          </p>
        </div>
      </footer>
    </div>
  );
}