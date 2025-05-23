import { createRoot } from 'react-dom/client';
import App from './App';
import './globals.css';
import './fonts.css';
import React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <StyledEngineProvider enableCssLayer>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <App />
        </StyledEngineProvider>
    </React.StrictMode>,
);
