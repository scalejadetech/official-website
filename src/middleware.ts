import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false
});

export default function middleware(request: NextRequest) {
  // Detect country from Vercel Edge headers
  const country = request.headers.get('x-vercel-ip-country');
  
  // If the user hits the root domain and is in Indonesia, route to /id
  // if (country === 'ID' && request.nextUrl.pathname === '/') {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/id';
  //   return NextResponse.redirect(url);
  // }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};