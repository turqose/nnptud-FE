import React, { useState } from "react";

const SettingPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Add logic to enable/disable 2FA
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <h1>Settings</h1>
      <div className="setting-section">
        <h2>Two-Factor Authentication</h2>
        <p>
          Enhance the security of your account by enabling two-factor
          authentication.
        </p>
        <button onClick={handleToggle2FA}>
          {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>
      <div className="setting-section">
        <h2>Notification Settings</h2>
        <p>Manage your notification preferences.</p>
        {/* Add notification settings form here */}
      </div>
      <div className="setting-section">
        <h2>Privacy Settings</h2>
        <p>Control who can see your information and activity.</p>
        {/* Add privacy settings form here */}
      </div>
    </div>
  );
};

export default SettingPage;
