var CACHE = 'morgana-v1';
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(['/', '/index.html']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if(url.includes('/api/') || url.includes('anthropic.com') || url.includes('wikimedia.org')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(cached) {
    return cached || fetch(e.request).then(function(resp) {
      if(resp && resp.status===200 && resp.type==='basic') {
        var clone = resp.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone)});
      }
      return resp;
    }).catch(function(){return caches.match('/index.html')});
  }));
});
