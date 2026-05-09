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
    console.log('[revalidate] No revalidation config found - webhook disabled');
    return;
  }

  const modelUid = getModelUid(event);
  console.log(`[revalidate] Lifecycle event: action=${event.action}, model=${modelUid}`);

  if (!shouldHandleModel(modelUid)) {
    console.log(`[revalidate] Ignoring model: ${modelUid} (not in api::* namespace)`);
    return;
  }

  const payload = buildRevalidatePayload(event, config.secret);

  if (!payload) {
    console.warn(`[revalidate] Could not build payload for model: ${modelUid}`);
    return;
  }

  try {
    console.log(`[revalidate] Triggering revalidation for: ${modelUid} (${event.action})`);
    await sendRevalidateRequest(config, payload);
  } catch (error) {
    strapi.log.warn(`[revalidate] Failed to send webhook: ${String(error)}`);
    console.error(`[revalidate] Error:`, error);
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
