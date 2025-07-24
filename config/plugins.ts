interface PluginEnv {
  (key: string, defaultValue?: string): string;
}

interface ImageFormat {
  readonly name: string;
  readonly width: number;
  readonly height?: number;
  readonly quality?: number;
}

interface BreakPoint {
  readonly [key: string]: ImageFormat;
}

interface SupabaseProviderConfig {
  readonly apiUrl: string;
  readonly apiKey: string;
  readonly bucket: string;
  readonly directory: string;
  readonly options: {
    readonly cacheControl: string;
    readonly upsert: boolean;
  };
}

interface UploadConfig {
  readonly provider: string;
  readonly providerOptions: SupabaseProviderConfig;
  readonly breakpoints: BreakPoint;
  readonly sizeOptimization: boolean;
  readonly responsiveDimensions: boolean;
}

interface PluginsConfig {
  readonly upload: {
    readonly config: UploadConfig;
  };
}

export default ({ env }: { env: PluginEnv }): PluginsConfig => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-supabase',
      providerOptions: {
        apiUrl: env('SUPABASE_API_URL'),
        apiKey: env('SUPABASE_API_KEY'),
        bucket: env('SUPABASE_BUCKET', 'exim-img'),
        directory: env('SUPABASE_DIRECTORY', 'uploads'),
        options: {
          cacheControl: '31536000', // 1 год кэширования
          upsert: true,
        },
      },
      // Настройка размеров изображений (причина 5 вариантов)
      breakpoints: {
        xlarge: { name: 'xlarge', width: 1920 },
        // large: { name: 'large', width: 1000 },
        // medium: { name: 'medium', width: 750 },
        // small: { name: 'small', width: 500 },
        thumbnail: { name: 'thumbnail', width: 245, height: 156 },
      },
      sizeOptimization: true,
      responsiveDimensions: true,
    },
  },
});