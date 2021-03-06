// ---
// layout: null
//---

var staticCacheName = 'np-v10';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index-data.json',
        '/css/main.css',
        '/js/ga-events.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/balance-text/1.6.0/jquery.balancetext.min.js',
        'https://fonts.googleapis.com/css?family=Open+Sans:700,300|Lustria',
        'https://fonts.gstatic.com/s/lustria/v4/P1zvvbOqCVCJzgypDg3MKw.woff2',
        'https://fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTegdm0LZdjqr5-oayXSOefg.woff2',
        'https://fonts.gstatic.com/s/opensans/v13/k3k702ZOKiLJc3WVjuplzOgdm0LZdjqr5-oayXSOefg.woff2',
        '/js/loadRemainingContent.js'
      ]);
    })
  );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       //console.log("getting ", event.request, response);
//       setTimeout(otherstuff, 0);
//       return response || fetch(event.request);
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          // if we got a response from the cache, update the cache
          if (response) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // respond from the cache, or the network
        return response || fetchPromise;
      });
    })
  );
});



self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('np-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          console.log("deleting " + cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});
