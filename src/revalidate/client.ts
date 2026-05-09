import type { RevalidateConfig } from './config';
import type { RevalidatePayload } from './payload';

export const sendRevalidateRequest = async (
  config: RevalidateConfig,
  payload: RevalidatePayload,
): Promise<void> => {
  console.log(`[revalidate-client] Sending webhook to: ${config.endpointUrl}`);
  console.log(`[revalidate-client] Payload: ${JSON.stringify(payload, null, 2)}`);
  
  try {
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
      const responseData = await response.text();
      console.log(`[revalidate-client] ✓ Webhook success (${response.status}): ${responseData}`);
      return;
    }

    const details = await response.text().catch(() => '');
    const error = `Frontend revalidate failed with ${response.status}: ${details || 'no details'}`;
    console.error(`[revalidate-client] ✗ Webhook failed: ${error}`);
    throw new Error(error);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[revalidate-client] ✗ Webhook timeout (${config.timeoutMs}ms): ${config.endpointUrl}`);
      throw new Error(`Frontend revalidate timeout after ${config.timeoutMs}ms`);
    }
    console.error(`[revalidate-client] ✗ Webhook error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};
