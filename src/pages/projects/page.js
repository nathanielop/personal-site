import React from 'react';
import { ArrowUpRight } from 'lucide-react';

import { Document } from 'src/components/document.js';
import { Nav } from 'src/components/nav.js';
import { projects } from 'src/data/projects.js';

export const route = 'projects';

export const ProjectsPage = () => {
  return (
    <Document
      title="Projects · Nathaniel Pendy"
      description="Things Nathaniel Pendy has built."
      bodyClassName="bg-white text-gray-600 min-h-full w-full flex flex-col overscroll-y-none"
    >
      <Nav />
      <main className="flex-1 w-full max-w-prose mx-auto px-6 pt-nav pb-16">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <ul className="mt-8 space-y-6 list-none p-0">
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
      </main>
    </Document>
  );
};
