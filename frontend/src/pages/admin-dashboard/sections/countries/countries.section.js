import React, { Fragment, memo, useEffect, useState } from "react";
import { Spinner } from "../../../../element";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { ConfirmModal } from "../../../../component";
import { Icon } from "@iconify/react";

const COUNTRIES = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [allCountries, setAllCountries] = useState({ countries: [] });
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [updateCountry, setUpdateCountry] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateNew = () => {
    setFormData({ ...formData, name: "", description: "" });
    setOpenModal(true);
    setUpdateCountry(false);
  };

  async function getAllCountries() {
    setLoading(true);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/countries`, {
        headers: {
          // Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      setAllCountries(data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  async function handleCreateCountry(e) {
    e.preventDefault();

    setModalLoading(true);
    setModalError(null);

    const updatedForm = {
      name: formData.name,
      description: formData.description,
    };

    if (updateCountry) {
      try {
        const response = await axios.put(
          `${apiBaseUrl}/api/v1/admin/country/${formData._id}`,
          updatedForm,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalLoading(false);
        setOpenModal(false);
        setFormData({ ...formData, name: "", description: "" });
        getAllCountries();
      } catch (error) {
        setModalError(error.response.data.message);
        setModalLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${apiBaseUrl}/api/v1/admin/country`,
          updatedForm,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalLoading(false);
        setOpenModal(false);
        setFormData({ ...formData, name: "", description: "" });
        getAllCountries();
      } catch (error) {
        setModalError(error.response.data.message);
        setModalLoading(false);
      }
    }
  }

  async function handleDeleteCountry(id) {
    setModalLoading(true);
    setModalError(null);

    try {
      const response = await axios.delete(
        `${apiBaseUrl}/api/v1/admin/country/${id}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setModalLoading(false);
      setOpenDeleteModal(false);
      getAllCountries();
    } catch (error) {
      setModalError(error.response.data.message);
      setModalLoading(false);
    }
  }

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <div className="bg-colorSeventh p-10">
      <div className="flex items-center space-x-2">
        <h3 className="flex-1 text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">
          Countries
        </h3>
        <button onClick={handleCreateNew} className="buttonPrimary">
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
      {!loading &&
      allCountries.countries &&
      allCountries.countries.length > 0 ? (
        <div className="max-h-[700px] mt-5 space-y-5 overflow-auto">
          <table className="min-w-full max-h-96 overflow-auto">
            <thead>
              <tr className="font-bold text-sm sm:text-base">
                <td>S No.</td>
                <td>Name</td>
                <td>Description</td>
                {/* <td>Products</td> */}
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {allCountries.countries.map((country, index) => (
                <tr key={country._id} className="text-xs sm:text-sm">
                  <td>{index + 1}</td>
                  <td className="text-sm sm:text-base capitalize">
                    {country.name}
                  </td>
                  <td className="text-colorSecondaryLight">
                    {country.description}
                  </td>
                  {/* <td className="text-colorPrimary font-bold">
                    {country.productCount}
                  </td> */}
                  <td className="">
                    <div className="flex items-center justify-end space-x-1">
                      <div
                        onClick={() => {
                          setUpdateCountry(true);
                          setFormData(country);
                          setOpenModal(true);
                        }}
                        className="w-6 h-6 bg-transparent hover:bg-colorPrimary border border-colorSecondaryLight hover:border-colorPrimary text-colorSecondaryLight hover:text-white rounded-full p-1 cursor-pointer"
                      >
                        <Icon icon="mi:edit-alt" className="w-full h-auto" />
                      </div>
                      {/* delete */}
                      <div
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setSelectedCountry(country);
                        }}
                        className="w-6 h-6 bg-transparent hover:bg-red-500 border border-red-500 hover:border-red-500 text-red-500 hover:text-white rounded-full p-1 cursor-pointer"
                      >
                        <Icon
                          icon="fluent:delete-48-regular"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-colorSecondaryLight text-left text-lg mt-5">
          No country found!
        </p>
      )}

      {/* error */}
      {error && (
        <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
          {error}
        </div>
      )}

      {/* create country modal */}
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
                      <form onSubmit={handleCreateCountry}>
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-medium leading-6 text-colorPrimary"
                        >
                          {updateCountry
                            ? "Update country"
                            : "Create new country"}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="space-y-5">
                            {/* name */}
                            <div>
                              <label className="text-colorSecondaryLight text-sm">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                onChange={handleChange}
                                value={formData.name}
                                placeholder="Enter country name"
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* description */}
                            <div>
                              <label className="text-colorSecondaryLight text-sm">
                                Description
                              </label>
                              <textarea
                                required
                                name="description"
                                onChange={handleChange}
                                value={formData.description}
                                placeholder="Enter description"
                                rows={4}
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              ></textarea>
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
                              setUpdateCountry(false);
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
                              value={updateCountry ? "Update" : "Create"}
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
          onClose={() => {
            setOpenDeleteModal(false);
            setSelectedCountry({});
          }}
          handleClick={() => handleDeleteCountry(selectedCountry?._id)}
          loading={modalLoading}
          error={modalError}
        />
      )}
    </div>
  );
};

export default memo(COUNTRIES);
