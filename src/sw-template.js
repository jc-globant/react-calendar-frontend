/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.loadModule('workbox-background-sync');

//eslint-disable-next-line no-restricted-globals
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;

const { BackgroundSyncPlugin } = workbox.backgroundSync;


// Se "Mockea" las llamadas a estos enpoints, con la estrategia network first
const cacheNetworkFirst = [
    '/api/events',
    '/api/auth/renew'
];

registerRoute(
    ({ request, url }) => {
        console.log({ request, url });
        return cacheNetworkFirst.includes(url.pathname);
    },
    new NetworkFirst(),
);


// Anterior implementacion antes de usar el callback que esta arriba
// registerRoute(
//     new RegExp('http://localhost:4000/api/events'),
//     new NetworkFirst()
// );


const cacheFirst = [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"
]


registerRoute(
    ({ request, url }) => {
        console.log({ request, url });
        return cacheFirst.includes(url.href);
    },
    new CacheFirst(),
);

// Anterior implementacion antes de usar el callback que esta arriba
// registerRoute(
//     new RegExp('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'),
//     new CacheFirst()
// )

// OFFLINE POSTS

const bgSyncPlugin = new BackgroundSyncPlugin('offline-posts-queue', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

// Se guarda en indexeDB las peticiones POST, DELETE y PUT como pendientes y se ejecutan cuando se tiene internet
registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "POST"
);


registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "DELETE"
);


registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    "PUT"
);
