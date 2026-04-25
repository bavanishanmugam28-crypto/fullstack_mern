import React from "react";
import { useNavigate } from "react-router-dom";

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper modules
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function ProductSlider() {

  const navigate = useNavigate();

  const slides = [
    {
      img: "https://i.ytimg.com/vi/DKsWfN51xBQ/maxresdefault.jpg",
      title: "Mega Sale",
      desc: "Up to 50% off on women fashion",
      btn: "Shop Now",
      fit: "contain",
      link: "/category/women"
    },
    {
      img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200",
      title: "Male Fashion Deals",
      desc: "Latest trends with amazing discounts",
      btn: "Explore",
      fit: "cover",
      link: "/category/men"
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0654/3504/2039/files/D2C_Homepage_Banner_Payday-Jan_1500x800_978b3f59-75bf-4853-aeee-5f22c44f151d.jpg",
      title: "Skin care",
      desc: "Best face care at best prices",
      btn: "Buy Now",
      fit: "contain",
      link: "/category/medicine"
    },
    {
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
      title: "Smart Watches",
      desc: "Track fitness with style",
      btn: "Shop Watches",
      fit: "cover",
      link: "/category/electronics"
    },
    {
      img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200",
      title: "preminum perfume",
      desc: "Comfort + Performance",
      btn: "Shop perfume",
      fit: "cover",
      link: "/category/fancy"
    },
    {
      img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200",
      title: "Home Essentials",
      desc: "Upgrade your living space",
      btn: "Shop Home",
      fit: "cover",
      link: "/category/home"
    }
  ];

  return (
    <div className="slider-container mb-4 shadow rounded overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="position-relative">

              <img
                src={slide.img}
                alt={slide.title}
                style={{
                  height: "400px",
                  width: "100%",
                  objectFit: slide.fit,
                  backgroundColor: "#f8f9fa"
                }}
              />

              {/* Caption */}
              <div
                className="carousel-caption text-start d-none d-md-block"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "20px",
                  borderRadius: "10px",
                  left: "10%",
                  bottom: "10%"
                }}
              >
                <h2 className="fw-bold text-white">{slide.title}</h2>
                <p className="text-white">{slide.desc}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate(slide.link)}
                >
                  {slide.btn}
                </button>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductSlider;