import React from 'react';

const SITE_URL = 'https://na.thaniel.dev/';
const AUTHOR = 'Nathaniel Pendy';

export const Document = ({
  title,
  description = 'The best personal site that ever was.',
  bodyClassName = '',
  styles = ['/styles/main.css'],
  scripts = [],
  children
}) => {
  return (
    <html className="h-full" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="author" content={AUTHOR} />
        <meta name="generator" content="ReactDOM.renderToStaticMarkup" />
        <title>{title}</title>
        <link rel="canonical" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        {styles.map(href => (
          <link key={href} href={href} rel="stylesheet" />
        ))}
      </head>
      <body className={bodyClassName}>
        {children}
        {scripts.map(src => (
          <script key={src} type="module" src={src} />
        ))}
      </body>
    </html>
  );
};
