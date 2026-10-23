import readFile from "../file-utils/read-file.ts";
import { type PostInfo } from "../types.ts";
import createFile from "../file-utils/create-file.ts";
import createIndexPage from "./create-index-page.ts";
import appConfig from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";

interface PageInfo {
  url: string;
  pagePosts: PostInfo[];
  index: number;
}

const generateIndexes = async (posts: PostInfo[]) => {
  const {
    blogProductionPath,
    blogIndexPageTemplate,
    postsPerPage,
    maxParallelProcesses,
  } = appConfig;
  posts.sort((a, b) => b.creationTimestamp - a.creationTimestamp);

  const pageTemplate = await readFile(blogIndexPageTemplate);

  const numberPages = Math.ceil(posts.length / postsPerPage);

  const pageInfo: PageInfo[] = [];

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

  await asyncPool<PageInfo, void>(
    pageInfo,
    maxParallelProcesses,
    async ({ url, pagePosts, index }) =>
      createFile(
        url,
        createIndexPage(pageTemplate, pagePosts, index, numberPages),
      ),
  );
};

export default generateIndexes;
