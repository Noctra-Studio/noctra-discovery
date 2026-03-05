const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSubmit() {
  console.log('Fetching active form...');
  const { data: forms, error } = await supabase
    .from('discovery_forms')
    .select('*')
    .eq('status', 'pending')
    .limit(1);

  let form;
  if (!forms || forms.length === 0) {
    console.log("No pending forms. Fetching ANY form and resetting its status...");
    const { data: anyForm } = await supabase.from('discovery_forms').select('*').limit(1).single();
    if (!anyForm) {
       console.log("No forms exist in the DB! We can't test."); return;
    }
    await supabase.from('discovery_forms').update({ status: 'pending' }).eq('id', anyForm.id);
    form = { ...anyForm, status: 'pending' };
  } else {
    form = forms[0];
  }
  console.log('Using form:', form.slug);

  const payload = {
    slug: form.slug,
    data: {
      q_origin: "We wanted to test the Resend integration.",
      q_ideal_client: "A tester who checks their email.",
      q_concrete_result: "100% email delivery.",
      q_differentiator: "We debug faster.",
      q_previous_attempts: "It failed silently before.",
      q_internal_obstacle: "Lack of logs",
      q_business_stage: "starting",
      ai_first_priority: "Automating Resend debugging",
      crm_main_goal: "Tracking bugs."
    }
  };

  console.log('Sending request to /api/submit...');
  const response = await fetch('http://localhost:3000/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(json, null, 2));
}

testSubmit();
