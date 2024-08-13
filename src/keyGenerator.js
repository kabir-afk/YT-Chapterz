export function generateKey(key,videourl, tabId) {
  const videoURL = new URLSearchParams(videourl);
  let videoId;

  for (const value of videoURL.values()) {
    videoId = value;
  }
  const result = key === 'summary' ? `s-${videoId}-${tabId}` : `t-${videoId}-${tabId}`;
  return result;
}