import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, ImageWithSkeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'UI/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Loading skeleton placeholders for content that is still loading.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['box', 'text', 'circle'],
            description: 'The shape variant of the skeleton',
        },
        width: {
            control: { type: 'text' },
            description: 'Width of the skeleton',
        },
        height: {
            control: { type: 'text' },
            description: 'Height of the skeleton',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Box: Story = {
    args: {
        variant: 'box',
        width: 200,
        height: 100,
    },
};

export const Text: Story = {
    args: {
        variant: 'text',
        width: 200,
    },
};

export const Circle: Story = {
    args: {
        variant: 'circle',
        width: 60,
        height: 60,
    },
};

export const CardSkeleton: Story = {
    render: () => (
        <div className="w-80 p-4 space-y-4 bg-secondary/20 rounded-lg">
            <Skeleton variant="box" width="100%" height={150} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div className="flex gap-2">
                <Skeleton variant="circle" width={40} height={40} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                </div>
            </div>
        </div>
    ),
};
