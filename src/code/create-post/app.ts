import createDir from "../blog-generation/file-utils/create-dir.ts";
import createFile from "../blog-generation/file-utils/create-file.ts";

const PAGE_THUMBNAIL_TEMPLATE = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="#ffcc00" />
    <circle cx="35" cy="40" r="5" fill="#000" />
    <circle cx="65" cy="40" r="5" fill="#000" />
    <path d="M30 60 Q50 80, 70 60" stroke="#000" stroke-width="3" fill="none" />
</svg>
`;

const POST_IMAGE_TEMPLATE = `
<svg width="1200" height="200" viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <g id="smiley">
            <circle cx="50" cy="50" r="40" fill="#ffcc00" />
            <circle cx="35" cy="40" r="5" fill="#000" />
            <circle cx="65" cy="40" r="5" fill="#000" />
            <path d="M30 60 Q50 80, 70 60" stroke="#000" stroke-width="3" fill="none" />
        </g>
    </defs>
    <use href="#smiley" x="0" y="0" />
    <use href="#smiley" x="100" y="0" />
    <use href="#smiley" x="200" y="0" />
    <use href="#smiley" x="300" y="0" />
    <use href="#smiley" x="400" y="0" />
    <use href="#smiley" x="500" y="0" />
    <use href="#smiley" x="600" y="0" />
    <use href="#smiley" x="700" y="0" />
    <use href="#smiley" x="800" y="0" />
    <use href="#smiley" x="900" y="0" />
    <use href="#smiley" x="1000" y="0" />
    <use href="#smiley" x="1100" y="0" />
    <use href="#smiley" x="0" y="100" />
    <use href="#smiley" x="100" y="100" />
    <use href="#smiley" x="200" y="100" />
    <use href="#smiley" x="300" y="100" />
    <use href="#smiley" x="400" y="100" />
    <use href="#smiley" x="500" y="100" />
    <use href="#smiley" x="600" y="100" />
    <use href="#smiley" x="700" y="100" />
    <use href="#smiley" x="800" y="100" />
    <use href="#smiley" x="900" y="100" />
    <use href="#smiley" x="1000" y="100" />
    <use href="#smiley" x="1100" y="100" />
</svg>
`;

process.stdin.resume();
process.stdin.setEncoding("utf8");

console.log("What is the name of the post?");

process.stdin.on("data", async (data) => {
  const name = (data as string).trim();
  const nameSlug = name.replaceAll(" ", "-").toLowerCase();
  process.stdin.pause();

  const now = new Date();
  const creationTimestamp = now.getTime();

  const postPath = `./src/blog-content/${creationTimestamp}_${nameSlug}`;

  const creationDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const creationTime = now.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  await createDir(postPath);

  const postInfo = JSON.stringify(
    {
      creationDate,
      creationTime,
      creationTimestamp,
      name,
      nameSlug,
      pageDescription: "A new post",
      postThumbDescription: "A new post",
      pageImageDescription: "A new post",
      author: "Lee G",
    },
    null,
    2,
  );

  Promise.all([
    createFile(`${postPath}/thumbnail.svg`, PAGE_THUMBNAIL_TEMPLATE),
    await createFile(`${postPath}/post-image.svg`, POST_IMAGE_TEMPLATE),
    await createFile(`${postPath}/content.md`, "Enter post content here"),
    await createFile(`${postPath}/postInfo.json`, postInfo),
  ]);
});
