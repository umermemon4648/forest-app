import { Listbox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify";
import React, { Fragment, memo, useEffect, useState } from "react";
import { Spinner } from "../../../../element";
import axios from "axios";
import { DateTime } from "luxon";
import useGetRoleById from "../../../../hooks/useGetRoleById";

const USERS = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("authToken");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const [rolesLoader, setRolesLoader] = useState(false);
    const [roles, setRoles] = useState([]);

    async function getUsers() {
        setLoading(true);

        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.message);
            setLoading(false);
        }
    };

    async function getRoles() {
        setRolesLoader(true);

        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/admin/roles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRoles(data.roles);
            setRolesLoader(false);
        } catch (error) {
            console.error(error.response.data.message);
            setRolesLoader(false);
        }
    };

    async function deleteUsers(id) {
        try {
            const response = await axios.delete(`${apiBaseUrl}/api/v1/admin/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            getUsers();
            getRoles();
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    useEffect(() => {
        getUsers();
        getRoles();
    }, []);

    const DROP_DOWN = (props) => {
        const { role, loading } = useGetRoleById(props.role, token);
        const [selected, setSelected] = useState({});
        const [editRole, setEditRole] = useState(false);
        const [updateRoleLoader, setUpdateRoleLoader] = useState(false);

        async function updateRole() {
            setUpdateRoleLoader(true);

            try {
                const response = await axios.put(`${apiBaseUrl}/api/v1/admin/user/${props.id}`, { "role": selected._id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                // setRoles(data.roles);
                setUpdateRoleLoader(false);
                getUsers();
                getRoles();
            } catch (error) {
                console.error(error.response.data.message);
                setUpdateRoleLoader(false);
            }
        };

        useEffect(() => {
            setSelected(role);
        }, [role, editRole]);
        return (
            <>
                {
                    (loading || updateRoleLoader) ? (
                        <Spinner />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <p className="flex-1">
                                <Listbox value={selected} onChange={setSelected} disabled={!editRole}>
                                    <div className="relative">
                                        <Listbox.Button className={`${editRole ? 'border border-colorSecondaryLight' : ''} relative w-[100px] cursor-default rounded-lg py-1.5 pl-3 pr-10 text-left focus:outline-none text-xs sm:text-sm`}>
                                            <span className="block truncate">{selected?.name}</span>
                                            {
                                                editRole &&
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <Icon icon="heroicons:chevron-up-down-solid" className="w-4 h-4" />
                                                </span>
                                            }
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-[140px] overflow-auto rounded-md bg-white text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                                                {
                                                    roles.length > 0 && roles.map((role) => (
                                                        <Listbox.Option
                                                            key={role._id}
                                                            className={({ active }) =>
                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-colorPrimary text-colorFifth' : 'text-colorSecondary'
                                                                }`
                                                            }
                                                            value={role}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span
                                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                            }`}
                                                                    >
                                                                        {role.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-colorPrimary">
                                                                            <Icon icon="ph:check" className="h-5 w-5" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))
                                                }
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </p>
                            {
                                editRole ? (
                                    <div className="flex items-center justify-end space-x-1">
                                        <button onClick={() => setEditRole(false)} className="w-6 h-6 text-red-500 hover:text-white bg-transparent hover:bg-red-500 border border-red-500 rounded-full p-1">
                                            <Icon icon="ion:close-outline" className="w-full h-auto" />
                                        </button>
                                        <button onClick={updateRole} className="w-6 h-6 text-colorPrimary hover:text-white bg-transparent hover:bg-colorPrimary border border-colorPrimary rounded-full p-1">
                                            <Icon icon="ic:round-check" className="w-full h-auto" />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setEditRole(true)} className="w-6 h-6 text-colorSecondary border border-colorSecondary rounded-full p-[5px]">
                                        <Icon icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing" className="w-full h-auto" />
                                    </button>
                                )
                            }
                        </div>
                    )
                }
            </>
        );
    };

    return (
        <div className="bg-colorSeventh p-10">
            <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Users</h3>

            {/* loader */}
            {
                loading &&
                <div className="flex items-center justify-center mt-5">
                    <Spinner rootClass='w-8 h-8' />
                </div>
            }

            {/* users table */}
            {
                !loading && users.length > 0 ? (
                    <div className="mt-5 space-y-5">
                        {/* <p className="text-colorSecondaryLight text-left text-lg">Order history</p> */}
                        <table className="min-w-full">
                            <thead>
                                <tr className="font-bold text-sm sm:text-base">
                                    <td>User</td>
                                    <td>Role</td>
                                    <td>Creation Date</td>
                                    <td className="text-right">Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((user) => (
                                        <tr key={user._id} className="text-sm sm:text-base">
                                            <td className="">
                                                <div>
                                                    <p className="text-colorFourth text-sm font-bold leading-none">{user.firstName + ' ' + user.lastName}</p>
                                                    <p className="text-colorSecondary text-sm leading-none">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="w-[200px]">
                                                <DROP_DOWN role={user.role} id={user._id} />
                                            </td>
                                            <td className="text-sm">{DateTime.fromISO(user.createdAt).toFormat("LLL dd, yyyy")}</td>
                                            <td className="text-right">
                                                <button onClick={() => deleteUsers(user._id)} className="w-6 h-6 text-red-500 hover:text-white bg-transparent hover:bg-red-500 border border-red-500 rounded-full p-1">
                                                    <Icon icon="heroicons:trash" className="w-full h-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-colorSecondaryLight text-left text-lg mt-5">No user found!</p>
                )
            }

            {/* error */}
            {/* {
                error &&
                <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
                    {error}
                </div>
            } */}
        </div>
    );
};

export default memo(USERS);