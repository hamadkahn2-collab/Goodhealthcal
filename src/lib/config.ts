/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AdSense Configuration
 * Before approval: MUST be false. Zero ad scripts load, no ad placeholders,
 * no 'ca-pub' text, and no 'Advertisement' labels are rendered.
 * After approval: Set to true with your verified Google publisher ID.
 */
export const ADSENSE_ENABLED = false;
export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXX';

/**
 * Domain Configuration
 * Must match the ACTUAL live domain where the application is deployed.
 */
export const LIVE_DOMAIN = 'https://ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app';

export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return LIVE_DOMAIN;
}
