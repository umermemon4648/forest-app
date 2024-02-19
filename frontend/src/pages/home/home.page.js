import React, { memo } from "react";
import "./home.page.css";
import { CTASection, Carousel, HeroSection, HowWeDo, MakeAnImpact, OurImpact, SliderComponent, WhatWeDo } from "../../component";

const Home = () => {

  return (
    <div>
      <HeroSection />
      <WhatWeDo />
      <MakeAnImpact />
      <Carousel />

      <div className="w-11/12 max-w-[1100px] m-auto space-y-20">
        <HowWeDo />

        <OurImpact />
      </div>

      <SliderComponent />
      <CTASection />
    </div>
  );
};

export default memo(Home);
