import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.nuestrahistoria.ios',
  appName: 'Nuestra Historia',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#fffafb',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 600,
      backgroundColor: '#fffafb',
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'LIGHT',
      backgroundColor: '#fffafb',
    },
  },
};

export default config;
