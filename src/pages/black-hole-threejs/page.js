import React from 'react';

import { Document } from 'src/components/document.js';
import { Nav } from 'src/components/nav.js';

export const route = 'black-hole-threejs';

export const BlackHoleThreeJsPage = () => {
  return (
    <Document
      title="Black Hole · Nathaniel Pendy"
      description="A black hole rendered with three.js."
      bodyClassName="h-full w-full m-0 overflow-hidden bg-black text-white"
      scripts={['/black-hole-threejs/index.js']}
    >
      <Nav />
    </Document>
  );
};
