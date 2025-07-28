import { NextResponse } from 'next/server';

const allowedOrigin = 'https://gue12v-0i.myshopify.com';

export async function GET() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'DmzFX6WgYrQQzdnSGomt6JHBmYpir9chwVLdOeS3';
  if (!PRINTFUL_API_KEY) {
    const res = NextResponse.json({ error: 'Missing Printful API key' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  const url = 'https://api.printful.com/v2/catalog-products';
  let data;
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      },
    });
    data = await response.json();
  } catch (err) {
    const res = NextResponse.json({ error: 'Network error', details: String(err) }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  if (!response.ok) {
    const res = NextResponse.json({ error: 'Failed to fetch catalog', details: data }, { status: response.status });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  const res = NextResponse.json(data.result);
  res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  return res;
}

export async function OPTIONS() {
  const res = new Response(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}