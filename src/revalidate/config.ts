const REVALIDATE_MODEL_PREFIX = 'api::';

export interface RevalidateConfig {
  endpointUrl: string;
  secret: string;
  timeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 5000;

export const shouldHandleModel = (modelUid?: string): boolean => {
  return typeof modelUid === 'string' && modelUid.startsWith(REVALIDATE_MODEL_PREFIX);
};

export const getRevalidateConfig = (): RevalidateConfig | null => {
  const endpointUrl = process.env.FRONTEND_REVALIDATE_URL?.trim() || '';
  const secret = process.env.FRONTEND_REVALIDATE_SECRET?.trim() || '';
  const timeoutMs = Number.parseInt(process.env.FRONTEND_REVALIDATE_TIMEOUT_MS || '', 10) || DEFAULT_TIMEOUT_MS;

  if (!endpointUrl || !secret) {
    return null;
  }

  return {
    endpointUrl,
    secret,
    timeoutMs,
  };
};
