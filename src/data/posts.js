export const posts = [
  {
    title: 'Hello, world!',
    slug: 'hello-world',
    date: '2026-09-23',
    description: "Something to fill up this block here until I actually figure out what I want to write about"
  }
];

export const postHref = post => `/blog/${post.slug}/`;
