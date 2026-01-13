/**
 * Content Demo Component
 *
 * Fetches and displays content from Contentstack CMS
 * using the Delivery SDK.
 */
import { useState } from 'react';
import {
  FileText,
  ShoppingBag,
  RefreshCw,
  Code2,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useEntries } from '../hooks/useContent';
import type { BlogPost, Product } from '../lib/contentstack';

type ContentType = 'blog_post' | 'product';

export function ContentDemo() {
  const [activeType, setActiveType] = useState<ContentType>('blog_post');

  // Fetch blog posts from Contentstack
  const {
    data: blogPosts,
    loading: loadingPosts,
    error: postsError,
    refetch: refetchPosts,
  } = useEntries<BlogPost>('blog_post');

  // Fetch products from Contentstack
  const {
    data: products,
    loading: loadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useEntries<Product>('product');

  const isLoading = activeType === 'blog_post' ? loadingPosts : loadingProducts;
  const error = activeType === 'blog_post' ? postsError : productsError;

  const handleRefresh = () => {
    if (activeType === 'blog_post') {
      refetchPosts();
    } else {
      refetchProducts();
    }
  };

  return (
    <section className='py-20 bg-gradient-to-b from-slate-900 to-slate-800'>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-2'>
              Content from CMS
            </h2>
            <p className='text-slate-400'>
              Live content fetched via Contentstack Delivery SDK
            </p>
          </div>

          {/* Content type tabs */}
          <div className='flex items-center gap-2 p-1 bg-slate-800 rounded-xl'>
            <button
              onClick={() => setActiveType('blog_post')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeType === 'blog_post'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              <FileText className='w-4 h-4' />
              Blog Posts
              {blogPosts.length > 0 && (
                <span className='ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20'>
                  {blogPosts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveType('product')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeType === 'product'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              <ShoppingBag className='w-4 h-4' />
              Products
              {products.length > 0 && (
                <span className='ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20'>
                  {products.length}
                </span>
              )}
            </button>
            <button
              onClick={handleRefresh}
              className='p-2 text-slate-400 hover:text-white transition-colors'
              disabled={isLoading}>
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <div className='flex flex-col items-center gap-4'>
              <Loader2 className='w-10 h-10 text-purple-500 animate-spin' />
              <p className='text-slate-400'>
                Fetching content from Contentstack...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className='flex items-center justify-center py-20'>
            <div className='flex flex-col items-center gap-4 text-center max-w-md'>
              <div className='p-4 rounded-full bg-red-500/10'>
                <AlertCircle className='w-10 h-10 text-red-400' />
              </div>
              <h3 className='text-xl font-bold text-white'>
                Failed to load content
              </h3>
              <p className='text-slate-400'>
                Make sure your Contentstack credentials are configured in your
                .env file and the content types have been created.
              </p>
              <button
                onClick={handleRefresh}
                className='px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors'>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !error &&
          ((activeType === 'blog_post' && blogPosts.length === 0) ||
            (activeType === 'product' && products.length === 0)) && (
            <div className='flex items-center justify-center py-20'>
              <div className='flex flex-col items-center gap-4 text-center max-w-md'>
                <div className='p-4 rounded-full bg-slate-700'>
                  {activeType === 'blog_post' ? (
                    <FileText className='w-10 h-10 text-slate-400' />
                  ) : (
                    <ShoppingBag className='w-10 h-10 text-slate-400' />
                  )}
                </div>
                <h3 className='text-xl font-bold text-white'>
                  No content found
                </h3>
                <p className='text-slate-400'>
                  Run the setup script to create sample content:
                  <code className='block mt-2 px-3 py-2 bg-slate-800 rounded-lg text-purple-400'>
                    npm run setup
                  </code>
                </p>
              </div>
            </div>
          )}

        {/* Blog Posts Grid */}
        {activeType === 'blog_post' &&
          !isLoading &&
          !error &&
          blogPosts.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {blogPosts.map((post, index) => (
                <article
                  key={post.uid}
                  className='group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1'
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Image placeholder or actual image */}
                  <div className='relative h-48 overflow-hidden bg-gradient-to-br from-purple-600/20 to-indigo-600/20'>
                    {post.featured_image?.url ? (
                      <img
                        src={post.featured_image.url}
                        alt={post.title}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <FileText className='w-16 h-16 text-purple-500/30' />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent' />
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 text-sm text-slate-400 mb-3'>
                      <span>{post.author_name}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.publish_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className='text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors'>
                      {post.title}
                    </h3>
                    <p className='text-slate-400 text-sm mb-4 line-clamp-2'>
                      {post.summary}
                    </p>
                    <button className='flex items-center gap-1 text-purple-400 text-sm font-medium hover:gap-2 transition-all'>
                      Read more
                      <ChevronRight className='w-4 h-4' />
                    </button>
                  </div>

                  {/* UID indicator */}
                  <div className='px-6 pb-4'>
                    <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 text-slate-500 text-xs font-mono'>
                      <Code2 className='w-3 h-3' />
                      uid: {post.uid}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        {/* Products Grid */}
        {activeType === 'product' &&
          !isLoading &&
          !error &&
          products.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {products.map((product, index) => (
                <div
                  key={product.uid}
                  className='group bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300'
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='p-3 rounded-xl bg-emerald-500/10'>
                      <ShoppingBag className='w-6 h-6 text-emerald-400' />
                    </div>
                    <span className='px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm'>
                      {product.category}
                    </span>
                  </div>
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    {product.title}
                  </h3>
                  <p className='text-slate-400 mb-6'>{product.description}</p>
                  <div className='flex items-center justify-between'>
                    <div className='text-3xl font-bold text-emerald-400'>
                      ${product.price}
                      <span className='text-sm text-slate-500 font-normal'>
                        /month
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      {product.in_stock ? (
                        <span className='text-sm text-emerald-400'>
                          In Stock
                        </span>
                      ) : (
                        <span className='text-sm text-red-400'>
                          Out of Stock
                        </span>
                      )}
                      <button
                        className='px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!product.in_stock}>
                        Subscribe
                      </button>
                    </div>
                  </div>
                  {/* UID indicator */}
                  <div className='mt-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 text-slate-500 text-xs font-mono'>
                    <Code2 className='w-3 h-3' />
                    uid: {product.uid}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Code example */}
        <div className='mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50'>
          <div className='flex items-center gap-2 text-slate-400 text-sm mb-4'>
            <Code2 className='w-4 h-4' />
            <span>How this content is fetched:</span>
          </div>
          <pre className='text-sm overflow-x-auto'>
            <code className='text-purple-300'>
              {`import { useEntries } from './hooks/useContent';
import type { BlogPost, Product } from './lib/contentstack';

function ContentDemo() {
  // Fetches all blog posts from Contentstack
  const { data: blogPosts, loading, refetch } = useEntries<BlogPost>('blog_post');

  // Fetches all products from Contentstack
  const { data: products } = useEntries<Product>('product');

  return posts.map(post => <BlogCard key={post.uid} {...post} />);
}`}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
