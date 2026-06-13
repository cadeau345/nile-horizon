import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

function Flights() {

useEffect(() => {

const script = document.createElement("script");

script.src =
"https://tpemd.com/content?currency=usd&trs=519404&shmarker=719849&target_host=www.aviasales.com%2Fsearch&locale=en&limit=6&powered_by=true&primary=%230085FF&promo_id=4044&campaign_id=100";

script.async = true;

script.charset = "utf-8";

document
.getElementById("flight-widget-container")
.appendChild(script);

}, []);

return (

<div className="p-10">

<Helmet>

<title>Search Flights | Nile Horizon</title>

<meta
name="description"
content="Search cheap flights worldwide directly from Nile Horizon."
/>

</Helmet>

<h1 className="text-3xl font-bold text-blue-900 mb-6">

Search Flights Worldwide

</h1>

<div id="flight-widget-container"></div>

</div>

);

}

export default Flights;