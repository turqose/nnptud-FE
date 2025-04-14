import React, { useRef, useState } from "react";

const ImageMagnifier = ({ src, alt }) => {
  const [zoom, setZoom] = useState(false);
  const imgRef = useRef(null);

  const handleMouseEnter = () => setZoom(true);
  const handleMouseLeave = () => setZoom(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`object-cover w-full h-full transition-transform duration-300 ${
          zoom ? "scale-150" : "scale-20"
        }`}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default ImageMagnifier;
