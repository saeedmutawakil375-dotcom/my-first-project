const createArticlePath = (article) => `/articles/${article.slug || article._id}`;

export default createArticlePath;
