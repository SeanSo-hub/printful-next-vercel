import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PRINTFUL_URL = "https://api.printful.com/v2/catalog-products";
const allowedOrigin = "https://zyh1n4-pd.myshopify.com/"; 

export async function GET(req: NextRequest) {
    const apiKey = process.env.PRINTFUL_API_KEY || 'UEU3qt73zbJR6Z46IV9LeiaqdlLTHu3LcuwUx82j';
    if (!apiKey) {
        return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    try {
        const res = await axios.get(PRINTFUL_URL, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            validateStatus: () => true,
        });

        return NextResponse.json(res.data, {
            status: res.status, 
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Content-Type': 'application/json'
            }
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                error: "Failed to fetch from Printful",
                details: err.message,
            },
            {
                status: 500, 
                headers: {
                    'Access-Control-Allow-Origin': allowedOrigin,
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}