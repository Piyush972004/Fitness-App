
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ffb33914cd3741eca368edbb9953d201',
  appName: 'swift-fit-sessions',
  webDir: 'dist',
  server: {
    url: 'https://ffb33914-cd37-41ec-a368-edbb9953d201.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false
    }
  }
};

export default config;
