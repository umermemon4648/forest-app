import React, { memo, useEffect, useState } from "react";
import { ButtonSecondary, HeadingTertiary, TextPrimary } from "../../element";

const CrossGridSection = (props) => {
  const [aspectRatio, setAspectRatio] = useState("5/6");

  useEffect(() => {
    const updateAspectRatio = () => {
      setAspectRatio(window.innerWidth >= 768 ? "5/6" : "16/9");
    };

    updateAspectRatio();

    window.addEventListener("resize", updateAspectRatio);

    return () => {
      window.removeEventListener("resize", updateAspectRatio);
    };
  }, []);

  return (
    <div className="space-y-20 md:space-y-10">
      {props.data.map((item, index) => (
        <div
          key={index}
          className="flex"
          // className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 group border-2 border-red-300"
        >
          {/* image */}
          {/* <div className="md:group-even:order-last shadow-2xl">
                            {
                                item.image &&
                                <div className="w-full aspect-video md:aspect-square md:h-full bg-cover bg-no-repeat bg-center rounded-2xl overflow-hidden" style={{ backgroundImage: `url(${item.image})` }}></div>
                            }
                        </div> */}
          {/* <div className="md:group-even:order-last shadow-2xl">
            {item.image && (
              <div
                className={`w-full aspect-video md:aspect-square md:h-full md:bg-cover bg-no-repeat md:bg-center bg-contain rounded-2xl overflow-hidden`}
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
            )}
          </div> */}

          <div className="flex md:flex-row flex-col w-full gap-8 md:gap-16 ">
            <div
              // className={`shadow-2xl border-2 border-red-400 order-${
              //   index % 2 === 0 ? "first" : "last"
              // }`}

              // className={`flex shadow-2xl border-2 border-red-400 ${
              //   index % 2 === 0 ? "order-first" : "order-last"
              // }`}
              className={`shadow-2xl border-2 w-full rounded-2xl  ${
                index % 2 === 0
                  ? "md:col-start-1 md:col-end-2"
                  : "md:col-start-2 md:col-end-3"
              }`}
            >
              {item.image && (
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className={`w-full  md:aspect-w-${
                    aspectRatio.split("/")[0]
                  } md:aspect-h-${aspectRatio.split("/")[1]} rounded-2xl`}
                  src={item.image}
                  alt={item.image}
                />
              )}
            </div>
            {/* content */}
            <div
              //   className={`flex flex-col justify-center md:py-10 space-y-4 border-4 border-blue-600

              //   md:order-${index % 2 === 0 ? "first" : "last"}

              // `}

              // className={`w-full flex flex-col justify-center md:py-10 space-y-4 order-${
              //   index % 2 === 0 ? "last" : "first"
              // }`}
              className={`w-full flex flex-col justify-center md:py-10 space-y-4 ${
                index % 2 === 0
                  ? "order-1 md:order-last"
                  : "order-2 md:order-first"
              }`}
              // className={`gap-4 md:gap-8 py-4 border-4 border-blue-600 ${
              //   index % 2 !== 0
              //     ? "md:col-start-1 md:col-end-2"
              //     : "md:col-start-2 md:col-end-3"
              // }`}
            >
              <div>
                {props.showSteps && (
                  <TextPrimary
                    rootClass="text-colorSecondary text-xs md:text-xs opacity-60"
                    text={`STEP ${index + 1}`}
                  />
                )}
                {item.heading && (
                  <HeadingTertiary
                    rootClass="text-colorSecondary leading-tight"
                    text={item.heading}
                  />
                )}
              </div>
              {item.text && (
                <TextPrimary rootClass="text-colorSecondary" text={item.text} />
              )}
              {item.li && (
                <ul className="list-disc pl-10 space-y-1.5">
                  {item.li.map((text, index) => (
                    <li
                      key={index}
                      className="text-colorSecondary text-base tracking-wider"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              )}
              {item.action && (
                <ButtonSecondary
                  label={item.action.label}
                  handleClick={item.action.action}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CrossGridSection.defaultProps = {
  showSteps: false,
};

export default memo(CrossGridSection);
