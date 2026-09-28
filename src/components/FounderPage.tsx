/**
 * CAPITAL AI — STUDIO HUB WRAPPER (Previously FounderPage)
 * Backwards compatibility export forwarding to the new StudioPage component.
 */

import React from 'react';
import { StudioPage, StudioPageProps, StudioTabKey } from './StudioPage';

export type { StudioPageProps, StudioTabKey };
export interface FounderPageProps extends StudioPageProps {
  initialTab?: any;
}

export const FounderPage: React.FC<FounderPageProps> = (props) => {
  return <StudioPage {...props} />;
};

export default FounderPage;
