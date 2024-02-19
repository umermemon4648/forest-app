import React, { memo, useEffect, useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";
import {
  HeadingSecondary,
  HeadingTertiary,
  Spinner,
  TextPrimary,
} from "../../element";
import {
  CarbonFootprint,
  ProductCardPrimary,
  ProductCardSecondary,
} from "../../component";
import { Link, useParams } from "react-router-dom";

const Plant = () => {
  let { id: categoryId } = useParams();
  const categoryIdOrDefault = categoryId || "all";
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [ratings, setRatings] = useState(0);

  const [subscription, setSubscription] = useState([]);

  const data = {
    heading: "Embrace the Power of Tree Planting",
    textOne: "Have you considered the impact of planting trees?",
    textTwo:
      "A simple gesture with tremendous benefits for the environment and communities, while also serving as a unique gift for your loved ones.",

    subscriptions: {
      heading: "Have you considered planting every month?",
      cards: [
        {
          heading: "Starter",
          li: [
            "10 trees per month",
            "123kg of carbon saved",
            "Cancel at anytime",
          ],
          image:
            "https://www.ourforest.co.za/cdn/shop/files/seedlingicon.jpg?v=1688135665&width=400",
          // action: {
          //     label: 'Start now',
          //     action: () => alert('Starter clicked')
          // }
        },
        {
          heading: "Guardian",
          li: [
            "16 trees per month",
            "197 kg of carbon saved",
            "Cancel at anytime",
          ],
          image:
            "https://www.ourforest.co.za/cdn/shop/files/treeicon.jpg?v=1688037473&width=400",
          // action: {
          //     label: 'Start now',
          //     action: () => alert('Guardian clicked')
          // }
        },
        {
          heading: "Warrior",
          li: [
            "24 trees per month",
            "295 kg of carbon saved",
            "Choose trees in your subscription",
            "Cancel at anytime",
          ],
          image:
            "https://www.ourforest.co.za/cdn/shop/files/Foresticon1.png?v=1688135738&width=400",
          // action: {
          //     label: 'Start now',
          //     action: () => alert('Warrior clicked')
          // }
        },
      ],
    },
  };

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    // dispatch(getProduct(categoryId));
    dispatch(getProduct(currentPage, price, categoryIdOrDefault, ratings));
  }, [dispatch, currentPage, price, categoryId, ratings]);

  useEffect(() => {
    if (!loading) {
      setSubscription(
        products?.filter((e) => e.productType === "subscription")
      );
    }
  }, [products]);

  return (
    <div className="plant-page">
      {/* hero section */}
      <div className="bg-colorFourth flex items-center justify-center py-10">
        <div className="w-11/12 md:w-9/12 lg:w-10/12 max-w-[780px] text-center space-y-5">
          <HeadingSecondary rootClass="text-colorFifth" text={data.heading} />
          <div>
            <TextPrimary rootClass="text-colorSixth" text={data.textOne} />
            <TextPrimary rootClass="text-colorSixth" text={data.textTwo} />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <TextPrimary
              rootClass="text-colorSixth"
              text="Looking for our business solutions?"
            />
            <Link to="/for-business">
              <p className="text-colorTertiary text-base underline">
                Click here
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* products list */}
      <div className="w-11/12 max-w-[1100px] mx-auto py-14">
        {/* loading */}
        {loading && (
          <div className="flex items-center justify-center">
            <Spinner rootClass="w-20 h-20" />
          </div>
        )}

        {/* empty */}
        {!loading && (_.isEmpty(products) || _.isUndefined(products)) && (
          <div>
            <HeadingSecondary
              rootClass="text-colorSecondary"
              text={"No products found!"}
            />
          </div>
        )}

        {/* cards */}
        {!loading && (!_.isEmpty(products) || !_.isUndefined(products)) && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10">
              {products &&
                products.map((product) => (
                  <ProductCardPrimary key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {productsCount > 9 && (
              <div className="mt-10">
                <nav>
                  <ul className="flex items-center justify-center space-x-2">
                    {Array.from(
                      { length: Math.ceil(productsCount / resultPerPage) },
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
            )}
          </>
        )}
      </div>

      {/* subscription section */}
      <div className="w-11/12 max-w-[1100px] mx-auto space-y-8 py-14">
        <HeadingTertiary
          rootClass="text-colorSecondary"
          text={data.subscriptions.heading}
        />

        {/* cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {subscription?.map((product, index) => (
            <ProductCardSecondary key={index} data={product} />
          ))}
        </div>
      </div>

      {/* carbon footprint */}
      <CarbonFootprint />
    </div>
  );
};

export default memo(Plant);
