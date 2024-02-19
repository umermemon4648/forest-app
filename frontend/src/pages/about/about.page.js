import React, { memo } from "react";
import {
  ButtonPrimary,
  ButtonSecondary,
  HeadingFourth,
  HeadingTertiary,
  TextPrimary,
} from "../../element";
import { CrossGridSection, OurImpact } from "../../component";
import { Link } from "react-router-dom";

const About = () => {
  const data = {
    aboutHeroSec: {
      heading:
        "Our Forest is a platform for planting trees on the African continent.",
      text: "Wherever you are in the world, we provide you with the opportunity to make your mark on the world and leave a lasting legacy! We believe that climate change can one day be a thing of the past if we all come together for this shared vision. We have already partnered up with organisations in various countries to make this a reality in our lifetime.",
      bgImage:
        "https://www.ourforest.co.za/cdn/shop/files/great_green_wall_jpg.webp?v=1689536642&width=1500",
    },

    mission: {
      image:
        "https://www.ourforest.co.za/cdn/shop/files/Drone_view_of_forest.jpg?v=1688684438&width=1500",
      heading: "Our Mission is clear",
      textOne:
        "We aim to plant 1 billion trees on the African continent by 2050.",
      textTwo:
        "We believe that we can create a legacy of positive change and create a world without global warming.",
      textThree:
        "We already have partners assisting in our efforts in multiple countries.",
    },

    principles: {
      heading: "Our principles",
      textOne: "The Right Tree in the Right Place for the Right Purpose.",
      textTwo:
        "Planting trees involves more than just the act itself. It requires a long-term perspective and strategic thinking. We consider the right tree for the right place and purpose, ensuring sustained growth and benefits for all. We select projects based on the criteria below.",
      content: [
        {
          heading: "Carbon absorbed",
          text: "Maximising the amount of carbon absorbed from the atmosphere to combat the effects of global warming.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/Mozambique_2022_copywm_1.jpg?v=1689190740&width=750",
        },
        {
          heading: "Environmental Benefits",
          text: "We strive to bring about environmental benefits both locally and globally. Our projects combat soil erosion, enrich biodiversity, protect soil fertility, and create sustainable ecosystems, contributing to a healthier environment.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/Mangroves_2_years_of_growth.jpg?v=1689190201&width=750",
        },
        {
          heading: "Socio-Economic Benefits",
          text: "We prioritise delivering social benefits to the communities involved in our projects. By providing funding, community building, training, and technical assistance, we empower local communities to derive food resources and economic opportunities from the trees they care for.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0309.jpg?v=1688219362&width=750",
        },
        {
          heading: "Data transparency",
          text: "See where your tree is planted and track the progress on a regular basis. Our impact is measurable and truly makes a difference.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0325.jpg?v=1689190639&amp;width=1500",
        },
      ],
    },

    howItWorks: {
      heading: "How it works",
      content: [
        {
          title: "Choose your tree",
          text: "Opt for a subscription or make a one-time contribution.",
        },
        {
          title: "Funds allocated",
          text: "Our Forest directs your funds to our partners for your tree to be planted.",
        },
        {
          title: "Track your impact",
          text: "Keep track of your impact in your personalised profile",
        },
        {
          title: "Transparent engagement",
          text: "We provide you with clear insights into how your contributions drive change.",
        },
      ],
    },

    projectsContribute: {
      text: "Our projects contribute to 12 of the 17 Sustainable Development Goals set out by the United Nations Development Program to end poverty, protect the planet and ensure prosperity for all in the context of a new sustainable development agenda.",
      image:
        "https://www.ourforest.co.za/cdn/shop/files/Sustainable_development_goals.png?v=1689282777&width=750",
    },
  };
  return (
    <div>
      {/* about hero section - desktop */}
      <div className="hidden md:block ">
        <div
          className="  w-full xl:h-screen bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${data.aboutHeroSec.bgImage})` }}
        >
          <div className="w-full h-full bg-black/60 flex items-center justify-center p-20">
            <div className="w-full max-w-[840px] text-center space-y-4">
              <HeadingTertiary
                rootClass="text-colorFifth leading-tight"
                text={data.aboutHeroSec.heading}
              />
              <TextPrimary
                rootClass="text-colorSixth text-lg"
                text={data.aboutHeroSec.text}
              />
            </div>
          </div>
        </div>
      </div>

      {/* about hero section - mobile */}
      <div className="block md:hidden mb-10">
        {/* image */}
        <div
          className=" w-full aspect-video bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${data.aboutHeroSec.bgImage})` }}
        ></div>
        {/* content */}
        <div className="bg-colorFourth text-center space-y-4 p-10">
          <HeadingTertiary
            rootClass="text-colorFifth leading-tight"
            text={data.aboutHeroSec.heading}
          />
          <TextPrimary
            rootClass="text-colorSixth text-lg"
            text={data.aboutHeroSec.text}
          />
        </div>
      </div>

      {/* mission is clear */}
      <div className="bg-colorFourth py-10">
        <div className="w-11/12 max-w-[1100px] grid grid-cols-12 m-auto gap-8 md:gap-0">
          {/* image */}
          <div className="col-span-12 md:col-span-4">
            <div
              className="w-full aspect-video md:aspect-auto md:h-full bg-cover bg-no-repeat bg-center rounded-xl overflow-hidden"
              style={{ backgroundImage: `url(${data.mission.image})` }}
            ></div>
          </div>

          {/* content */}
          <div className="col-span-12 md:col-span-8 md:pl-16 md:py-16">
            <div className="w-full h-full flex flex-col justify-center space-y-1 sm:space-y-4">
              <HeadingTertiary
                rootClass="text-colorFifth leading-tight"
                text={data.mission.heading}
              />
              <TextPrimary
                rootClass="text-colorSixth text-lg"
                text={data.mission.textOne}
              />
              <TextPrimary
                rootClass="text-colorSixth text-lg"
                text={data.mission.textTwo}
              />
              <TextPrimary
                rootClass="text-colorSixth text-lg"
                text={data.mission.textThree}
              />
            </div>
          </div>
        </div>
      </div>

      {/* principles */}
      <div className="w-11/12 max-w-[1100px] py-10 sm:py-20 m-auto space-y-20">
        {/* main title */}
        <div className="w-11/12 md:w-8/12 max-w-[780px] text-center m-auto space-y-4">
          <HeadingTertiary
            rootClass="text-colorSecondary"
            text={data.principles.heading}
          />
          <TextPrimary
            rootClass="text-colorSecondary"
            text={data.principles.textOne}
          />
          <TextPrimary
            rootClass="text-colorSecondary"
            text={data.principles.textTwo}
          />
        </div>

        {/* content */}
        <CrossGridSection data={data.principles.content} />
      </div>

      {/* how its work */}
      <div className="w-11/12 max-w-[1100px] m-auto space-y-6 py-10 sm:py-20">
        <HeadingTertiary
          rootClass="text-colorSecondary"
          text={data.howItWorks.heading}
        />

        {/* content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {data.howItWorks.content.map((item, index) => (
            <div
              key={index}
              className="bg-colorSeventh text-center p-8 rounded-3xl space-y-3"
            >
              <HeadingFourth
                rootClass="text-colorSecondary"
                text={index + 1 + ". " + item.title}
              />
              <TextPrimary rootClass="text-colorSecondary" text={item.text} />
            </div>
          ))}
        </div>

        {/* button */}
        <div className="flex justify-center pt-5">
          <Link to="/how-we-do-it">
            <div className="buttonPrimary">Our Approach</div>
          </Link>
        </div>

        {/* Our projects contribute */}
        <div className="pt-10 md:pt-20">
          <div className="grid grid-cols-12">
            {/* image */}
            <div className="col-span-12 lg:col-span-8">
              <img
                className="w-full h-auto"
                src={data.projectsContribute.image}
                alt="projects contribute"
              />
            </div>
            {/* text */}
            <div className="col-span-12 lg:col-span-4 relative">
              <div className="relative -top-[10%] sm:-top-[20%] lg:top-[10%] lg:right-[10%] w-11/12 lg:w-[110%] h-full bg-gradient-to-t from-colorPrimary from-1% to-colorTertiary to-20% p-10 md:p-16 rounded-3xl m-auto">
                <TextPrimary
                  rootClass="text-colorSecondary"
                  text={data.projectsContribute.text}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* our impact */}
      <div className="w-11/12 max-w-[1100px] m-auto py-10 sm:py-20">
        <OurImpact />
      </div>

      {/* Join the movement */}
      <div className="bg-colorFourth py-10">
        <div className="w-11/12 md:w-8/12 max-w-[780px] m-auto text-center space-y-4">
          <HeadingTertiary
            rootClass="text-colorFifth"
            text={"Join the movement"}
          />
          <TextPrimary
            rootClass="text-colorSixth"
            text={
              "Take your first step towards making a difference that will leave a positive legacy for generations to come!"
            }
          />
          <div className="flex justify-center">
            <Link to="/collections/all">
              <div className="buttonSecondary">Create your forest</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(About);
