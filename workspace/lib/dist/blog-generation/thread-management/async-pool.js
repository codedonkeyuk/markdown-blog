const asyncPool = async (items, limit, callback) => {
    const results = [];
    for (let i = 0; i < items.length; i += limit) {
        const chunk = items.slice(i, i + limit);
        const chunkPromises = chunk.map((item) => callback(item));
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
    }
    return results;
};
export default asyncPool;
//# sourceMappingURL=async-pool.js.map