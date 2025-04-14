import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../../features/banner/bannerSlice";

const HeroSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners } = useSelector((state) => state.banners);
  const dispatch = useDispatch();
  const previousSlide = () => {
    setCurrentSlide((curr) => (curr === 0 ? banners.length - 1 : curr - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((curr) => (curr === banners.length - 1 ? 0 : curr + 1));
  };
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);
  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[600px]">
        {banners.map((slide, index) => (
          <div
            key={slide.banner_id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={
                import.meta.env.VITE_API_URL + "/" + slide.image ||
                "/placeholder.svg"
              }
              alt={slide.title}
              // crossOrigin="anonymous"
              className="object-cover  w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"

            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlide;
