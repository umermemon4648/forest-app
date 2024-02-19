import React, { memo, useEffect } from "react";
import { ButtonPrimary, HeadingTertiary, TextPrimary } from "../../element";
import {
  CrossGridSection,
  BusinessProductCardSecondary,
  ProductCardTertiary,
} from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";
import { useNavigate } from "react-router-dom";

const ForBusiness = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getProduct(1, [0, 25000], "6543b4b81fe943768c546202", 0));
  }, [dispatch]);

  const data = {
    heroSection: {
      image:
        "https://www.ourforest.co.za/cdn/shop/files/Drone_view_of_forest.jpg?v=1688684438&width=1500",
      heading: "Make your business a force for good",
      text: "Plant a tree with each sale to offset your carbon footprint",
      actions: [
        {
          label: "Start planting",
          action: () => navigate("/collections/all"),
        },
        {
          label: "Book a meeting",
          action: () => (window.location.href = "mailto:info@ourforest.co.za"),
        },
      ],
    },

    whatCanWeDo: {
      heading: "What can we do for you",
      text: "We will help you meet your CSR goals and communicate these in a simple and effective way. You can choose to plant once-off or on a monthly basis.",
    },

    personalDashboard: {
      heading: "Personal dashboard",
      text: "We make it simple. We create a profile and impact dashboard with shareable resources that you can communicate to customers or engage your employees.",
      image:
        "https://www.ourforest.co.za/cdn/shop/files/Impact_dashboard_icon_bd9ac3ec-bd7c-4280-9dbf-0c2d6ffac3fd.jpg?v=1688851450&width=750",
      action: {
        label: "View example",
        action: () => navigate("/login"),
      },
    },

    onceOff: {
      heading: "Once-off options",
    },

    endlessPossibilities: {
      heading: "Endless possibilities",
      cards: [
        {
          heading: "Gift your trees",
          text: "A unique and timeless token for customers and staff alike.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/Apricottreeullustration.jpg?v=1687864579&width=400",
        },
        {
          heading: "Communicate your impact",
          text: "Use your impact to engage your target audience on your environmental contributions and milestones.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/Sharing_impact.jpg?v=1688851895&width=400",
        },
        {
          heading: "Compensate your emmissions",
          text: "Based on your carbon footprint we can estimate the number of trees required.",
          image:
            "https://www.ourforest.co.za/cdn/shop/files/CO2_icon_b2e846f3-ff7e-4dae-a6cd-72f410f37f4e.jpg?v=1688854476&width=400",
        },
      ],
    },

    HowItWork: {
      heading: "How does it work",
      text: "After getting in touch with us via info@ourforest.co.za we take you through the following steps.",
    },

    list: [
      {
        heading: "Choose a project",
        text: "Choose an impactful initiative in the country or area that most aligns with your ambitions or purpose. We can also help you make a choice based on your carbon footprint.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/Pin_drop_on_map_icon_1ef74fae-3ed9-432c-b813-ab46c1776e36.jpg?v=1688834536&width=750",
      },
      {
        heading: "Agree to no. of trees",
        text: "Based on your chosen carbon reduction goals, we can help you estimate the amount of trees needed.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/How_many_trees.jpg?v=1688834514&width=750",
      },
      {
        heading: "We set up your profile",
        text: "Sit back and relax whilst we get your personal dashboard ready for you to track the progress of your chosen initiative.",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/Impact_dashboard_icon_bd9ac3ec-bd7c-4280-9dbf-0c2d6ffac3fd.jpg?v=1688851450&width=750",
      },
      {
        heading: "Monitor and share your impact",
        text: "Engage and surprise your chosen audience with your impact, be they customers, clients or staff",
        image:
          "https://www.ourforest.co.za/cdn/shop/files/Sharing_impact.jpg?v=1688851895&width=750",
        action: {
          label: "Get in touch to kick-off your project",
          action: () => (window.location.href = "mailto:info@ourforest.co.za"),
        },
      },
    ],
  };

  return (
    <div>
      {/* hero section */}
      <div className="relative">
        <div
          className="w-full min-h-[340px] md:min-h-[560px] bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${data.heroSection.image})` }}
        ></div>
        {/* content */}
        <div className="md:absolute inset-0 w-full max-w-[900px] h-max bg-gradient-to-t from-colorPrimary from-1% to-colorTertiary to-20% text-center md:rounded-3xl overflow-hidden space-y-8 p-10 m-auto">
          <HeadingTertiary
            rootClass="text-colorSecondary leading-tight"
            text={data.heroSection.heading}
          />
          <TextPrimary
            rootClass="text-colorSecondary"
            text={data.heroSection.text}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            {data.heroSection.actions.map((button, index) => (
              <ButtonPrimary
                key={index}
                rootClass="!w-full sm:!w-max"
                label={button.label}
                handleClick={button.action}
              />
            ))}
          </div>
        </div>
      </div>

      {/* What can we do for you */}
      <div className="bg-colorFourth py-10 lg:py-16">
        <div className="w-11/12 md:w-8/12 max-w-[780px] m-auto text-center space-y-4">
          <HeadingTertiary
            rootClass="text-colorFifth"
            text={data.whatCanWeDo.heading}
          />
          <TextPrimary
            rootClass="text-colorSixth"
            text={data.whatCanWeDo.text}
          />
        </div>
      </div>

      {/* Personal dashboard */}
      <div className="w-11/12 max-w-[1100px] m-auto space-y-6 py-10 sm:py-20">
        <div className="grid grid-cols-12">
          {/* image */}
          <div className="col-span-12 lg:col-span-6">
            <img
              className="w-full h-auto rounded-2xl overflow-hidden shadow-2xl"
              src={data.personalDashboard.image}
              alt={data.personalDashboard.heading}
            />
          </div>
          {/* text */}
          <div className="col-span-12 lg:col-span-6 relative">
            <div className="relative -top-[10%] sm:-top-[20%] lg:top-[5%] lg:right-[5%] w-11/12 lg:w-[105%] h-max bg-gradient-to-t from-colorPrimary from-1% to-colorTertiary to-20% p-10 md:px-20 md:py-16 rounded-3xl space-y-3 m-auto">
              <HeadingTertiary
                rootClass="text-colorSecondary leading-tight"
                text={data.personalDashboard.heading}
              />
              <div className="space-y-8">
                <TextPrimary
                  rootClass="text-colorSecondary"
                  text={data.personalDashboard.text}
                />
                <ButtonPrimary
                  label={data.personalDashboard.action.label}
                  handleClick={data.personalDashboard.action.action}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {products && products?.length > 0 && (
        <div className="w-11/12 max-w-[1100px] m-auto space-y-10 py-10 sm:py-20">
          <HeadingTertiary
            rootClass="text-colorSecondary"
            text={data.onceOff.heading}
          />

          {/* cards */}
          <div className="grid md:grid-cols-2 grid-cols-2 lg:grid-cols-4 gap-2 md:gap-10">
            {products?.slice(0, 4).map((product) => (
              <ProductCardTertiary key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Endless possibilities */}
      <div className="w-11/12 max-w-[1100px] mx-auto space-y-8 py-14">
        <HeadingTertiary
          rootClass="text-colorSecondary"
          text="Endless possibilities"
        />

        {/* cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 ">
          {data.endlessPossibilities.cards.map((item, index) => (
            <BusinessProductCardSecondary key={index} data={item} />
          ))}
        </div>
      </div>

      {/* How does it work */}
      <div className="bg-colorFourth py-10 lg:py-16">
        <div className="w-11/12 md:w-8/12 max-w-[780px] m-auto text-center space-y-4">
          <HeadingTertiary
            rootClass="text-colorFifth"
            text={data.HowItWork.heading}
          />
          <TextPrimary rootClass="text-colorSixth" text={data.HowItWork.text} />
        </div>
      </div>

      {/* cross card listing */}
      <div className="w-11/12 max-w-[1100px] m-auto py-20">
        <CrossGridSection data={data.list} showSteps={true} />
      </div>
    </div>
  );
};

export default memo(ForBusiness);
