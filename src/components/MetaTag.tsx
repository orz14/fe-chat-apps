import Head from "next/head";
import { useRouter } from "next/router";

type MetaTagProps = {
  title?: string;
};

export default function MetaTag(props: MetaTagProps) {
  const router = useRouter();

  return (
    <Head>
      {/* SEO Meta Tags */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`} />
      <link rel="icon" sizes="32x32" href="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-32.webp" />
      <link rel="icon" sizes="192x192" href="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-192.webp" />
      <link rel="apple-touch-icon-precomposed" href="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-180.webp" />
      <meta name="msapplication-TileImage" content="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-144.webp" />
      <link rel="icon" type="image/x-icon" href="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-500.webp" />
      <meta name="robots" content="index, follow" />
      <meta name="geo.country" content="id" />
      <meta name="geo.placename" content="Indonesia" />
      <meta name="rating" content="general" />
      <meta name="author" content={process.env.NEXT_PUBLIC_AUTHOR_NAME} />
      <link rel="publisher" href={process.env.NEXT_PUBLIC_AUTHOR_URL} />
      <link rel="author" href={process.env.NEXT_PUBLIC_AUTHOR_URL} />
      <link rel="me" href={process.env.NEXT_PUBLIC_AUTHOR_URL} />
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="article:author" content={process.env.NEXT_PUBLIC_AUTHOR_URL} />
      <meta property="article:publisher" content={process.env.NEXT_PUBLIC_AUTHOR_URL} />
      {/* <meta name="google-site-verification" content="dxkAHdf8jg1-2rmTH-QGkIMSYY7s0EwcEffohbUQCt8" />
      <meta name="msvalidate.01" content="26E64DF8D8B14C5AF83FBD804474B8C4" /> */}
      <meta
        name="search engines"
        content="Aeiwi, Alexa, AllTheWeb, AltaVista, AOL Netfind, Anzwers, Canada, DirectHit, EuroSeek, Excite, Overture, Go, Google, HotBot, InfoMak, Kanoodle, Lycos, MasterSite, National Directory, Northern Light, SearchIt, SimpleSearch, WebsMostLinked, WebTop, What-U-Seek, AOL, Yahoo, WebCrawler, Infoseek, Excite, Magellan, LookSmart, CNET, Googlebot"
      />

      {/* Primary Meta Tags */}
      <title>{`${props.title ? props.title + " · " : ""}${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
      <meta name="title" content={`${props.title ? props.title + " · " : ""}${process.env.NEXT_PUBLIC_APP_NAME}`} />
      <meta name="description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
      <meta name="keywords" content={process.env.NEXT_PUBLIC_APP_KEYWORDS} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`} />
      <meta property="og:title" content={`${props.title ? props.title + " · " : ""}${process.env.NEXT_PUBLIC_APP_NAME}`} />
      <meta property="og:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
      <meta property="og:image" content="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-1200x630.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Meta Tags */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={process.env.NEXT_PUBLIC_APP_URL?.replace(/^(http|https):\/\//, "")} />
      <meta property="twitter:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`} />
      <meta property="twitter:title" content={`${props.title ? props.title + " · " : ""}${process.env.NEXT_PUBLIC_APP_NAME}`} />
      <meta property="twitter:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
      <meta property="twitter:image" content="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-1200x630.webp" />

      {/* Styles */}
      <meta name="theme-color" content="#4338ca" />
      <meta name="msapplication-navbutton-color" content="#4338ca" />
      <meta name="msapplication-TileColor" content="#4338ca" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#4338ca" />

      {/* Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      {/* <link rel="preconnect" href="https://be-chat.orzverse.com" crossOrigin="anonymous" /> */}

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      {/* <link rel="dns-prefetch" href="//be-chat.orzverse.com" /> */}
      <link rel="dns-prefetch" href="//github.com" />
    </Head>
  );
}
