#!/usr/bin/env node
import generatePostPages from "./template/generate-post-pages.js";
import generateIndexes from "./template/generate-indexes.js";
import deleteDirContents from "./file-utils/delete-dir-contents.js";
import copyFolderContents from "./file-utils/copy-folder-contents.js";
import generatePostInfo from "./template/generate-post-info.js";
import appConfig from "../app-config.js";
import minifySite from "./compression/minify-site.js";
import injectServiceWorker from "./service-worker/inject-service-worker.js";
import rssFeed from "./rss/rss-feed.js";
import hashAssets from "./hashing/hash-assets.js";
const { productionPath, siteSourcePath, blogProductionPath } = appConfig;
await deleteDirContents(productionPath);
await copyFolderContents(siteSourcePath, productionPath);
await deleteDirContents(blogProductionPath);
const postInfo = await generatePostInfo();
await generatePostPages(postInfo);
await generateIndexes(postInfo);
await Promise.all([injectServiceWorker(), rssFeed(postInfo)]);
await hashAssets();
await minifySite();
//# sourceMappingURL=app.js.map