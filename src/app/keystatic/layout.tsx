"use client";

import { AdminBar } from "@/components/admin/AdminBar";
import KeystaticApp from "./keystatic";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminBar currentPage="Keystatic CMS" />
            <div className="flex-1">
                <KeystaticApp />
            </div>
        </div>
    );
}
