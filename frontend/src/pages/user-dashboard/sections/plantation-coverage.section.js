import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import _ from "lodash";
import TreeSvg from "../../../assets/images/tree-svg.svg";
import GiftSvg from "../../../assets/images/gift-svg.svg";
// import TonneSvg from "../../../assets/images/co2-reduce-svg.svg";
import TonneSvg from "../../../assets/images/co2-svgrepo-com.svg";
import mapSvg from "../../../assets/images/map.svg";
import mapSmallSvg from "../../../assets/images/map.png";
import mapPinSvg from "../../../assets/images/map-pin.svg";
import { Spinner } from "../../../element";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axios from "axios";
import useGetCountriesByIds from "../../../hooks/useGetCountriesById";
import numeral from "numeral";
import GoogleMapComponent from "./GoogleMapComponent";

const PlantationCoverage = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const [shouldRenderGoogleMap, setShouldRenderGoogleMap] = useState(true);

  const searchWord = "gift"; // The word you want to search for (case-insensitive)

  const onlyGifts = _.filter(props?.orders, (obj) => {
    return obj.name.toLowerCase().includes(searchWord.toLowerCase());
  });

  const data = [
    {
      name: "Planted",
      icon: TreeSvg,
      value: `${props?.userTotalTrees?.totalNoOfItems || 0} Tree${
        props?.userTotalTrees?.totalNoOfItems > 1 ? "s" : ""
      }`,
    },
    {
      name: "Gifted",
      icon: GiftSvg,
      value: `${onlyGifts[0]?.quantity || 0} Tree${
        onlyGifts[0]?.quantity > 1 ? "s" : ""
      }`,
    },
    {
      name: "Kilograms Absorbed",
      icon: TonneSvg,
      value: `${
        numeral(props?.userTotalTrees?.totalNoOfCo2 * 1000).format("0,0") || 0
      } CO2`,
    },
  ];

  const [allCountries, setAllCountries] = useState(null);

  async function getAllCountries() {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/countries`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("me res.datatatattatattat .......", data?.countries);
      setAllCountries(data?.countries);
    } catch (error) {
      //   setError(error.response.data.message);
      //   setLoading(false);
    }
  }

  useEffect(() => {
    getAllCountries();
  }, []);

  console.log(
    "Ge countreus00-------------",
    useGetCountriesByIds("654379ce1fe943768c5460f6")
  );

  const PIN_COMPONENT = ({ item, index }) => {
    const { countries } = useGetCountriesByIds(item.countries);

    return (
      <div className="cursor-pointer" key={index}>
        <img
          id={`abc${item?.product}`}
          src={mapPinSvg}
          alt="map pin"
          className={`${
            index === 0
              ? "w-4 md:w-5 top-0 left-3"
              : index === 1
              ? "w-4 md:w-5 top-2 right-0"
              : index === 2
              ? "w-4 md:w-6 bottom-3 left-0"
              : index === 3
              ? "w-4 md:w-6 bottom-0 right-2"
              : "w-4 md:w-7 inset-0 m-auto"
          } h-auto absolute`}
        />
        <Tooltip
          anchorSelect={`#abc${item?.product}`}
          place="top"
          clickable
          style={{
            zIndex: "200",
            background: "rgba(255,255,255,1)",
            borderRadius: "10px",
          }}
        >
          <div className="w-60 relative">
            {/* close icon */}
            {/* <div className="absolute top-4 right-4 bg-red-900">
                                                    <Icon icon="carbon:close-filled" />
                                                </div> */}
            {/* image */}
            <div
              className="w-full h-32 bg-colorPrimaryLight rounded-xl bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${imageBaseUrl + item?.image})` }}
            ></div>
            {/* content */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-colorFourth text-base font-bold capitalize">
                  {item?.quantity}x {item?.name}
                </h3>
                <div>
                  <p className="text-colorSecondaryLight text-xs capitalize">
                    Funded by you
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {!_.isEmpty(countries) && (
                  <div className="w-max bg-colorPrimaryLight text-colorFourth flex items-center space-x-0 px-2 py-px rounded">
                    <Icon icon="gridicons:location" className="w-3 h-auto" />
                    <ul className="text-xs capitalize flex items-center justify-center divide-x divide-colorSecondaryLight">
                      {countries &&
                        countries?.map((country) => (
                          <li key={country?._id} className="px-1">
                            {country?.name}
                          </li>
                        ))}
                    </ul>
                    {/* <p className="text-xs capitalize">location</p> */}
                  </div>
                )}
                {/* <div className="w-max bg-colorPrimaryLight text-colorFourth flex items-center space-x-1 px-2 py-px rounded">
                                    <Icon icon="gridicons:location" className='w-3 h-auto' />
                                    <p className="text-xs capitalize">location</p>
                                </div> */}
                <div>
                  {/* <p className="text-colorSecondaryLight text-xs font-light capitalize">date here</p> */}
                </div>
              </div>
              <p className="text-colorSecondaryLight text-xs capitalize">
                Unique ID: {item?.product}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  {/* <p className="text-colorSecondaryLight text-xs capitalize">Partner: Our Forest</p> */}
                </div>
                <Link to={`/product/${item?.product}`}>
                  <div className="w-max bg-colorPrimary text-colorFifth text-sm px-2 py-1 rounded-md cursor-pointer">
                    Learn More
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="bgGradientSecondary border border-colorPrimary space-y-20 p-6 md:p-12">
      {/* info */}
      <div className="flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0">
        <div>
          <h2 className="text-colorSecondary kalam text-3xl sm:text-4xl font-bold">
            Your Impact Map
            {/* <br /> */}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* card */}
          {data?.map((item, index) => (
            <div
              key={index}
              className="bg-colorFifth border border-colorPrimary flex items-center rounded-lg shadow-lg p-5 space-x-5"
            >
              {/* image */}
              <div>
                <div className="w-10 lg:w-14 h-10 lg:h-14 flex items-center justify-center border border-colorSecondaryLight rounded-full">
                  <img
                    src={item?.icon}
                    alt={item?.name}
                    className="w-5 lg:w-8 h-auto"
                  />
                </div>
              </div>
              {/* content */}
              <div>
                {props.totalTreesLoading && <Spinner rootClass="w-5 h-5" />}
                {!props.totalTreesLoading && !_.isUndefined(item?.value) && (
                  <h4 className="text-colorSecondary text-sm lg:text-base font-semibold whitespace-nowrap">
                    {item?.value}
                  </h4>
                )}
                <p className="text-colorSecondaryLight text-xs font-light">
                  {item?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* map */}
      {/* <div className="relative"> */}
      <div className="">
        <div>
          {/* <img
            src={mapSvg}
            alt="map"
            className="w-full h-auto hidden md:block"
          /> */}

          <GoogleMapComponent />
          {/* {props && <GoogleMapComponent />} */}
          {/* <img
            src={mapSmallSvg}
            alt="map"
            className="w-full h-auto block md:hidden"
          /> */}
        </div>
        {/* pins */}
        {/* <div className="absolute inset-0 w-full h-full grid grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="relative md:-left-20 w-20 h-20">
              {!_.isNil(props?.orders) &&
                !_.isNil(allCountries) &&
                props?.orders
                  ?.filter((e) => e?.countries[0] === allCountries[1]?._id)
                  .slice(0, 5)
                  .map((item, index) => (
                    <PIN_COMPONENT index={index} item={item} />
                  ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              {!_.isNil(props?.orders) &&
                !_.isNil(allCountries) &&
                props?.orders
                  ?.filter((e) => e?.countries[0] === allCountries[2]?._id)
                  .slice(0, 5)
                  .map((item, index) => (
                    <PIN_COMPONENT index={index} item={item} />
                  ))}
            </div>
          </div>
          <div className="flex items-start md:items-center justify-center">
            <div className="relative md:-right-10 w-20 h-20">
              {!_.isNil(props?.orders) &&
                !_.isNil(allCountries) &&
                props?.orders
                  ?.filter((e) => e?.countries[0] === allCountries[3]?._id)
                  .slice(0, 5)
                  .map((item, index) => (
                    <PIN_COMPONENT index={index} item={item} />
                  ))}
            </div>
          </div>
          <div className="flex items-center md:items-start justify-center md:justify-start">
            <div className="relative w-20 h-20">
              {!_.isNil(props?.orders) &&
                !_.isNil(allCountries) &&
                props?.orders
                  ?.filter((e) => e?.countries[0] === allCountries[4]?._id)
                  .slice(0, 5)
                  .map((item, index) => (
                    <PIN_COMPONENT index={index} item={item} />
                  ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default memo(PlantationCoverage);
