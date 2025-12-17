import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 관리지 페이지의 보안(로그인 체크)를 위해 추가 
 * /admin 페이지 보여주기 전에 먼저 검사. 
 * 
 * 로그인 안한 사람은 절대 들어오지 못하게 막는 안전장치로서 가장 앞단에 배치
 */
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // 1. 관리자 페이지로 가는 요청인지 확인
    const isProtectedPath = path.startsWith('/admin')

    // 2. 로그인 페이지로 가는 요청인지 확인
    const isPublicAdminPath = path === '/admin/login'

    // 3. 로그인 쿠키가 있는지 확인
    const isAuthenticated = request.cookies.has('admin_session')

    // 4. 로그인 안한 사람은 절대 들어오지 못하게 막는 안전장치
    if (isProtectedPath && !isPublicAdminPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 5. 로그인한 사람은 절대 들어오지 못하게 막는 안전장치
    if (isPublicAdminPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // 6. 정상적인 요청이면 다음 미들웨어로 전달
    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
