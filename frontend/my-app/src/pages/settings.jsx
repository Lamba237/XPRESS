import React, { useState, useEffect, useCallback } from 'react';
import { useAppSettings } from '../context/app/useAppSettings.js';
import {
    Box,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Typography,
} from '@mui/material';
import '../styles/settings.css';

// Persistence handled by AppSettingsContext now.

export default function Settings() {
    const { settings, updateSetting, saving } = useAppSettings();
    const update = useCallback((path, value) => updateSetting(path, value), [updateSetting]);

    const handleExportData = () => {
        const exportObj = {
            settings,
            inventory: JSON.parse(localStorage.getItem('inventoryProducts') || '[]'),
            sales: JSON.parse(localStorage.getItem('salesHistory') || '[]'),
        };
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `xpress_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const handleResetDemo = () => {
        if (!window.confirm('This will clear inventory, sales history and restore default settings. Continue?')) return;
        localStorage.removeItem('inventoryProducts');
        localStorage.removeItem('salesHistory');
    // Soft reset to context defaults (clears local storage and reloads page state)
    localStorage.removeItem('appSettings');
    window.location.reload();
    };

    // Side nav active section
    const [active, setActive] = useState('organization');

    useEffect(() => {
        const sections = document.querySelectorAll('.settings-section');
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
        );
        sections.forEach(s => observer.observe(s));
        return () => { sections.forEach(s => observer.unobserve(s)); };
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="settings-container redesigned">
            <div className="settings-layout">
                <nav className="settings-sidenav">
                    <div className="sidenav-header">
                        <h1>Settings</h1>
                        <span className={`save-indicator ${saving ? 'saving' : 'saved'}`}>{saving ? 'Saving…' : 'Saved'}</span>
                    </div>
                    <ul>
                        <li className={active === 'organization' ? 'active' : ''} onClick={() => scrollTo('organization')}>Organization</li>
                        <li className={active === 'currency' ? 'active' : ''} onClick={() => scrollTo('currency')}>Currency & Tax</li>
                        <li className={active === 'inventory' ? 'active' : ''} onClick={() => scrollTo('inventory')}>Inventory Defaults</li>
                        <li className={active === 'appearance' ? 'active' : ''} onClick={() => scrollTo('appearance')}>Appearance</li>
                        <li className={active === 'data' ? 'active' : ''} onClick={() => scrollTo('data')}>Data Management</li>
                    </ul>
                </nav>
                <main className="settings-content">
                    <section id="organization" className="settings-section">
                        <Paper className="settings-card" elevation={2}>
                            <Typography variant="h6" className="settings-card-title">Organization</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                                <TextField label="Name" size="small" value={settings.org.name} onChange={e => update('org.name', e.target.value)} />
                                <TextField label="Email" size="small" value={settings.org.email} onChange={e => update('org.email', e.target.value)} />
                                <TextField label="Address" size="small" multiline minRows={2} sx={{ gridColumn: '1 / -1' }} value={settings.org.address} onChange={e => update('org.address', e.target.value)} />
                            </Box>
                        </Paper>
                    </section>
                    <section id="currency" className="settings-section">
                        <Paper className="settings-card" elevation={2}>
                            <Typography variant="h6" className="settings-card-title">Currency & Tax</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel id="currency-label">Currency</InputLabel>
                                    <Select labelId="currency-label" label="Currency" value={settings.currency} onChange={e => update('currency', e.target.value)}>
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                        <MenuItem value="GBP">GBP (£)</MenuItem>
                                        <MenuItem value="NGN">NGN (₦)</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Tax Rate (%)"
                                    size="small"
                                    type="number"
                                    value={settings.taxRate}
                                    onChange={e => {
                                        let v = parseFloat(e.target.value);
                                        if (isNaN(v)) v = 0;
                                        if (v < 0) v = 0; if (v > 100) v = 100;
                                        update('taxRate', v);
                                    }}
                                    sx={{ maxWidth: 140 }}
                                />
                            </Box>
                        </Paper>
                    </section>
                    <section id="inventory" className="settings-section">
                        <Paper className="settings-card" elevation={2}>
                            <Typography variant="h6" className="settings-card-title">Inventory Defaults</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <TextField
                                    label="Low Stock Multiplier"
                                    helperText="Low Stock = threshold * multiplier"
                                    size="small"
                                    type="number"
                                    value={settings.inventory.defaultLowStockMultiplier}
                                    onChange={e => {
                                        let v = parseFloat(e.target.value); if (isNaN(v) || v <= 0) v = 1.5; update('inventory.defaultLowStockMultiplier', v);
                                    }}
                                    sx={{ maxWidth: 210 }}
                                />
                                <TextField
                                    label="Global Reorder Point"
                                    helperText="Fallback threshold"
                                    size="small"
                                    type="number"
                                    value={settings.inventory.globalReorderPoint}
                                    onChange={e => {
                                        let v = parseInt(e.target.value) || 0; if (v < 0) v = 0; update('inventory.globalReorderPoint', v);
                                    }}
                                    sx={{ maxWidth: 210 }}
                                />
                            </Box>
                        </Paper>
                    </section>
                    <section id="appearance" className="settings-section">
                        <Paper className="settings-card" elevation={2}>
                            <Typography variant="h6" className="settings-card-title">Appearance</Typography>
                            <Divider sx={{ my: 2 }} />
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id="theme-label">Theme</InputLabel>
                                <Select labelId="theme-label" label="Theme" value={settings.appearance.theme} onChange={e => update('appearance.theme', e.target.value)}>
                                    <MenuItem value="light">Light</MenuItem>
                                    <MenuItem value="dark">Dark</MenuItem>
                                </Select>
                            </FormControl>
                        </Paper>
                    </section>
                    <section id="data" className="settings-section">
                        <Paper className="settings-card" elevation={2}>
                            <Typography variant="h6" className="settings-card-title">Data Management</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Button variant="outlined" onClick={handleExportData} size="small" sx={{ textTransform: 'none' }}>Export Backup</Button>
                                <Button variant="outlined" color="error" onClick={handleResetDemo} size="small" sx={{ textTransform: 'none' }}>Reset Demo Data</Button>
                            </Box>
                        </Paper>
                    </section>
                </main>
            </div>
        </div>
    );
}