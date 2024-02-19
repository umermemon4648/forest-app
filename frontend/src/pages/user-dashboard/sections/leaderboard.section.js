import React, { memo, useEffect, useState } from "react";
import _ from "lodash";
import { Icon } from "@iconify/react";
import BannerImage from "../../../assets/images/banner-03.png";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import axios from "axios";
import { Spinner } from "../../../element";
const Leaderboard = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getLeaderboardData() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/orders/combined`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      setLeaderBoardData(data.combinedOrders);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLeaderBoardData([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getLeaderboardData();
  }, []);

  return (
    <div>
      <div className="">
        {/* top 3 users */}
        <div className="relative">
          <img
            src={BannerImage}
            alt="banner"
            className="w-full h-auto rounded-3xl sm:rounded-t-[40px]"
          />

          <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-1 md:space-y-4 lg:space-y-6">
              <h2 className="text-colorSecondary text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase">
                IMPACT LEADERBOARD
              </h2>

              {loading && (
                <div>
                  <Spinner />
                </div>
              )}

              {/* top 3 */}
              {!loading && !_.isEmpty(leaderboardData) && (
                <div className="inline-grid grid-cols-3 gap-6">
                  {leaderboardData[1] && (
                    <div className="flex flex-col items-center">
                      <h3 className="text-colorSecondary text-sm sm:text-xl md:text-2xl lg:text-3xl font-extrabold">
                        2<sup>nd</sup>
                      </h3>
                      <div className="w-11 sm:w-16 md:w-20 lg:w-24 h-11 sm:h-16 md:h-20 lg:h-24 bg-colorPrimary rounded-full overflow-hidden p-1 sm:p-1.5 md:p-2.5">
                        <div
                          className="w-full h-full rounded-full overflow-hidden bg-colorPrimaryLight bg-cover bg-no-repeat bg-center"
                          style={{
                            backgroundImage: `url(${
                              leaderboardData[1]?.avatar
                                ? imageBaseUrl + leaderboardData[1]?.avatar
                                : DefaultAvatar
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {leaderboardData[0] && (
                    <div className="flex flex-col items-center">
                      <div className="w-11 sm:w-16 md:w-20 lg:w-24 h-11 sm:h-16 md:h-20 lg:h-24 bg-colorPrimary rounded-full overflow-hidden p-1 sm:p-1.5 md:p-2.5">
                        <div
                          className="w-full h-full rounded-full overflow-hidden bg-colorPrimaryLight bg-cover bg-no-repeat bg-center"
                          style={{
                            backgroundImage: `url(${
                              leaderboardData[0]?.avatar
                                ? imageBaseUrl + leaderboardData[0]?.avatar
                                : DefaultAvatar
                            })`,
                          }}
                        ></div>
                      </div>
                      <h3 className="text-colorSecondary text-sm sm:text-xl md:text-2xl lg:text-3xl font-extrabold">
                        1<sup>st</sup>
                      </h3>
                    </div>
                  )}
                  {leaderboardData[2] && (
                    <div className="flex flex-col items-center">
                      <h3 className="text-colorSecondary text-sm sm:text-xl md:text-2xl lg:text-3xl font-extrabold">
                        3<sup>rd</sup>
                      </h3>
                      <div className="w-11 sm:w-16 md:w-20 lg:w-24 h-11 sm:h-16 md:h-20 lg:h-24 bg-colorPrimary rounded-full overflow-hidden p-1 sm:p-1.5 md:p-2.5">
                        <div
                          className="w-full h-full rounded-full overflow-hidden bg-colorPrimaryLight bg-cover bg-no-repeat bg-center"
                          style={{
                            backgroundImage: `url(${
                              leaderboardData[2]?.avatar
                                ? imageBaseUrl + leaderboardData[2]?.avatar
                                : DefaultAvatar
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* remaining top 5 */}
        <div className="bgGradientSecondary border border-colorPrimary rounded-3xl p-3 sm:p-8 md:p-10">
          <div className="space-y-3">
            {loading && (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            )}

            {!loading && _.isEmpty(leaderboardData) && (
              <p className="kalam text-colorSecondaryLight text-base sm:text-lg font-bold text-center">
                No data found!
              </p>
            )}

            {!loading &&
              !_.isEmpty(leaderboardData) &&
              leaderboardData.slice(0, 5).map((person, index) => (
                <div
                  key={person?._id}
                  className="flex flex-col sm:flex-row items-center bgGradientSecondary border border-colorPrimary rounded-lg px-4 py-2 space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <div className="w-full sm:w-auto flex-1 flex items-center space-x-4">
                    <p className="text-xs sm:text-base font-bold">
                      #0{index + 1}
                    </p>
                    <div
                      className="w-8 sm:w-12 h-8 sm:h-12 bg-colorPrimaryLight rounded-full bg-cover bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url(${
                          person?.avatar
                            ? imageBaseUrl + person?.avatar
                            : DefaultAvatar
                        })`,
                      }}
                    ></div>
                    <h3 className="text-sm sm:text-base font-bold capitalize">
                      {person?.name}
                    </h3>
                  </div>
                  <div className="w-full sm:w-auto flex items-center justify-end space-x-4">
                    <h4 className="text-xs sm:text-base font-bold">
                      {person?.totalNoOfItems} Tree
                      {person?.totalNoOfItems > 1 && "s"}
                    </h4>
                    <div>
                      {/* <Icon
                        icon="healthicons:triangle-large"
                        className="w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 text-red-600"
                      /> */}
                      <img
                        width="32"
                        height="32"
                        src="https://img.icons8.com/emoji/48/deciduous-tree-emoji.png"
                        alt="deciduous-tree-emoji"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Leaderboard);
