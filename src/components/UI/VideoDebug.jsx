import React, { useState } from 'react';
import { checkVideoSupport, monitorVideoPerformance } from '../../utils/videoOptimizer';

const VideoDebug = () => {
  const [supportInfo, setSupportInfo] = useState(null);

  const testVideoSupport = () => {
    const info = checkVideoSupport();
    setSupportInfo(info);
    monitorVideoPerformance();
    
    // Test direct video loading
    const testVideo = document.createElement('video');
    testVideo.src = '/video/v1.mp4';
    testVideo.preload = 'metadata';
    testVideo.style.width = '300px';
    testVideo.controls = true;
    
    testVideo.onloadeddata = () => {
      console.log('✅ Test video loaded successfully');
      console.log('📊 Duration:', testVideo.duration, 'seconds');
    };
    
    testVideo.onerror = (e) => {
      console.error('❌ Test video failed:', e);
    };
    
    // Add to page for manual testing
    document.body.appendChild(testVideo);
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      margin: '20px 0'
    }}>
      <h3>🎬 Video Debug Panel</h3>
      <button 
        onClick={testVideoSupport}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        Test Video Support
      </button>
      
      {supportInfo && (
        <div style={{ marginTop: '15px' }}>
          <h4>Browser Video Support:</h4>
          <pre style={{ 
            background: 'white', 
            padding: '15px', 
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            {JSON.stringify(supportInfo, null, 2)}
          </pre>
          <p><strong>Check browser console for detailed video performance data</strong></p>
        </div>
      )}
    </div>
  );
};

export default VideoDebug;