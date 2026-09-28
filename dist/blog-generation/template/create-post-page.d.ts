import { type PostInfo } from "../types.ts";
declare const createPostPage: (pageTemplate: string, postContent: string, postInfo: PostInfo) => Promise<string>;
export default createPostPage;
