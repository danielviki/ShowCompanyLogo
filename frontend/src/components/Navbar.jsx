import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Select, FormControl } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

export function Navbar() {
    const { t, i18n } = useTranslation('common');
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLanguageChange = async (event) => {
        try {
            await i18n.changeLanguage(event.target.value);
        } catch (error) {
            console.error('Language change failed:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setMobileOpen(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMobileOpen(false);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                
                <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img 
                        src="/src/assets/companylogo.png" 
                        alt="Company Logo" 
                        style={{ height: '40px', marginRight: '16px' }}
                    />
                    <Typography variant="h6" component="div">
                        Corporate Directory
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 3 }}>
                    <MenuItem component={Link} to="/" sx={{ my: 0, color: 'white' }}>
                        {t('home')}
                    </MenuItem>
                </Box>

                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        inputProps={{ 'aria-label': 'Select language' }}
                        sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' } }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="zh">中文</MenuItem>
                    </Select>
                </FormControl>

                <Menu
                    anchorEl={anchorEl}
                    open={mobileOpen}
                    onClose={handleMenuClose}
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                >
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                        {t('home')}
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
