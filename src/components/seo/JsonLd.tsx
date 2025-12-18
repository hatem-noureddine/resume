export function JsonLd({ data }: Readonly<{ data: Record<string, unknown> }>) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function BreadcrumbJsonLd({
    items,
}: Readonly<{
    items: { name: string; item: string }[];
}>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    };

    return <JsonLd data={jsonLd} />;
}

export function ArticleJsonLd({
    url,
    title,
    images,
    datePublished,
    dateModified,
    description,
    authorName,
}: Readonly<{
    url: string;
    title: string;
    images: string[];
    datePublished: string;
    dateModified?: string;
    description: string;
    authorName: string;
}>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        image: images,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        description: description,
        author: {
            "@type": "Person",
            name: authorName,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
    };

    return <JsonLd data={jsonLd} />;
}
