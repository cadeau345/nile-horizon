
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.nilehorizon.org";

export default function SEO({
  title,
  description,
  path = "/",
  image = "/logo.png",
}) {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{title} | Nile Horizon</title>

      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Nile Horizon" />
      <meta property="og:title" content={`${title} | Nile Horizon`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | Nile Horizon`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
