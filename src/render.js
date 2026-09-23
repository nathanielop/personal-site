import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { HomePage, route as homeRoute } from 'src/pages/home/page.js';
import { ProjectsPage, route as projectsRoute } from 'src/pages/projects/page.js';
import {
  BlackHoleThreeJsPage,
  route as blackHoleRoute
} from 'src/pages/black-hole-threejs/page.js';
import { BlogIndexPage, route as blogRoute } from 'src/pages/blog/page.js';
import {
  HelloWorldPost,
  route as helloWorldRoute
} from 'src/pages/blog/hello-world/page.js';

const pages = [
  { route: homeRoute, Component: HomePage },
  { route: projectsRoute, Component: ProjectsPage },
  { route: blackHoleRoute, Component: BlackHoleThreeJsPage },
  { route: blogRoute, Component: BlogIndexPage },
  { route: helloWorldRoute, Component: HelloWorldPost }
];

export const render = () =>
  pages.map(({ route, Component }) => ({
    route,
    html: `<!doctype html>\n${renderToStaticMarkup(<Component />)}`
  }));
