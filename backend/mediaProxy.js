// backend/mediaProxy.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Google Drive file ID mappings
const videoFiles = {
  'v1': '1sb0XpXiCPme3ySx7pMi3HUXFGf2WIxyv',
  'v2': '1e7OqD1Z3WOmgGMPYqeB6bWf4QQG0snZa',
  'v3': '1teO5_DhnsxJXZY_FG5sEDKezuEddLNL6',
  'v4': '12SEbwZb_5Lr9r953CB41P1EnYSTHkoMk',
  'v5': '1mLxbi7-WKUeZXjgPsXpYMxJqjKKA8Sx1',
  'v6': '1OnlEuqx5PaNz_f--EEW3-U_K_NJgVExX',
  'v7': '1ZiHmxHdhTNPy-tV_i1e-xkfGQs_atBLH',
  'v8': '1AmTbc3umf8CTDvpfugEUtZvXgRWcsMNH',
  'v9': '1HPorkRFgpxX8cSw19DAMmMyDj8h9Ap2I',
  'v10': '1pK1ZgiRU-RZNyvV7hBRz33mreM3TUm6o'
};

const englishAudioFiles = {
  'a1': '1zZdYVF7fV-wmZJNX-mx6dKwmYgkXQ4lz',
  'a2': '11qMlpdX6DIUU2u3fEuuCBK1ybEeOhaYS',
  'a3': '1aKXbdSXE_tBndajoOy3vdmXkIWTAuDur',
  'a4': '1ykUlS3onJPywtYZUGXpT3K03glKaaMT9',
  'a5': '1_opE1hdTYIcHoX1c6z77j9Rj3zQofRiK',
  'a6': '1KAWkgBaW-V_G96wlLrZqRUyXp6EaRQri',
  'a7': '14y8lHFMOKu006AkrX6NQOdBG-2X6KJbd',
  'a8': '1OItHEk_ifpdtQZpwV_1D8ofk_tAKWtbR',
  'a9': '1MAAM0zbPF_lUTmtlPSNt4kQbRR8Yi0BD',
  'a10': '1S7tH9f5czKtt5OxiIv3z6g2lDJ5FypXG'
};

const hindiAudioFiles = {
  'a1': '1t3lKj_6qtWh36-RP_mGj8ky0zgLdcgup',
  'a2': '19wpgdYgBM_3IkFfxVJqmfOk666S2eJGi',
  'a3': '1jLxF2LaSfAmaaMCCZlMkuj0kkJOB5iyT',
  'a4': '1H_DfN0BcR_O1MaJ5RPuwkE6MnspJF786',
  'a5': '1QJDiTeKQMx9st_2_r3SlfooyYZVw-cJJ',
  'a6': '1D2ybzk5KfJhGT8duHWGCPSaWi6iHO-9x',
  'a7': '1OommMYu7bUbY2FiigkrtM_j52-IQDQjn',
  'a8': '1_ySVU_1RjL2HvxCAc4lyOPK1p74g5uaS',
  'a9': '1-W85-eaAfyqAPfq0P2x0Cjj3omBpSzao',
  'a10': '1yanHsobVMvMKTmpkR0CGQqdjfMcz3qcI'
};

// Enhanced Google Drive URL helper
const getGoogleDriveUrl = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
};

