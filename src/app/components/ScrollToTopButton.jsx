import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-button bg-primary hover:bg-[#212057]"
        >
          ↑
        </button>
      )}
      <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 50px;
          right: 20px;
          z-index: 1000;
        }
        .scroll-to-top-button {
          border: none;
          color: white;
          padding: 10px 18px;
          font-size: 20px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ScrollToTopButton;
