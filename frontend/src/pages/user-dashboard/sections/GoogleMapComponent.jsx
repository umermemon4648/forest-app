import { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { FaTree } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { BsTree } from "react-icons/bs";
const treeIconSvg = renderToStaticMarkup(
  <FaTree fontSize={12} color="green" />
);
// const treeIconSvg = renderToStaticMarkup(<BsTree color="green" />);

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

const zimbabweCoordinates = [
  { lat: -17.8292, lng: 31.0522 },
  { lat: -20.1461, lng: 28.5845 },
  { lat: -18.9707, lng: 32.6709 },
  { lat: -19.4317, lng: 29.8185 },
  { lat: -16.7921, lng: 29.391 }, // Additional location
  { lat: -18.8291, lng: 31.0523 }, // Additional location
  { lat: -20.5682, lng: 29.724 }, // Additional location
  { lat: -19.2085, lng: 29.7476 }, // Additional location
  { lat: -17.9842, lng: 31.1272 }, // Additional location
  { lat: -18.2567, lng: 29.8716 }, // Additional location
  { lat: -19.7568, lng: 30.796 }, // Additional location
  { lat: -17.8297, lng: 30.9401 }, // Additional location
  { lat: -20.2783, lng: 30.9875 }, // Additional location
  { lat: -18.4921, lng: 31.425 }, // Additional location
  { lat: -19.8245, lng: 29.1082 }, // Additional location
  { lat: -17.9174, lng: 31.476 }, // Additional location
  { lat: -20.0487, lng: 29.2309 }, // Additional location
  { lat: -18.1375, lng: 32.3447 }, // Additional location
  { lat: -19.3748, lng: 28.4775 }, // Additional location
  { lat: -17.6015, lng: 30.9287 }, // Additional location
  { lat: -20.1033, lng: 28.5761 }, // Additional location
];
const southArficaCoordinates = [
  { lat: -30.5595, lng: 22.9375 }, // Approximate coordinates for Bloemfontein
  { lat: -33.918, lng: 18.4233 }, // Cape Town
  { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  { lat: -29.8587, lng: 31.0218 }, // Durban
  { lat: -33.0292, lng: 27.8546 }, // East London
  { lat: -28.7416, lng: 24.7717 }, // Kimberley
  { lat: -25.7479, lng: 28.2293 }, // Pretoria
  { lat: -29.603, lng: 30.3378 }, // Pietermaritzburg
  { lat: -33.963, lng: 25.6022 }, // Port Elizabeth
  { lat: -26.7167, lng: 27.1 }, // Vereeniging

  { lat: -34.0522, lng: 18.4325 }, // Additional location
  { lat: -26.1952, lng: 28.0341 }, // Additional location
  { lat: -30.0296, lng: 30.971 }, // Additional location
  { lat: -25.7461, lng: 28.1881 }, // Additional location
  { lat: -33.968, lng: 25.6022 }, // Additional location
  { lat: -26.985, lng: 28.0568 }, // Additional location
  { lat: -32.3749, lng: 27.3928 }, // Additional location
  { lat: -27.0922, lng: 26.1866 }, // Additional location
  { lat: -30.5595, lng: 24.1945 }, // Additional location
  { lat: -31.6116, lng: 29.5288 }, // Additional location
];
const ethiopiaCoordinates = [
  { lat: 9.145, lng: 40.4897 }, // Addis Ababa
  { lat: 9.2791, lng: 38.8839 }, // Debre Zeit
  { lat: 9.5924, lng: 37.1241 }, // Ambo
  { lat: 9.0162, lng: 38.765 }, // Adama
  { lat: 10.9261, lng: 38.7233 }, // Bishoftu
  { lat: 8.978, lng: 38.7578 }, // Mojo
  { lat: 9.0852, lng: 38.725 }, // Dukem
  { lat: 10.9585, lng: 37.9969 }, // Modjo
  { lat: 9.1487, lng: 40.4981 }, // Yeka
  { lat: 9.135, lng: 40.4999 }, // Kirkos
  { lat: 9.0959, lng: 38.7395 }, // Gelan
  { lat: 9.32, lng: 39.1475 }, // Sebeta
  { lat: 9.2818, lng: 38.8126 }, // Burayu
  { lat: 9.2004, lng: 38.7223 }, // Akaki
  { lat: 9.0133, lng: 38.7616 }, // Bole
];

const mozambiqueCoordinates = [
  { lat: -25.9655, lng: 32.5832 }, // Manica
  { lat: -24.0232, lng: 35.3148 }, // Maxixe
  { lat: -25.0265, lng: 33.0982 }, // Dondo
  { lat: -24.3975, lng: 33.7314 }, // Macia
  { lat: -25.8508, lng: 32.6093 }, // Chokwe
  { lat: -25.0343, lng: 33.6413 }, // Vilanculos
  { lat: -24.007, lng: 34.7319 }, // Xai-Xai
  { lat: -25.0259, lng: 33.6536 }, // Massinga
  { lat: -24.0416, lng: 34.7373 }, // Inharrime
  { lat: -24.8944, lng: 33.4621 }, // Panda
  { lat: -24.5718, lng: 32.0429 }, // Chibuto
  { lat: -25.2186, lng: 33.7597 }, // Morrumbene
  { lat: -25.8814, lng: 32.606 }, // Guija
  { lat: -23.8646, lng: 35.3848 }, // Jangamo
  { lat: -25.4139, lng: 34.7251 }, // Zavala
];

const allCoordinates = [
  ...zimbabweCoordinates,
  //   ...southArficaCoordinates,
  //   ...ethiopiaCoordinates,
  //   ...mozambiqueCoordinates,
];

const GoogleMapComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBw5CuEoBenDv_rvAB5iOyQycCEToa3RLQ",
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
    },
    [allCoordinates]
  );

  if (loadError) {
    console.error("Error loading maps:", loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    console.log("Loading maps...");
    return <div>Loading maps</div>;
  }

  const center = calculateCenter(allCoordinates);
  console.log("center -------", center);

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
        onLoad={onMapLoad}
      >
        {allCoordinates?.map((i, index) => (
          //   <Marker key={index} position={i} />
          <MarkerF
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(treeIconSvg)}`,
              scaledSize: new window.google.maps.Size(25, 25), // Adjust the size as needed
            }}
            key={index}
            position={i}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;