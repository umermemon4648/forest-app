import React, { Fragment, memo, useEffect, useState } from "react";
import { Spinner } from "../../../../element";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { ConfirmModal } from "../../../../component";
import DefaultImage from '../../../../assets/images/default-image.webp';

const CATEGORIES = (props) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [allCategories, setAllCategories] = useState({ categories: [] });
    const [error, setError] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateNew = () => {
        setFormData({ ...formData, name: '', description: '', image: '' });
        setOpenModal(true);
        setUpdateCategory(false);
    };

    async function getAllCategories() {
        setLoading(true);

        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/categories`, {
                headers: {
                    // Authorization: `Bearer ${props.token}`,
                    "Content-Type": "application/json",
                },
            });
            setAllCategories(data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const CreateProductImageChange = (e) => {
        const file = e.target.files[0]; // Get the first file from the input

        const fetchData = async () => {
            setModalError(null);
            setFormData({ ...formData, image: '' });

            const formImage = new FormData();
            formImage.append("image", file);

            try {
                const { data } = await axios.post(`${apiBaseUrl}/api/v1/upload`, formImage, {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setFormData({ ...formData, image: data.media.path });
            } catch (error) {
                setModalError(error.response.data.message);
            };
        };

        fetchData();
    };

    async function handleCreateCategory(e) {
        e.preventDefault();

        setModalLoading(true);
        setModalError(null);

        const updatedForm = {
            name: formData.name,
            description: formData.description,
            image: formData.image
        };

        if (updateCategory) {
            try {
                const response = await axios.put(`${apiBaseUrl}/api/v1/admin/category/${formData._id}`, updatedForm, {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                        "Content-Type": "application/json",
                    },
                });
                setModalLoading(false);
                setOpenModal(false);
                setFormData({ ...formData, name: '', description: '', image: '' });
                getAllCategories();
            } catch (error) {
                setModalError(error.response.data.message);
                setModalLoading(false);
            }
        } else {
            try {
                const response = await axios.post(`${apiBaseUrl}/api/v1/admin/category`, updatedForm, {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                        "Content-Type": "application/json",
                    },
                });
                setModalLoading(false);
                setOpenModal(false);
                setFormData({ ...formData, name: '', description: '', image: '' });
                getAllCategories();
            } catch (error) {
                setModalError(error.response.data.message);
                setModalLoading(false);
            }
        }
    };

    async function handleDeleteCategory(id) {
        setModalLoading(true);
        setModalError(null);

        try {
            const response = await axios.delete(`${apiBaseUrl}/api/v1/admin/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                    "Content-Type": "application/json",
                },
            });
            setModalLoading(false);
            setOpenDeleteModal(false);
            getAllCategories();
        } catch (error) {
            setModalError(error.response.data.message);
            setModalLoading(false);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className="bg-colorSeventh p-10">
            <div className="flex items-center space-x-2">
                <h3 className="flex-1 text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Categories</h3>
                <button onClick={handleCreateNew} className="buttonPrimary">Create new</button>
            </div>
            {/* loader */}
            {
                loading &&
                <div className="flex items-center justify-center mt-5">
                    <Spinner rootClass='w-8 h-8' />
                </div>
            }

            {/* content */}
            {
                !loading && allCategories.categories && allCategories.categories.length > 0 ? (
                    <div className="max-h-[700px] mt-5 space-y-5 overflow-auto">
                        <table className="min-w-full max-h-96 overflow-auto">
                            <thead>
                                <tr className="font-bold text-sm sm:text-base">
                                    <td>S No.</td>
                                    <td>Name</td>
                                    <td>Description</td>
                                    <td>Image</td>
                                  
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allCategories.categories.map((category, index) => (
                                        <tr key={category._id} className="text-xs sm:text-sm">
                                            <td>{index + 1}</td>
                                            <td className="text-sm sm:text-base capitalize">{category.name}</td>
                                            <td className="text-colorSecondaryLight">{category.description}</td>
                                            <td>
                                                <img className="w-10 h-auto m-auto" src={category.image ? imageBaseUrl+category.image : DefaultImage} alt={category.name} />
                                                {/* <div className="w-10 h-10 bg-cover bg-no-repeat bg-center rounded-xl" style={{ backgroundImage: `url(${category.image ? category.image : DefaultImage})` }}></div> */}
                                            </td>
                                            {/* <td className="text-colorPrimary font-bold">{category.productCount}</td> */}
                                            <td className="">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <div onClick={() => { setUpdateCategory(true); setFormData(category); setOpenModal(true) }} className="w-6 h-6 bg-transparent hover:bg-colorPrimary border border-colorSecondaryLight hover:border-colorPrimary text-colorSecondaryLight hover:text-white rounded-full p-1 cursor-pointer">
                                                        <Icon icon="mi:edit-alt" className='w-full h-auto' />
                                                    </div>
                                                    {/* delete */}
                                                    <div onClick={() => { setOpenDeleteModal(true); setSelectedCategory(category) }} className="w-6 h-6 bg-transparent hover:bg-red-500 border border-red-500 hover:border-red-500 text-red-500 hover:text-white rounded-full p-1 cursor-pointer">
                                                        <Icon icon="fluent:delete-48-regular" className='w-full h-auto' />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-colorSecondaryLight text-left text-lg mt-5">No category found!</p>
                )
            }

            {/* error */}
            {
                error &&
                <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
                    {error}
                </div>
            }

            {/* create category modal */}
            {
                openModal &&
                <div>
                    <Transition appear show={openModal} as={Fragment}>
                        <Dialog as="div" className="relative z-[60]" onClose={() => setOpenModal(false)}>
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
                                            <form onSubmit={handleCreateCategory}>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-xl font-medium leading-6 text-colorPrimary"
                                                >
                                                    {
                                                        updateCategory ? (
                                                            'Update category'
                                                        ) : (
                                                            'Create new category'
                                                        )
                                                    }
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <div className="space-y-5">
                                                        {/* name */}
                                                        <div>
                                                            <label className="text-colorSecondaryLight text-sm">Name</label>
                                                            <input type="text" name="name" required onChange={handleChange} value={formData.name} placeholder="Enter category name" className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md" />
                                                        </div>
                                                        {/* description */}
                                                        <div>
                                                            <label className="text-colorSecondaryLight text-sm">Description</label>
                                                            <textarea required name="description" onChange={handleChange} value={formData.description} placeholder="Enter description" rows={4} className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"></textarea>
                                                        </div>
                                                        {/* image */}
                                                        <div className="">
                                                            <div>
                                                                <label className="text-colorSecondaryLight text-sm">{updateCategory ? 'Category image' : 'Category image'}</label>
                                                            </div>
                                                                {
                                                                    formData.image === '' &&
                                                                    <input
                                                                        type="file"
                                                                        name="avatar"
                                                                        accept="image/*"
                                                                        onChange={CreateProductImageChange}
                                                                        multiple
                                                                        required
                                                                        className="text-sm text-colorSecondaryLight"
                                                                    />
                                                                }
                                                                {
                                                                formData.image !== '' &&
                                                                <div className="flex items-center space-x-5 mt-5">
                                                                    <div className="w-14 h-14 bg-cover bg-no-repeat bg-center rounded-lg bg-gray-100" style={{ backgroundImage: `url(${imageBaseUrl+formData.image})` }}></div>
                                                                    <div onClick={() => setFormData({ ...formData, image: '' })} className="cursor-pointer">
                                                                        <Icon icon="ep:close" />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                {
                                                    modalError &&
                                                    <div className="text-sm text-center mt-5 w-full px-2 py-1 border border-red-600 text-red-600">
                                                        {modalError}
                                                    </div>
                                                }

                                                <div className="flex items-center justify-end space-x-2 mt-4">
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none"
                                                        onClick={() => { setOpenModal(false); setUpdateCategory(false); }}
                                                    >
                                                        Close
                                                    </button>
                                                    {
                                                        modalLoading ? (
                                                            <div><Spinner /></div>
                                                        ) : (
                                                            <input
                                                                type="submit"
                                                                value={updateCategory ? 'Update' : 'Create'}
                                                                className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/80 hover:bg-colorPrimary px-4 py-2 text-sm font-medium text-white focus:outline-none"
                                                            />
                                                        )
                                                    }
                                                </div>
                                            </form>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            }

            {/* delete product modal */}
            {
                openDeleteModal &&
                <ConfirmModal
                    isOpen={openDeleteModal}
                    onClose={() => { setOpenDeleteModal(false); setSelectedCategory({}) }}
                    handleClick={() => handleDeleteCategory(selectedCategory?._id)}
                    loading={modalLoading}
                    error={modalError}
                />
            }
        </div>
    );
};

export default memo(CATEGORIES);