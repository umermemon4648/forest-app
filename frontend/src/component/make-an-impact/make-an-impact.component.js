import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./make-an-impact.component.css";
import { HeadingTertiary, PrimaryCardElement, Spinner } from "../../element";
import DefaultImage from "../../assets/images/default-image.webp";
import axios from "axios";

const cardData = [
  {
    imageSrc:
      "//www.ourforest.co.za/cdn/shop/files/Once-off.jpg?v=1688047837&amp;width=3200",
    text: "Plant once-off",
    description:
      "Experience the power of a simple act that will sow seeds of positive change for generations to come. Choose your tree or country to support.",
    linkText: "View Trees",
    link: "/collections/651d96dbd188ba901a800fd6",
  },
  {
    imageSrc:
      "//www.ourforest.co.za/cdn/shop/files/Tree_gift.jpg?v=1688047848&amp;width=3200",
    text: "Gift a tree",
    description:
      "A small token with a positive ripple effect across the world, benefiting local African communities and ecosystems alike.",
    linkText: "Gift card",
    link: "/product/651d9b56d188ba901a80102e",
  },
  {
    imageSrc:
      "//www.ourforest.co.za/cdn/shop/files/Tree_subscription.jpg?v=1688047848&amp;width=3200",
    text: "Plant every month",
    description:
      "Plant more trees each month and make a difference at your preferred level of environmental impact.",
    linkText: "View plans",
    // link: "/collections/all"
  },
  {
    imageSrc:
      "//www.ourforest.co.za/cdn/shop/files/Business_solutions.jpg?v=1688047848&amp;width=3200",
    text: "Business solutions",
    description:
      "A bold statement tailor-made offers that showcase your corporate commitment to sustainability.",
    linkText: "View options",
    // link: "/collections/all"
  },
];

const MakeAnImpact = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  // const [data, setData] = useState([]);
  // const wordsArr = ['once', 'gift', 'every month', 'business'];

  async function getAllCategories() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/categories`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAllCategories(data.categories);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <section className="make-an-impact">
      {/* loading */}
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner rootClass="w-20 h-20" />
        </div>
      )}

      {/* empty */}
      {/* {
        !loading && (_.isEmpty(allCategories) || _.isUndefined(allCategories)) &&
        <div>
          <HeadingSecondary rootClass='text-colorSecondary' text={'No products found!'} />
        </div>
      } */}

      {!loading &&
        (!_.isEmpty(allCategories) || !_.isUndefined(allCategories)) && (
          <div className="page-width">
            <div className="title-wrapper">
              <div className="w-11/12 max-w-[1100px] m-auto py-10">
                <HeadingTertiary
                  rootClass="text-colorSecondary leading-tight"
                  text={"Make an impact with a few clicks"}
                />
              </div>
            </div>

            <div className="w-11/12 max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-auto gap-6 xl:gap-10">
              {allCategories.map((category) => (
                <>
                  {category?.name !== "uncategorized" && (
                    <PrimaryCardElement
                      key={category?._id}
                      imageSrc={
                        category?.image
                          ? `${imageBaseUrl + category?.image}`
                          : DefaultImage
                      }
                      text={category?.name}
                      description={category?.description}
                      link={`/collections/${category?._id}`}
                      linkText={"View options"}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        )}
    </section>
  );
};

export default MakeAnImpact;
