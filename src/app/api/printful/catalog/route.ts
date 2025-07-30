import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PRINTFUL_URL = "https://api.printful.com/v2/catalog-products";
const allowedOrigin = "https://zyh1n4-pd.myshopify.com";

export async function GET() {
  const apiKey =
    process.env.PRINTFUL_API_KEY || "xyD86qYWF2lZKRUdbOCfelfw8V4OX3Nd0zYnIipf";
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const res = await axios.get(PRINTFUL_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch from Printful" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://zyh1n4-pd.myshopify.com",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