// Enhanced video proxy with better streaming support
router.get('/video/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const fileId = videoFiles[videoId];
    
    if (!fileId) {
      return res.status(404).json({ error: `Video ${videoId} not found` });
    }

    const googleDriveUrl = getGoogleDriveUrl(fileId);
    
    console.log(`📹 Streaming video: ${videoId} from Google Drive: ${fileId}`);
    console.log(`📡 Range header: ${req.headers.range || 'Not provided'}`);

    // Prepare headers for Google Drive
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
    };

    // Forward range header if present
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    console.log(`🚀 Making request to Google Drive: ${googleDriveUrl}`);

    const response = await axios({
      method: 'GET',
      url: googleDriveUrl,
      responseType: 'stream',
      headers: headers,
      timeout: 60000,
      maxRedirects: 5,
      maxContentLength: 200 * 1024 * 1024, // 200MB max
    });

    // Log response details
    console.log(`📊 Google Drive Response:`, {
      status: response.status,
      statusText: response.statusText,
      contentLength: response.headers['content-length'],
      contentType: response.headers['content-type'],
      contentRange: response.headers['content-range']
    });

    // Get content information
    const contentLength = response.headers['content-length'];
    const contentType = response.headers['content-type'] || 'video/mp4';
    const contentRange = response.headers['content-range'];

    console.log(`🎬 Video Info - Length: ${contentLength}, Type: ${contentType}, Range: ${contentRange}`);

    // Set comprehensive response headers for video streaming
    const responseHeaders = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Accept-Ranges': 'bytes'
    };

    // Handle content length
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }

    // Handle range requests (206 Partial Content)
    if (req.headers.range && contentRange) {
      responseHeaders['Content-Range'] = contentRange;
      res.status(206); // Partial Content
      console.log(`🔄 Serving partial content: ${contentRange}`);
    } else {
      // If no range requested, serve full content
      if (contentLength) {
        responseHeaders['Content-Length'] = contentLength;
      }
      res.status(200);
    }

    // Set all headers
    res.set(responseHeaders);

    let bytesStreamed = 0;
    
    // Pipe the video stream to response with progress tracking
    response.data.on('data', (chunk) => {
      bytesStreamed += chunk.length;
    });

    response.data.on('end', () => {
      console.log(`✅ Video stream completed: ${videoId}, Bytes: ${bytesStreamed}`);
    });

    // Pipe the stream
    response.data.pipe(res);

    // Handle stream errors
    response.data.on('error', (error) => {
      console.error('❌ Video stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Video stream error', details: error.message });
      } else {
        res.end();
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log(`🔌 Client disconnected during video: ${videoId}`);
      if (response.data.destroy) {
        response.data.destroy();
      }
    });

  } catch (error) {
    console.error('❌ Video proxy error:', error.message);
    console.error('Error details:', error.response?.data || error.code);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: 'Video loading timeout',
        details: 'The video file took too long to load from Google Drive'
      });
    }
    
    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      
      console.error(`📡 Google Drive response: ${status} ${statusText}`);
      
      if (status === 404) {
        return res.status(404).json({ 
          error: 'Video file not found on Google Drive',
          details: 'The file might have been moved or deleted'
        });
      } else if (status === 403) {
        return res.status(403).json({ 
          error: 'Access denied to video file',
          details: 'Please ensure the video file is publicly accessible on Google Drive'
        });
      } else if (status === 416) {
        return res.status(416).json({ 
          error: 'Range not satisfiable',
          details: 'The requested video range is beyond the file size'
        });
      }
      
      return res.status(status).json({ 
        error: 'Failed to fetch video from Google Drive',
        details: statusText
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to fetch video',
        details: error.message,
        code: error.code
      });
    }
  }
});

// Enhanced audio proxy with better format handling
router.get('/audio/:type/:audioId', async (req, res) => {
  try {
    const { type, audioId } = req.params;
    let fileId;

    if (type === 'english') {
      fileId = englishAudioFiles[audioId];
    } else if (type === 'hindi') {
      fileId = hindiAudioFiles[audioId];
    } else {
      return res.status(400).json({ error: 'Invalid audio type. Use "english" or "hindi"' });
    }

    if (!fileId) {
      return res.status(404).json({ error: `${type} audio ${audioId} not found` });
    }

    const googleDriveUrl = getGoogleDriveUrl(fileId);
    
    console.log(`🔊 Streaming ${type} audio: ${audioId} from Google Drive: ${fileId}`);

    const response = await axios({
      method: 'GET',
      url: googleDriveUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      },
      timeout: 30000
    });

    // Determine correct content type for audio
    const contentType = response.headers['content-type'] || 'audio/mpeg';
    
    console.log(`🎵 Audio Response - Type: ${contentType}, Length: ${response.headers['content-length']}`);

    res.set({
      'Content-Type': contentType,
      'Content-Length': response.headers['content-length'],
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
      'Accept-Ranges': 'bytes'
    });

    let audioBytes = 0;
    response.data.on('data', (chunk) => {
      audioBytes += chunk.length;
    });

    response.data.on('end', () => {
      console.log(`✅ Audio stream completed: ${type}/${audioId}, Bytes: ${audioBytes}`);
    });

    response.data.pipe(res);

    // Handle stream errors
    response.data.on('error', (error) => {
      console.error('Audio stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Audio stream error' });
      }
    });

  } catch (error) {
    console.error('Audio proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Failed to fetch audio from Google Drive',
        details: error.response.statusText
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch audio',
        details: error.message
      });
    }
  }
});

