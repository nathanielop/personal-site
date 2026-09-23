import React from 'react';

import { Document } from 'src/components/document.js';
import { Nav } from 'src/components/nav.js';
import { posts, postHref } from 'src/data/posts.js';

export const route = 'blog';

const formatDate = date =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

export const BlogIndexPage = () => {
  return (
    <Document
      title="Blog · Nathaniel Pendy"
      description="Writing from Nathaniel Pendy."
      bodyClassName="bg-white text-gray-600 min-h-full w-full flex flex-col overscroll-y-none"
    >
      <Nav />
      <main className="flex-1 w-full max-w-prose mx-auto px-6 pt-nav pb-16">
        <h1 className="text-3xl font-bold text-gray-800">Blog</h1>
        <ul className="mt-8 space-y-6 list-none p-0">
          {posts.map(post => (
            <li key={post.slug}>
              <a
                className="text-lg font-semibold text-blue-500 no-underline hover:underline"
                href={postHref(post)}
              >
                {post.title}
              </a>
              <p className="mt-1 mb-0 text-sm text-gray-400">{formatDate(post.date)}</p>
              <p className="mt-1 mb-0">{post.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </Document>
  );
};
