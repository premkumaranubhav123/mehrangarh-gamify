import { mehrangarhStories } from '../data/mehrangarhStories';

export const verifyMediaFiles = async () => {
  const results = {
    verified: [],
    missing: [],
    errors: []
  };

  console.log('🔍 Starting media file verification...');

  for (const story of mehrangarhStories) {
    console.log(`\n📖 Checking story: ${story.title}`);
    
    // Check English audio files
    if (story.audioFile) {
      const exists = await checkFileExists(story.audioFile);
      if (exists) {
        results.verified.push(`✅ English Audio: ${story.audioFile}`);
        console.log(`✅ English Audio: ${story.audioFile}`);
      } else {
        results.missing.push(`❌ English Audio: ${story.audioFile}`);
        console.log(`❌ English Audio: ${story.audioFile}`);
      }
    }
    
    // Check Hindi audio files
    if (story.hindiAudioFile) {
      const exists = await checkFileExists(story.hindiAudioFile);
      if (exists) {
        results.verified.push(`✅ Hindi Audio: ${story.hindiAudioFile}`);
        console.log(`✅ Hindi Audio: ${story.hindiAudioFile}`);
      } else {
        results.missing.push(`❌ Hindi Audio: ${story.hindiAudioFile}`);
        console.log(`❌ Hindi Audio: ${story.hindiAudioFile}`);
      }
    }
    
    // Check video files
    if (story.videoFile) {
      const exists = await checkFileExists(story.videoFile);
      if (exists) {
        results.verified.push(`✅ Video: ${story.videoFile}`);
        console.log(`✅ Video: ${story.videoFile}`);
      } else {
        results.missing.push(`❌ Video: ${story.videoFile}`);
        console.log(`❌ Video: ${story.videoFile}`);
      }
    }

    // Check image files for paintings
    if (story.paintings && story.paintings.length > 0) {
      for (const painting of story.paintings) {
        if (painting.imageUrl) {
          const exists = await checkFileExists(painting.imageUrl);
          if (exists) {
            results.verified.push(`✅ Image: ${painting.imageUrl}`);
          } else {
            results.missing.push(`❌ Image: ${painting.imageUrl}`);
            console.log(`❌ Image: ${painting.imageUrl}`);
          }
        }
      }
    }
  }

  console.log('\n📊 Verification Summary:');
  console.log(`✅ Verified: ${results.verified.length} files`);
  console.log(`❌ Missing: ${results.missing.length} files`);
  
  if (results.missing.length > 0) {
    console.log('\n🔧 Missing files that need attention:');
    results.missing.forEach(missing => console.log(missing));
  }

  return results;
};

const checkFileExists = async (url) => {
  try {
    // For development with Vite, use absolute paths from public folder
    const fullUrl = `${window.location.origin}${url}`;
    const response = await fetch(fullUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking file ${url}:`, error);
    return false;
  }
};

// Helper function to get expected file structure
export const getExpectedFileStructure = () => {
  return {
    audio: {
      path: '/public/audio/',
      files: ['a1.m4a', 'a2.m4a', 'a3.m4a', 'a4.m4a', 'a5.m4a', 'a6.m4a', 'a7.m4a', 'a8.m4a', 'a9.m4a', 'a10.m4a']
    },
    hindiAudio: {
      path: '/public/Hindi Audio/',
      files: ['a1.m4a', 'a2.m4a', 'a3.m4a', 'a4.m4a', 'a5.m4a', 'a6.m4a', 'a7.m4a', 'a8.m4a', 'a9.m4a', 'a10.m4a']
    },
    video: {
      path: '/public/video/',
      files: ['v1.mp4', 'v2.mp4', 'v3.mp4', 'v4.mp4', 'v5.mp4', 'v6.mp4', 'v7.mp4', 'v8.mp4', 'v9.mp4', 'v10.mp4']
    },
    images: {
      path: '/public/img/',
      files: ['p1.png', 'p2.png', 'p3.png', 'p4.png', 'p5.png', 'p6.png', 'p7.png', 'p8.png', 'p9.png', 'p10.png']
    }
  };
};

// Function to generate file structure report
export const generateFileStructureReport = () => {
  const expected = getExpectedFileStructure();
  console.log('\n📁 EXPECTED FILE STRUCTURE:');
  console.log('============================');
  
  Object.entries(expected).forEach(([type, info]) => {
    console.log(`\n📂 ${type.toUpperCase()}: ${info.path}`);
    info.files.forEach(file => {
      console.log(`   📄 ${file}`);
    });
  });
};

// Run verification on import for quick testing
export const quickVerify = async () => {
  console.log('🚀 Running quick media verification...');
  generateFileStructureReport();
  return await verifyMediaFiles();
};