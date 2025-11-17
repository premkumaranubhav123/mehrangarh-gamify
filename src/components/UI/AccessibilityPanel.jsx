import React from 'react';

const AccessibilityPanel = ({ settings, onSettingsChange }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="accessibility-panel">
      <h3>♿ Accessibility Settings</h3>
      
      <div className="accessibility-options">
        <div className="option-group">
          <h4>Text Size</h4>
          <div className="option-item">
            <label>
              <input
                type="radio"
                name="fontSize"
                value="normal"
                checked={settings.fontSize === 'normal'}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              />
              Normal
            </label>
          </div>
          <div className="option-item">
            <label>
              <input
                type="radio"
                name="fontSize"
                value="large"
                checked={settings.fontSize === 'large'}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              />
              Large
            </label>
          </div>
          <div className="option-item">
            <label>
              <input
                type="radio"
                name="fontSize"
                value="x-large"
                checked={settings.fontSize === 'x-large'}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              />
              Extra Large
            </label>
          </div>
        </div>

        <div className="option-group">
          <h4>Display</h4>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
              />
              High Contrast Mode
            </label>
          </div>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.simpleLayout}
                onChange={(e) => handleSettingChange('simpleLayout', e.target.checked)}
              />
              Simple Layout
            </label>
          </div>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.extraSpacing}
                onChange={(e) => handleSettingChange('extraSpacing', e.target.checked)}
              />
              Extra Spacing
            </label>
          </div>
        </div>

        <div className="option-group">
          <h4>Audio & Media</h4>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.audioEnabled}
                onChange={(e) => handleSettingChange('audioEnabled', e.target.checked)}
              />
              Enable Audio Narration
            </label>
          </div>
          <div className="option-item">
            <label>
              Preferred Audio Language:
              <select
                value={settings.preferredLanguage || 'english'}
                onChange={(e) => handleSettingChange('preferredLanguage', e.target.value)}
                className="language-preference"
              >
                <option value="english">English</option>
                <option value="hindi">हिन्दी (Hindi)</option>
              </select>
            </label>
          </div>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.autoPlayVideo}
                onChange={(e) => handleSettingChange('autoPlayVideo', e.target.checked)}
              />
              Auto-play Videos
            </label>
          </div>
          <div className="option-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
              />
              Reduced Motion
            </label>
          </div>
        </div>
      </div>

      <div className="accessibility-tips">
        <h4>💡 Tips for Comfortable Reading</h4>
        <ul>
          <li>Use audio narration to rest your eyes while listening to stories</li>
          <li>Switch between English and Hindi audio based on your preference</li>
          <li>High contrast mode helps with visibility in different lighting</li>
          <li>Extra spacing makes text easier to read</li>
          <li>Watch videos for an immersive storytelling experience</li>
          <li>Take breaks between chapters to reflect on what you've learned</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityPanel;