import React, { useEffect, useState } from 'react'

const Carousel = ({productImagesRef}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
        const interval = setInterval(() => {
          if (productImagesRef.current.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % productImagesRef.current.length);
          }
        }, 3000);
        return () => clearInterval(interval);
    }, []);  

  return (
    <div className="relative w-full h-fit py-12 md:w-2/5 bg-white flex justify-center items-center shadow-lg">
      <div className="carousel">
        {productImagesRef.current.length > 0 && (
          <img
            src={productImagesRef.current[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
          />
        )}
      </div>
      </div>
  )
}

export default Carousel
