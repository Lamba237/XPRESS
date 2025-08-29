import React, { useState, useEffect, useCallback } from 'react';
import { AppSettingsContext } from './AppSettingsContextBase.js';

// LocalStorage key (reuse existing settings key)
const SETTINGS_KEY = 'appSettings';

const defaultSettings = {
  org: { name: 'Xpress Mart', address: '', email: '' },
  currency: 'USD',
  taxRate: 7.5,
  inventory: { defaultLowStockMultiplier: 1.5, globalReorderPoint: 10 },
  appearance: { theme: 'light' }
};

function mergeDefaults(raw) {
  return { ...defaultSettings, ...raw, org: { ...defaultSettings.org, ...(raw?.org||{}) } };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return mergeDefaults(JSON.parse(raw));
  } catch {
    return defaultSettings;
  }
}

function saveSettings(data) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [saving, setSaving] = useState(false);

  // Debounced persistence + update document title
  useEffect(() => {
    setSaving(true);
    const t = setTimeout(() => {
      saveSettings(settings);
      document.title = (settings.org?.name || 'App') + ' Dashboard';
      setSaving(false);
    }, 400);
    return () => clearTimeout(t);
  }, [settings]);

  const updateSetting = useCallback((path, value) => {
    setSettings(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      let ref = next;
      for (let i = 0; i < parts.length - 1; i++) {
        ref[parts[i]] = { ...ref[parts[i]] };
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, orgName: settings.org?.name || 'App', saving }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

