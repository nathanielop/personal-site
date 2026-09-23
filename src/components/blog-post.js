import React from 'react';
import { ArrowLeft } from 'lucide-react';

import { Document } from 'src/components/document.js';
import { Nav } from 'src/components/nav.js';

const formatDate = date =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

export const BlogPost = ({ title, date, description, children }) => {
  return (
    <Document
      title={`${title} · Nathaniel Pendy`}
      description={description}
      bodyClassName="bg-white text-gray-600 min-h-full w-full flex flex-col overscroll-y-none"
    >
      <Nav />
      <main className="flex-1 w-full max-w-prose mx-auto px-6 pt-nav pb-16">
        <article>
          <a
            className="inline-flex items-center gap-1 text-blue-500 no-underline hover:underline"
            href="/blog/"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </a>
          <h1 className="mt-6 text-3xl font-bold text-gray-800">{title}</h1>
          <p className="mt-2 text-sm text-gray-400">{formatDate(date)}</p>
          <div className="mt-8">{children}</div>
        </article>
      </main>
    </Document>
  );
};
