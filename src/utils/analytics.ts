/**
 * Google Analytics & SEO Tracking Infrastructure for Capital-AI
 * Supports Google Analytics 4 (GA4), GTM dataLayer, and dynamic SEO metadata.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Default GA Measurement ID can be configured via environment variable
export const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || '';

/**
 * Initializes Google Analytics dataLayer and queues initial config.
 * Safe to execute even without an active GA ID (queues into dataLayer).
 */
export function initGoogleAnalytics(measurementId: string = GA_MEASUREMENT_ID) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag('js', new Date());

  if (measurementId) {
    // If a measurement ID is configured, load the official gtag.js script if not already present
    const scriptId = 'google-analytics-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }
    window.gtag('config', measurementId, {
      send_page_view: false, // We dispatch custom page_views for SPA accuracy
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }
}

/**
 * Dispatches a typed event to Google Analytics and dataLayer
 */
export function trackEvent(
  action: string,
  params: {
    category?: string;
    label?: string;
    value?: number;
    destination?: string;
    [key: string]: any;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event: action,
    event_category: params.category || 'engagement',
    event_label: params.label || '',
    value: params.value,
    ...params,
    timestamp: new Date().toISOString(),
  };

  // Push to GTM / dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  // Call gtag if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, eventPayload);
  }

  // Developer logging in non-production
  if ((import.meta as any).env?.DEV) {
    console.debug('[Analytics Event]', action, eventPayload);
  }
}

/**
 * Dispatches a Page View event for single-page application navigation
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window === 'undefined') return;

  const pageViewPayload = {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    ...pageViewPayload,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', pageViewPayload);
  }

  if ((import.meta as any).env?.DEV) {
    console.debug('[Analytics PageView]', pagePath, pageTitle);
  }
}

/**
 * Specialized tracker for the Login button & authentication funnel
 */
export function trackLoginClick(source: string = 'header') {
  trackEvent('login_button_click', {
    category: 'authentication',
    label: `login_source_${source}`,
    destination: '/login',
    method: 'header_navigation',
  });
}

/**
 * Updates dynamic SEO tags (title, description, canonical link, OpenGraph)
 */
export function updatePageSEO({
  title,
  description,
  canonicalPath = window.location.pathname,
}: {
  title: string;
  description: string;
  canonicalPath?: string;
}) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = title;

  // Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // OpenGraph Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  // Canonical URL
  const origin = window.location.origin || '';
  const fullCanonicalUrl = `${origin}${canonicalPath}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);
}
