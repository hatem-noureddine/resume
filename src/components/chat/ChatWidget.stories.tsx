import type { Meta, StoryObj } from '@storybook/react';
import { ChatWidget } from './ChatWidget';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

const meta: Meta<typeof ChatWidget> = {
    title: 'Components/Chat/ChatWidget',
    component: ChatWidget,
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <LanguageProvider>
                    <div className="h-[600px] w-full relative bg-background border border-border rounded-lg overflow-hidden">
                        <Story />
                    </div>
                </LanguageProvider>
            </ThemeProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof ChatWidget>;

export const Default: Story = {};

export const OpenWithMessages: Story = {
    render: () => {
        // We can't easily force state without refactoring the component to accept props/control
        // But we can document it exists.
        // Ideally we would refactor ChatWidget to be a controlled component or accept initial state
        return <ChatWidget />;
    }
};
