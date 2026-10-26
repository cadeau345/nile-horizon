
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "nile-horizon.firebaseapp.com",
  projectId: "nile-horizon",
  storageBucket: "nile-horizon.firebasestorage.app",
  messagingSenderId: "400045612068",
  appId: "YOUR_FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = "https://www.nilehorizon.org";

const staticRoutes = [
  "/",
  "/hotels",
  "/trips",
  "/transport",
  "/offers",
  "/about",
  "/contact",
  "/aswan-tours",
  "/abu-simbel-tour",
  "/luxor-tour-from-aswan",
  "/nile-cruise-egypt",
];

async function main() {
  const urls = new Set(
    staticRoutes.map((route) => `${BASE_URL}${route}`)
  );

  const [hotelsSnapshot, toursSnapshot] = await Promise.all([
    getDocs(collection(db, "hotels")),
    getDocs(collection(db, "tours")),
  ]);

  hotelsSnapshot.forEach((item) => {
    urls.add(`${BASE_URL}/hotel/${encodeURIComponent(item.id)}`);
  });

  toursSnapshot.forEach((item) => {
    urls.add(`${BASE_URL}/trip/${encodeURIComponent(item.id)}`);
  });

  const entries = [...urls]
    .map(
      (url) => `  <url>\n    <loc>${url}</loc>\n  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  await mkdir("public", { recursive: true });
  await writeFile("public/sitemap.xml", sitemap, "utf8");

  console.log(`Sitemap generated with ${urls.size} URLs.`);
}

main().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exitCode = 1;
});
