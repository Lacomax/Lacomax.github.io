/**
 * Service Worker for Vokabeltrainer PWA
 * Provides offline functionality and caching strategies
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `vokabeltrainer-${CACHE_VERSION}`;

// Files to cache immediately on install
const STATIC_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './favicon.ico',
    './flag_france.png',
    './flag_germany.png',
    './flag_uk.png'
];

// Vocabulary JSON files (cache on first request)
const DYNAMIC_CACHE = [
    './vocabD1B.json',
    './vocabGL2B.json'
];

// Audio files (cache on demand)
const AUDIO_CACHE = [];
for (let i = 1; i <= 25; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    AUDIO_CACHE.push(`./correct_mp3/correct${num}.mp3`);
}

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Error caching static assets:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('vokabeltrainer-') && name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(url.pathname)) {
        // Cache-first strategy for static assets
        event.respondWith(cacheFirst(request));
    } else if (isVocabularyFile(url.pathname)) {
        // Network-first strategy for vocabulary files (allows updates)
        event.respondWith(networkFirst(request));
    } else if (isAudioFile(url.pathname)) {
        // Cache-first strategy for audio files
        event.respondWith(cacheFirst(request));
    } else {
        // Default: network-first
        event.respondWith(networkFirst(request));
    }
});

/**
 * Cache-first strategy: Try cache, fallback to network
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first failed:', error);

        // Return cached response if available (even if stale)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page or error response
        return new Response('Offline - Resource not cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network-first strategy: Try network, fallback to cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network request failed, trying cache:', request.url);

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return error response
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
    return pathname.endsWith('.html') ||
           pathname.endsWith('.css') ||
           pathname.endsWith('.js') ||
           pathname.endsWith('.png') ||
           pathname.endsWith('.ico') ||
           pathname.endsWith('.json') && pathname.includes('manifest');
}

/**
 * Check if URL is a vocabulary file
 */
function isVocabularyFile(pathname) {
    return pathname.includes('vocab') && pathname.endsWith('.json');
}

/**
 * Check if URL is an audio file
 */
function isAudioFile(pathname) {
    return pathname.endsWith('.mp3') || pathname.endsWith('.wav');
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_AUDIO') {
        // Preload audio files
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll(AUDIO_CACHE);
                })
                .then(() => {
                    console.log('[SW] Audio files cached');
                })
                .catch((error) => {
                    console.error('[SW] Error caching audio files:', error);
                })
        );
    }
});

/**
 * Background sync event (future enhancement)
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

/**
 * Sync progress data (placeholder for future implementation)
 */
async function syncProgress() {
    try {
        // Future: sync user progress to server
        console.log('[SW] Background sync triggered');
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
    }
}

console.log('[SW] Service Worker script loaded');
