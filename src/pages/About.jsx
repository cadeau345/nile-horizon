import { Helmet } from "react-helmet-async";
function About() {

  return (

    <div className="p-10 max-w-6xl mx-auto">
             <Helmet>

        <title>
          About Aswan Tourism | Nile Horizon Guide
        </title>

        <meta
          name="description"
          content="Learn about Aswan tourism, best attractions, weather and travel tips before your visit."
        />

      </Helmet>

      <h1 className="text-4xl font-bold text-blue-900 mb-6">

        About Aswan

      </h1>


      <p className="text-gray-700 leading-8 mb-8">

        Aswan is one of the most beautiful tourist cities in Egypt.
        It is famous for its warm winter weather, the Nile River views,
        Nubian culture, and historical temples like Abu Simbel and Philae.

      </p>


      <h2 className="text-2xl font-bold mt-6 mb-3">

        Top Attractions

      </h2>


      <ul className="list-disc pl-6 space-y-2 text-gray-700">

        <li>Abu Simbel Temples</li>

        <li>Nubian Village Experience</li>

        <li>Philae Temple</li>

        <li>Aswan High Dam</li>

        <li>Felucca Ride on the Nile</li>

      </ul>


      <h2 className="text-2xl font-bold mt-8 mb-3">

        Best Time to Visit

      </h2>


      <p className="text-gray-700">

        The best time to visit Aswan is between October and April
        when the weather is warm and perfect for sightseeing.

      </p>


      <h2 className="text-2xl font-bold mt-8 mb-3">

        Why Visit Aswan with Nile Horizon?

      </h2>


      <ul className="list-disc pl-6 space-y-2 text-gray-700">

        <li>Carefully selected hotels</li>

        <li>Comfortable transport from Cairo</li>

        <li>Guided tours to top attractions</li>

        <li>Exclusive travel packages</li>

      </ul>

    </div>

  );

}

export default About;