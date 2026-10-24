import copyFolderContents from "../file-utils/copy-folder-contents.js";
import createDir from "../file-utils/create-dir.js";
import createFile from "../file-utils/create-file.js";
import deleteFile from "../file-utils/delete-file.js";
import readFile from "../file-utils/read-file.js";
import createPostPage from "../template/create-post-page.js";
import asyncPool from "../thread-management/async-pool.js";
import {} from "../types.js";
import appConfig from "../../app-config.js";
import convertSvgToPng from "../image/convert-svg-to-png.js";
const generatePostPages = async (postInfo) => {
    const { postSourcePath, blogProductionPath, postPageTemplate, maxParallelProcesses, } = appConfig;
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
            await convertSvgToPng(`${destDir}/post-image.svg`, `${destDir}/social-image.png`),
            await deleteFile(`${destDir}/content.md`),
        ]);
    });
};
export default generatePostPages;
//# sourceMappingURL=generate-post-pages.js.map