import React, { memo } from "react";
import { HeadingSecondary, HeadingTertiary, TextPrimary } from "../../element";
import { CrossGridSection } from "../../component";
import { useNavigate } from "react-router-dom";

const ProjectsAndCountries = () => {
  const navigate = useNavigate();

  const data = {
    heading: "Projects and countries",

    acrossAfrica: {
      heading: "Across Africa",
      text: "Check out the range of projects we support across sub-Saharan Africa.",
      button: {
        label: "View map",
        url: "https://www.google.com/maps/d/viewer?mid=1dBy7JgzNBfqOdPKQZ1-jSnHcaenYx8s&ll=-9.884292169617131%2C32.9185489&z=5",
      },
    },

    list: [
      {
        heading: "South Africa",
        text: "Planting of food forests and establishing agroforestry systems, wherever the need arises, particularly on the outskirts of urban areas in poor communities.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/F_T4A_fruit_harvesting.jpg?v=1688220480&width=750",
        action: {
          label: "Learn more",
          action: () => navigate("/south-africa"),
        },
      },
      {
        heading: "Zimbabwe",
        text: "In a country with vast unemployment, but rich land we go to various parts of Harare and plant fruit trees for the benefit of the impoverished and destitute.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/Zim_man_planting.jpg?v=1688678385&width=650",
        action: {
          label: "Learn more",
          action: () => navigate("/zimbabwe"),
        },
      },
      {
        heading: "Mozambique",
        text: "Run by a 70% female workforce that focuses on self-empowerment. Here we focus on planting mangrove forests on the countries coastline to protect from extreme weather events.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0397wm.jpg?v=1688219643&width=750",
        action: {
          label: "Learn more",
          action: () => navigate("/mozambique"),
        },
      },
      {
        heading: "Ethiopia",
        text: "Here we are contributing to the Great Green Wall initiative! In this way we hope to stop the spread of the Sahara desert further south, thus alleviating significant deforestation experienced by the country.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/Ethiopia_1.jpg?v=1688231907&width=750",
        action: {
          label: "Learn more",
          action: () => navigate("/ethiopia"),
        },
      },
    ],
  };

  return (
    <div>
      {/* heading */}
      <div className="w-11/12 max-w-[1100px] m-auto py-20 text-center">
        <HeadingSecondary
          rootClass="text-colorSecondary text-[50px] sm:text-[68px]"
          text={data.heading}
        />
      </div>

      {/* Across Africa */}
      <div className="bg-colorFourth py-10">
        <div className="w-11/12 md:w-8/12 max-w-[780px] m-auto text-center space-y-6">
          <HeadingTertiary
            rootClass="text-colorFifth"
            text={data.acrossAfrica.heading}
          />
          <TextPrimary
            rootClass="text-colorSixth"
            text={data.acrossAfrica.text}
          />
          <div>
            <a
              href={data.acrossAfrica.button.url}
              target="_blank"
              className="buttonSecondary"
            >
              {data.acrossAfrica.button.label}
            </a>
          </div>
        </div>
      </div>

      <div className="w-11/12 max-w-[1100px] m-auto py-20">
        <CrossGridSection data={data.list} />
      </div>
    </div>
  );
};

export default memo(ProjectsAndCountries);
