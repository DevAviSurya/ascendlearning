// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the production domain before deploying — required
  // for correct canonical/OG URLs (see src/components/Seo.astro).
  site: 'https://www.ascendlearning.courses',
  vite: {
    plugins: [tailwindcss()]
  }
});