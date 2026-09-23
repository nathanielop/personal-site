import React from 'react';

import { BlogPost } from 'src/components/blog-post.js';
import { posts } from 'src/data/posts.js';

const post = posts.find(entry => entry.slug === 'hello-world');

export const route = 'blog/hello-world';

export const HelloWorldPost = () => {
  return (
    <BlogPost title={post.title} date={post.date} description={post.description}>
      <p>Hello, world!</p>
    </BlogPost>
  );
};
