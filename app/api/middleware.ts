import { NextRequest, NextResponse } from "next/server";

const NEXT_LOCAL_URL = process.env.NEXT_LOCAL_URL!;
const NEXT_DOMAIN_URL = process.env.NEXT_DOMAIN_URL!;
const NEXT_WWW_DOMAIN_URL = process.env.NEXT_WWW_DOMAIN_URL!;

const allowedOrigins = [
    NEXT_LOCAL_URL, 
    NEXT_DOMAIN_URL,
    NEXT_WWW_DOMAIN_URL,
  ];

  export function middleware(req: NextRequest) {
    // retrieve the current response
    const res = NextResponse.next()

    // retrieve the HTTP "Origin" header 
    // from the incoming request
    req.headers.get("origin")

    // if the origin is an allowed one,
    // add it to the 'Access-Control-Allow-Origin' header
    if (allowedOrigins.includes(origin)) {
      res.headers.append('Access-Control-Allow-Origin', origin);
    }

    // add the remaining CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}