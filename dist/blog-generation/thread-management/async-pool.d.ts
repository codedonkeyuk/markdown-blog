declare const asyncPool: <T, R>(items: T[], limit: number, callback: (item: T) => Promise<R>) => Promise<R[]>;
export default asyncPool;
