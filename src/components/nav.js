import React from 'react';

import { Icon as GithubIcon } from 'src/icons/github.svg';

export const Nav = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 bg-black bg-opacity-50 text-white backdrop-blur-sm">
      <nav className="max-w-prose mx-auto flex items-center gap-4 sm:gap-6 px-6 h-16">
        <a href="/" className="mr-auto text-lg font-bold no-underline hover:opacity-80">
          Nathaniel Pendy
        </a>
        <a href="/projects/" className="no-underline hover:underline">
          Projects
        </a>
        <a href="/blog/" className="no-underline hover:underline">
          Blog
        </a>
        <a href="https://github.com/nathanielop" aria-label="GitHub" className="hover:opacity-80">
          <GithubIcon className="h-6 w-6" />
        </a>
      </nav>
    </header>
  );
};
