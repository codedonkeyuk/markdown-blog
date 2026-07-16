import readFile from "../file-utils/read-file.ts";
import { type PostInfo } from "../types.ts";
import createFile from "../file-utils/create-file.ts";
import createIndexPage from "./create-index-page.ts";
import {
  blogProductionPath,
  blogIndexPageTemplate,
  postsPerPage,
} from "../../app-config.ts";

const generateIndexes = async (posts: PostInfo[]) => {
  posts.sort((a, b) => b.creationTimestamp - a.creationTimestamp);

  const pageTemplate = await readFile(blogIndexPageTemplate);

  const numberPages = Math.ceil(posts.length / postsPerPage);

  for (let i = 0; i < numberPages; i++) {
    const start = postsPerPage * i;
    const end = start + postsPerPage;

    const pagePosts = posts.slice(start, end);

    await createFile(
      `${blogProductionPath}/page${i + 1}.html`,
      createIndexPage(pageTemplate, pagePosts, i, numberPages),
    );
  }
};

export default generateIndexes;
