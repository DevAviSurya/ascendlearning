// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the production domain before deploying — required
  // for correct canonical/OG URLs (see src/components/Seo.astro).
  site: 'https://www.ascendlearning.courses',
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()]
  }
});