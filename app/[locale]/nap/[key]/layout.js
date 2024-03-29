export async function generateMetadata({ params }) {
  const title = params.locale === "ko" ? "시차해결사" : "LagLess";
  const description =
    params.locale === "ko"
      ? "추천 받은 낮잠 시간을 공유합니다. 함께 여행 중 시차를 최소화하세요."
      : "Share the nap time recommended through LagLess. Minimize jet lag together during our travels.";
  return {
    metadataBase: new URL(
      `https://sky-nap-guide.vercel.app/${params.locale}/nap/`
    ),
    openGraph: {
      title: title,
      description: description,
      images: ["../../thumbnail.jpg"],
      siteName: title,
    },
    twitter: {
      cardType: "summary_large_image",
      site: "@LagLess",
      title: title,
      description: description,
      image: {
        url: "https://sky-nap-guide.vercel.app/thumbnail.jpg",
        alt: "Twitter image",
      },
    },
  };
}

export default function RootLayout({ children }) {
  return <>{children}</>;
}
