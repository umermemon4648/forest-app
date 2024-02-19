import React, { memo, useEffect, useState } from "react";
import { HeadingSecondary, HeadingTertiary, Spinner, TextPrimary } from "../../element";
import siteImage from '../../assets/images/zimbabwe-asset-01.webp';
import AboutImageOne from '../../assets/images/zimbabwe-asset-02.webp';
import AboutImageTwo from '../../assets/images/zimbabwe-asset-03.webp';
import AboutImageThree from '../../assets/images/zimbabwe-asset-04.webp';
import galleryImageOne from '../../assets/images/zimbabwe-asset-05.webp';
import galleryImageTwo from '../../assets/images/zimbabwe-asset-06.webp';
import galleryImageThree from '../../assets/images/zimbabwe-asset-07.webp';
import { CrossGridSectionSecondary, JustTextImageSlider, ProductCardPrimary } from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../actions/productAction";
import { Link } from "react-router-dom";
import axios from "axios";

const Zimbabwe = () => {
    const dispatch = useDispatch();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState({ products: [] });
    const [error, setError] = useState(null);

    const data = {
        heading: 'Zimbabwe',
        textOne: 'Once known as the bread-basket of Africa, Zimbabwe has had its share of severe difficulties in the last decades. Massive deforestation for the planting of tobacco and burning word for fuel has resulted in the loss of some estimated 232,000 hectares since 2001-2022. About 300,000 hectares of indigenous woodland is still lost every year according to the Forestry Council.',
        textTwo: 'About 38.9% of Zimbabweans live below the poverty line.',

        planting: {
            heading: 'Harare',
            text: 'Located in Harare, the capitol of the country, we fund the planting of fruit trees in various parts of the city to help green the urban spaces and provide locals with a fresh source of sustenance.',
            image: siteImage,
            action: {
                label: 'Planting site',
                link: 'https://www.google.com/maps/d/viewer?mid=1dBy7JgzNBfqOdPKQZ1-jSnHcaenYx8s&ll=-17.825680206602943%2C31.025586918566&z=17'
            }
        },

        about: [
            {
                heading: 'About the country',
                text: 'Situated in southern Africa, Zimbabwe`s warm subtropical climate supports a range of ecosystems, from savannas to forests, and plays a vital role in shaping the country`s agriculture and natural landscapes. This enables the country to grow a vast array of foods from grains to legumes and fruit like bananas, citrus and avocados.',
                image: AboutImageOne
            },
            {
                heading: 'About the need',
                text: 'Decades of economic and political instability with tough land reform policies and lacking infrastructure have resulted in extreme poverty and food insecurity. Resource scarcity is especially evident in the capital Harare, where one can see many underserved communities seeking a reliable source of nourishment and income.',
                image: AboutImageTwo
            },
            {
                heading: 'The benefits',
                text: 'Planting food forests and orchards here provides a source of nutrition for the local communities and allows them to informally trade to earn an income. The positive ripple effects extend to cleaner air, reduced urban heat, and a stronger sense of community.',
                image: AboutImageThree
            }
        ],

        gallery: {
            heading: 'Gallery',
            slider: [
                {
                    image: galleryImageOne
                },
                {
                    image: galleryImageTwo
                },
                {
                    image: galleryImageThree
                }
            ]
        }
    };

    const { countries } = useSelector((state) => state.countries);

    async function getAllProducts() {
        setLoading(true);

        if (Array.isArray(countries)) {
            const selectedCountry = await countries?.find((country) => country.name == 'Zimbabwe');

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

    return (
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

export default memo(Zimbabwe);