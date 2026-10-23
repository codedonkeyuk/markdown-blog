import readFile from "../file-utils/read-file.js";
import {} from "../types.js";
import createFile from "../file-utils/create-file.js";
import createIndexPage from "./create-index-page.js";
import appConfig from "../../app-config.js";
import asyncPool from "../thread-management/async-pool.js";
const generateIndexes = async (posts) => {
    const { blogProductionPath, blogIndexPageTemplate, postsPerPage, maxParallelProcesses, } = appConfig;
    posts.sort((a, b) => b.creationTimestamp - a.creationTimestamp);
    const pageTemplate = await readFile(blogIndexPageTemplate);
    const numberPages = Math.ceil(posts.length / postsPerPage);
    const pageInfo = [];
    for (let i = 0; i < numberPages; i++) {
        const start = postsPerPage * i;
        const end = start + postsPerPage;
        const pagePosts = posts.slice(start, end);
        pageInfo.push({
            url: `${blogProductionPath}/page${i + 1}.html`,
            pagePosts,
            index: i,
        });
    }
    await asyncPool(pageInfo, maxParallelProcesses, async ({ url, pagePosts, index }) => createFile(url, createIndexPage(pageTemplate, pagePosts, index, numberPages)));
};
export default generateIndexes;
//# sourceMappingURL=generate-indexes.js.map