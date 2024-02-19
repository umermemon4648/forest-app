import React from "react";
import "./cta-section.component.css";
import "./animation.css";
import bannerImg from "../../assets/images/banner.webp";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="cta-section-component">
      <div className="ctaSection">
        <div className="bannerview">
          <img src={bannerImg} alt="banner" />
        </div>
        <div className="banner-content m-auto">
          <h3 className='kalam'>Sewing seeds of positive change</h3>
          <div className="flex items-center justify-center">
            <Link to='/collections/all'>
              <div className="buttonPrimary">Get involved</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
