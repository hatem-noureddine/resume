"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCommit, Star, GitFork, ExternalLink, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/Glass";

interface GitHubEvent {
    id: string;
    type: string;
    repo: {
        name: string;
        url: string;
    };
    created_at: string;
    payload: {
        commits?: { message: string; sha: string }[];
        action?: string;
        ref?: string;
        ref_type?: string;
    };
}

interface GitHubActivityProps {
    readonly username: string;
    readonly maxEvents?: number;
    readonly showCard?: boolean;
    readonly className?: string;
}

/**
 * GitHub Activity Widget - displays recent public activity from a GitHub user.
 * 
 * Usage:
 * ```tsx
 * <GitHubActivity username="octocat" maxEvents={5} />
 * ```
 */
export function GitHubActivity({
    username,
    maxEvents = 5,
    showCard = true,
    className = ""
}: GitHubActivityProps) {
    const [events, setEvents] = useState<GitHubEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://api.github.com/users/${username}/events/public?per_page=${maxEvents}`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                        },
                        next: { revalidate: 3600 } // Cache for 1 hour
                    }
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('GitHub user not found');
                    }
                    if (response.status === 403) {
                        throw new Error('API rate limit exceeded');
                    }
                    throw new Error('Failed to fetch GitHub activity');
                }

                const data = await response.json();
                setEvents(data.slice(0, maxEvents));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load activity');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchActivity();
        }
    }, [username, maxEvents]);

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'PushEvent':
                return <GitCommit className="w-4 h-4 text-green-500" />;
            case 'WatchEvent':
                return <Star className="w-4 h-4 text-yellow-500" />;
            case 'ForkEvent':
                return <GitFork className="w-4 h-4 text-blue-500" />;
            default:
                return <GitCommit className="w-4 h-4 text-primary" />;
        }
    };

    const getEventDescription = (event: GitHubEvent) => {
        switch (event.type) {
            case 'PushEvent': {
                const commits = event.payload.commits?.length || 0;
                return `Pushed ${commits} commit${commits === 1 ? '' : 's'} to`;
            }
            case 'WatchEvent':
                return 'Starred';
            case 'ForkEvent':
                return 'Forked';
            case 'CreateEvent':
                return `Created ${event.payload.ref_type || 'repository'}`;
            case 'PullRequestEvent':
                return `${event.payload.action || 'Updated'} pull request in`;
            case 'IssuesEvent':
                return `${event.payload.action || 'Updated'} issue in`;
            default:
                return 'Activity in';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const content = (
        <div className={className}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-outfit flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub Activity
                </h3>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    @{username}
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <div className="text-sm text-red-500 text-center py-4">
                    {error}
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                    No recent public activity
                </div>
            )}

            {!loading && !error && events.length > 0 && (
                <ul className="space-y-3">
                    {events.map((event, index) => (
                        <motion.li
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 text-sm"
                        >
                            <div className="mt-1">{getEventIcon(event.type)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground">
                                    {getEventDescription(event)}{' '}
                                    <a
                                        href={`https://github.com/${event.repo.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {event.repo.name.split('/')[1]}
                                    </a>
                                </p>
                                {event.type === 'PushEvent' && event.payload.commits?.[0] && (
                                    <p className="text-muted-foreground truncate mt-0.5">
                                        &quot;{event.payload.commits[0].message}&quot;
                                    </p>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTimeAgo(event.created_at)}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );

    if (showCard) {
        return (
            <GlassCard hover className="w-full">
                {content}
            </GlassCard>
        );
    }

    return content;
}
