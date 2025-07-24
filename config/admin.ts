export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  tutorials: false,
  releases: false,
  // vite: {
  //   cacheDir: path.join(os.tmpdir(), 'strapi-vite-cache'),
  //   server: {
  //     fs: {
  //       strict: false,
  //     },
  //     watch: {
  //       usePolling: true,
  //       interval: 300,
  //     },
  //   },
  //   optimizeDeps: {
  //     force: false,
  //     cacheDir: path.join(os.tmpdir(), 'strapi-vite-deps'),
  //   },
  //   build: {
  //     chunkSizeWarningLimit: 3000,
  //   },
  //   esbuild: {
  //     logOverride: { 'this-is-undefined-in-esm': 'silent' },
  //   },
  // },
});
