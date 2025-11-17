const CACHE_NAME = 'video-cache-v2';
const VIDEO_CACHE_LIMIT = 300 * 1024 * 1024;

self.addEventListener('install', (event) => {
  console.log('🎯 Video Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🎯 Video Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle video files
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.m4a')) {
    event.respondWith(handleVideoRequest(event.request));
  }
});

async function handleVideoRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached response if available
  if (cachedResponse) {
    console.log('🎯 Serving video from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    // Fetch with cache control for large files
    const response = await fetch(request, {
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      }
    });
    
    // Cache the response if successful
    if (response.status === 200) {
      // Check cache size before storing
      const cacheSize = await getCacheSize();
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      if (cacheSize + contentLength < VIDEO_CACHE_LIMIT) {
        cache.put(request, response.clone());
        console.log('✅ Cached video:', request.url);
      } else {
        console.log('⚠️ Cache limit reached, skipping cache for:', request.url);
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ Video fetch failed:', error);
    throw error;
  }
}

async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        totalSize += parseInt(contentLength);
      }
    }
  }
  
  return totalSize;
}