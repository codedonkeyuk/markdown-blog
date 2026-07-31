import fs from "fs";
import path from "path";
import createFile from "../file-utils/create-file.ts";
import appConfig from "../../app-config.ts";

const { productionPath } = appConfig();

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

function* walkDir(dir: string): Generator<string> {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

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
              return caches.match("/offline");
            }
          });

        return cachedResponse || networkFetch;
      });
    }),
  );
});
`;

const injectServiceWorker = async () => {
  const dynamicAssets: string[] = ["/"];
  const CACHEABLE_EXTENSIONS = [
    ".html",
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".webp",
    ".ico",
    ".woff2",
  ];

  for (const filePath of walkDir(path.resolve(productionPath))) {
    const fileName = path.basename(filePath).toLowerCase();
    const ext = path.extname(filePath).toLowerCase();

    if (fileName === "sw.js" || fileName === "rss.xml") {
      continue;
    }

    if (CACHEABLE_EXTENSIONS.includes(ext)) {
      let webPath =
        "/" +
        path
          .relative(path.resolve(productionPath), filePath)
          .replace(/\\/g, "/")
          .toLowerCase();

      if (webPath.endsWith("/index.html")) {
        webPath = webPath.slice(0, -11);
        if (webPath === "") webPath = "/";
      } else if (webPath.endsWith(".html")) {
        webPath = webPath.slice(0, -5);
      }

      if (!dynamicAssets.includes(webPath)) {
        dynamicAssets.push(webPath);
      }
    }
  }

  const versionNo = generateAssetHash(dynamicAssets);

  return createFile(
    `${productionPath}/sw.js`,
    serviceWorkerContent(versionNo, dynamicAssets),
  );
};

export default injectServiceWorker;
