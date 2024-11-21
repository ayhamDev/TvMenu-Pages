import { NextRequest, NextResponse } from "next/server";
import { FindPage } from "./utils/FindPage";

const PUBLIC_FILE = /\.(.*)$/; // Files

const DomainCache = new Map();

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { hostname } = new URL(`http://${host}`);
  const domainParts = hostname.split(".");
  const subdomain = domainParts.length > 2 ? domainParts[0] : null;
  const rootDomain = domainParts.slice(domainParts.length - 2).join(".");

  const url = request.nextUrl.clone();
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) {
    return NextResponse.next();
  }

  if (
    subdomain &&
    rootDomain === process.env.NEXT_PUBLIC_DOMAIN &&
    subdomain !== "menuone" &&
    subdomain !== "www" &&
    subdomain !== "api"
  ) {
    // Check the cache
    const cachedResult = DomainCache.get(subdomain);
    if (cachedResult && cachedResult.expires > Date.now()) {
      // Serve the cached response if available
      if (cachedResult.page) {
        const req = NextResponse.rewrite(
          new URL(`/pages/${subdomain}${request.nextUrl.pathname}`, request.url)
        );
        req.headers.set("X-Url", request.url);

        // Update the cache in the background
        refreshCache(subdomain);
        return req;
      } else {
        // If cached as "not found," immediately respond with an error
        return NextResponse.error();
      }
    }

    // If no valid cache, fetch the page
    const [page, error] = await FindPage(subdomain);

    if (!page || (error?.response && error?.response?.status >= 201)) {
      // Cache the "not found" state and respond with an error
      DomainCache.delete(subdomain);
      return NextResponse.error();
    }

    // Cache the valid result and serve the response
    DomainCache.set(subdomain, { page, expires: Date.now() + 60 * 1000 });
    const req = NextResponse.rewrite(
      new URL(`/pages/${subdomain}${request.nextUrl.pathname}`, request.url)
    );
    req.headers.set("X-Url", request.url);

    return req;
  }

  return NextResponse.next();
}

// Function to refresh the cache asynchronously
async function refreshCache(subdomain: string) {
  try {
    const [page, error] = await FindPage(subdomain);
    if (!page || (error?.response && error?.response?.status >= 201)) {
      // Cache "not found" for 1 minute
      DomainCache.set(subdomain, {
        page: null,
        expires: Date.now() + 60 * 1000,
      });
    } else {
      // Cache valid result for 1 minute
      DomainCache.set(subdomain, { page, expires: Date.now() + 60 * 1000 });
    }
  } catch (err) {
    console.error(`Error refreshing cache for subdomain "${subdomain}":`, err);
  }
}
