
import React from "react";
import { Helmet } from "react-helmet-async";

export default function AbuSimbelTour() {
  const title =
    "Abu Simbel Tour from Aswan | Nile Horizon";

  const description =
    "Book an Abu Simbel tour from Aswan with Nile Horizon Tourism Egypt. Discover the famous Abu Simbel temples and plan your Egypt trip.";

  const canonical =
    "https://www.nilehorizon.org/abu-simbel-tour";

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta
          name="description"
          content={description}
        />

        <link
          rel="canonical"
          href={canonical}
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:url"
          content={canonical}
        />

        <html lang="en" />
      </Helmet>

      <div style={{ padding: "40px" }}>
        <h1>
          Abu Simbel Tour from Aswan | رحلة أبو سمبل من أسوان
        </h1>

        <p>
          Book your Abu Simbel tour from Aswan with
          Nile Horizon Tourism Egypt and enjoy a
          comfortable trip to one of the most famous
          temples in Egypt with professional guides
          and modern transportation.
        </p>

        <p>
          توفر شركة Nile Horizon رحلة أبو سمبل من أسوان
          بسيارات حديثة وخدمة مميزة وزيارات منظمة لأحد
          أهم معابد مصر التاريخية مع أفضل المرشدين السياحيين.
        </p>
      </div>
    </>
  );
}
