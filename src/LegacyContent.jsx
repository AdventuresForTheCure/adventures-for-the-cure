import { useEffect, useRef } from 'react';

export default function LegacyContent({ html, className = '' }) {
  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content?.querySelector('.strava-embed-placeholder')) return;

    const embedScript = document.createElement('script');
    embedScript.src = 'https://strava-embeds.com/embed.js';
    embedScript.async = true;
    content.appendChild(embedScript);

    return () => embedScript.remove();
  }, [html]);

  return (
    <div
      ref={contentRef}
      className={`well legacy-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
