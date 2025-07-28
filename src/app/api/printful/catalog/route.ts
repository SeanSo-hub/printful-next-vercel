import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = 'https://zyh1n4-pd.myshopify.com';

function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  
  if (origin !== ALLOWED_ORIGIN) {
    return setCorsHeaders(NextResponse.json({ error: 'CORS Error' }, { status: 403 }));
  }

  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  if (!PRINTFUL_API_KEY) {
    return setCorsHeaders(NextResponse.json({ error: 'Missing API key' }, { status: 500 }));
  }

  try {
    const response = await fetch('https://api.printful.com/v2/catalog-products', {
      headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return setCorsHeaders(NextResponse.json({ error: 'API Error', details: data }, { status: response.status }));
    }

    if (!data.result) {
      return setCorsHeaders(NextResponse.json({ error: 'Invalid response' }, { status: 500 }));
    }

    return setCorsHeaders(NextResponse.json(data.result));
    
  } catch (err) {
    return setCorsHeaders(NextResponse.json({ error: 'Network error' }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
}