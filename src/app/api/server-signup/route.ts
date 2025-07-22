import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase on the server side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dderjvlsbmjpuptiqlhx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXJqdmxzYm1qcHVwdGlxbGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1ODc4ODksImV4cCI6MjAzNzE2Mzg4OX0.mVP3crvbwFZfKme5Mecc8k8ziWwg5ybpOWvz4HgjdAQ'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    console.log("Server-side signup attempt for:", email);
    
    // Basic validation
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }
    
    // Try to sign up the user - minimal approach
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      console.error("Server-side signup error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log("Server-side signup successful");
    
    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email
      },
      message: "Account created successfully"
    });
    
  } catch (err) {
    console.error("Unexpected server-side signup error:", err);
    return NextResponse.json({ 
      error: "An unexpected error occurred during signup" 
    }, { status: 500 });
  }
}
