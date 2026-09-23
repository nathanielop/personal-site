import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Document } from 'src/components/document.js';
import { Nav } from 'src/components/nav.js';
import { projects } from 'src/data/projects.js';
import { posts, postHref } from 'src/data/posts.js';

export const route = '';

export const HomePage = () => {
  return (
    <Document
      title="Nathaniel Pendy"
      bodyClassName="bg-white text-gray-600 min-h-full w-full flex flex-col overscroll-y-none"
    >
      <Nav />
      <main className="flex-1 w-full max-w-prose mx-auto px-6 pt-nav pb-16 space-y-16">
        <section>
          <h1 className="text-3xl font-bold text-gray-800">Hey, I'm Nathaniel.</h1>
          <p className="mt-4">
            Welcome to my personal site- largely a collection of random projects that seemed interesting and potentially a blog post or two if I feel like musing about some random topic that nobody else finds interesting.
          </p>
          <p className="mb-0">Have a look around.</p>
        </section>
        <section id="projects">
          <h2 className="text-gray-800">Projects</h2>
          <ul className="mt-4 space-y-4 list-none p-0">
            {projects.map(project => (
              <li key={project.href}>
                <a
                  className="inline-flex items-center gap-1 text-lg font-semibold text-blue-500 no-underline hover:underline"
                  href={project.href}
                >
                  {project.title}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <p className="mt-1 mb-0">{project.description}</p>
              </li>
            ))}
          </ul>
          <a
            className="mt-4 inline-flex items-center gap-1 text-blue-500 no-underline hover:underline"
            href="/projects/"
          >
            See all projects
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
        <section id="blog">
          <h2 className="text-gray-800">Blog</h2>
          <ul className="mt-4 space-y-4 list-none p-0">
            {posts.map(post => (
              <li key={post.slug}>
                <a
                  className="text-lg font-semibold text-blue-500 no-underline hover:underline"
                  href={postHref(post)}
                >
                  {post.title}
                </a>
                <p className="mt-1 mb-0">{post.description}</p>
              </li>
            ))}
          </ul>
          <a
            className="mt-4 inline-flex items-center gap-1 text-blue-500 no-underline hover:underline"
            href="/blog/"
          >
            See all posts
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </main>
    </Document>
  );
};
