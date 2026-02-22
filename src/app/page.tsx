import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }
  // Landing Page optimized for Vercel


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Background moved to layout.tsx */}

      <main className="relative z-10 text-center glass-panel p-12 rounded-2xl shadow-2xl max-w-2xl animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl font-serif text-gold mb-6">Wedding Matchmaker</h1>
        <p className="text-xl text-gray-200 mb-8 font-light">
          Make decisions together. Swipe your way to the perfect wedding.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gold hover:bg-[#C5A028] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gold font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gold"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
