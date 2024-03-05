const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // Match all requests for assets (CSS, JS, images, etc.)
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  // Use CacheFirst strategy for caching assets
  new CacheFirst({
    cacheName: 'assets-cache', // Name for the cache
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache responses with status 0 and 200
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Limit the number of entries in the cache
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);
