import { GitCommit, Clock, ExternalLink, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    html_url: string;
}

async function getRecentActivity(): Promise<Commit[]> {
    try {
        const response = await fetch(
            "https://api.github.com/repos/hatem-noureddine/resume/commits?per_page=5",
            {
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch activity");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching activity:", error);
        return [];
    }
}

export async function ActivityFeed() {
    const activities = await getRecentActivity();

    return (
        <section className="bg-secondary/20 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-secondary/30 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-primary" />
                    Recent Activity
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    From GitHub
                </span>
            </div>

            <div className="divide-y divide-white/5">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.sha} className="p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                                    <GitCommit className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                        {activity.commit.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(activity.commit.author.date), { addSuffix: true })}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/30">•</span>
                                        <a
                                            href={activity.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                                        >
                                            {activity.sha.substring(0, 7)}
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No recent activity found.
                    </div>
                )}
            </div>

            <div className="p-3 bg-black/20 text-center">
                <a
                    href="https://github.com/hatem-noureddine/resume/commits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                    View all activity on GitHub
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </section>
    );
}
