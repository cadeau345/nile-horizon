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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Box */}
      <div className="relative bg-white/85 md:bg-white/95 backdrop-blur-md px-4 py-4 md:px-6 md:py-8 rounded-2xl shadow-xl text-center w-[85%] max-w-sm md:max-w-3xl">

        {/* Title */}
        <h1 className="text-lg sm:text-2xl md:text-5xl font-bold text-blue-900">

          Discover Aswan with Nile Horizon

        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">

          Hotels • Transport • Private Cars

        </p>

      </div>

    </div>
  );
}

export default Hero;