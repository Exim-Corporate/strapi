export interface RevalidatePayload {
  model: string;
  event: string;
  entry: {
    slug?: string;
    locale?: string;
  };
  secret: string;
}

interface LifecycleEventLike {
  action?: string;
  model?: unknown;
  uid?: unknown;
  result?: Record<string, unknown>;
  params?: {
    data?: Record<string, unknown>;
  };
}

const readString = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim() ? value : undefined;
};

export const getModelUid = (event: LifecycleEventLike): string | undefined => {
  if (typeof event.model === 'string') {
    return event.model;
  }

  if (event.model && typeof event.model === 'object' && 'uid' in event.model) {
    const uid = (event.model as { uid?: unknown }).uid;

    if (typeof uid === 'string') {
      return uid;
    }
  }

  return readString(event.uid);
};

export const buildRevalidatePayload = (event: LifecycleEventLike, secret: string): RevalidatePayload | null => {
  const model = getModelUid(event);

  if (!model) {
    return null;
  }

  const entity = event.result || event.params?.data || {};

  return {
    model,
    event: readString(event.action) || 'unknown',
    entry: {
      slug: readString(entity.slug),
      locale: readString(entity.locale),
    },
    secret,
  };
};
