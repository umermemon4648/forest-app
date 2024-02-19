import React, { memo, useState } from "react";
import heroImage from '../../assets/images/banner-02.webp';
import { Icon } from "@iconify/react";
import { Disclosure } from "@headlessui/react";

const FAQS = () => {
    const tabs = ['Our process', 'Transparency', 'Business', 'Impact'];

    const [selectedTab, setSelectedTab] = useState('Our process');

    const data = {
        'Our process': [
            {
                text: 'How does your tree planting process work?',
                li: [
                    'Our tree planting process begins with carefully selecting reputable local partners in the countries we operate in. We collaborate with organizations experienced in reforestation efforts.',
                    'Once you choose to plant a tree with us, we work with our partners to source high-quality tree saplings.',
                    'Our partners employ skilled local workers who plant and care for the trees in designated areas, following best practices to ensure their survival and growth.'
                ]
            },
            {
                text: 'Do you involve local communities in your tree planting projects?',
                li: [
                    'Yes, community involvement is integral to our tree planting projects. We collaborate with local communities, ensuring their participation, engagement, and empowerment.',
                    'This approach helps create a sense of ownership, promotes sustainable practices, and supports the long-term success of the projects.'
                ]
            },
            {
                text: 'Are there any volunteering opportunities to physically participate in the tree planting activities?',
                li: [
                    'We currently do not offer volunteering opportunities for physical participation in the tree planting activities.',
                    'However, our focus on community involvement ensures that local communities and workers are actively engaged in the planting process.'
                ]
            }
        ],
        'Transparency': [
            {
                text: 'How do you ensure transparency and accountability in your operations?',
                li: [
                    'Transparency and accountability are core principles of our business. We maintain open communication with our customers, providing regular updates and progress reports on tree planting activities.',
                    'We strive to share information about our partners, the locations of tree plantings, and the impact achieved, fostering trust and transparency throughout our operations.'
                ]
            },
            {
                text: 'What is the pricing structure for planting trees, and how is the revenue allocated to support your initiatives?',
                li: [
                    'Our pricing structure may vary depending on the tree species, planting location, and specific project requirements.',
                    'A portion of the revenue generated from tree sales is allocated to cover operational costs, including the sourcing of high-quality saplings, project management, and ongoing monitoring.',
                    'The remaining funds contribute to supporting local communities, environmental conservation efforts, and the expansion of our tree planting initiatives.'
                ]
            }
        ],
        'Business': [
            {
                text: 'Can businesses or organizations participate in your tree planting program for corporate social responsibility (CSR) initiatives?',
                li: [
                    'Absolutely! We offer tailored packages for businesses and organizations seeking to fulfill their CSR objectives through tree planting.',
                    'Our team can collaborate with your company to develop a customized program that aligns with your sustainability goals and engages your employees or stakeholders.'
                ]
            },
            {
                text: 'How do you calculate and communicate the carbon offset or other environmental benefits associated with tree planting?',
                li: [
                    'We work with reputable experts and organizations to calculate the carbon offset and other environmental benefits associated with our tree planting initiatives.',
                    'Through robust methodologies and scientific assessments, we determine the approximate carbon sequestration capacity and communicate the environmental benefits to our customers.'
                ]
            }
        ],
        'Impact': [
            {
                text: 'Which countries do you operate in and where are the trees planted?',
                li: [
                    'We currently focus on tree planting initiatives in Sub-Saharan Africa, including South Africa, Zimbabwe, Mozambique and Ethiopia.',
                    'We hope to soon add projects in Namibia, Zambia, Botswana, Madagascar, and Tanzania.',
                    'Trees are planted in areas identified as needing reforestation, such as degraded forests, deforested lands, or regions impacted by environmental challenges.'
                ]
            },
            {
                text: 'How do you ensure the survival and long-term health of the planted trees?',
                li: [
                    'Our local partners follow established reforestation techniques to maximize tree survival rates.',
                    'They provide proper watering, protection from pests, and ongoing maintenance to ensure the trees establish strong roots and thrive in their new environment.',
                    'Regular monitoring and periodic evaluations are conducted to track the growth and health of the trees.'
                ]
            }
        ]
    }

    return (
        <div>
            {/* hero section */}
            <div className="w-full min-h-[230px] flex items-center justify-center bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="w-11/12 md:max-w-[60%] space-y-4">
                    <h2 className="text-white text-4xl font-bold capitalize text-center">Frequently Asked Questions</h2>
                    <form>
                        <div className="flex items-center space-x-4 bg-white p-3 rounded-full">
                            <Icon icon="tabler:search" className="w-7 h-auto text-colorSecondary" />
                            <input
                                type="text"
                                placeholder="What can we help you with?"
                                className="appearance-none w-full bg-transparent text-colorSecondary text-lg focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* content */}
            <div className="w-11/12 max-w-[1200px] m-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* left */}
                    <div className="lg:col-span-4">
                        <div className="min-h-[50px] hidden lg:block"></div>
                        <div className="border-y border-colorSecondary/20 divide-y divide-colorSecondary/20">
                            {
                                tabs.map((tab, index) => (
                                    <div key={index} onClick={() => setSelectedTab(tab)} className={`${selectedTab === tab ? 'text-colorFifth bg-colorPrimary' : 'text-colorSecondaryLight bg-transparent'} w-full cursor-pointer px-2 py-3 transition-all ease-in-out duration-150`}>{tab}</div>
                                ))
                            }
                        </div>
                    </div>

                    {/* right */}
                    <div className="lg:col-span-8">
                        <div className="min-h-[50px]">
                            <h3 className="text-colorSecondary text-2xl font-bold text-center tracking-wider">{selectedTab}</h3>
                        </div>

                        <div className="border-y border-colorSecondary/20 divide-y divide-colorSecondary/20">
                            {
                                data[selectedTab] && data[selectedTab].map((item, index) => (
                                    <div key={index} className="p-4">
                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="w-full focus:outline-none">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="flex-1 text-colorSecondary text-lg text-left">{item.text}</span>
                                                            <Icon icon={open ? 'ic:baseline-minus' : 'ic:baseline-plus'} className={`${open ? 'rotate-180' : ''} text-colorSecondary w-5 h-auto transition-all ease-in-out duration-300`} />
                                                        </div>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel>
                                                        <div className="p-4">
                                                            <ul className="text-colorSecondary list-disc tracking-wider leading-loose pl-4">
                                                                {
                                                                    item.li.map((ans, index) => (
                                                                        <li key={index}>{ans}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-colorSecondaryLight text-center text-lg tracking-wider py-10">Didn't find what you were looking for? Contact us!</p>
        </div>
    );
};

export default memo(FAQS);