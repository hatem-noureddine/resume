import { getSortedPostsData, getPostData, getPostSlugs } from './posts';
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
});
