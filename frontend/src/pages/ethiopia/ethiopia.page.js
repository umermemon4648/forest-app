import React, { memo, useEffect, useState } from "react";
import { HeadingSecondary, HeadingTertiary, Spinner, TextPrimary } from "../../element";
import siteImage from '../../assets/images/ethiopia-asset-01.webp';
import AboutImageOne from '../../assets/images/ethiopia-asset-02.webp';
import AboutImageTwo from '../../assets/images/ethiopia-asset-03.webp';
import AboutImageThree from '../../assets/images/ethiopia-asset-04.webp';
import galleryImageOne from '../../assets/images/ethiopia-asset-05.webp';
import galleryImageTwo from '../../assets/images/ethiopia-asset-06.webp';
// import galleryImageThree from '../../assets/images/zimbabwe-asset-07.webp';
import storyImage from '../../assets/images/ethiopia-asset-07.webp';
import { CrossGridSectionSecondary, JustTextImageSlider, ProductCardPrimary } from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../actions/productAction";
import { Link } from "react-router-dom";
import axios from "axios";

const Ethiopia = () => {
    const dispatch = useDispatch();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState({ products: [] });
    const [error, setError] = useState(null);

    const data = {
        heading: 'Ethiopia',
        textOne: 'The degradation of Ethiopia`s forest habitats stems from inequitable development, slash-and-burn agricultural practices, charcoal production, and overexploitation of forest resources. This has a profound impact on the rural communities who heavily depend on the land for their daily necessities like food, water, and shelter. As forests diminish, the survival and sustenance of these communities are increasingly compromised due to the scarcity of natural resources. ',
        textTwo: '23.5% of Ethiopians already live below the poverty line.',

        planting: {
            heading: 'Dawuro region',
            text: 'Located in the Omo Valley about 500km south of Addis Ababa. We focus on the restoration of riverine forests. This involves developing an agroforestry programme to promote food security. It covers 2,360 hectares and employs 5 individuals through Eden Reforestation Projects.',
            image: siteImage,
            action: {
                label: 'Planting site',
                link: 'https://www.google.com/maps/d/viewer?mid=1dBy7JgzNBfqOdPKQZ1-jSnHcaenYx8s&ll=7.254455832378273%2C37.38813738375718&z=12'
            }
        },

        about: [
            {
                heading: 'About the country',
                text: 'Ethiopia, located in the Horn of Africa, is a land of remarkable diversity, both culturally and ecologically. As one of the oldest countries in the world, it boasts a rich history dating back thousands of years. The country`s ecosystems are as diverse as its people, encompassing lush highlands, fertile plateaus, vast savannas, and dense forests. Ethiopia`s varied landscapes host a wide range of flora and fauna, with unique endemic species found nowhere else on the planet.',
                image: AboutImageOne
            },
            {
                heading: 'About the need',
                text: 'Deforestation, climate change, and soil degradation are significant challenges faced by the country, leading to reduced agricultural productivity, water scarcity, and increased vulnerability to extreme weather events such as drought and floods. All ultimately leading to food shortages. 428,000 hectares were lost since 2001, affecting the 23,7% of Ethiopians who live below the poverty line.',
                image: AboutImageTwo
            },
            {
                heading: 'The benefits',
                text: 'By planting trees near water bodies and along riverbanks, the Dawuro community contributes to protecting water quality and supporting aquatic ecosystems, stops run-off and thus preventing soil erosion. Furthermore, planting fosters community cohesion and empowers residents to actively participate in environmental conservation efforts, fostering a sense of ownership, as seen with the Green Legacy initiative.',
                image: AboutImageThree
            }
        ],

        story: {
            heading: 'The Great Green Wall',
            text: [
                'The Great Green Wall Initiative is an ambitious and visionary project aimed at combating desertification, land degradation, and climate change in the Sahel region of Africa. Spanning across more than 20 countries, from Senegal in the west to Djibouti in the east, the initiative seeks to create a mosaic of restored and productive landscapes. By planting a vast "green wall" of trees, shrubs, and vegetation, the project aims to halt the southward expansion of the Sahara Desert, promote sustainable land management, and improve the livelihoods of millions of people in the region. Beyond environmental restoration, the Great Green Wall Initiative stands as a symbol of hope and unity, bringing countries together in a collective effort to tackle one of the most pressing challenges facing Africa and the world.'
            ],
            image: storyImage
        },

        gallery: {
            heading: 'Gallery',
            slider: [
                {
                    image: galleryImageOne
                },
                {
                    image: galleryImageTwo
                }
            ]
        }
    };

    const { countries } = useSelector((state) => state.countries);

    async function getAllProducts() {
        setLoading(true);

        if (Array.isArray(countries)) {
            const selectedCountry = await countries?.find((country) => country.name == 'Ethiopia');

            try {
                const { data } = await axios.get(`${apiBaseUrl}/api/v1/products?countries=${selectedCountry?._id}`, {
                    headers: {
                        // Authorization: `Bearer ${props.token}`,
                        "Content-Type": "application/json",
                    },
                });
                setAllProducts(data);
                setLoading(false);
            } catch (error) {
                setError(error.response.data.message);
                setLoading(false);
            }
        };
    };

    useEffect(() => {
        if(Array.isArray(countries)) {
            getAllProducts();
        } else {
            dispatch(getCountries());
        };
    }, [dispatch, countries]);

    return(
        <div>
            {/* hero section */}
            <div className="w-11/12 max-w-[700px] m-auto py-7 text-left space-y-4">
                <HeadingSecondary rootClass='text-colorSecondary text-[50px] sm:text-[68px]' text={data.heading} />
                {
                    data.textOne &&
                    <TextPrimary rootClass='text-colorSecondaryLight' text={data.textOne} />
                }
                {
                    data.textTwo &&
                    <TextPrimary rootClass='text-colorSecondaryLight' text={data.textTwo} />
                }
            </div>

            {/* planting site */}
            <div className="w-11/12 max-w-[1100px] m-auto py-10 md:py-20 text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
                    <div className="order-2 md:order-1 text-left space-y-8 p-8 lg:p-16">
                        <HeadingTertiary rootClass='text-colorSecondary leading-tight' text={data.planting.heading} />
                        <TextPrimary rootClass='text-colorSecondaryLight' text={data.planting.text} />
                        <div>
                            <a href={data.planting.action.link} target="_blank" className="buttonPrimary">{data.planting.action.label}</a>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 w-full h-[330px] md:h-auto bg-cover bg-no-repeat bg-center rounded-t-xl md:rounded-r-xl md:rounded-tl-none" style={{ backgroundImage: `url(${data.planting.image})` }}></div>
                </div>
            </div>

            {/* about */}
            <div className="w-11/12 max-w-[1100px] m-auto py-10 md:py-20 text-center">
                <CrossGridSectionSecondary data={data.about} />
            </div>

            {/* story */}
            <div className="w-11/12 max-w-[1100px] m-auto py-10 md:py-20 text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
                    <div className="order-2 md:order-1 text-left space-y-8 p-8 lg:p-16">
                        <HeadingTertiary rootClass='text-colorSecondary leading-tight' text={data.story.heading} />
                        <ul className="text-colorSecondaryLight space-y-5 leading-relaxed">
                            {
                                data.story.text.map((text, index) => (
                                    <li key={index}>{text}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 w-full aspect-video md:aspect-auto bg-cover bg-no-repeat bg-center rounded-t-xl md:rounded-tl-none md:rounded-r-xl" style={{ backgroundImage: `url(${data.story.image})` }}></div>
                </div>
            </div>

            {/* products */}
            <div className="w-11/12 max-w-[1100px] m-auto space-y-10 py-10 md:py-20">
                <HeadingTertiary rootClass='text-colorSecondary' text={'Plant trees in this country'} />
                {/* loading */}
                {
                    loading &&
                    <div className="flex items-center justify-center">
                        <Spinner rootClass='w-20 h-20' />
                    </div>
                }

                {/* empty */}
                {
                    !loading && allProducts.products && allProducts.products.length <= 0 &&
                    <div>
                        <HeadingSecondary rootClass='text-colorSecondary' text={'No products found!'} />
                    </div>
                }

                {/* cards */}
                {
                    !loading && allProducts.products && allProducts.products.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10">
                            {
                                allProducts.products.map((product) => (
                                    <ProductCardPrimary key={product._id} product={product} />
                                ))
                            }
                        </div>
                    )
                }
            </div>

            {/* gallery */}
            <div>
                <div className="flex items-center justify-center py-12">
                    <HeadingTertiary rootClass='text-colorSecondary' text={data.gallery.heading} />
                </div>
                <div>
                    <JustTextImageSlider data={data.gallery.slider} />
                </div>
            </div>

            {/* back to projects */}
            <div className="bg-colorFourth flex items-center justify-center py-10">
                <Link to='/projects-and-countries'>
                    <div className="buttonSecondary">Back to all projects</div>
                </Link>
            </div>
        </div>
    );
};

export default memo(Ethiopia);