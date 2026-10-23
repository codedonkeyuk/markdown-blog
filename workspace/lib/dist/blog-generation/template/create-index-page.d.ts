import { type PostInfo } from "../types.ts";
declare const createIndexPage: (pageTemplate: string, posts: PostInfo[], pageNo: number, maxPage: number) => string;
export default createIndexPage;
