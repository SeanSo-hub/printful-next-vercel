import { NextResponse } from 'next/server';

export async function GET() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY ;
  if (!PRINTFUL_API_KEY) {
    return NextResponse.json({ error: 'Missing Printful API key' });
  }

  // Printful Catalog API endpoint for products
  const url = 'https://api.printful.com/products';

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json(data.result);
}