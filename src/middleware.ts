// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
// import { getSession } from 'next-auth/react';
// import { authOptions } from './lib/auth';
// import { getServerSession } from 'next-auth';

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; 
import { getToken } from "next-auth/jwt";


const isApiRoute = (pathname: string) => {
    return pathname.startsWith('/api/protected');
}

export async function middleware(req : NextRequest) {
    const url = req.url
    const { pathname } = req.nextUrl
    // console.log(pathname);
    const session: any = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // console.log(session)

    if(pathname == "/" && session){
        return NextResponse.redirect(new URL('/dashboard', url));
    }

    if(!session){
      if (isApiRoute(pathname)) {
        return NextResponse.redirect(new URL('/api/auth/unauthorized', url));
      }else if(pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL('/', url));
      }
    }

    return NextResponse.next()
  }