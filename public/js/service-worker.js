const APP_PREFIX = 'FoodFest -';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/js/index.js',
    '/js/idb.js',
    '/maifest.json',
    '/css/style.css',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];


self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.andAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener('acivate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keylist) {
            let cacheKeeplist = keylist.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(keylist.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keylist[i] );
                    return caches.delete(keylist[i]);
                }
            }));
        })
    )
});