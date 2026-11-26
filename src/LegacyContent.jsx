export default function LegacyContent({ html, className = '' }) {
  return (
    <div
      className={`well legacy-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
