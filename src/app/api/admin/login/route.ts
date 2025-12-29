import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Check if ADMIN_PASSWORD is set, otherwise use a fallback (not recommended for prod)
        const expectedPassword = process.env.ADMIN_PASSWORD;

        if (!expectedPassword) {
            return NextResponse.json(
                { error: "Admin password not configured on server" },
                { status: 500 }
            );
        }

        if (password === expectedPassword) {
            await createSession("admin");
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
