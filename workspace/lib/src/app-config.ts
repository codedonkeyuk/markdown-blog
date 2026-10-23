import fs from "node:fs";
import path from "node:path";

interface BlogConfig {
  author: string;
  siteSourcePath: string;
  postSourcePath: string;
  productionPath: string;
  postsPerPage: number;
  blogPath: string;
  maxParallelProcesses: number;
  maxCompresionProcesses: number;
  siteTitle: string;
  siteAddress: string;
  rssDescription: string;
  rssPostLimit: number;
  spellingExemptions: string[];
  blogProductionPath: string;
  blogIndexPageTemplate: string;
  postPageTemplate: string;
}

const ogBlogConfig: BlogConfig = {
  author: "no author set, add to config file",
  siteSourcePath: "./src/site",
  postSourcePath: "./src/blog-content",
  productionPath: "./dist",
  postsPerPage: 20,
  blogPath: "blog",
  maxParallelProcesses: 24,
  maxCompresionProcesses: 4,
  siteTitle: "Markdown Blog",
  siteAddress: "http://localhost:3001",
  rssDescription: "A web developers portfolio and blog.",
  rssPostLimit: 20,
  spellingExemptions: [],
  blogProductionPath: "",
  blogIndexPageTemplate: "",
  postPageTemplate: "",
};

function appConfig(): BlogConfig {
  let userConfig: Record<string, any> = {};

  const rootDir = process.cwd();
  const configPath = path.join(rootDir, "blog-config.json");

  try {
    if (fs.existsSync(configPath)) {
      const fileContent = fs.readFileSync(configPath, "utf8");
      userConfig = JSON.parse(fileContent);
    } else {
      console.warn(
        "⚠️  blog-config.json not found in application root. Using default configurations.",
      );
    }
  } catch (error) {
    console.error("❌ Failed to parse blog-config.json. Checking file syntax.");
    throw error;
  }

  const mrgConfig = {
    ...ogBlogConfig,
    ...userConfig,
  } as BlogConfig;

  return {
    ...mrgConfig,
    blogProductionPath: `${mrgConfig.productionPath}/blog`,
    blogIndexPageTemplate: `${mrgConfig.siteSourcePath}/blog/page1.html`,
    postPageTemplate: `${mrgConfig.siteSourcePath}/blog/post/post.html`,
  };
}

export default appConfig();
