import readDirectories from "../file-utils/read-directories.ts";
import { type PostInfo, type PostInfoJson } from "../types.ts";
import {
  blogProductionPath,
  postSourcePath,
  blogPath,
  maxParallelProcesses,
} from "../../app-config.ts";
import asyncPool from "../thread-management/async-pool.ts";
import readFile from "../file-utils/read-file.ts";

const generatePostInfo = async (): Promise<PostInfo[]> => {
  const directories = await readDirectories(postSourcePath);
  const postInfo = await asyncPool(
    directories,
    maxParallelProcesses,
    async (directory) => {
      const {
        creationDate,
        creationTime,
        creationTimestamp,
        nameSlug,
        name,
        pageDescription,
        postThumbDescription,
        pageImageDescription,
        author,
      }: PostInfoJson = JSON.parse(
        await readFile(`${postSourcePath}/${directory}/postInfo.json`),
      );

      const postDate = new Date(creationTimestamp);

      const dateDirectory = `${postDate.getFullYear()}-${postDate.getMonth() + 1}-${postDate.getDate()}-${postDate.getHours()}-${postDate.getMinutes()}-${postDate.getSeconds()}`;
      const blogDirectory = `${blogProductionPath}/${dateDirectory}`;
      const blogPage = `${blogProductionPath}/${dateDirectory}/${nameSlug}.html`;
      const blogUrl = `/${blogPath}/${dateDirectory}/${nameSlug}`;

      return {
        nameSlug,
        creationDate,
        creationTime,
        creationTimestamp,
        name,
        directory,
        blogDirectory,
        dateDirectory,
        blogPage,
        blogUrl,
        pageDescription,
        postThumbDescription,
        pageImageDescription,
        author,
      };
    },
  );

  return postInfo;
};

export default generatePostInfo;
