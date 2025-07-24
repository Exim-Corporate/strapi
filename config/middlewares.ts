interface SecurityConfig {
  readonly contentSecurityPolicy: {
    readonly useDefaults: boolean;
    readonly directives: {
      readonly 'connect-src': string[];
      readonly 'img-src': string[];
      readonly 'media-src': string[];
      readonly 'frame-src': string[];
    };
    readonly upgradeInsecureRequests: null;
  };
}

interface SecurityConfig {
  readonly contentSecurityPolicy: {
    readonly useDefaults: boolean;
    readonly directives: {
      readonly 'connect-src': string[];
      readonly 'img-src': string[];
      readonly 'media-src': string[];
      readonly 'frame-src': string[];
    };
    readonly upgradeInsecureRequests: null;
  };
}

type MiddlewareEntry =
  | string
  | {
      readonly name: string;
      readonly config?: SecurityConfig | object;
    };

type MiddlewareConfig = MiddlewareEntry[];

export default (): MiddlewareConfig => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ['\'self\'', 'https:', 'https://ofwjpnieqzxvaqoaeozr.supabase.co'],
          'img-src': [
            '\'self\'', 
            'data:', 
            'blob:', 
            'market-assets.strapi.io',
            'https://ofwjpnieqzxvaqoaeozr.supabase.co',
            '*.supabase.co'
          ],
          'media-src': [
            '\'self\'', 
            'data:', 
            'blob:', 
            'https://ofwjpnieqzxvaqoaeozr.supabase.co',
            '*.supabase.co'
          ],
          'frame-src': ['\'self\'', 'sandbox.embed.apollographql.com'],
        },
        upgradeInsecureRequests: null,
      },
    } as SecurityConfig,
  },
];