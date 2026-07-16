import copyFolderContents from "../file-utils/copy-folder-contents.ts";
import createDir from "../file-utils/create-dir.ts";
import createFile from "../file-utils/create-file.ts";
import deleteFile from "../file-utils/delete-file.ts";
import readFile from "../file-utils/read-file.ts";
import createPostPage from "../template/create-post-page.ts";
import asyncPool from "../thread-management/async-pool.ts";
import { type PostInfo } from "../types.ts";
import {
  postSourcePath,
  blogProductionPath,
  postPageTemplate,
  maxParallelProcesses,
} from "../../app-config.ts";
import convertSvgToPng from "../image/convert-svg-to-png.ts";

const generatePostPages = async (postInfo: PostInfo[]): Promise<void> => {
  const postTemplate = await readFile(postPageTemplate);

  await asyncPool(postInfo, maxParallelProcesses, async (post) => {
    const sourceDir = `${postSourcePath}/${post.directory}`;
    const destDir = `${blogProductionPath}/${post.dateDirectory}`;

    const postContent = await readFile(`${sourceDir}/content.md`);
    await createDir(post.blogDirectory);

    const renderedPost = await createPostPage(postTemplate, postContent, post);

    await Promise.all([
      createFile(post.blogPage, renderedPost),
      copyFolderContents(sourceDir, destDir),
    ]);

    await Promise.all([
      await convertSvgToPng(
        `${destDir}/post-image.svg`,
        `${destDir}/social-image.png`,
      ),
      await deleteFile(`${destDir}/content.md`),
    ]);
  });
};

export default generatePostPages;
