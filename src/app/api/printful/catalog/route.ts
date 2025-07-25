import { NextResponse } from 'next/server';

export async function GET() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  if (!PRINTFUL_API_KEY) {
    const res = NextResponse.json({ error: 'Missing Printful API key' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', 'https://gue12v-0i.myshopify.com');
    return res;
  }

  // Printful Catalog API endpoint for products
  const url = 'https://api.printful.com/products';

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    },
  });

  if (!response.ok) {
    const res = NextResponse.json({ error: 'Failed to fetch catalog' }, { status: response.status });
    res.headers.set('Access-Control-Allow-Origin', 'https://gue12v-0i.myshopify.com');
    return res;
  }

  const data = await response.json();
  const res = NextResponse.json(data.result);
  res.headers.set('Access-Control-Allow-Origin', 'https://gue12v-0i.myshopify.com');
  return res;
}

export async function OPTIONS() {
  const res = new Response(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', 'https://gue12v-0i.myshopify.com');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}