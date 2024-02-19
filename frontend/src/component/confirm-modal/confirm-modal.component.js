import React, { Fragment, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Spinner } from "../../element";

const ConfirmModal = (props) => {
    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={props.onClose}>
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-red-500"
                                >
                                    Delete
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-colorSecondaryLight">
                                        Are you sure you want to delete?
                                    </p>
                                </div>

                                {
                                    props.error &&
                                    <div className="text-sm text-center mt-5 w-full px-2 py-1 border border-red-600 text-red-600">
                                        {props.error}
                                    </div>
                                }

                                {/* action */}
                                <div className="flex items-center justify-end space-x-2 mt-4">
                                    <button
                                        className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none"
                                        onClick={props.onClose}
                                    >
                                        Close
                                    </button>
                                    {
                                        props.loading ? (
                                            <div><Spinner /></div>
                                        ) : (
                                            <button
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white focus:outline-none"
                                                onClick={props.handleClick}
                                            >Delete</button>
                                        )
                                    }
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default memo(ConfirmModal);