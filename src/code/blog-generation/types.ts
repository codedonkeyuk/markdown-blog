export type PostInfoJson = {
  creationDate: string;
  creationTime: string;
  creationTimestamp: number;
  name: string;
  nameSlug: string;
  pageDescription: string;
  postThumbDescription: string;
  pageImageDescription: string;
  author: string;
};

export type PostInfo = PostInfoJson & {
  blogDirectory: string;
  dateDirectory: string;
  directory: string;
  blogPage: string;
  blogUrl: string;
};
