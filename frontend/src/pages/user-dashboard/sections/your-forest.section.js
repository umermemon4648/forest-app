import React, { memo, useEffect, useState } from "react";
import _ from "lodash";
import { Spinner } from "../../../element";
import OrderModalSection from "./order-modal.section";
import useGetCountriesByIds from "../../../hooks/useGetCountriesById";
import axios from "axios";

const YourForest = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [sortedOrders, setSortedOrders] = useState(props?.orders);

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  const [allCountries, setAllCountries] = useState(null);

  async function getAllCountries() {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/countries`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAllCountries(data?.countries);
    } catch (error) {
      setAllCountries([]);
    }
  }

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (!props.loading) {
      setSortedOrders(props?.orders);
    }
  }, [props.loading]);

  async function handleSortByCountry(e) {
    const selectedId = await e.target.value;
    const filterCountries = await props?.orders?.filter((e) =>
      e.countries.includes(selectedId)
    );
    setSortedOrders(e.target.value === "all" ? props?.orders : filterCountries);
  }

  const ProductCard = ({ order }) => {
    const { countries } = useGetCountriesByIds(order?.countries);
    return (
      <div
        onClick={() => {
          setSelectedOrder(order);
          setOpenModal(true);
        }}
        className="bg-colorFifth text-center border border-colorPrimary rounded-lg shadow-lg cursor-pointer p-5 relative"
      >
        {order?.type == "subscription" && (
          <div className="absolute bg-red-400 text-white top-[10px] right-0 px-4">
            Subscription
          </div>
        )}
        <img
          className="w-full h-auto"
          src={imageBaseUrl + order?.image}
          alt="mango"
        />
        <h4 className="text-colorSecondary text-base lg:text-lg font-bold">
          {order?.name}
        </h4>
        <ul className="text-colorSecondaryLight text-xs font-light capitalize flex items-center justify-center divide-x divide-colorSecondaryLight">
          {countries &&
            countries?.map((country) => (
              <li key={country?._id} className="px-1">
                {country?.name}
              </li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className=" p-6 md:p-12">
      {/* name and filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-colorSecondary kalam text-3xl sm:text-4xl font-bold">
            Your Forest
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* total */}
          <div className="flex items-center justify-center bg-colorFifth border border-colorPrimary rounded-lg shadow-lg py-1 px-2">
            <p className="text-colorSecondary text-sm font-bold">
              Total Trees: {props?.orders?.length || 0}
            </p>
          </div>

          {/* by country */}
          <div className="flex items-center justify-center bg-colorFifth border border-colorPrimary rounded-lg shadow-lg space-x-2 py-1 px-2">
            <p className="text-colorSecondary text-xs">By Country</p>
            <select
              onChange={handleSortByCountry}
              className="text-xs text-colorSecondary border border-colorPrimaryLight rounded-md focus:outline-none py-px"
            >
              <option value="all">All</option>
              {allCountries?.map((country) => (
                <option key={country?._id} value={country?._id}>
                  {country?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* loader */}
      {props.loading && (
        <div className="mt-12 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* empty */}
      {!props.loading && _.isEmpty(sortedOrders) && (
        <p className="kalam text-colorSecondaryLight text-base font-bold text-center">
          No order found!
        </p>
      )}

      {/* orders */}
      {!props.loading && !_.isEmpty(sortedOrders) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-12">
          {/* card */}
          {sortedOrders.map((order, index) => (
            <ProductCard order={order} key={index} />
          ))}
        </div>
      )}

      {/* selected order modal */}
      {openModal && (
        <OrderModalSection
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedOrder({});
          }}
          data={selectedOrder}
        />
      )}
    </div>
  );
};

export default memo(YourForest);
