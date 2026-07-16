import generatePostPages from "./template/generate-post-pages.ts";
import generateIndexes from "./template/generate-indexes.ts";
import deleteDirContents from "./file-utils/delete-dir-contents.ts";
import copyFolderContents from "./file-utils/copy-folder-contents.ts";
import generatePostInfo from "./template/generate-post-info.ts";
import {
  productionPath,
  siteSourcePath,
  blogProductionPath,
} from "../app-config.ts";
import minifySite from "./compression/minify-site.ts";
import injectServiceWorker from "./service-worker/inject-service-worker.ts";
import rssFeed from "./rss/rss-feed.ts";

await deleteDirContents(productionPath);
await copyFolderContents(siteSourcePath, productionPath);
await deleteDirContents(blogProductionPath);

const postInfo = await generatePostInfo();

await Promise.all([
  generatePostPages(postInfo),
  generateIndexes(postInfo),
  injectServiceWorker(),
  rssFeed(postInfo),
]);

await minifySite();
