import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { transform as svgrTransform } from '@svgr/core';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const outDir = path.join(root, 'public');
const tmpDir = path.join(root, '.tmp');

const clientEntries = {
  'black-hole-threejs/index': 'src/pages/black-hole-threejs/index.js'
};

const log = message => console.log(`\u001b[36m[build]\u001b[0m ${message}`);

const svgrPlugin = {
  name: 'svgr',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async args => {
      const svg = await readFile(args.path, 'utf8');
      const contents = await svgrTransform(
        svg,
        {
          plugins: ['@svgr/plugin-jsx'],
          jsxRuntime: 'automatic',
          icon: true,
          exportType: 'named',
          namedExport: 'Icon'
        },
        { componentName: 'Icon' }
      );
      return { contents, loader: 'jsx' };
    });
  }
};

const clean = async () => {
  await rm(outDir, { recursive: true, force: true });
  await rm(tmpDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
};

const copyStatic = async () => {
  const staticDir = path.join(root, 'static');
  if (!existsSync(staticDir)) return;
  await cp(staticDir, outDir, { recursive: true });
  log('copied static assets');
};

const buildStyles = async () => {
  const from = path.join(root, 'src/styles/main.css');
  const css = await readFile(from, 'utf8');
  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from,
    to: path.join(outDir, 'styles/main.css')
  });
  await mkdir(path.join(outDir, 'styles'), { recursive: true });
  await writeFile(path.join(outDir, 'styles/main.css'), result.css);
  log('built styles/main.css');
};

const buildClients = async () => {
  await esbuild.build({
    entryPoints: clientEntries,
    bundle: true,
    format: 'esm',
    target: 'es2019',
    minify: true,
    sourcemap: false,
    outdir: outDir,
    nodePaths: [root],
    logLevel: 'warning'
  });
  log(`bundled ${Object.keys(clientEntries).length} client script(s)`);
};

const renderPages = async () => {
  const renderBundle = path.join(tmpDir, 'render.mjs');
  await esbuild.build({
    entryPoints: [path.join(root, 'src/render.js')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    jsx: 'automatic',
    loader: { '.js': 'jsx' },
    nodePaths: [root],
    mainFields: ['module', 'main'],
    plugins: [svgrPlugin],
    external: [
      'react',
      'react-dom',
      'react-dom/server',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ],
    outfile: renderBundle,
    logLevel: 'warning'
  });

  const { render } = await import(pathToFileURL(renderBundle).href);
  const pages = render();

  for (const page of pages) {
    const dir = page.route ? path.join(outDir, page.route) : outDir;
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), page.html);
    log(`rendered /${page.route || ''} -> ${path.relative(root, path.join(dir, 'index.html'))}`);
  }

  await rm(tmpDir, { recursive: true, force: true });
};

const build = async () => {
  const start = Date.now();
  await clean();
  await copyStatic();
  await buildStyles();
  await buildClients();
  await renderPages();
  log(`done in ${Date.now() - start}ms`);
  if (process.env.LIVERELOAD) {
    await writeFile(path.join(root, '.livereload'), String(Date.now()));
  }
};

build().catch(error => {
  console.error(error);
  process.exit(1);
});
