import { useCallback, useRef, useState, useEffect, Fragment } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { FaTree } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { getLatLongForCountry } from "../../../data/data";
import { Dialog, Transition } from "@headlessui/react";
import MapPinSvg from "../../../assets/images/map-pin.svg";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import _ from "lodash";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const treeIconSvg = renderToStaticMarkup(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 128 128"
  >
    <path
      fill="#5b9821"
      d="M32 24.66s2.43-7.3 8.16-11.88s58.85 15.04 58.85 15.04s9.28 3.31 14.77 12.08c3.69 5.9 5.75 14.62 1.84 25.15c-9.32 25.08-33.5 22.18-39.8 20.75c-2.96-.67-10.17-2.58-10.17-2.58s-16.47 13.6-36.29 3.17c-15.09-7.94-13.22-19.81-13.22-19.81S5.98 56.42 10.38 42.27C15.68 25.23 32 24.66 32 24.66"
    ></path>
    <path
      fill="#8bc02b"
      d="M66.37 55.01c13.75-2.29 18.04-8.16 21.77-13.6c4.11-6 3.01-11.03 5.87-11.17s5.14 5.02 2 14.03c-4.44 12.74-13.57 14.61-13.75 18.04c-.14 2.72 9.72 2.91 18.62-1.43c12.89-6.3 12.89-21.05 12.89-21.05s-2.29-4.73-6.73-8.02s-7.74-5.01-7.74-5.01S94 6.9 69.95 3.6S36.01 17.07 36.01 17.07s.86 5.44 5.01 11.74c3.31 5.03 6.73 4.87 6.44 7.73c-.19 1.86-6.16 2.43-12.46-.29c-5.74-2.48-7.16-5.87-8.73-5.87S11.68 37.63 17.11 53c4.3 12.17 18.51 14.45 21.05 14.89c7.45 1.29 11.74-3.58 6.44-7.45s-11.17-6.16-9.88-10.02c1.39-4.18 6.35.18 12.31 2.76c5.89 2.55 13.02 2.89 19.34 1.83"
    ></path>
    <path
      fill="#6d4b41"
      d="M39.03 70.97s3.3-.19 4.66-.58c1.36-.39 3.2-1.55 3.2-1.55S59.64 82.18 60.96 83.3c1.29 1.09 2.81-15.53 2.81-15.53s2.91.45 5.63.02c3.58-.57 6.02-1.71 6.02-1.71S73.68 76.31 73 80.19c-.43 2.49-.58 9.41-.58 9.41l-9.32 7.76l-7.09-4.76s-.02-1.87-1.07-3.14c-3.26-3.94-15.91-18.49-15.91-18.49m32.51 22.81l7.09-8.54s2.52.19 4.37.19c1.84 0 5.05-.39 5.05-.39s-5.82 7.86-8.93 11.74c-3.11 3.88-7.18 8.74-7.18 8.74l-3.88-11.26z"
    ></path>
    <path
      fill="#865b50"
      d="M66.5 86.98c-2.9.26-10.48 5.63-10.48 5.63s.39 9.12.1 14.27s-2.32 13.56-.45 15.69c1.62 1.84 15.24 2.19 17.27.05c2.04-2.14.06-10.98.06-16.71s-.58-16.31-.58-16.31s-2.62-2.91-5.92-2.62"
    ></path>
  </svg>
);

const allCoordinates = [
  { lat: -17.8292, lng: 31.0522 },
  { lat: -20.1461, lng: 28.5845 },
  { lat: -18.9707, lng: 32.6709 },
  { lat: -19.4317, lng: 29.8185 },
];
const libraries = ["places"];
const mapContainerStyle = {
  width: "80vw",
  height: "80vh",
};

const calculateCenter = (coordinates) => {
  const totalCoordinates = coordinates.length;
  if (totalCoordinates === 0) return null;

  const sumLat = coordinates.reduce(
    (sum, coordinate) => sum + coordinate.lat,
    0
  );
  const sumLng = coordinates.reduce(
    (sum, coordinate) => sum + coordinate.lng,
    0
  );

  return {
    lat: sumLat / totalCoordinates,
    lng: sumLng / totalCoordinates,
  };
};

