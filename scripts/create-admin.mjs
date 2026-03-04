import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czyyjwrpncojuckuonwe.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log("Checking if user exists...");
  
  // Try to sign up the user
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'hello@noctra.studio',
    password: 'Amigos12-',
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("already exists")) {
       console.log("User already exists!");
    } else {
       console.error("Error creating user:", error);
    }
  } else {
    console.log("User created successfully:", data.user?.email);
    
    // Also add to profiles table just in case our trigger didn't handle it
    const { error: profileError } = await supabase.from('profiles').upsert({
       id: data.user?.id,
       email: 'hello@noctra.studio',
       full_name: 'Noctra Admin'
    });
    
    if (profileError) {
       console.error("Error creating profile:", profileError);
    } else {
       console.log("Profile created/verified.");
    }
  }
}

main();
