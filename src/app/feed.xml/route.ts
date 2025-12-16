import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';

const BASE_URL = 'https://hatemnoureddine.github.io/resume';

export async function GET() {
  const allPosts = await getSortedPostsData();

  const itemsXml = allPosts.map((post) => {
    const postUrl = `${BASE_URL}/blog/${post.slug}`;
    const date = new Date(post.date).toUTCString();

    return `
    <item>
      <title>${post.title}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
    </item>`;
  }).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hatem Noureddine - Blog</title>
    <link>${BASE_URL}</link>
    <description>Thoughts, tutorials, and insights on web development and design.</description>
    <language>en-us</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
