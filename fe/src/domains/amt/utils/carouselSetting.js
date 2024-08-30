import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// 슬라이더 설정
export const carouselSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />, // 커스텀 버튼 사용
  prevArrow: <SamplePrevArrow />, // 커스텀 버튼 사용
};

export function SampleNextArrow(props) {
  const { className, style, onClick, size=16 } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        textAlign: "center",
        cursor: "pointer",
        color: "#333", // 아이콘 색상
        zIndex: 1, // Ensure the button is above the slider content
        // Optional: Add padding to the arrow
        padding: "5px",
      }}
      onClick={onClick}
    >
      <FaChevronRight size={size} />
    </div>
  );
}

export function SamplePrevArrow(props) {
  const { className, style, onClick, size=16 } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        textAlign: "center",
        cursor: "pointer",
        color: "#333", // 아이콘 색상
        zIndex: 1, // Ensure the button is above the slider content
        // Optional: Add padding to the arrow
        padding: "5px",
      }}
      onClick={onClick}
    >
      <FaChevronLeft size={size} />
    </div>
  );
}
