import React, { memo } from "react";
import { ButtonSecondary, HeadingTertiary, TextPrimary, Ul } from "../../element";
import { CrossGridSection, JustTextImageSlider } from "../../component";
import { useNavigate } from "react-router-dom";

const HowWeDoIt = () => {
    const navigate = useNavigate();

    const data = {
        heading: 'Every Tree Planted Matters',
        text: 'At Our Forest, we believe that simply scattering seeds in a field doesn`t guarantee the growth of 100 trees. We also understand that intensive planting of a single species is not sustainable or conducive to biodiversity.',

        process: {
            heading: 'Our process is simple',
            text: 'Together with our partners we can revitalise local ecosystems by planting, growing, allowing the trees to multiply and eventually create a new forest.',
            slider: [
                {
                    label: 'Plant',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/20190821_Mozambique_0067_1.jpg?v=1688218627&width=900'
                },
                {
                    label: 'Grow',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0325.jpg?v=1689190639&amp;width=900'
                },
                {
                    label: 'Multiply',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/Mozambique_1_copywm.jpg?v=1689190461&width=900'
                },
                {
                    label: 'Forest',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/Mangrove_forest_from_above.jpg?v=1689190197&width=900'
                }
            ]
        },

        list: [
            {
                heading: 'Seedling',
                text: 'Sourcing high-quality seeds from native tree species. Implementing rigorous germination and selection processes to ensure strong and healthy seedlings. Nurturing seedlings in a controlled environment to promote optimal growth and development.',
                image: 'https://www.ourforest.co.za/cdn/shop/files/20190821_Mozambique_0094.jpg?v=1689372964&width=750'
            },
            {
                heading: 'Nursery',
                text: 'Transferring selected seedlings to well-maintained nurseries. Providing specialized care, including regular watering, nutrient-rich soil, and protection from pests and diseases. Monitoring the seedlings` progress and adjusting care as needed to ensure healthy growth before they are planted',
                image: 'https://www.ourforest.co.za/cdn/shop/files/Mozambique_Maputo_Province_Nursery_5a9a81cf-ec5f-4578-b929-6ae4568ec014.jpg?v=1691254406&width=750'
            },
            {
                heading: 'Growth',
                text: 'Planting mature and robust seedlings in carefully selected sites. Employing sustainable planting techniques to promote tree survival and establishment. Monitoring the trees` growth and progress over time to ensure their health and resilience.',
                image: 'https://www.ourforest.co.za/cdn/shop/files/Mozambique_MaputoBay_2021_Progress_Saplings_wm.jpg?v=1689372720&width=750'
            },
            {
                heading: 'Impact',
                text: 'Eventually growing into a tree, where it can serve multiple purposes, such as:',
                li: [
                    'sequestering carbon.',
                    'adding to the biodiversity.',
                    'a source of income for the farmer who planted it.',
                    'providing food for the local community.'
                ],
                image: 'https://www.ourforest.co.za/cdn/shop/files/Mozambique_2022_copywm.jpg?v=1691254324&width=750'
            }
        ],

        ourProject: {
            heading: 'How we select our projects',
            list: [
                {
                    label: 'CO2 impact',
                    text: 'Maximising the amount of carbon absorbed from the atmosphere to mitigate the warming effects of climate change.',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/CO2_icon_b2e846f3-ff7e-4dae-a6cd-72f410f37f4e.jpg?v=1688854476&width=400'
                },
                {
                    label: 'Biodiversity',
                    text: 'A positive influence on the local ecosystem and wildlife. Native trees are essential. See our principles.',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/Stages_of_tree.jpg?v=1689375590&width=300'
                },
                {
                    label: 'Soci-economic impact',
                    text: 'Providing jobs and opportunities for local communities.',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0309.jpg?v=1688219362&width=750'
                },
                {
                    label: 'Transparency',
                    text: 'Clear and precise data on the projects and the trees. See where your tree is planted and track the progress on a regular basis. Our impact is measurable and truly makes a difference.',
                    image: 'https://www.ourforest.co.za/cdn/shop/files/Pin_drop_on_map_icon_1ef74fae-3ed9-432c-b813-ab46c1776e36.jpg?v=1688834536&width=300'
                }
            ],
            action: {
                label: 'View projects',
                action: () => navigate('/projects-and-countries')
            }
        },

        ourPartners: {
            heading: 'Our partners',
            textOne: 'We choose our partners based on their impact and accreditation. That is why we have chosen some of the best initiatives out there:',
            li: [
                'Eden Reforestation Projects',
                'Food and Trees for Africa'
            ],
            textTwo: 'Our impact is measurable and truly makes a difference and these partners make the magic happen on the ground where it is needed most. They provide the necessary resources and training for the local communities to benefits from the tree planting projects.',
            image: 'https://www.ourforest.co.za/cdn/shop/files/Our_Forest_Partners_7891d85e-53e8-45df-b166-42d301e243b0.png?v=1691964901&width=750'
        }
    };

    return(
        <div>
            {/* Every Tree Planted Matters */}
            <div className="bg-colorFourth py-10 lg:py-16">
                <div className="w-11/12 md:w-8/12 max-w-[780px] m-auto text-center space-y-4">
                    <HeadingTertiary rootClass='text-colorFifth' text={data.heading} />
                    <TextPrimary rootClass='text-colorSixth' text={data.text} />
                </div>
            </div>

            {/* Our process is simple */}
            <div>
                {/* main title */}
                <div className="w-11/12 md:w-8/12 max-w-[780px] text-center m-auto space-y-4 py-20">
                    <HeadingTertiary rootClass='text-colorSecondary' text={data.process.heading} />
                    <TextPrimary rootClass='text-colorSecondary' text={data.process.text} />
                </div>

                {/* slider */}
                <JustTextImageSlider data={data.process.slider} />
            </div>

            {/* cross card listing */}
            <div className="w-11/12 max-w-[1100px] m-auto py-20">
                <CrossGridSection data={data.list} showSteps={true} />
            </div>

            {/* How we select our projects */}
            <div className="bg-colorFourth py-10">
                <div className="w-11/12 max-w-[1100px] m-auto space-y-6">
                    <HeadingTertiary rootClass='text-colorFifth' text={data.ourProject.heading} />

                    {/* cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {
                            data.ourProject.list.map((item, index) => (
                                <div key={index} className="space-y-3 p-4">
                                    {/* image */}
                                    <div className="w-full aspect-square bg-cover bg-no-repeat bg-center rounded-full overflow-hidden" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    {/* heading */}
                                    <h3 className="text-colorFifth kalam text-2xl font-bold tracking-wider">{item.label}</h3>
                                    {/* text */}
                                    <TextPrimary rootClass='text-colorSixth' text={item.text} />
                                </div>
                            ))
                        }
                    </div>

                    <div className="flex justify-center">
                        <ButtonSecondary label={data.ourProject.action.label} handleClick={data.ourProject.action.action} />
                    </div>
                </div>
            </div>

            {/* Our partners */}
            <div className="w-11/12 max-w-[1100px] m-auto py-10 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* image */}
                    <div className="w-full aspect-square lg:aspect-auto bg-cover bg-no-repeat bg-center rounded-l-3xl overflow-hidden shadow-2xl" style={{ backgroundImage: `url(${data.ourPartners.image})` }}></div>

                    {/* content */}
                    <div className="p-10 lg:p-20 space-y-3">
                        <HeadingTertiary rootClass='text-colorSecondary' text={data.ourPartners.heading} />
                        <TextPrimary rootClass='text-colorSecondary' text={data.ourPartners.textOne} />
                        <div className="pl-10">
                            <Ul list={data.ourPartners.li} />
                        </div>
                        <TextPrimary rootClass='text-colorSecondary' text={data.ourPartners.textTwo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(HowWeDoIt);