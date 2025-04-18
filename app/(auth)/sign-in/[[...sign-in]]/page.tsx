// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-950 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="relative z-10">
        <SignIn appearance={{
          elements: {
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
            card: 'bg-slate-900/90 backdrop-blur-xl border border-purple-500/20'
          }
        }} />
      </div>
    </div>
  );
}