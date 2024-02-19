import React, { memo } from "react";
import _ from "lodash";
import BadgeOne from "../../../assets/badges/badge-1.png";
import BadgeTwo from "../../../assets/badges/badge-2.png";
import BadgeThree from "../../../assets/badges/badge-3.png";
import BadgeFour from "../../../assets/badges/badge-4.png";
import BadgeFive from "../../../assets/badges/badge-5.png";
import BadgeSix from "../../../assets/badges/badge-6.png";
import BadgeSeven from "../../../assets/badges/badge-7.png";
import { Tooltip } from "react-tooltip";

const Badges = (props) => {
  const totalTrees = props.userTotalTrees?.totalNoOfItems;

  const searchWord = "gift"; // The word you want to search for (case-insensitive)

  const onlyGifts = _.filter(props?.orders, (obj) => {
    return obj.name.toLowerCase().includes(searchWord.toLowerCase());
  });

  const areCountriesEqual = (orders) => {
    const referenceCountries = orders[0]?.countries;

    for (let i = 1; i < orders?.length; i++) {
      if (!_.isEqual(orders[i]?.countries, referenceCountries)) {
        return false;
      }
    }

    return true;
  };

  const moreThanTwoCountries = !areCountriesEqual(props?.orders);

  const data = [
    {
      name: "Seed Starter.",
      desc: "Given to users who have planted their first tree through the service, acknowledging their initial step towards positive change.",
      badge: BadgeOne,
      enable: totalTrees > 0,
    },
    {
      name: "Bestowal Badge.",
      desc: "A badge for users who have gifted a tree to someone.",
      badge: BadgeTwo,
      enable: onlyGifts[0]?.quantity > 0,
    },
    {
      name: "Global Green Thumb.",
      desc: "A badge for users who have planted trees in multiple countries, symbolizing their worldwide environmental impact.",
      badge: BadgeThree,
      enable: moreThanTwoCountries,
    },
    {
      name: "10 Tree Milestone Planter.",
      desc: "Given to users who have planted 10 trees.",
      badge: BadgeFour,
      enable: totalTrees > 9,
    },
    {
      name: "25 Tree Milestone Planter.",
      desc: "Given to users who have planted 25 trees.",
      badge: BadgeFive,
      enable: totalTrees > 24,
    },
    {
      name: "50 Tree Milestone Planter.",
      desc: "Given to users who have planted 50 trees.",
      badge: BadgeSix,
      enable: totalTrees > 49,
    },
    {
      name: "100 Tree Milestone Planter.",
      desc: "Given to users who have planted 100 trees.",
      badge: BadgeSeven,
      enable: totalTrees > 99,
    },
  ];

  return (
    <div className="bgGradientSecondary border border-colorPrimary p-6 md:p-12">
      <h2 className="text-colorSecondary kalam text-3xl sm:text-4xl font-bold">
        Badges
      </h2>

      {/* badges */}
      <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 gap-2 mt-12">
        {data.map((badge, index) => (
          <div
            key={index}
            data-tooltip-id="my-tooltip"
            data-tooltip-html={`${
              badge.enable ? "⭐ Congratulation! you unlock <br/>" : "🔒 "
            }${badge.name} <br/> ${badge.desc}`}
            className="aspect-square flex items-center justify-center bg-colorFifth border border-colorPrimary rounded-lg shadow-lg p-6"
          >
            <img
              src={badge.badge}
              alt={badge.name}
              className={`${
                badge.enable ? "opacity-100" : "opacity-30"
              } h-full w-auto object-cover`}
            />
          </div>
        ))}
        <Tooltip id="my-tooltip" html={true} className="text-center" />
      </div>
    </div>
  );
};

export default memo(Badges);