const PIN_COMPONENT = ({ products, index }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal((pre) => !pre);
  };
  const [selectedProduct, setSelectedProduct] = useState(null);

  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const { lat, lng } = getLatLongForCountry(products?.country?.name);

  return (
    <MarkerF
      icon={{
        url: `data:image/svg+xml;base64,${btoa(treeIconSvg)}`,
        scaledSize: new window.google.maps.Size(32, 32),
      }}
      className
      key={`abc${products?.product?._id}`}
      position={{ lat, lng }}
      onClick={() => {
        setSelectedProduct(products);
        setOpenModal(true);
      }}
    >
      <div
        id={`markerTooltip_${products?.uniqueId}`}
        className="cursor-pointer h-auto absolute"
      >
        {/* <img
          id={`abc${products?.product?._id}`}
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
        /> */}

        <Transition appear show={openModal} as={Fragment}>
          <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    {/* close button */}
                    <div
                      onClick={() => setOpenModal(false)}
                      className="text-colorFourth cursor-pointer my-2"
                    >
                      <Icon
                        icon="carbon:close-filled"
                        className="w-6 h-auto ml-auto"
                      />
                    </div>

                    <div className="w-56 mx-auto">
                      <div
                        className="w-full h-32 bg-colorPrimaryLight rounded-xl bg-cover bg-no-repeat bg-center object-contain"
                        style={{
                          backgroundImage: `url(${
                            imageBaseUrl + selectedProduct?.product?.images[0]
                          })`,
                        }}
                      ></div>
                      <div className="space-y-2 mt-2 flex flex-col justify-center items-center">
                        <h3 className="text-colorFourth text-base font-bold capitalize">
                          {selectedProduct?.product?.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <div className="w-max bg-colorPrimaryLight text-colorFourth flex items-center space-x-0 px-2 py-px rounded">
                            <Icon
                              icon="gridicons:location"
                              className="w-3 h-auto"
                            />
                            <ul className="text-xs capitalize flex items-center justify-center divide-x divide-colorSecondaryLight">
                              {selectedProduct?.country?.name}
                            </ul>
                          </div>
                        </div>
                        <p className="text-colorSecondaryLight text-xs capitalize">
                          Unique ID: {selectedProduct?.product?._id}
                        </p>
                        <div className="flex items-center justify-between">
                          <div></div>
                          <Link
                            to={`/product/${selectedProduct?.product?._id}`}
                          >
                            <div className="w-max bg-colorPrimary text-colorFifth text-sm px-2 py-1 rounded-md cursor-pointer">
                              Learn More
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* <Tooltip
          // anchorSelect={`#abc${products?.product?._id}`}
          anchorSelect={`#markerTooltip_${products?.uniqueId}`}
          place="top"
          clickable
          style={{
            zIndex: "200",
            background: "rgba(255,255,255,1)",
            borderRadius: "10px",
          }}
        >
          {selectedProduct && (
            <div className="w-60 relative">
              <div
                className="w-full h-32 bg-colorPrimaryLight rounded-xl bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    imageBaseUrl + selectedProduct?.product?.images[0]
                  })`,
                }}
              ></div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-colorFourth text-base font-bold capitalize">
                    {selectedProduct?.product?.name}
                  </h3>
                  <div>
                    <p className="text-colorSecondaryLight text-xs capitalize">
                      Funded by you
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-max bg-colorPrimaryLight text-colorFourth flex items-center space-x-0 px-2 py-px rounded">
                    <Icon icon="gridicons:location" className="w-3 h-auto" />
                    <ul className="text-xs capitalize flex items-center justify-center divide-x divide-colorSecondaryLight">
                      {"Pakistan"}
                    </ul>
                  </div>
                </div>
                <p className="text-colorSecondaryLight text-xs capitalize">
                  Unique ID: {4215551254}
                </p>
                <div className="flex items-center justify-between">
                  <div></div>
                  <Link to={`/product`}>
                    <div className="w-max bg-colorPrimary text-colorFifth text-sm px-2 py-1 rounded-md cursor-pointer">
                      Learn More
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Tooltip> */}
      </div>
    </MarkerF>
  );
};

const GoogleMapComponent = ({ orders }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBw5CuEoBenDv_rvAB5iOyQycCEToa3RLQ",
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
    },
    [orders?.productArray]
  );

  if (loadError) {
    console.error("Error loading maps:", loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const center = calculateCenter(allCoordinates);
  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
        onLoad={onMapLoad}
      >
        {/* {allCoordinates?.map((i, index) => (
          <MarkerF
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(treeIconSvg)}`,
              scaledSize: new window.google.maps.Size(25, 25), // Adjust the size as needed
            }}
            key={index}
            position={i}
          />
        ))} */}

        {orders?.productArray.length > 0 &&
          orders?.productArray &&
          orders?.productArray?.map((prod, index) => (
            <PIN_COMPONENT key={index} products={prod} index={index} />
          ))}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
