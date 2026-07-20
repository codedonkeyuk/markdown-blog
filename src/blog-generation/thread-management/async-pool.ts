const asyncPool = async <T, R>(
  items: T[],
  limit: number,
  callback: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkPromises = chunk.map((item) => callback(item));

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return results;
};

export default asyncPool;
