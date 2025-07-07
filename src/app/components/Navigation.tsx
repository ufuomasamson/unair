"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrencyStore } from "@/lib/currencyManager";

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const { currency, setCurrency } = useCurrencyStore();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch user role and full name
        const { data: userData } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();
        setUserRole(userData?.role || null);
        setUser((prevUser: any) => ({ ...prevUser, full_name: userData?.full_name || '' }));
        
        // Try to fetch user currency preference, but don't fail if table doesn't exist
        try {
          const { data: prefData, error } = await supabase
            .from('user_preferences')
            .select('currency_code')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.log("Error fetching user preferences:", error);
          } else if (prefData) {
            setCurrency(prefData.currency_code);
          }
        } catch (error) {
          // Table doesn't exist or other error, use default currency
          console.log("user_preferences table not found or error occurred, using default currency");
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Fetch user role and full name
          const { data: userData } = await supabase
            .from("users")
            .select("role, full_name")
            .eq("id", session.user.id)
            .single();
          setUserRole(userData?.role || null);
          setUser((prevUser: any) => ({ ...prevUser, full_name: userData?.full_name || '' }));
        } else {
          setUser(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    if (user) {
      try {
        // Try to update first, if no record exists, create one
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ currency_code: newCurrency })
          .eq('user_id', user.id);
        
        if (updateError && updateError.code === 'PGRST116') {
          // No rows found, create a new preference record
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert({ user_id: user.id, currency_code: newCurrency });
          
          if (insertError) {
            console.log("Error creating user preference:", insertError);
          }
        } else if (updateError) {
          console.log("Error updating user preference:", updateError);
        }
      } catch (error) {
        // Table doesn't exist or other error, that's okay
        console.log("user_preferences table not found or error occurred, currency change not persisted");
      }
    }
  };

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-[#4f1032] flex items-center justify-between px-8 py-4">
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">Flight Booker</Link>
        <div className="hidden md:flex gap-8 items-center text-base font-medium">
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#4f1032] flex items-center justify-between px-8 py-4">
      <Link href="/" className="text-2xl font-bold text-white tracking-tight">Flight Booker</Link>
      <div className="hidden md:flex gap-8 items-center text-base font-medium">
        <Link href="/" className="text-white hover:text-[#cd7e0f] transition">Home</Link>
        <Link href="/about" className="text-white hover:text-[#cd7e0f] transition">About Us</Link>
        <Link href="/search" className="text-white hover:text-[#cd7e0f] transition">Flights</Link>
        <Link href="/track" className="text-white hover:text-[#cd7e0f] transition">Track Flight</Link>
        <Link href="/contact" className="text-white hover:text-[#cd7e0f] transition">Contact</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            {userRole === "admin" && (
              <Link href="/admin/dashboard" className="text-white hover:text-[#cd7e0f] transition">
                Admin Dashboard
              </Link>
            )}
            <select onChange={(e) => handleCurrencyChange(e.target.value)} value={currency} className="bg-[#4f1032] text-white px-3 py-1 rounded border border-white/20 hover:border-white/40 transition">
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
            </select>
            
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-white font-medium">
                {user.full_name || user.email}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-black">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
            <button
                    onClick={() => {
                      handleSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="ml-4 px-4 py-2 bg-[#cd7e0f] text-white rounded hover:bg-[#cd7e0f]/90 transition">Login</Link>
            <Link href="/signup" className="ml-2 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-[#4f1032] transition">Sign Up</Link>
          </div>
        )}
      </div>
      <div className="md:hidden">
        {/* Mobile menu button placeholder */}
      </div>
    </nav>
  );
} 