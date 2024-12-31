import { NextRequest, NextResponse } from "next/server";
import { FindPage } from "./utils/api/common/FindPage";

const PUBLIC_FILE = /\.(.*)$/;
const CACHE_TTL = 1000 * 60 * 60; // Cache TTL in milliseconds (1 hour)
const DomainCache = new Map<string, { page: any; expires: number }>();
const RewriteToPath = !!process.env.REWRITE_SUBDOMAIN_TO_PATH;
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const { hostname } = new URL(`http://${host}`);

  const domainParts = hostname.split(".");
  const subdomain = RewriteToPath
    ? url.pathname.split("/")[1]
    : domainParts.length > 2
    ? domainParts[0]
    : null;
  const rootDomain = domainParts.slice(-2).join(".");

  // Skip public/static files and Next.js internals
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.includes("_next") ||
    url.pathname.includes("api")
  ) {
    return NextResponse.next();
  }
  // Redirect /edit to /edit/menu
  if (RewriteToPath) {
    if (url.pathname === `/${subdomain}/edit`) {
      console.log(true);

      url.pathname = `/${subdomain}/edit/menu`;
      return NextResponse.redirect(url);
    }

    if (url.pathname) {
      const req = NextResponse.rewrite(
        new URL(`${request.nextUrl.pathname}(page)/[..slug]`, request.url)
      );
      req.headers.set("X-Url", request.url);

      return req;
    }
  } else if (!RewriteToPath) {
    if (url.pathname === "/edit") {
      url.pathname = "/edit/menu";
      return NextResponse.redirect(url);
    }
    if (url.pathname == "/" && subdomain) {
      return createRewriteResponse(subdomain, request, `(page)/[...slug]`);
    }

    // Handle subdomain-based routing
    if (
      subdomain &&
      rootDomain === process.env.NEXT_PUBLIC_DOMAIN &&
      !["menuone", "www", "api"].includes(subdomain)
    ) {
      if (url.pathname == "/cache-invalid") return InvalidateCache(subdomain);
      const cachedResult = await getCachedDomain(subdomain);

      if (cachedResult) {
        if (cachedResult.expires >= Date.now()) {
          refreshCache(subdomain);
        }
        if (cachedResult.page) {
          return createRewriteResponse(subdomain, request);
        } else {
          return NextResponse.error(); // Cached as "not found"
        }
      }

      // Fetch and cache if not in cache
      const [page, error] = await FindPage(subdomain);

      if (!page || (error?.response && error?.response?.status >= 201)) {
        DomainCache.delete(subdomain);
        return NextResponse.error();
      }

      cacheDomain(subdomain, true);
      return createRewriteResponse(subdomain, request);
    }
  }
  return NextResponse.next();
}

async function InvalidateCache(subdomain: string) {
  if (DomainCache.has(subdomain)) {
    DomainCache.delete(subdomain);
  }

  return NextResponse.json(
    {
      message: "Dns Cache Invalidated Successfully.",
      statuCode: 200,
    },
    {
      status: 200,
      statusText: "ok",
    }
  );
}
// Helper to get cached domain and check expiration
async function getCachedDomain(subdomain: string) {
  let cached = DomainCache.get(subdomain);

  if (cached && cached.expires > Date.now()) return cached;

  DomainCache.delete(subdomain); // Remove expired cache
  await refreshCache(subdomain); // Refresh cache asynchronously
  cached = DomainCache.get(subdomain);
  if (cached && cached.expires > Date.now()) return cached;
  return null;
}

// Helper to cache domain data
function cacheDomain(subdomain: string, page: any) {
  DomainCache.set(subdomain, {
    page,
    expires: Date.now() + CACHE_TTL,
  });
}

// Helper to refresh cache asynchronously
async function refreshCache(subdomain: string) {
  try {
    const [page, error] = await FindPage(subdomain);

    // @ts-expect-error
    if (page && (!error || error?.response?.status < 201)) {
      cacheDomain(subdomain, true);
    } else {
      DomainCache.delete(subdomain); // Cache as "not found"
    }
  } catch (err) {
    console.error(`Error refreshing cache for subdomain "${subdomain}`, err);
  }
}

// Helper to create a rewrite response
function createRewriteResponse(
  subdomain: string,
  request: NextRequest,
  extrapath: string = ""
) {
  const req = NextResponse.rewrite(
    new URL(`/${subdomain}${request.nextUrl.pathname}${extrapath}`, request.url)
  );
  req.headers.set("X-Url", request.url);
  return req;
}
