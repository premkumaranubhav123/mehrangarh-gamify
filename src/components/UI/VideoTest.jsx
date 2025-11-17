import React, { useState } from 'react';
import { quickVerify } from '../../utils/fileStructureVerifier';

const VideoTest = () => {
  const [testResults, setTestResults] = useState(null);

  const runVideoTest = async () => {
    console.log('🧪 Running video playback test...');
    const results = await quickVerify();
    setTestResults(results);
    
    // Test direct video access
    const testVideo = document.createElement('video');
    testVideo.src = '/video/v1.mp4';
    testVideo.preload = 'metadata';
    
    testVideo.onloadedmetadata = () => {
      console.log('✅ Video metadata loaded successfully');
      console.log('📊 Video duration:', testVideo.duration);
    };
    
    testVideo.onerror = (e) => {
      console.error('❌ Video test failed:', e);
    };
    
    testVideo.load();
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🎬 Video Playback Test</h3>
      <button onClick={runVideoTest} style={{ padding: '10px 20px', margin: '10px 0' }}>
        Test Video Playback
      </button>
      
      {testResults && (
        <div style={{ marginTop: '15px' }}>
          <h4>Test Results:</h4>
          <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VideoTest;