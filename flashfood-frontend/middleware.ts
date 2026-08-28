import { NextRequest, NextResponse } from 'next/server';

const rotasProtegidas = ['/home', '/dashboard-restaurante'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const ehRotaProtegida = rotasProtegidas.some((rota) => pathname.startsWith(rota));

  if (ehRotaProtegida && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/dashboard-restaurante/:path*'],
};