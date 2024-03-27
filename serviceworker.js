const CACHE_NAME = "flower-shop-cache-v1";
const urlsToCache = [
  "/",
  "index.html",
  "style.css",
  "app.js",
  "assets/rose.png",
  "assets/tulip.png",
  "assets/sunflower.png",
];

// Install event: Cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve assets from cache or fetch from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Serve from cache:", event.request.url);
        return response;
      }
      console.log("Fetch from network:", event.request.url);
      return fetch(event.request);
    })
  );
});

// Sync event: Background synchronization
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    console.log("Background sync event:", event.tag);
    // Perform synchronization tasks here
  }
});

// Push event: Handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received");
  const options = {
    body: event.data.text(),
    icon: "/images/notification-icon.png",
    badge: "/images/notification-badge.png",
  };
  event.waitUntil(self.registration.showNotification("Flower Shop", options));
});
