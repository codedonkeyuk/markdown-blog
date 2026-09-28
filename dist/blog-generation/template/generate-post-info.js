import readDirectories from "../file-utils/read-directories.js";
import {} from "../types.js";
import appConfig from "../../app-config.js";
import asyncPool from "../thread-management/async-pool.js";
import readFile from "../file-utils/read-file.js";
const generatePostInfo = async () => {
    const { blogProductionPath, postSourcePath, blogPath, maxParallelProcesses } = appConfig;
    const directories = await readDirectories(postSourcePath);
    const allRawPosts = await asyncPool(directories, maxParallelProcesses, async (directory) => {
        const rawData = JSON.parse(await readFile(`${postSourcePath}/${directory}/postInfo.json`));
        return { ...rawData, directory };
    });
    return allRawPosts
        .filter(({ publish }) => publish)
        .map(({ creationTimestamp, nameSlug, creationDate, creationTime, name, directory, pageDescription, postThumbDescription, author, }) => {
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
            author,
            publish: true,
        };
    });
};
export default generatePostInfo;
//# sourceMappingURL=generate-post-info.js.map