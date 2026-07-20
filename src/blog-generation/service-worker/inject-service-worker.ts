import createFile from "../file-utils/create-file.ts";
import appConfig from "../../app-config.ts";

const generateAssetHash = (assets: string[]): number => {
  const str = assets.join(",");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

// 2. Updated template accepting both version number and assets string array
const serviceWorkerContent = (versionNo: number, assets: string[]) => `
const CACHE_NAME = "site-assets-v${versionNo}";

const PRECACHE_ASSETS = ${JSON.stringify(assets, null, 2)};

function trimCache(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => {
          trimCache(cacheName, maxItems);
        });
      }
    });
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());

              event.waitUntil(trimCache(CACHE_NAME, 50));
            }
            return networkResponse;
          })
          .catch(() => {
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/offline.html");
            }
          });

        return cachedResponse || networkFetch;
      });
    }),
  );
});
`;

const injectServiceWorker = async () => {
  const {
    productionPath,
    serviceWorker: { precacheAssets },
  } = appConfig();
  const versionNo = generateAssetHash(precacheAssets);

  return createFile(
    `${productionPath}/sw.js`,
    serviceWorkerContent(versionNo, precacheAssets),
  );
};

export default injectServiceWorker;
