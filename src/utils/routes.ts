const routes = {
    home: '/',
    about: '/about',
    blog: {
      index: '/blog',
      post: (slug: string) => `/blog/${slug}`,
    },
  };
  
  export default routes;