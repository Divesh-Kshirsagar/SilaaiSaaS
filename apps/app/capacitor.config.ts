import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silaaisaas.app',
  appName: 'SilaaiSaaS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
