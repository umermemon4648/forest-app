import React, { memo } from "react";
import TreeSvg from "../../../assets/images/tree-svg.svg";
// import TonneSvg from "../../../assets/images/co2-reduce-svg.svg";
import TonneSvg from "../../../assets/images/co2-svgrepo-com.svg";
import numeral from "numeral";
const YourImpact = (props) => {
  const currentYear = new Date().getFullYear();
  console.log("beta propos hun ", props);
  return (
    <div className="flex flex-col items-center justify-center text-center bgGradientSecondary border border-colorPrimary p-6 md:p-12 space-y-20">
      <div className="space-y-4">
        <h2 className="text-colorSecondary text-2xl sm:text-3xl font-bold">
          Hello {props?.name || ""}
        </h2>
        <p className="text-colorPrimary text-2xl sm:text-3xl font-extralight poppins">
          Your Impact for this year {currentYear}
        </p>
      </div>
      <div className="space-y-4">
        {/* trees */}
        <div className="flex items-center space-x-4">
          <div>
            <img src={TreeSvg} alt="trees" className="w-12 h-12" />
          </div>
          <h4 className="text-colorSecondary text-base font-bold">
            {/* {props?.userTotalTrees?.totalNoOfItems || 0} Tree
            {props?.userTotalTrees?.totalNoOfItems > 1 ? "s" : ""} Planted */}
            {props?.productArray?.length} Tree
            {props?.productArray?.length > 1 ? "s" : ""} Planted
          </h4>
        </div>
        {/* tonne */}
        <div className="flex items-center space-x-4">
          <div>
            <img src={TonneSvg} alt="tonne co2" className="w-12 h-12" />
          </div>
          <h4 className="text-colorSecondary text-base font-bold">
            {numeral(props?.userTotalTrees?.totalNoOfCo2).format("0,0") || 0}{" "}
            kilograms of CO<sub>2</sub> absorbed
          </h4>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-colorPrimary text-2xl sm:text-3xl font-extralight poppins">
          Your Impact to date
        </h3>
        <img src={TreeSvg} alt="trees" className="w-20 h-auto" />
        <h4 className="text-colorSecondary text-base font-bold">
          {/* {props?.userTotalTrees?.totalNoOfItems || 0} Tree
          {props?.userTotalTrees?.totalNoOfItems > 1 ? "s" : ""} Planted */}
          {props?.productArray?.length} Tree
          {props?.productArray?.length > 1 ? "s" : ""} Planted
        </h4>
      </div>
    </div>
  );
};

export default memo(YourImpact);
