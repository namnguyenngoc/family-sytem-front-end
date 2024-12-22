import Link from 'next/link';

const BlogIndex = () => {
  const posts = [
    { slug: 'post-1', title: 'First Post' },
    { slug: 'post-2', title: 'Second Post' },
    // ...more posts
  ];

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
           <a>{post.title}</a>
            {/* <Link href={`/blog/${post.slug}`}>
              <a>{post.title}</a>
            </Link> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogIndex;
