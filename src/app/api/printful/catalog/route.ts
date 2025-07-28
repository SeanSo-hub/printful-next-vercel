import { NextResponse } from 'next/server';

// Allow multiple Shopify domains
const allowedOrigins = [
  'https://zyh1n4-pd.myshopify.com' 
];

function setCorsHeaders(response: NextResponse, origin: string | null) {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

export async function GET(request: Request) {
  console.log('API route called');
  
  // Handle CORS preflight
  const origin = request.headers.get('origin');
  console.log('Request origin:', origin);
  console.log('Allowed origins:', allowedOrigins);
  
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'UEU3qt73zbJR6Z46IV9LeiaqdlLTHu3LcuwUx82j';
  console.log('Using API key:', PRINTFUL_API_KEY.substring(0, 10) + '...');
  
  if (!PRINTFUL_API_KEY) {
    console.error('Missing Printful API key');
    const res = NextResponse.json({ error: 'Missing Printful API key' }, { status: 500 });
    return setCorsHeaders(res, origin);
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
    console.log('Response ok:', response.ok);
    
    data = await response.json();
    console.log('Response data keys:', Object.keys(data));
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error('Fetch error:', err);
    const res = NextResponse.json({ 
      error: 'Network error', 
      details: String(err),
      url: url,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    return setCorsHeaders(res, origin);
  }

  if (!response.ok) {
    console.error('Printful API error:', response.status, data);
    const res = NextResponse.json({ 
      error: 'Failed to fetch catalog', 
      details: data, 
      status: response.status,
      statusText: response.statusText
    }, { status: response.status });
    return setCorsHeaders(res, origin);
  }

  // Check if data.result exists
  if (!data.result) {
    console.error('Unexpected data structure:', data);
    const res = NextResponse.json({ 
      error: 'Unexpected response structure', 
      details: data
    }, { status: 500 });
    return setCorsHeaders(res, origin);
  }

  console.log('Successfully returning', data.result.length, 'products');
  const res = NextResponse.json(data.result);
  return setCorsHeaders(res, origin);
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  console.log('OPTIONS request from origin:', origin);
  
  const res = NextResponse.json(null, { status: 204 });
  return setCorsHeaders(res, origin);
}