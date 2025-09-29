import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const colorScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(colorScheme || 'light');

    const toggleTheme = () => {
        setTheme((value) => value === 'light' ? 'dark' : 'light');
    }

    const themeColors = {
        light: {
            background: '#FFFFFF',
            text: '#000000',
            textSecondary: '#666666',
            cardBackground: '#FFFFFF',
            inputBackground: '#f0f0f0',
            inputText: '#000000',
            placeholderTextColor: '#666666',
            border: '#dddddd',
            // Verde mantido igual em ambos os temas
            primary: '#01743A',
            primaryText: '#FFFFFF'
        },
        dark: {
            background: '#000000',
            text: '#FFFFFF',
            textSecondary: '#aaaaaa',
            cardBackground: '#000000', // MUDANÇA: era '#212121', agora é '#000000'
            inputBackground: '#212121', // Mantém cinza para inputs
            inputText: '#FFFFFF',
            placeholderTextColor: '#aaaaaa',
            border: '#555555',
            // Verde mantido igual em ambos os temas
            primary: '#01743A',
            primaryText: '#FFFFFF'
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
            {children}
        </ThemeContext.Provider>
    );
}