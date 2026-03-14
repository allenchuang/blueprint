export interface AppConfig {
  /** Display name of the app (e.g. "My App") */
  name: string;
  /** URL-safe slug (e.g. "my-app") — used for bundle IDs, URL slugs, deep link schemes */
  slug: string;
  /** Short description of the app */
  description: string;
  /** Marketing slogan displayed on OG images and landing pages */
  slogan: string;
  /** Semantic version string */
  version: string;

  colors: {
    /** Primary brand color in hex (e.g. "#6366f1") */
    primary: string;
    /** Optional secondary/accent color in hex */
    secondary?: string;
  };

  urls: {
    /** Production website URL */
    website: string;
    /** API server URL */
    api: string;
    /** Documentation site URL */
    docs: string;
    /** Support email address */
    supportEmail: string;
  };

  socials?: {
    github?: string;
    twitter?: string;
    discord?: string;
  };

  mobile: {
    /** iOS bundle identifier / Android package name (e.g. "com.myapp.app") */
    bundleId: string;
    /** Deep link scheme (e.g. "myapp") */
    scheme: string;
  };

  seo?: {
    /** Path or URL to the default Open Graph image */
    ogImage?: string;
    /** SEO keywords */
    keywords?: string[];
  };
}
