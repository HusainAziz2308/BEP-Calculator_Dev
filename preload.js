const { contextBridge, ipcRenderer, nativeTheme } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  toggleDarkMode: () => {
    ipcRenderer.invoke('dark-mode:toggle');
  },
  setSystemDarkMode: () => {
    ipcRenderer.invoke('dark-mode:system');
  }
});
