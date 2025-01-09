import React, { useEffect, useRef, useState } from 'react';

const Carousel = ({ productImagesRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (productImagesRef.current.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % productImagesRef.current.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [productImagesRef]);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-fit py-12 md:w-2/5 bg-white flex flex-col  items-center shadow-lg">
      <div className="carousel relative overflow-hidden">
        {productImagesRef.current.length > 0 && (
          <div className="relative cursor-zoom-in">
            <img
              ref={imageRef}
              src={productImagesRef.current[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="object-contain w-full transition-transform duration-500 ease-in-out transform hover:scale-150"
            />
          </div>
        )}
      </div>
      <div className="thumbnails flex flex-wrap mt-4">
        {productImagesRef.current.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 object-cover m-2 cursor-pointer ${currentIndex === index ? 'border-2 border-blue-500' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
