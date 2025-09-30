// main.js
const { app, BrowserWindow, Menu, ipcMain, nativeTheme } = require('electron');
const path = require('path');

function createWindow() {
  let win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  Menu.setApplicationMenu(null);

  // Load the renderer script
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(
      `require('${path.join(__dirname, 'renderer.js')}')`
    );
  });
}

app.on('ready', createWindow);

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});
