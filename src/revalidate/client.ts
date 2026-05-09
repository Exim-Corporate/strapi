import type { RevalidateConfig } from './config';
import type { RevalidatePayload } from './payload';

export const sendRevalidateRequest = async (
  config: RevalidateConfig,
  payload: RevalidatePayload,
): Promise<void> => {
  const response = await fetch(config.endpointUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-revalidate-secret': config.secret,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  if (response.ok) {
    return;
  }

  const details = await response.text().catch(() => '');

  throw new Error(`Frontend revalidate failed with ${response.status}: ${details || 'no details'}`);
};
