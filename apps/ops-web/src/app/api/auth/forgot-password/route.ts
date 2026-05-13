import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the service role key to bypass RLS when looking up and resetting user passwords
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Determine the base URL for the redirect
    // Use the request origin, or fallback to the NEXT_PUBLIC_APP_URL environment variable
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // We send the reset password link pointing to our custom reset password page
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/admin/reset-password`,
    });

    if (error) {
      console.error("Supabase Reset Password Error:", error);
      // We still return 200 to prevent email enumeration attacks
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // Returning 200 generic response prevents enumeration even in the case of unexpected errors
    return NextResponse.json({ success: true });
  }
}
