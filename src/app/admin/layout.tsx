import { AdminLayout } from "@/components/admin";

export const metadata = {
    title: "Admin | Resume Portfolio",
    description: "Admin dashboard for managing resume portfolio",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
