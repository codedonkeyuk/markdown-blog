#!/usr/bin/env node

import appConfig from "../app-config.ts";
import createDir from "../blog-generation/file-utils/create-dir.ts";
import createFile from "../blog-generation/file-utils/create-file.ts";

const { postSourcePath } = appConfig();

const POST_IMAGE_TEMPLATE = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" version="1.1" id="svg26">
  <defs id="defs3" />
  <g id="g2" transform="translate(1.3636365)">
    <rect style="fill:#00ffff; stroke:#000000; stroke-width:0" id="rect1" width="1198.6364" height="465" x="0" y="0" />

    <path style="fill:#008000; stroke:#000000; stroke-width:0" d="M -0.0302694,373.63949 C 60.392409,292.24836 131.55192,293.82058 213.30845,377.27581 c 88.4694,-75.6322 117.25245,-23.36985 158.67067,1.81816 76.06612,70.03169 132.91926,39.63573 188.00474,0 45.54598,-27.08823 59.14133,-88.0003 178.67117,1.81816 63.74912,42.3241 119.80891,40.08665 169.33761,0 35.53879,-24.27046 58.89165,-68.08982 152.00386,0 65.8114,81.60809 94.2791,38.55661 138.6701,1.81816 L 1200,630 -1.3636364,630 Z" id="path1" />

    <ellipse style="fill:#ffff00; stroke:#000000; stroke-width:0" id="path2" cx="218.18182" cy="171.13635" rx="94.090912" ry="92.045456" />
  </g>
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

  const postPath = `${postSourcePath}/${creationTimestamp}_${nameSlug}`;

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
      author: "Joe Bloggs",
      publish: true,
    },
    null,
    2,
  );

  Promise.all([
    createFile(`${postPath}/post-image.svg`, POST_IMAGE_TEMPLATE),
    createFile(`${postPath}/content.md`, "Enter post content here"),
    createFile(`${postPath}/postInfo.json`, postInfo),
  ]);
});
