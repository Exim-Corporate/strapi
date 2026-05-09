import type { Core } from '@strapi/strapi';
import { getRevalidateConfig, shouldHandleModel } from './config';
import { sendRevalidateRequest } from './client';
import { buildRevalidatePayload, getModelUid } from './payload';

interface LifecycleEventLike {
  action?: string;
  model?: unknown;
  uid?: unknown;
  result?: Record<string, unknown>;
  params?: {
    data?: Record<string, unknown>;
  };
}

const handleLifecycleEvent = async (event: LifecycleEventLike, strapi: Core.Strapi): Promise<void> => {
  const config = getRevalidateConfig();

  if (!config) {
    return;
  }

  const modelUid = getModelUid(event);

  if (!shouldHandleModel(modelUid)) {
    return;
  }

  const payload = buildRevalidatePayload(event, config.secret);

  if (!payload) {
    return;
  }

  try {
    await sendRevalidateRequest(config, payload);
  }
  catch (error) {
    strapi.log.warn(`[revalidate] ${String(error)}`);
  }
};

export const registerRevalidateLifecycle = (strapi: Core.Strapi): void => {
  strapi.db.lifecycles.subscribe({
    async afterCreate(event) {
      await handleLifecycleEvent(event as LifecycleEventLike, strapi);
    },
    async afterUpdate(event) {
      await handleLifecycleEvent(event as LifecycleEventLike, strapi);
    },
    async afterDelete(event) {
      await handleLifecycleEvent(event as LifecycleEventLike, strapi);
    },
  });
};
