const TTL = 5 * 60 * 1000;
const cacheMap = new Map<
  string,
  { response: Response; unixFetchTime: number }
>();

export async function fetchWithCache(url: string) {
  const cachedResponse = cacheMap.get(url);
  if (!cachedResponse || Date.now() > cachedResponse.unixFetchTime + TTL) {
    const response = await fetch(url);
    const responseWithTime = {
      unixFetchTime: Date.now(),
      response: response.clone(),
    };
    cacheMap.set(url, responseWithTime);
    return {
      unixFetchTime: responseWithTime.unixFetchTime,
      response: responseWithTime.response.clone(),
    };
  }
  return {
    unixFetchTime: cachedResponse.unixFetchTime,
    response: cachedResponse.response.clone(),
  };
}
