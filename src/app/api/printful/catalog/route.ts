import { NextResponse } from 'next/server';

const allowedOrigin = 'https://gue12v-0i.myshopify.com';

export async function GET() {
  console.log('API route called');
  
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'DmzFX6WgYrQQzdnSGomt6JHBmYpir9chwVLdOeS3';
  console.log('Using API key:', PRINTFUL_API_KEY.substring(0, 10) + '...');
  
  if (!PRINTFUL_API_KEY) {
    console.error('Missing Printful API key');
    const res = NextResponse.json({ error: 'Missing Printful API key' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  const url = 'https://api.printful.com/v2/catalog-products';
  console.log('Making request to:', url);
  
  let data;
  let response;
  
  try {
    response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    data = await response.json();
    console.log('Response data keys:', Object.keys(data));
    
  } catch (err) {
    console.error('Fetch error:', err);
    const res = NextResponse.json({ 
      error: 'Network error', 
      details: String(err),
      url: url,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  if (!response.ok) {
    console.error('Printful API error:', response.status, data);
    const res = NextResponse.json({ 
      error: 'Failed to fetch catalog', 
      details: data, 
      status: response.status,
      statusText: response.statusText
    }, { status: response.status });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  // Check if data.result exists
  if (!data.result) {
    console.error('Unexpected data structure:', data);
    const res = NextResponse.json({ 
      error: 'Unexpected response structure', 
      details: data 
    }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  }

  console.log('Successfully returning', data.result.length, 'products');
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