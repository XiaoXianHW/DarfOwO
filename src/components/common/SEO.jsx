import { Helmet } from 'react-helmet-async'
import { useConfig } from '../../contexts/ConfigContext'

const SEO = ({ 
  title, 
  description, 
  keywords = [],
  author,
  type = 'website',
  image,
  article
}) => {
  const config = useConfig()
  
  const siteTitle = config.siteConfig?.title || 'DarfOwORD'
  const siteDescription = config.siteConfig?.description || '个人博客'
  const siteUrl = config.siteConfig?.url || window.location.origin
  
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const metaDescription = description || siteDescription
  const metaImage = image || `${siteUrl}/og-image.jpg`
  const metaAuthor = author || config.siteConfig?.author || 'Darf'
  
  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={metaAuthor} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {config.siteConfig?.twitter && (
        <meta name="twitter:creator" content={config.siteConfig.twitter} />
      )}
      
      {/* 文章特定的 Meta */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* 其他 */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  )
}

export default SEO
