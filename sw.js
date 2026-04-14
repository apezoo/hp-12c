// HP-12C Calculator - Service Worker
// Provides offline functionality and caching for PWA

// IMPORTANT: Increment this version on every deployment to bust cache
// Format: hp12c-vX.Y.Z or hp12c-dev-YYYYMMDD for dev builds
const CACHE_NAME = 'hp12c-v1.5.1';

// Development mode detection (disable aggressive caching during debug)
// Set to false for production builds
const DEV_MODE = false;
const urlsToCache = [
  './app/index.html',
  './app/css/styles.css',
  './app/css/components.css',
  './app/js/i18n.js',
  './app/js/rpn-stack.js',
  './app/js/display.js',
  './app/js/memory.js',
  './app/js/financial.js',
  './app/js/statistics.js',
  './app/js/date-functions.js',
  './app/js/depreciation.js',
  './app/js/keyboard.js',
  './app/js/key-metadata.js',
  './app/js/key-info.js',
  './app/js/calculator.js',
  './docs/examples.html',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // In DEV_MODE, use network-first to always get fresh content
  if (DEV_MODE) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the response for offline fallback
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Production: Cache-first strategy for best performance
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});
