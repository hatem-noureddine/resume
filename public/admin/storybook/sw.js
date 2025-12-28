const CACHE_NAME = 'hatem-portfolio-v2';

// Resources to cache on install
const STATIC_ASSETS = [
    '/',
    '/blog',
    '/portfolio',
    '/manifest.json',
    '/logo_HN.svg',
    '/icon-192.png',
    '/icon-512.png',
    '/favicon.ico',
    '/profile.webp',
];

// Cache strategies
const CACHE_STRATEGIES = {
    // Cache first for static assets
    cacheFirst: 'cache-first',
    // Network first for API and dynamic content
    networkFirst: 'network-first',
    // Stale while revalidate for balance
    staleWhileRevalidate: 'stale-while-revalidate',
};

// Determine cache strategy based on request
function getCacheStrategy(request) {
    const url = new URL(request.url);

    // API requests - network first
    if (url.pathname.startsWith('/api/')) {
        return CACHE_STRATEGIES.networkFirst;
    }

    // Static assets - cache first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2|ico)$/) ||
        url.pathname.startsWith('/_next/static/')
    ) {
        return CACHE_STRATEGIES.cacheFirst;
    }

    // Pages - stale while revalidate
    return CACHE_STRATEGIES.staleWhileRevalidate;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Activate immediately
    globalThis.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    // Take control of all pages immediately
    globalThis.clients.claim();
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const strategy = getCacheStrategy(event.request);

    switch (strategy) {
        case CACHE_STRATEGIES.cacheFirst:
            event.respondWith(cacheFirst(event.request));
            break;
        case CACHE_STRATEGIES.networkFirst:
            event.respondWith(networkFirst(event.request));
            break;
        case CACHE_STRATEGIES.staleWhileRevalidate:
            event.respondWith(staleWhileRevalidate(event.request));
            break;
    }
});

// Cache first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Return offline fallback if available
        return caches.match('/');
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        // For API requests, return error response
        return new Response(
            JSON.stringify({ error: 'Offline', cached: false }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Start network request in background
    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });

    // Return cached immediately, or wait for network
    return cached || fetchPromise;
}

// Listen for messages from the app
globalThis.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        globalThis.skipWaiting();
    }
});
