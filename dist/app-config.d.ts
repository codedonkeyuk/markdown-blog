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
declare const _default: BlogConfig;
export default _default;
