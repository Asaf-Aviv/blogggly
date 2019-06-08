import { useState, useLayoutEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode());

  useLayoutEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
    document.querySelector('html').classList[isDarkMode ? 'add' : 'remove']('dark-theme');
  }, [isDarkMode]);

  function toggleDarkMode() {
    return setIsDarkMode(!isDarkMode);
  }

  function getPrefColorScheme() {
    return window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }

  function getInitialMode() {
    const inCache = 'isDarkMode' in localStorage;
    const cachedMode = localStorage.getItem('isDarkMode') === 'true';
    const userPrefersDark = getPrefColorScheme();

    return (inCache && cachedMode) || userPrefersDark;
  }

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
