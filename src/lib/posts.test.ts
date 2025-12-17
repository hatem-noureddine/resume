import { getSortedPostsData, getPostData, getPostSlugs, extractHeadings } from './posts';
import fs from 'fs';
import path from 'path';

// Mock the fs module
jest.mock('fs');
jest.mock('path');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('posts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default path.join behavior
        mockedPath.join.mockImplementation((...args) => args.join('/'));
    });

    describe('getSortedPostsData', () => {
        it('returns empty array when posts directory does not exist', async () => {
            mockedFs.existsSync.mockReturnValue(false);

            const result = await getSortedPostsData();

            expect(result).toEqual([]);
        });

        it('returns parsed posts sorted by date descending', async () => {
            mockedFs.existsSync.mockReturnValue(true);

            mockedFs.readdirSync.mockReturnValue(['post1.md', 'post2.md'] as any);

            // Mock file contents with frontmatter
            mockedFs.readFileSync.mockImplementation((filePath) => {
                if (filePath.toString().includes('post1')) {
                    return `---
title: "First Post"
date: "2024-01-01"
description: "Description 1"
tags: ["tag1"]
category: "Tutorial"
---
Content 1`;
                }
                return `---
title: "Second Post"
date: "2024-02-01"
description: "Description 2"
tags: ["tag2", "tag3"]
category: "Guide"
---
Content 2`;
            });

            const result = await getSortedPostsData();

            expect(result).toHaveLength(2);
            // Should be sorted by date descending (newest first)
            expect(result[0].title).toBe('Second Post');
            expect(result[0].date).toBe('2024-02-01');
            expect(result[1].title).toBe('First Post');
        });

        it('handles posts without category by defaulting to General', async () => {
            mockedFs.existsSync.mockReturnValue(true);

            mockedFs.readdirSync.mockReturnValue(['post.md'] as any);
            mockedFs.readFileSync.mockReturnValue(`---
title: "No Category Post"
date: "2024-01-01"
description: "Test"
tags: []
---
Content`);

            const result = await getSortedPostsData();

            expect(result[0].category).toBe('General');
        });

        it('handles posts without tags by defaulting to empty array', async () => {
            mockedFs.existsSync.mockReturnValue(true);

            mockedFs.readdirSync.mockReturnValue(['post.md'] as any);
            mockedFs.readFileSync.mockReturnValue(`---
title: "No Tags Post"
date: "2024-01-01"
description: "Test"
---
Content`);

            const result = await getSortedPostsData();

            expect(result[0].tags).toEqual([]);
        });
    });

    describe('getPostData', () => {
        it('returns null for non-existent post', async () => {
            mockedFs.existsSync.mockReturnValue(false);

            const result = await getPostData('non-existent');

            expect(result).toBeNull();
        });

        it('returns post data for existing post', async () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(`---
title: "Test Post"
date: "2024-01-15"
description: "A test post"
tags: ["test"]
category: "Testing"
---
This is the content.`);

            const result = await getPostData('test-post');

            expect(result).not.toBeNull();
            expect(result?.slug).toBe('test-post');
            expect(result?.title).toBe('Test Post');
            expect(result?.content).toContain('This is the content.');
        });
    });

    describe('getPostSlugs', () => {
        it('returns empty array when posts directory does not exist', async () => {
            mockedFs.existsSync.mockReturnValue(false);

            const result = await getPostSlugs();

            expect(result).toEqual([]);
        });

        it('returns list of slugs from md files', async () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readdirSync.mockReturnValue(['a.md', 'b.md', 'c.txt'] as any);

            const result = await getPostSlugs();

            expect(result).toEqual(['a', 'b']);
        });
    });

    describe('extractHeadings', () => {

        it('extracts h1 and h2 headings by default (maxLevel=2)', () => {
            const content = `
# Main Title
## Section One
### Subsection
## Section Two
`;
            const headings = extractHeadings(content);
            expect(headings).toHaveLength(3); // h1, h2, h2 (h3 excluded)
            expect(headings[0]).toEqual({ id: 'main-title', text: 'Main Title', level: 1 });
            expect(headings[1]).toEqual({ id: 'section-one', text: 'Section One', level: 2 });
            expect(headings[2]).toEqual({ id: 'section-two', text: 'Section Two', level: 2 });
        });

        it('respects maxLevel parameter', () => {
            const content = `
# Title
## Section
### Subsection
#### Deep
`;
            const headingsLevel2 = extractHeadings(content, 2);
            expect(headingsLevel2).toHaveLength(2); // h1, h2

            const headingsLevel3 = extractHeadings(content, 3);
            expect(headingsLevel3).toHaveLength(3); // h1, h2, h3

            const headingsLevel1 = extractHeadings(content, 1);
            expect(headingsLevel1).toHaveLength(1); // h1 only
        });

        it('generates URL-friendly IDs', () => {
            const content = `
## Hello World
## What's New?
## 1. Introduction
## Émojis & Special!
`;
            const headings = extractHeadings(content, 6);
            expect(headings[0].id).toBe('hello-world');
            expect(headings[1].id).toBe('whats-new');
            expect(headings[2].id).toBe('1-introduction');
            expect(headings[3].id).toBe('mojis-special'); // Special chars removed
        });

        it('handles multiple dashes', () => {
            const content = `## This   Has   Spaces`;
            const headings = extractHeadings(content, 6);
            expect(headings[0].id).toBe('this-has-spaces');
        });

        it('returns empty array for no headings', () => {
            const content = 'Just some text without headings';
            const headings = extractHeadings(content);
            expect(headings).toEqual([]);
        });

        it('handles heading with only level 1', () => {
            const content = '# Only Title';
            const headings = extractHeadings(content, 1);
            expect(headings).toHaveLength(1);
            expect(headings[0].level).toBe(1);
        });

        it('skips headings beyond maxLevel', () => {
            const content = `### H3 Before
## H2
### H3 After`;
            const headings = extractHeadings(content, 2);
            expect(headings).toHaveLength(1);
            expect(headings[0].text).toBe('H2');
        });
    });
});

