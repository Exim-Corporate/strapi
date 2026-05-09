import type { Core } from '@strapi/strapi';
import { registerRevalidateLifecycle } from './revalidate/register';

export default {
  register() {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    registerRevalidateLifecycle(strapi);
  },
};