// NEW: Test individual media file
router.get('/test/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let fileId;

    if (type === 'video') {
      fileId = videoFiles[id];
    } else if (type === 'english') {
      fileId = englishAudioFiles[id];
    } else if (type === 'hindi') {
      fileId = hindiAudioFiles[id];
    } else {
      return res.status(400).json({ error: 'Invalid type. Use "video", "english", or "hindi"' });
    }

    if (!fileId) {
      return res.status(404).json({ error: `${type} ${id} not found` });
    }

    const googleDriveUrl = getGoogleDriveUrl(fileId);
    
    console.log(`🧪 Testing ${type} ${id}: ${googleDriveUrl}`);

    const response = await axios.head(googleDriveUrl, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    res.json({
      type,
      id,
      fileId,
      status: 'accessible',
      contentLength: response.headers['content-length'],
      contentType: response.headers['content-type'],
      lastModified: response.headers['last-modified'],
      url: googleDriveUrl,
      proxyUrl: `/api/media/${type === 'video' ? 'video' : 'audio/' + type}/${id}`
    });

  } catch (error) {
    console.error(`❌ Test failed for ${req.params.type}/${req.params.id}:`, error.message);
    
    res.status(500).json({
      type: req.params.type,
      id: req.params.id,
      status: 'error',
      error: error.message,
      code: error.code
    });
  }
});

// Route to get all available media files
router.get('/files', (req, res) => {
  res.json({
    videos: Object.keys(videoFiles),
    englishAudio: Object.keys(englishAudioFiles),
    hindiAudio: Object.keys(hindiAudioFiles),
    totalFiles: {
      videos: Object.keys(videoFiles).length,
      englishAudio: Object.keys(englishAudioFiles).length,
      hindiAudio: Object.keys(hindiAudioFiles).length
    }
  });
});

// NEW: Health check for media files
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    media: {
      videos: Object.keys(videoFiles).length,
      englishAudio: Object.keys(englishAudioFiles).length,
      hindiAudio: Object.keys(hindiAudioFiles).length
    },
    tests: {}
  };

  // Test a sample of files
  const testFiles = [
    { type: 'video', id: 'v1' },
    { type: 'english', id: 'a1' },
    { type: 'hindi', id: 'a1' }
  ];

  for (const test of testFiles) {
    try {
      const fileId = test.type === 'video' ? videoFiles[test.id] : 
                    test.type === 'english' ? englishAudioFiles[test.id] : 
                    hindiAudioFiles[test.id];
      
      const googleDriveUrl = getGoogleDriveUrl(fileId);
      await axios.head(googleDriveUrl, { timeout: 10000 });
      
      health.tests[`${test.type}/${test.id}`] = 'accessible';
    } catch (error) {
      health.tests[`${test.type}/${test.id}`] = 'error: ' + error.message;
      health.status = 'degraded';
    }
  }

  res.json(health);
});

// NEW: Bulk test all files
router.get('/test-all', async (req, res) => {
  const results = {
    videos: {},
    englishAudio: {},
    hindiAudio: {},
    summary: {
      totalVideos: 0,
      workingVideos: 0,
      totalAudio: 0,
      workingAudio: 0
    }
  };

  // Test videos
  for (const [key, fileId] of Object.entries(videoFiles)) {
    try {
      const googleDriveUrl = getGoogleDriveUrl(fileId);
      const response = await axios.head(googleDriveUrl, { timeout: 10000 });
      
      results.videos[key] = {
        status: 'OK',
        size: response.headers['content-length'],
        type: response.headers['content-type'],
        accessible: true
      };
      results.summary.workingVideos++;
    } catch (error) {
      results.videos[key] = {
        status: 'ERROR',
        error: error.message,
        accessible: false,
        code: error.code
      };
    }
    results.summary.totalVideos++;
  }

  // Test English audio
  for (const [key, fileId] of Object.entries(englishAudioFiles)) {
    try {
      const googleDriveUrl = getGoogleDriveUrl(fileId);
      const response = await axios.head(googleDriveUrl, { timeout: 10000 });
      
      results.englishAudio[key] = {
        status: 'OK',
        size: response.headers['content-length'],
        type: response.headers['content-type'],
        accessible: true
      };
      results.summary.workingAudio++;
    } catch (error) {
      results.englishAudio[key] = {
        status: 'ERROR',
        error: error.message,
        accessible: false
      };
    }
    results.summary.totalAudio++;
  }

  // Test Hindi audio
  for (const [key, fileId] of Object.entries(hindiAudioFiles)) {
    try {
      const googleDriveUrl = getGoogleDriveUrl(fileId);
      const response = await axios.head(googleDriveUrl, { timeout: 10000 });
      
      results.hindiAudio[key] = {
        status: 'OK',
        size: response.headers['content-length'],
        type: response.headers['content-type'],
        accessible: true
      };
      results.summary.workingAudio++;
    } catch (error) {
      results.hindiAudio[key] = {
        status: 'ERROR',
        error: error.message,
        accessible: false
      };
    }
    results.summary.totalAudio++;
  }

  res.json(results);
});

module.exports = router;