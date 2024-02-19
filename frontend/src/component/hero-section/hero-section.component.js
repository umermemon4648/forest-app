import React from "react";
import "./hero-section.component.css";
import "./animation.css";
import bannerImg from "../../assets/images/banner.webp";

import {
  TextElement,
  TitleElement,
} from "../../element";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="hero-section-component">
      <div className="heroSection">
        <div className="bannerview">
          <img src={bannerImg} alt="banner" />
          <div className="gradient-overlay"></div>

        </div>
        <div className="banner-content">
          <TitleElement title=" Help plant 1 billion trees in Africa by 2050" />
          {/* <TitleElement title=" by 2050" /> */}

          <TextElement text="You can stop climate change. Do your part, by mitigating your carbon footprint simply by planting trees." />
          <div className="flex items-center justify-center">
            <Link to='/collections/all'>
              <div className="buttonPrimary">Create your forest</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
