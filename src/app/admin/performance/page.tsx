import { PerformanceDashboard } from "@/components/performance";

export const metadata = {
    title: "Performance Dashboard | Admin",
    description: "Real-time Core Web Vitals monitoring dashboard",
};

export default function PerformancePage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <PerformanceDashboard />
        </div>
    );
}
