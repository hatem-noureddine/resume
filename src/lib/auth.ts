import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "default_secret_please_change_in_production"
);

export const SESSION_COOKIE = "admin_session";

export interface SessionPayload {
    role: string;
    expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET, {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

export async function createSession(role: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ role, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    if (!session) return null;
    return decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    if (!parsed) return;

    parsed.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: SESSION_COOKIE,
        value: await encrypt(parsed),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: parsed.expiresAt,
        sameSite: "lax",
        path: "/",
    });
    return res;
}
