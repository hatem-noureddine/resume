import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeading } from './SectionHeading';

const meta = {
    title: 'UI/SectionHeading',
    component: SectionHeading,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        align: {
            control: 'select',
            options: ['left', 'center'],
        },
    },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Section Title',
        subtitle: 'Subtitle goes here',
    },
};

export const LeftAligned: Story = {
    args: {
        title: 'Left Aligned Title',
        subtitle: 'Aligned to the left',
        align: 'left',
    },
};

export const LongText: Story = {
    args: {
        title: 'A Very Long Section Title That Might Wrap',
        subtitle: 'A detailed subtitle describing the section content in more depth',
    },
};
