import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/; // Files

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const [subdomain] = host.split(".");

  // Skip rewriting for the main domain and specific subdomains like 'www' or 'api'
  const url = request.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next"))
    return NextResponse.next();
  if (
    subdomain &&
    subdomain !== "menuone" &&
    subdomain !== "www" &&
    subdomain !== "api"
  ) {
    // Rewrite to `/${subdomain}` if the subdomain is valid
    const req = NextResponse.rewrite(
      new URL(`/client/${subdomain}${request.nextUrl.pathname}`, request.url)
    );
    req.headers.set("X-Url", request.url);
    return req;
  }

  // Continue as usual if no valid subdomain
  return NextResponse.next();
}
