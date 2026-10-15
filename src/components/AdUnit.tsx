/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ADSENSE_ENABLED, ADSENSE_PUBLISHER_ID } from '../lib/config';

interface AdUnitProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  slotId = 'XXXXXXXXXX',
  format = 'auto',
  className = ''
}) => {
  // If AdSense is disabled (pre-approval state), render absolutely nothing.
  // Zero placeholders, zero 'Advertisement' text, zero network requests.
  if (!ADSENSE_ENABLED) {
    return null;
  }

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle && ADSENSE_ENABLED) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // Silent fail - never break calculator or user experience
    }
  }, []);

  return (
    <div className={`my-8 w-full overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
