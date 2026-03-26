import heroImage from "../assets/hero.jpg";

function Hero() {
  return (
    <div className="relative h-[45vh] md:h-[90vh] flex items-center justify-center">

      {/* Background Image */}
      <img
        src={heroImage}
        className="absolute w-full h-full object-cover"
        alt="Aswan Nile"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>


      <div className="relative text-center px-4">

        <h1 className="text-white text-xl sm:text-3xl md:text-5xl font-bold drop-shadow-lg">

          Discover Aswan with Nile Horizon

        </h1>

        <p className="text-gray-200 mt-2 text-sm sm:text-base md:text-lg">

          Hotels • Transport • Private Cars

        </p>

      </div>

    </div>
  );
}

export default Hero;