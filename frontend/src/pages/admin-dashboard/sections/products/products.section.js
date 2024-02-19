import React, { Fragment, memo, useEffect, useState } from "react";
import _ from "lodash";
import { Spinner } from "../../../../element";
import axios from "axios";
import { Dialog, Disclosure, Listbox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { DateTime } from "luxon";
import useGetCategoriesByIds from "../../../../hooks/useGetCategoriesById";
import useGetCountriesByIds from "../../../../hooks/useGetCountriesById";
import { ConfirmModal } from "../../../../component";

const PRODUCTS = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState({ products: [] });
  const [allCategories, setAllCategories] = useState({ categories: [] });
  const [allCountries, setAllCountries] = useState({ countries: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  // const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const productTypes = ["simple", "variant", "subscription"];
  const validCouponDuration = ["once", "forever", "repeating"];

  const [selectedType, setSelectedType] = useState(productTypes[0]);
  const [couponDuration, setCouponDuration] = useState();

  const initialFormData = {
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    monthlyPrice: "",
    yearlyPrice: "",
    noOfItems: 1,
    categories: [],
    countries: [],
    images: [],
    user: props.user._id,
    productType: "",
  };

  const initialVariantsData = {
    type: "",
    options: [
      {
        name: "",
        price: "",
        stock: "",
      },
    ],
  };

  const initialMoreInfoData = {
    LOCAL: [{ heading: "", text: "", img: "" }],
    BENEFITS: [{ heading: "", ratio: "", img: "" }],
    CO2: {
      value: "",
      unit: "",
      distance: "",
      period: "",
      averageAnnual: "",
      img: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);

  const [variantsFormData, setVariantsFormData] = useState(initialVariantsData);

  const [moreInfoFormData, setMoreInfoFormData] = useState(initialMoreInfoData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateChange = (product) => {
    console.log("Existing categories:", product?.categories);
    console.log("Existing countries:", product?.countries);
    setUpdateProduct(true);
    setFormData({
      ...product,
      price: product?.simple?.price,
      salePrice: product?.simple?.salePrice,
      stock: product?.simple?.stock,
      monthlyPrice: product?.subscriptions?.monthlyPrice,
      yearlyPrice: product?.subscriptions?.yearlyPrice,
    });

    // Reset the selectedCategories and selectedCountries state
    setSelectedCategories([]);
    setSelectedCountries([]);

    setMoreInfoFormData(product?.moreinfo);
    setSelectedType(product?.productType);
    setVariantsFormData(
      _.isEmpty(product?.variants) ||
        _.isUndefined(product?.variants) ||
        !product?.variants
        ? initialVariantsData
        : product?.variants[0]
    );
    setOpenModal(true);
    setModalError(null);
  };

  const variantsHandleChange = (e, index) => {
    const { name, value } = e.target;

    setVariantsFormData((prevData) => {
      if (name === "type") {
        // Handle the 'type' field separately
        return {
          ...prevData,
          type: value,
        };
      } else {
        // Handle changes to the 'options' array
        const updatedOptions = [...prevData.options];
        updatedOptions[index] = {
          ...updatedOptions[index],
          [name]: value,
        };

        return {
          ...prevData,
          options: updatedOptions,
        };
      }
    });
  };

  const moreInfoHandleChange = (e) => {
    const { name, value } = e.target;

    // Use a regular expression to check if the property being updated is nested
    const nestedMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)/);

    if (nestedMatch) {
      const [, topLevelProp, index, nestedProp] = nestedMatch;
      setMoreInfoFormData((prevData) => ({
        ...prevData,
        [topLevelProp]: [
          ...prevData[topLevelProp].map((item, i) =>
            i === parseInt(index) ? { ...item, [nestedProp]: value } : item
          ),
        ],
      }));
    } else {
      setMoreInfoFormData((prevData) => ({
        ...prevData,
        CO2: { ...prevData.CO2, [name]: value },
      }));
    }
  };

  const createProductImagesChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input

    const fetchData = async () => {
      setModalError(null);

      const formImage = new FormData();
      formImage.append("image", file);

      try {
        const { data } = await axios.post(
          `${apiBaseUrl}/api/v1/upload`,
          formImage,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setFormData((old) => ({
          ...old,
          images: [...old.images, data.media.path],
        }));
      } catch (error) {
        setModalError(error.response.data.message);
      }
    };

    fetchData();
  };

  const handleMoreInfoImageChange = (e, propName, index) => {
    const file = e.target.files[0];

    const fetchData = async () => {
      setModalError(null);

      const formImage = new FormData();
      formImage.append("image", file);

      try {
        const { data } = await axios.post(
          `${apiBaseUrl}/api/v1/upload`,
          formImage,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (propName === "CO2") {
          setMoreInfoFormData((prevData) => ({
            ...prevData,
            CO2: {
              ...prevData.CO2,
              img: data.media.path, // Set the img property for the "CO2" section
            },
          }));
        } else {
          setMoreInfoFormData((prevData) => ({
            ...prevData,
            [propName]: [
              ...prevData[propName].map((item, i) =>
                i === index
                  ? { ...item, img: data.media.path } // Set the img property for the specified item
                  : item
              ),
            ],
          }));
        }
      } catch (error) {
        setModalError(error.response.data.message);
      }
    };

    fetchData();
  };

  const removeCreateProductImage = (indexToRemove) => {
    setFormData((oldFormData) => {
      const updatedImages = [...oldFormData.images]; // Create a copy of the images array
      updatedImages.splice(indexToRemove, 1); // Remove the image at the specified index

      return {
        ...oldFormData,
        images: updatedImages, // Update the images property with the new array
      };
    });
  };

  const removeCreateVariantsOptions = (indexToRemove) => {
    if (variantsFormData.options.length <= 1) return;

    setVariantsFormData((oldFormData) => {
      const updatedVariants = [...oldFormData.options];
      updatedVariants.splice(indexToRemove, 1);

      return {
        ...oldFormData,
        options: updatedVariants,
      };
    });
  };

  const removeCreateMoreInfoObjects = (indexToRemove, propName) => {
    if (moreInfoFormData[propName].length <= 1) return;

    setMoreInfoFormData((oldFormData) => {
      const updatedMoreInfos = [...oldFormData[propName]];
      updatedMoreInfos.splice(indexToRemove, 1);

      return {
        ...oldFormData,
        [propName]: updatedMoreInfos,
      };
    });
  };

  async function getAllProducts() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/v1/products?page=${currentPage}`,
        {
          headers: {
            // Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAllProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  async function getAllCategories() {
    setModalLoading(true);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/categories`, {
        headers: {
          // Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      setAllCategories(data);
      setSelectedCategories([data?.categories[0]]);
      setModalLoading(false);
    } catch (error) {
      setModalError(error.response.data.message);
      setModalLoading(false);
    }
  }

  async function getAllCountries() {
    setModalLoading(true);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/countries`, {
        headers: {
          // Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      setAllCountries(data);
      setSelectedCountries([data?.countries[0]]);
      setModalLoading(false);
    } catch (error) {
      setModalError(error.response.data.message);
      setModalLoading(false);
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();

    setModalLoading(true);
    setModalError(null);

    function isMoreInfoObjectEmpty(obj) {
      return (
        _.isEmpty(obj) ||
        (_.isObject(obj) && _.every(obj, isMoreInfoObjectEmpty))
      );
    }

    const isMoreInfoAllEmpty = await isMoreInfoObjectEmpty(moreInfoFormData);

    if (isMoreInfoAllEmpty && _.isEmpty(formData?.images)) {
      setModalLoading(false);
      setModalError("Product image required");
      return;
    } else if (
      !isMoreInfoAllEmpty &&
      (_.isEmpty(formData?.images) ||
        moreInfoFormData?.LOCAL[0]?.img === "" ||
        moreInfoFormData?.BENEFITS[0]?.img === "" ||
        moreInfoFormData?.CO2?.img === "")
    ) {
      setModalLoading(false);
      setModalError("Product image required or please check more info fields");
      return;
    }

    // if (formData.images == [] || moreInfoFormData.LOCAL[0].img === '' || moreInfoFormData.BENEFITS[0].img === '' || moreInfoFormData.CO2.img === '') {
    //     setModalLoading(false);
    //     setModalError('Please insert image');
    //     return;
    // };

    let createProductData = {};

    if (selectedType === "variant") {
      createProductData = {
        name: formData.name,
        description: formData.description,
        // price: parseFloat(formData.price),
        // salePrice: parseFloat(formData.salePrice),
        // stock: parseFloat(formData.stock),
        noOfItems: parseFloat(formData.noOfItems),
        categories: selectedCategories.map((category) => category._id),
        countries: selectedCountries.map((country) => country._id),
        images: formData.images,
        user: formData.user,
        productType: selectedType,
        moreinfo: isMoreInfoAllEmpty
          ? {}
          : {
              LOCAL: moreInfoFormData.LOCAL,
              BENEFITS: moreInfoFormData.BENEFITS,
              CO2: moreInfoFormData.CO2,
            },
        variants: [variantsFormData],
      };
    } else if (selectedType === "subscription") {
      createProductData = {
        name: formData.name,
        description: formData.description,
        subscriptions: {
          monthlyPrice: parseFloat(formData.monthlyPrice),
          yearlyPrice: parseFloat(formData.yearlyPrice),
        },
        noOfItems: parseFloat(formData.noOfItems),
        categories: selectedCategories.map((category) => category._id),
        countries: selectedCountries.map((country) => country._id),
        images: formData.images,
        user: formData.user,
        productType: selectedType,
        moreinfo: isMoreInfoAllEmpty
          ? {}
          : {
              LOCAL: moreInfoFormData.LOCAL,
              BENEFITS: moreInfoFormData.BENEFITS,
              CO2: moreInfoFormData.CO2,
            },
      };
    } else {
      createProductData = {
        name: formData.name,
        description: formData.description,

        // price: parseFloat(formData.price),
        // salePrice: parseFloat(formData.salePrice),
        // stock: parseFloat(formData.stock),

        simple: {
          price: parseFloat(formData.price),
          salePrice: parseFloat(formData.salePrice),
          stock: parseFloat(formData.stock),
        },

        noOfItems: parseFloat(formData.noOfItems),
        categories: selectedCategories.map((category) => category._id),
        countries: selectedCountries.map((country) => country._id),
        images: formData.images,
        user: formData.user,
        productType: selectedType,
        moreinfo: isMoreInfoAllEmpty
          ? {}
          : {
              LOCAL: moreInfoFormData.LOCAL,
              BENEFITS: moreInfoFormData.BENEFITS,
              CO2: moreInfoFormData.CO2,
            },
      };
    }

    if (updateProduct) {
      try {
        const response = await axios.put(
          `${apiBaseUrl}/api/v1/admin/product/${formData._id}`,
          createProductData,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalLoading(false);
        setOpenModal(false);
        setFormData(initialFormData);
        setMoreInfoFormData(initialMoreInfoData);
        setVariantsFormData(initialVariantsData);
        getAllProducts();
      } catch (error) {
        setModalError(error.response.data.message);
        setModalLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${apiBaseUrl}/api/v1/admin/product/new`,
          createProductData,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // create coupon

        if (
          couponState.duration &&
          couponState.percent &&
          couponState.couponCode
        ) {
          const res = await axios.post(`${apiBaseUrl}/api/v1/createCoupon`, {
            duration: couponState.duration,
            id: couponState.couponCode,
            percent_off: couponState.percent,
          });
          if (res.data.success === true) {
            console.log("coupon created");
          }
        }

        setModalLoading(false);
        setOpenModal(false);
        setFormData(initialFormData);
        setMoreInfoFormData(initialMoreInfoData);
        getAllProducts();
      } catch (error) {
        setModalError(error.response.data.message);
        setModalLoading(false);
      }
    }
  }

  async function handleDeleteProduct(id) {
    setModalLoading(true);
    setModalError(null);

    try {
      const response = await axios.delete(
        `${apiBaseUrl}/api/v1/admin/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setModalLoading(false);
      setOpenDeleteModal(false);
      getAllProducts();
    } catch (error) {
      setModalError(error.response.data.message);
      setModalLoading(false);
    }
  }

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllCountries();
  }, [currentPage]);

  const openModalForProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeModalForProduct = () => {
    setSelectedProduct(null);
  };

  const [couponState, setCouponState] = useState({
    percent: 0,
    couponCode: "",
    duration: "",
  });

  const handlePercentChange = (e) => {
    const percentValue = parseInt(e.target.value);
    setCouponState((prev) => ({ ...prev, percent: percentValue }));
  };
  const handleDurationChange = (value) => {
    setCouponState((prev) => ({ ...prev, duration: value }));
  };
  const handleCouponCodeChange = (e) => {
    setCouponState((prev) => ({ ...prev, couponCode: e.target.value }));
  };

  const VIEW_PRODUCT = () => {
    const { countries } = useGetCountriesByIds(selectedProduct?.countries);
    const { categories } = useGetCategoriesByIds(selectedProduct?.categories);

    const radius = 30;

    const emptySelectedMoreInfo =
      _.isEmpty(selectedProduct?.moreinfo?.LOCAL) &&
      _.isEmpty(selectedProduct?.moreinfo?.BENEFITS);

    return (
      <div>
        <Transition appear show={true} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[60]"
            onClose={closeModalForProduct}
          >
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
                  <div className="w-11/12 max-w-4xl bg-white rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                    {/* <Dialog.Title
                                            as="h3"
                                            className="text-xl font-medium leading-6 text-colorPrimary"
                                        >
                                            Product Information
                                        </Dialog.Title> */}
                    <div
                      className={`${
                        emptySelectedMoreInfo ? "grid-cols-1" : "grid-cols-2"
                      } mt-2 grid gap-6`}
                    >
                      <div className="w-full">
                        <h3 className="text-xl font-medium leading-6 text-colorPrimary">
                          Product Information
                        </h3>
                        <table>
                          <tbody>
                            {selectedProduct?.name && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Name
                                </td>
                                <td className="text-colorPrimary text-lg font-bold kalam">
                                  {selectedProduct?.name} (
                                  {selectedProduct?.productType})
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.description && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Description
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  <div className="max-h-40 overflow-auto">
                                    {selectedProduct?.description}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.images && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Images
                                </td>
                                <td>
                                  <div className="flex items-center space-x-4">
                                    {selectedProduct?.images.map((image) => (
                                      <div
                                        key={image._id}
                                        className="w-16 md:w-16 h-16 md:h-16 bg-cover bg-no-repeat bg-center rounded-2xl overflow-hidden"
                                        style={{
                                          backgroundImage: `url(${
                                            imageBaseUrl + image
                                          })`,
                                        }}
                                      ></div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.simple?.price && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Price
                                </td>
                                {selectedProduct?.simple?.salePrice &&
                                (!_.isNull(
                                  selectedProduct?.simple?.salePrice
                                ) ||
                                  !_.isNaN(
                                    selectedProduct?.simple?.salePrice
                                  )) ? (
                                  <td>
                                    <div className="flex items-center space-x-2">
                                      <p className="text-red-500 text-sm line-through">
                                        ${selectedProduct?.simple?.price}
                                      </p>
                                      <p className="text-colorPrimary font-bold">
                                        ${selectedProduct?.simple?.salePrice}
                                      </p>
                                    </div>
                                  </td>
                                ) : (
                                  <td className="text-colorPrimary font-bold">
                                    ${selectedProduct?.simple?.price}
                                  </td>
                                )}
                              </tr>
                            )}
                            {selectedProduct?.simple?.stock && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Stock
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  {selectedProduct?.simple?.stock}
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.variants &&
                              !_.isEmpty(selectedProduct?.variants) && (
                                <tr>
                                  <td className="align-top text-colorSecondaryLight text-sm">
                                    Variants
                                  </td>
                                  <td>
                                    <div className="text-colorSecondary text-xs">
                                      {selectedProduct?.variants[0].type}
                                    </div>
                                    <div className="flex items-start flex-wrap">
                                      {selectedProduct?.variants[0]?.options?.map(
                                        (variant) => (
                                          <div className="border border-colorSecondaryLight text-colorSecondaryLight text-xs px-1.5 py-1 m-1 rounded-md">
                                            <p>Name: {variant.name}</p>
                                            <p>Price: {variant.price}</p>
                                            <p>Stock: {variant.stock}</p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            {selectedProduct?.subscriptions?.monthlyPrice && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Monthly Price
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  {selectedProduct?.subscriptions?.monthlyPrice}
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.subscriptions?.yearlyPrice && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Yearly Price
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  {selectedProduct?.subscriptions?.yearlyPrice}
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.createdAt && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Created at
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  {DateTime.fromISO(
                                    selectedProduct?.createdAt
                                  ).toFormat("LLL dd, yyyy")}
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.countries && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Countries
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  <ul className="flex items-center flex-wrap divide-x divide-colorSecondaryLight capitalize">
                                    {countries?.map((country) => (
                                      <li
                                        key={country?._id}
                                        className="px-2 first:pl-0"
                                      >
                                        {country?.name}
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            )}
                            {selectedProduct?.categories && (
                              <tr>
                                <td className="align-top text-colorSecondaryLight text-sm">
                                  Categories
                                </td>
                                <td className="text-colorSecondaryLight text-sm">
                                  <ul className="flex items-center flex-wrap divide-x divide-colorSecondaryLight capitalize">
                                    {categories?.map((category) => (
                                      <li
                                        key={category?._id}
                                        className="px-2 first:pl-0"
                                      >
                                        {category?.name}
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {!emptySelectedMoreInfo && (
                        <div className="w-full">
                          <h3 className="text-xl font-medium leading-6 text-colorPrimary">
                            More Information
                          </h3>
                          <table>
                            <tbody>
                              {selectedProduct?.moreinfo?.LOCAL && (
                                <tr>
                                  <td className="align-top text-colorSecondaryLight text-sm">
                                    Local uses
                                  </td>
                                  <td>
                                    <div className="max-h-44 space-y-4 overflow-auto">
                                      {selectedProduct?.moreinfo?.LOCAL.map(
                                        (item) => (
                                          <div
                                            key={item._id}
                                            className="flex items-start space-x-2"
                                          >
                                            {/* image */}
                                            <img
                                              className="w-12 h-auto"
                                              src={imageBaseUrl + item.img}
                                              alt={item.heading}
                                            />
                                            {/* <div className="w-16 md:w-16 h-16 md:h-16 bg-cover bg-no-repeat bg-center rounded-2xl overflow-hidden" style={{ backgroundImage: `url(${imageBaseUrl + item.img})` }}></div> */}
                                            {/* content */}
                                            <div className="flex-1">
                                              <h4 className="text-colorPrimary text-sm font-bold">
                                                {item.heading}
                                              </h4>
                                              <p className="text-colorSecondaryLight text-xs">
                                                {item.text}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {selectedProduct?.moreinfo?.CO2 && (
                                <tr>
                                  <td className="align-top text-colorSecondaryLight text-sm">
                                    CO<sub>2</sub> absorbed
                                  </td>
                                  <td className="text-colorSecondaryLight text-sm">
                                    <div className="max-h-44 overflow-auto space-y-2">
                                      {/* image and text */}
                                      <div className="flex items-center justify-start space-x-3">
                                        <div
                                          className="w-16 md:w-16 h-16 md:h-16 bg-cover bg-no-repeat bg-center rounded-full overflow-hidden"
                                          style={{
                                            backgroundImage: `url(${
                                              imageBaseUrl +
                                              selectedProduct?.moreinfo?.CO2.img
                                            })`,
                                          }}
                                        ></div>
                                        <div className="flex-1">
                                          <p className="text-colorSecondaryLight text-sm uppercase">
                                            <span className="text-3xl font-bold text-colorFourth">
                                              {
                                                selectedProduct?.moreinfo?.CO2
                                                  ?.value
                                              }
                                            </span>{" "}
                                            {
                                              selectedProduct?.moreinfo?.CO2
                                                ?.unit
                                            }{" "}
                                            of CO2
                                          </p>
                                          <p className="text-colorSecondaryLight text-xs">
                                            equal to that produced by{" "}
                                            <span className="text-colorFourth font-semibold">
                                              {
                                                selectedProduct?.moreinfo?.CO2
                                                  ?.distance
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      {/* text */}
                                      <table className="border-0">
                                        <tbody>
                                          <tr>
                                            <td className="text-xs text-colorFourth font-semibold border-0">
                                              CO2 compensation Period
                                            </td>
                                            <td className="text-xs text-colorSecondaryLight border-0">
                                              {
                                                selectedProduct?.moreinfo?.CO2
                                                  ?.period
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="text-xs text-colorFourth font-semibold border-0">
                                              Average annual compensation
                                            </td>
                                            <td className="text-xs text-colorSecondaryLight border-0">
                                              {
                                                selectedProduct?.moreinfo?.CO2
                                                  ?.averageAnnual
                                              }
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {selectedProduct?.moreinfo?.BENEFITS && (
                                <tr>
                                  <td className="align-top text-colorSecondaryLight text-sm">
                                    Benefits
                                  </td>
                                  <td>
                                    <div className="max-h-44 space-y-4 overflow-auto">
                                      {selectedProduct?.moreinfo?.BENEFITS.map(
                                        (item) => (
                                          <div
                                            key={item._id}
                                            className="flex items-center space-x-2"
                                          >
                                            {/* range & image */}
                                            <div className="relative">
                                              <svg
                                                className="relative z-10"
                                                style={{
                                                  width: radius * 2.2,
                                                  height: radius * 2.2,
                                                }}
                                              >
                                                <circle
                                                  className="text-gray-300"
                                                  strokeWidth="6"
                                                  stroke="currentColor"
                                                  fill="transparent"
                                                  r={radius}
                                                  cx={radius * 1.1}
                                                  cy={radius * 1.1}
                                                />
                                                <circle
                                                  className="text-colorPrimary"
                                                  strokeWidth="6"
                                                  strokeDasharray={
                                                    2 * Math.PI * radius
                                                  }
                                                  strokeDashoffset={
                                                    2 * Math.PI * radius -
                                                    (item.ratio / 10) *
                                                      (2 * Math.PI * radius)
                                                  }
                                                  strokeLinecap="round"
                                                  stroke="currentColor"
                                                  fill="transparent"
                                                  r={radius}
                                                  cx={radius * 1.1}
                                                  cy={radius * 1.1}
                                                />
                                              </svg>
                                              {/* image */}
                                              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white rounded-full overflow-hidden p-3">
                                                <img
                                                  className="w-7 h-auto m-auto"
                                                  src={imageBaseUrl + item.img}
                                                  alt={item.heading}
                                                />
                                                {/* <div className="w-full h-full bg-cover bg-no-repeat bg-center rounded-full overflow-hidden" style={{ backgroundImage: `url(${imageBaseUrl + item.img})` }}></div> */}
                                              </div>
                                            </div>
                                            {/* content */}
                                            <div>
                                              <h4 className="text-colorPrimary text-sm font-bold">
                                                {item.heading}
                                              </h4>
                                              <p className="text-colorSecondaryLight text-xs">
                                                {item.ratio} / 10
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModalForProduct}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="bg-colorSeventh p-10">
      <div className="flex items-center space-x-2">
        <h3 className="flex-1 text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">
          Products
        </h3>
        <button
          onClick={() => {
            setOpenModal(true);
            setUpdateProduct(false);
          }}
          className="buttonPrimary"
        >
          Create new
        </button>
      </div>
      {/* loader */}
      {loading && (
        <div className="flex items-center justify-center mt-5">
          <Spinner rootClass="w-8 h-8" />
        </div>
      )}

      {/* content */}
      {!loading && allProducts.products && allProducts.products.length > 0 ? (
        <div className="mt-5">
          <p className="text-colorSecondaryLight text-left">
            Products {allProducts.filteredProductsCount} /{" "}
            {allProducts.productsCount}
          </p>

          {/* card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-5">
            {allProducts.products.map((product) => (
              <div
                key={product._id}
                className="text-center space-y-2 group cursor-default"
              >
                {/* images */}
                <div className="relative w-full aspect-square bg-colorFifth rounded-xl shadow group-hover:shadow-2xl overflow-hidden transition-all ease-in-out duration-150">
                  <div
                    className="w-full h-full bg-no-repeat bg-center bg-cover opacity-100 group-hover:opacity-0 transition-all ease-in-out duration-300"
                    style={{
                      backgroundImage: `url(${
                        imageBaseUrl + product.images[0]
                      })`,
                    }}
                  ></div>
                  {/* second images */}
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all ease-in-out duration-700"
                    style={{
                      backgroundImage: `url(${
                        product.images[1]
                          ? imageBaseUrl + product.images[1]
                          : imageBaseUrl + product.images[0]
                      })`,
                    }}
                  ></div>

                  {/* actions */}
                  <div className="absolute top-2 right-0 rounded-l-full bg-colorFourth flex items-center space-x-2 translate-x-full group-hover:translate-x-0 transition-all ease-in-out duration-200 px-4 py-2">
                    {/* view */}
                    <div
                      onClick={() => {
                        openModalForProduct(product);
                        setModalError(null);
                      }}
                      className="w-6 h-6 bg-transparent hover:bg-colorPrimary border border-colorFifth hover:border-colorPrimary text-colorFifth rounded-full p-1 cursor-pointer"
                    >
                      <Icon icon="carbon:view" className="w-full h-auto" />
                    </div>
                    {/* edit */}
                    <div
                      onClick={() => handleUpdateChange(product)}
                      className="w-6 h-6 bg-transparent hover:bg-colorPrimary border border-colorFifth hover:border-colorPrimary text-colorFifth rounded-full p-1 cursor-pointer"
                    >
                      <Icon icon="mi:edit-alt" className="w-full h-auto" />
                    </div>
                    {/* delete */}
                    <div
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setDeleteProductId(product._id);
                        setModalError(null);
                      }}
                      className="w-6 h-6 bg-transparent hover:bg-red-500 border border-colorFifth hover:border-red-500 text-colorFifth rounded-full p-1 cursor-pointer"
                    >
                      <Icon
                        icon="fluent:delete-48-regular"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-0">
                  <h3 className="text-colorSecondary kalam text-lg font-bold tracking-wide">
                    {product.name}
                  </h3>
                  {/* <p className="text-colorSecondary text-xs font-light uppercase tracking-wide">Our Forest</p> */}
                  {product.productType === "variant" &&
                    product?.variants[0]?.options[0]?.price && (
                      <p className="text-colorSecondary text-sm tracking-wide">
                        $ {product?.variants[0]?.options[0]?.price} USD
                      </p>
                    )}
                  {product.productType === "simple" &&
                    product?.simple?.price && (
                      <p className="text-colorSecondary text-sm tracking-wide">
                        $ {product?.simple?.price} USD
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="mt-10">
            <ul className="flex items-center justify-center space-x-2">
              {Array.from(
                {
                  length: Math.ceil(
                    allProducts?.productsCount / allProducts?.resultPerPage
                  ),
                },
                (_, index) => (
                  <li
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-7 h-7 flex items-center justify-center text-sm border rounded-full cursor-pointer ${
                      currentPage === index + 1
                        ? "border-colorPrimary bg-colorPrimary text-colorFifth"
                        : "border-colorSecondaryLight bg-transparent text-colorSecondaryLight"
                    }`}
                  >
                    <p>{index + 1}</p>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      ) : (
        <p className="text-colorSecondaryLight text-left text-lg mt-5">
          No product found!
        </p>
      )}

      {/* View Product Modal */}
      {selectedProduct && <VIEW_PRODUCT />}

      {/* create update product modal */}
      {openModal && (
        <div>
          <Transition appear show={openModal} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-[60]"
              onClose={() => setOpenModal(false)}
            >
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
                    <div className="w-11/12 max-w-xl bg-white rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                      <form onSubmit={handleCreateProduct}>
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-medium leading-6 text-colorPrimary"
                        >
                          {updateProduct
                            ? "Update product"
                            : "Create new product"}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="grid grid-cols-2 gap-4">
                            {/* name */}
                            <div className="col-span-2 sm:col-span-2">
                              <label className="text-colorSecondaryLight text-sm">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                onChange={handleChange}
                                value={formData?.name}
                                placeholder="Enter product name"
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* description */}
                            <div className="col-span-2 sm:col-span-2">
                              <label className="text-colorSecondaryLight text-sm">
                                Description
                              </label>
                              <textarea
                                required
                                name="description"
                                onChange={handleChange}
                                value={formData?.description}
                                placeholder="Enter description"
                                rows={3}
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              ></textarea>
                            </div>
                            {/* product type */}
                            <div className="col-span-2 sm:col-span-2">
                              <label className="text-colorSecondaryLight text-sm">
                                Product type
                              </label>
                              <Listbox
                                value={selectedType}
                                onChange={setSelectedType}
                              >
                                {({ open }) => (
                                  <div className="relative">
                                    <Listbox.Button className="relative w-full border border-colorSecondary/20 cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none text-xs sm:text-sm">
                                      <span className="block truncate">
                                        {selectedType}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <Icon
                                          icon="heroicons:chevron-up-down-solid"
                                          className="w-4 h-4"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                                        {productTypes.map((type, index) => (
                                          <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                  ? "bg-colorPrimary text-colorFifth"
                                                  : "text-colorSecondary"
                                              }`
                                            }
                                            value={type} // Use the category name as the value
                                          >
                                            {({ selected }) => (
                                              <>
                                                <span
                                                  className={`block truncate ${
                                                    selected
                                                      ? "font-medium"
                                                      : "font-normal"
                                                  }`}
                                                >
                                                  {type}
                                                </span>
                                                {selected ? (
                                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-colorFourth">
                                                    <Icon
                                                      icon="ph:check"
                                                      className="h-5 w-5"
                                                    />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                )}
                              </Listbox>
                            </div>
                            {selectedType === "simple" && (
                              <>
                                {/* price */}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Price
                                  </label>
                                  <input
                                    type="number"
                                    name="price"
                                    required
                                    onChange={handleChange}
                                    value={formData?.price}
                                    placeholder="Enter product price"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                {/* sale price */}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Sale price
                                  </label>
                                  <input
                                    type="number"
                                    name="salePrice"
                                    onChange={handleChange}
                                    value={formData?.salePrice}
                                    placeholder="Enter sale price"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                {/* stock */}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Stock
                                  </label>
                                  <input
                                    type="number"
                                    name="stock"
                                    required
                                    onChange={handleChange}
                                    value={formData?.stock}
                                    placeholder="Enter product stock"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                              </>
                            )}
                            {/* variants */}
                            {selectedType === "variant" && (
                              <div className="col-span-2 border border-colorPrimary rounded-xl p-4">
                                <h3 className="text-colorSecondary text-sm capitalize">
                                  Variants
                                </h3>
                                <div className="mt-2 space-y-2 divide-y divide-colorPrimary">
                                  <input
                                    type="text"
                                    name="type"
                                    required
                                    onChange={variantsHandleChange}
                                    value={variantsFormData?.type}
                                    placeholder="Variants main title"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                  {variantsFormData?.options?.map(
                                    (item, index) => (
                                      <div
                                        key={index}
                                        className="grid grid-cols-2 gap-2 py-2"
                                      >
                                        <div className="col-span-2 flex items-center space-x-2">
                                          <input
                                            type="text"
                                            name={`name`}
                                            required
                                            onChange={(e) =>
                                              variantsHandleChange(e, index)
                                            }
                                            value={
                                              variantsFormData.options[index]
                                                .name
                                            }
                                            placeholder="Variant name"
                                            className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                          />
                                          <div
                                            onClick={() =>
                                              removeCreateVariantsOptions(index)
                                            }
                                            className="w-5 h-5 flex items-center justify-center text-red-500 border border-red-500 rounded-full cursor-pointer"
                                          >
                                            <Icon
                                              icon="iconamoon:close-light"
                                              className="w-full h-auto"
                                            />
                                          </div>
                                        </div>
                                        <input
                                          type="number"
                                          name={`price`}
                                          required
                                          onChange={(e) =>
                                            variantsHandleChange(e, index)
                                          }
                                          value={
                                            variantsFormData.options[index]
                                              .price
                                          }
                                          placeholder="Variant price"
                                          className="col-span-2 sm:col-span-1 appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                        />
                                        <input
                                          type="number"
                                          name={`stock`}
                                          required
                                          onChange={(e) =>
                                            variantsHandleChange(e, index)
                                          }
                                          value={
                                            variantsFormData.options[index]
                                              .stock
                                          }
                                          placeholder="Variant stock"
                                          className="col-span-2 sm:col-span-1 appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                        />
                                      </div>
                                    )
                                  )}
                                  <div
                                    className="w-max text-colorPrimary py-2 cursor-pointer"
                                    onClick={() =>
                                      setVariantsFormData((prevData) => ({
                                        ...prevData,
                                        options: [
                                          ...prevData?.options,
                                          { name: "", price: "", stock: "" },
                                        ],
                                      }))
                                    }
                                  >
                                    +Add
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedType === "subscription" && (
                              <>
                                {/* monthlyPrice price */}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Monthly Price
                                  </label>
                                  <input
                                    type="number"
                                    name="monthlyPrice"
                                    required
                                    onChange={handleChange}
                                    value={formData?.monthlyPrice}
                                    placeholder="Enter monthly price"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                {/* yearlyPrice price */}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Yearly Price
                                  </label>
                                  <input
                                    type="number"
                                    name="yearlyPrice"
                                    onChange={handleChange}
                                    value={formData?.yearlyPrice}
                                    placeholder="Enter yearly price"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                {/* change here*/}
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Percent Off (0 - 100)
                                  </label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    onChange={handlePercentChange}
                                    placeholder="Enter Discount percentage"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Coupon Code
                                  </label>
                                  <input
                                    type="text"
                                    onChange={handleCouponCodeChange}
                                    placeholder="Enter Coupon Code"
                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                  />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                  <label className="text-colorSecondaryLight text-sm">
                                    Valid Coupon Duration
                                  </label>
                                  <Listbox onChange={handleDurationChange}>
                                    {({ open }) => (
                                      <div className="relative">
                                        <Listbox.Button className="relative w-full border border-colorSecondary/20 cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none text-xs sm:text-sm">
                                          <span className="block truncate">
                                            {couponState.duration ||
                                              "Select Duration"}
                                          </span>

                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <Icon
                                              icon="heroicons:chevron-up-down-solid"
                                              className="w-4 h-4"
                                            />
                                          </span>
                                        </Listbox.Button>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                                            {validCouponDuration.map(
                                              (type, index) => (
                                                <Listbox.Option
                                                  key={index}
                                                  className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                      active
                                                        ? "bg-colorPrimary text-colorFifth"
                                                        : "text-colorSecondary"
                                                    }`
                                                  }
                                                  value={type} // Use the category name as the value
                                                >
                                                  {({ selected }) => (
                                                    <>
                                                      <span
                                                        className={`block truncate ${
                                                          selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                        }`}
                                                      >
                                                        {type}
                                                      </span>
                                                      {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-colorFourth">
                                                          <Icon
                                                            icon="ph:check"
                                                            className="h-5 w-5"
                                                          />
                                                        </span>
                                                      ) : null}
                                                    </>
                                                  )}
                                                </Listbox.Option>
                                              )
                                            )}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    )}
                                  </Listbox>
                                </div>
                              </>
                            )}
                            {/* noOfItems */}
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-colorSecondaryLight text-sm">
                                No of trees (for business e.g: 50, 100)
                              </label>
                              <input
                                type="number"
                                name="noOfItems"
                                required
                                onChange={handleChange}
                                value={formData?.noOfItems}
                                placeholder="Enter number of trees"
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* categories */}
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-colorSecondaryLight text-sm">
                                Categories
                              </label>
                              <Listbox
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                                multiple
                              >
                                {({ open }) => (
                                  <div className="relative">
                                    <Listbox.Button className="relative w-full border border-colorSecondary/20 cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none text-xs sm:text-sm">
                                      <span className="block truncate">
                                        {selectedCategories?.length === 0
                                          ? "Select categories..."
                                          : selectedCategories
                                              .map((category) => category.name)
                                              .join(", ")}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <Icon
                                          icon="heroicons:chevron-up-down-solid"
                                          className="w-4 h-4"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                                        {allCategories?.categories?.map(
                                          (category) => (
                                            <Listbox.Option
                                              key={category?._id}
                                              className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                  active
                                                    ? "bg-colorPrimary text-colorFifth"
                                                    : "text-colorSecondary"
                                                }`
                                              }
                                              value={category} // Use the category name as the value
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span
                                                    className={`block truncate ${
                                                      selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                    }`}
                                                  >
                                                    {category?.name}
                                                  </span>
                                                  {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-colorFourth">
                                                      <Icon
                                                        icon="ph:check"
                                                        className="h-5 w-5"
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          )
                                        )}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                )}
                              </Listbox>
                            </div>
                            {/* countries */}
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-colorSecondaryLight text-sm">
                                Countries
                              </label>
                              <Listbox
                                value={selectedCountries}
                                onChange={setSelectedCountries}
                                multiple
                              >
                                {({ open }) => (
                                  <div className="relative">
                                    <Listbox.Button className="relative w-full border border-colorSecondary/20 cursor-default rounded-lg py-2 pl-4 pr-10 text-left focus:outline-none text-xs sm:text-sm">
                                      <span className="block truncate">
                                        {selectedCountries?.length === 0
                                          ? "Select categories..."
                                          : selectedCountries
                                              .map((country) => country.name)
                                              .join(", ")}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <Icon
                                          icon="heroicons:chevron-up-down-solid"
                                          className="w-4 h-4"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                                        {allCountries?.countries?.map(
                                          (country) => (
                                            <Listbox.Option
                                              key={country?._id}
                                              className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                  active
                                                    ? "bg-colorPrimary text-colorFifth"
                                                    : "text-colorSecondary"
                                                }`
                                              }
                                              value={country}
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span
                                                    className={`block truncate ${
                                                      selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                    }`}
                                                  >
                                                    {country?.name}
                                                  </span>
                                                  {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-colorFourth">
                                                      <Icon
                                                        icon="ph:check"
                                                        className="h-5 w-5"
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          )
                                        )}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                )}
                              </Listbox>
                            </div>

                            {/* images */}
                            <div className="col-span-2 sm:col-span-2 space-y-1">
                              <div>
                                <label className="text-colorSecondaryLight text-sm">
                                  Products images
                                </label>
                              </div>
                              <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={createProductImagesChange}
                                multiple
                                className="text-sm text-colorSecondaryLight"
                              />
                              <div className="flex items-center flex-wrap space-x-2">
                                {formData.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="relative w-16 md:w-16 h-16 md:h-16 bg-cover bg-no-repeat bg-center rounded-xl overflow-hidden"
                                    style={{
                                      backgroundImage: `url(${
                                        imageBaseUrl + image
                                      })`,
                                    }}
                                  >
                                    <div className="absolute top-0.5 right-0.5">
                                      <Icon
                                        onClick={() =>
                                          removeCreateProductImage(index)
                                        }
                                        icon="carbon:close"
                                        className="w-5 h-5 bg-white text-black rounded-full cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* more info */}
                            <div className="col-span-2">
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-colorPrimary/10 px-4 py-2 text-left text-sm font-medium text-colorPrimary focus:outline-none">
                                      <span>Add more information</span>
                                      <Icon
                                        icon="ci:chevron-down"
                                        className={`${
                                          open ? "rotate-180" : "rotate-0"
                                        } w-5 h-5 transition-all ease-in-out duration-300`}
                                      />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="pt-1">
                                      <div className="space-y-2">
                                        {/* local uses */}
                                        <div className="border border-colorPrimary rounded-xl p-4 space-y-1">
                                          <h3 className="text-colorSecondary text-sm capitalize">
                                            Local uses
                                          </h3>
                                          <div className="divide-y-2 divide-colorPrimary">
                                            {moreInfoFormData.LOCAL.map(
                                              (item, index) => (
                                                <div
                                                  key={index}
                                                  className="space-y-2 py-2"
                                                >
                                                  <div className="flex items-center space-x-2">
                                                    <input
                                                      type="text"
                                                      name={`LOCAL[${index}].heading`}
                                                      required={open}
                                                      onChange={
                                                        moreInfoHandleChange
                                                      }
                                                      value={
                                                        moreInfoFormData.LOCAL[
                                                          index
                                                        ].heading
                                                      }
                                                      placeholder="Enter title"
                                                      className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                                    />
                                                    <div
                                                      onClick={() =>
                                                        removeCreateMoreInfoObjects(
                                                          index,
                                                          "LOCAL"
                                                        )
                                                      }
                                                      className="w-5 h-5 flex items-center justify-center text-red-500 border border-red-500 rounded-full cursor-pointer"
                                                    >
                                                      <Icon
                                                        icon="iconamoon:close-light"
                                                        className="w-full h-auto"
                                                      />
                                                    </div>
                                                  </div>
                                                  <textarea
                                                    required={open}
                                                    name={`LOCAL[${index}].text`}
                                                    onChange={
                                                      moreInfoHandleChange
                                                    }
                                                    value={
                                                      moreInfoFormData.LOCAL[
                                                        index
                                                      ].text
                                                    }
                                                    placeholder="Enter description"
                                                    rows={2}
                                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                                  ></textarea>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="file"
                                                      name={`LOCAL[${index}].img`}
                                                      accept="image/*"
                                                      onChange={(e) =>
                                                        handleMoreInfoImageChange(
                                                          e,
                                                          "LOCAL",
                                                          index
                                                        )
                                                      }
                                                      className="text-sm text-colorSecondaryLight"
                                                    />
                                                    {item.img && (
                                                      <div>
                                                        <img
                                                          className="h-10 w-auto"
                                                          src={
                                                            imageBaseUrl +
                                                            item.img
                                                          }
                                                          alt={item.heading}
                                                        />
                                                        {/* <div className="w-10 h-10 bg-cover bg-no-repeat bg-center rounded-lg" style={{ backgroundImage: `url(${imageBaseUrl + item.img})` }}></div> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                            <div
                                              className="w-max text-colorPrimary py-2 cursor-pointer"
                                              onClick={() =>
                                                setMoreInfoFormData(
                                                  (prevData) => ({
                                                    ...prevData,
                                                    LOCAL: [
                                                      ...prevData.LOCAL,
                                                      {
                                                        heading: "",
                                                        text: "",
                                                        img: "",
                                                      },
                                                    ],
                                                  })
                                                )
                                              }
                                            >
                                              +Add
                                            </div>
                                          </div>
                                        </div>
                                        {/* Benefites */}
                                        <div className="border border-colorPrimary rounded-xl p-4 space-y-1">
                                          <h3 className="text-colorSecondary text-sm capitalize">
                                            Benefites
                                          </h3>
                                          <div className="divide-y-2 divide-colorPrimary">
                                            {moreInfoFormData.BENEFITS.map(
                                              (item, index) => (
                                                <div
                                                  key={index}
                                                  className="space-y-2 py-2"
                                                >
                                                  <div className="flex items-center space-x-2">
                                                    <input
                                                      type="text"
                                                      name={`BENEFITS[${index}].heading`}
                                                      required={open}
                                                      onChange={
                                                        moreInfoHandleChange
                                                      }
                                                      value={
                                                        moreInfoFormData
                                                          .BENEFITS[index]
                                                          .heading
                                                      }
                                                      placeholder="Enter title"
                                                      className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                                    />
                                                    <div
                                                      onClick={() =>
                                                        removeCreateMoreInfoObjects(
                                                          index,
                                                          "BENEFITS"
                                                        )
                                                      }
                                                      className="w-5 h-5 flex items-center justify-center text-red-500 border border-red-500 rounded-full cursor-pointer"
                                                    >
                                                      <Icon
                                                        icon="iconamoon:close-light"
                                                        className="w-full h-auto"
                                                      />
                                                    </div>
                                                  </div>
                                                  <input
                                                    type="number"
                                                    name={`BENEFITS[${index}].ratio`}
                                                    required={open}
                                                    onChange={
                                                      moreInfoHandleChange
                                                    }
                                                    value={
                                                      moreInfoFormData.BENEFITS[
                                                        index
                                                      ].ratio
                                                    }
                                                    placeholder="Set ratio 0 out of 10"
                                                    className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                                  />
                                                  <div className="flex items-center">
                                                    <input
                                                      type="file"
                                                      name={`BENEFITS[${index}].img`}
                                                      accept="image/*"
                                                      onChange={(e) =>
                                                        handleMoreInfoImageChange(
                                                          e,
                                                          "BENEFITS",
                                                          index
                                                        )
                                                      }
                                                      className="text-sm text-colorSecondaryLight"
                                                    />
                                                    {item.img && (
                                                      <div>
                                                        <img
                                                          className="h-10 w-auto"
                                                          src={
                                                            imageBaseUrl +
                                                            item.img
                                                          }
                                                          alt={item.heading}
                                                        />
                                                        {/* <div className="w-10 h-10 bg-cover bg-no-repeat bg-center rounded-lg" style={{ backgroundImage: `url(${imageBaseUrl + item.img})` }}></div> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                            <div
                                              className="w-max text-colorPrimary py-2 cursor-pointer"
                                              onClick={() =>
                                                setMoreInfoFormData(
                                                  (prevData) => ({
                                                    ...prevData,
                                                    BENEFITS: [
                                                      ...prevData.BENEFITS,
                                                      {
                                                        heading: "",
                                                        ratio: "",
                                                        img: "",
                                                      },
                                                    ],
                                                  })
                                                )
                                              }
                                            >
                                              +Add
                                            </div>
                                          </div>
                                        </div>
                                        {/* co2 absorbed */}
                                        <div className="border border-colorPrimary rounded-xl p-4 space-y-1">
                                          <h3 className="text-colorSecondary text-sm capitalize">
                                            CO<sub>2</sub> absorbed
                                          </h3>
                                          <div className="grid grid-cols-2 gap-2">
                                            {/* value */}
                                            <div className="col-span-2 sm:col-span-1">
                                              <input
                                                type="number"
                                                name={`value`}
                                                required={open}
                                                onChange={moreInfoHandleChange}
                                                value={
                                                  moreInfoFormData?.CO2?.value
                                                }
                                                placeholder="Carbon value"
                                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                              />
                                            </div>
                                            {/* unit */}
                                            <div className="col-span-2 sm:col-span-1">
                                              <input
                                                type="text"
                                                name={`unit`}
                                                required={open}
                                                onChange={moreInfoHandleChange}
                                                value={
                                                  moreInfoFormData?.CO2?.unit
                                                }
                                                placeholder="Carbon value unit eg: mg, g, kg"
                                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                              />
                                            </div>
                                            {/* produced by */}
                                            <div className="col-span-2 sm:col-span-1">
                                              <input
                                                type="text"
                                                name={`distance`}
                                                required={open}
                                                onChange={moreInfoHandleChange}
                                                value={
                                                  moreInfoFormData?.CO2
                                                    ?.distance
                                                }
                                                placeholder="481km by bus"
                                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                              />
                                            </div>
                                            {/* period */}
                                            <div className="col-span-2 sm:col-span-1">
                                              <input
                                                type="text"
                                                name={`period`}
                                                required={open}
                                                onChange={moreInfoHandleChange}
                                                value={
                                                  moreInfoFormData?.CO2?.period
                                                }
                                                placeholder="0 years / 10 years"
                                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                              />
                                            </div>
                                            {/* averageAnnual */}
                                            <div className="col-span-2 sm:col-span-2">
                                              <input
                                                type="text"
                                                name={`averageAnnual`}
                                                required={open}
                                                onChange={moreInfoHandleChange}
                                                value={
                                                  moreInfoFormData?.CO2
                                                    ?.averageAnnual
                                                }
                                                placeholder="Annual compensation eg: 5kg"
                                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                                              />
                                            </div>
                                            {/* image */}
                                            <div className="col-span-2 sm:col-span-2">
                                              <div className="flex items-center">
                                                <input
                                                  type="file"
                                                  name="CO2.img"
                                                  accept="image/*"
                                                  onChange={(e) =>
                                                    handleMoreInfoImageChange(
                                                      e,
                                                      "CO2"
                                                    )
                                                  }
                                                  className="text-sm text-colorSecondaryLight"
                                                />
                                                {moreInfoFormData?.CO2?.img && (
                                                  <div>
                                                    <img
                                                      className="h-10 w-auto"
                                                      src={
                                                        imageBaseUrl +
                                                        moreInfoFormData?.CO2
                                                          ?.img
                                                      }
                                                      alt="co2 absorbed"
                                                    />
                                                    {/* <div className="w-10 h-10 bg-cover bg-no-repeat bg-center rounded-lg" style={{ backgroundImage: `url(${imageBaseUrl + moreInfoFormData.CO2.img})` }}></div> */}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            </div>
                          </div>
                        </div>

                        {modalError && (
                          <div className="text-sm text-center mt-5 w-full px-2 py-1 border border-red-600 text-red-600">
                            {modalError}
                          </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none"
                            onClick={() => {
                              setOpenModal(false);
                            }}
                          >
                            Close
                          </button>
                          {modalLoading ? (
                            <div>
                              <Spinner />
                            </div>
                          ) : (
                            <input
                              type="submit"
                              value={updateProduct ? "Update" : "Create"}
                              className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/80 hover:bg-colorPrimary px-4 py-2 text-sm font-medium text-white focus:outline-none"
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}

      {/* delete product modal */}
      {openDeleteModal && (
        <ConfirmModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          handleClick={() => handleDeleteProduct(deleteProductId)}
          loading={modalLoading}
          error={modalError}
        />
      )}

      {/* error */}
      {error && (
        <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(PRODUCTS);
