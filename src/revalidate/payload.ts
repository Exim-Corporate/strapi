export interface RevalidatePayload {
  model?: string;
  event?: string;
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

export const buildRevalidatePayload = (event: LifecycleEventLike, secret: string): RevalidatePayload => {
  const model = getModelUid(event);

  return {
    model,
    event: readString(event.action),
    secret,
  };
};
