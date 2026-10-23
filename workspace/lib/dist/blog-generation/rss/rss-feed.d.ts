import { type PostInfo } from "../types.ts";
declare const rssFeed: (posts: PostInfo[]) => Promise<void>;
export default rssFeed;
