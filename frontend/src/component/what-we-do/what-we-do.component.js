import React, { useState } from "react";
import "./what-we-do.component.css";
import { HeadingTertiary } from "../../element";
import thumbnail from "../../assets/images/videoimage.webp";
// import videomp4 from "../../assets/videos/whatwedo.mp4";
const WhatWeDo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="what-we-do">
      <div className="w-11/12 max-w-[1100px] m-auto py-10">
        <HeadingTertiary rootClass='text-colorSecondary leading-tight' text={'What we do'} />
      </div>

      <div className="video-section">
        <div className="page-width">
          <div className="video-section__media">
            {/* Play button */}
            <button
              className={`play-button ${isPlaying ? "hide" : ""}`}
              onClick={togglePlay}
            >
              <svg
                style={{ width: '17px', height: '17px' }}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                className="icon icon-play"
                fill="currentColor"
                viewBox="0 0 10 14"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.48177 0.814643C0.81532 0.448245 0 0.930414 0 1.69094V12.2081C0 12.991 0.858787 13.4702 1.52503 13.0592L10.5398 7.49813C11.1918 7.09588 11.1679 6.13985 10.4965 5.77075L1.48177 0.814643Z"
                  fill="rgba(0, 0, 0, 0.7)"
                ></path>
              </svg>
            </button>
            {/* Conditional rendering based on play state */}
            {isPlaying ? (
              <video
                playsInline
                controls
                preload="metadata"
                autoPlay
                src={"https://cdn.shopify.com/videos/c/vp/fbf6fc36f77f41f1a6daad355090d1fe/fbf6fc36f77f41f1a6daad355090d1fe.HD-1080p-7.2Mbps-16533735.mp4"}
              />
            ) : (
              <img src={thumbnail} alt="Thumbnail" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
