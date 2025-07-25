import { NextResponse } from 'next/server';

export async function GET() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  if (!PRINTFUL_API_KEY) {
    return NextResponse.json({ error: 'Missing Printful API key' }, { status: 500 });
  }

  // Printful Nonce API endpoint
  const url = 'https://api.printful.com/embedded-designer/nonces';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    // If Printful requires a body, add it here. Otherwise, leave it empty.
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch nonce' }, { status: res.status });
  }

  const data = await res.json();

  // Return the nonce/session token to the frontend
  return NextResponse.json(data.result);
}
