'use client';

import { useFeatureFlags } from '@/context/FeatureFlags';
import { ToggleLeft, ToggleRight, Settings } from 'lucide-react';

export function FeatureFlagsSection() {
    const { flags, setFlag } = useFeatureFlags();

    return (
        <section className="p-6 rounded-xl bg-secondary/30 border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Feature Flags
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(flags).map(([key, enabled]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5 hover:border-primary/20 transition-colors"
                    >
                        <span className="text-sm font-mono text-muted-foreground">{key}</span>
                        <button
                            onClick={() => setFlag(key, !enabled)}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${enabled ? 'text-primary' : 'text-muted-foreground'}`}
                            title={`Toggle ${key}`}
                        >
                            {enabled ? (
                                <ToggleRight className="w-6 h-6" />
                            ) : (
                                <ToggleLeft className="w-6 h-6" />
                            )}
                            <span className="sr-only">{enabled ? 'Enabled' : 'Disabled'}</span>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
