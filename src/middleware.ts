import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = "stryde2026";
const USER_SESSION_COOKIE = "stryde-user-session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 旧路径 /stock 重定向到 /admin/stock（随后走 admin 鉴权）
  if (pathname === "/stock") {
    return NextResponse.redirect(new URL("/admin/stock", req.url));
  }

  // 旧公开 /studio 已移至内部 /admin/studio：已登录 admin 直达内部路由，否则去登录页
  if (pathname === "/studio") {
    const studioToken = req.cookies.get("stryde-admin-token")?.value;
    if (studioToken === ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/studio", req.url));
    }
    const studioLoginUrl = new URL("/login", req.url);
    studioLoginUrl.searchParams.set("redirect", "/studio");
    return NextResponse.redirect(studioLoginUrl);
  }

  // 客户账户区：cookie 存在即初步放行，/account 页面会再调 /api/auth/me 校验会话有效性
  if (pathname.startsWith("/account")) {
    const hasSession = Boolean(req.cookies.get(USER_SESSION_COOKIE)?.value);
    const isAuthPage =
      pathname === "/account/login" || pathname === "/account/register";

    if (isAuthPage) {
      // 已登录再访问登录/注册页 → 直接进账户中心
      if (hasSession) {
        return NextResponse.redirect(new URL("/account", req.url));
      }
      return NextResponse.next();
    }

    if (!hasSession) {
      const loginUrl = new URL("/account/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 管理后台
  const token = req.cookies.get("stryde-admin-token")?.value;

  // 已登录 → 放行
  if (token === ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  // 未登录 → 跳登录页
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/stock", "/studio", "/account/:path*"],
};
