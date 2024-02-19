import React, { memo, useEffect, useState } from "react";
import { HeadingSecondary, HeadingTertiary, Spinner, TextPrimary } from "../../element";
import siteImage from '../../assets/images/south-africa-asset-01.webp';
import AboutImageOne from '../../assets/images/south-africa-asset-02.webp';
import AboutImageTwo from '../../assets/images/south-africa-asset-03.webp';
import AboutImageThree from '../../assets/images/south-africa-asset-04.webp';
import galleryImageOne from '../../assets/images/south-africa-asset-05.webp';
import galleryImageTwo from '../../assets/images/south-africa-asset-06.webp';
import galleryImageThree from '../../assets/images/south-africa-asset-07.webp';
import galleryImageFour from '../../assets/images/south-africa-asset-08.webp';
import storyImage from '../../assets/images/south-africa-asset-09.webp';
import { CrossGridSectionSecondary, JustTextImageSlider, ProductCardPrimary } from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SouthAfrica = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState({ products: [] });
    const [error, setError] = useState(null);

    const data = {
        heading: 'South Africa',
        textOne: 'Along with our partner, Food & Trees for Africa, we plant food forests for local communities and enable independent self-owned businesses contributing to the local community and providing employment.',
        // textTwo: 'About 38.9% of Zimbabweans live below the poverty line.',

        planting: {
            heading: 'Ekurhuleni municipality',
            text: 'Located in the outlying areas to the east of Johannesburg, we focus on building agroforestry programmes in underserved communities.',
            image: siteImage,
            action: {
                label: 'Planting site',
                link: 'https://www.google.com/maps/d/viewer?mid=1dBy7JgzNBfqOdPKQZ1-jSnHcaenYx8s&ll=-26.12005014299765%2C28.461098526261033&z=16'
            }
        },

        about: [
            {
                heading: 'About the country',
                text: 'Thanks to the nation`s varied climate and fertile soil, South Africa boasts many exotic tree varieties like mangoes, avocados, and guavas, thriving in its subtropical regions. The bountiful harvest of these fruit trees not only contributes to the nation`s economy but also delights both locals and global consumers with their flavorful and nutritious offerings.',
                image: AboutImageOne
            },
            {
                heading: 'About the need',
                text: 'In South Africa, many communities face challenges related to food insecurity, limited access to nutritious food, and economic disparities. Rising poverty levels and unequal distribution of resources exacerbate these issues, leaving vulnerable populations struggling to meet their basic needs. Amidst these challenges, implementing food forests in local communities emerges as a transformative solution, offering a pathway towards self-sufficiency, improved nutrition, and economic empowerment.',
                image: AboutImageTwo
            },
            {
                heading: 'The benefits',
                text: 'Aside from the additional food security and contribution to a more nutritious diet, the food forests provide a green space for the locals to enjoy and allow them to even engage in small-scale businesses that generate additional income.',
                image: AboutImageThree
            }
        ],

        story: {
            heading: 'Gift`s Story',
            text: [
                'Meet Gift Ntombela, who founded a community farming initiative on the East Rand of Johannesburg that feeds the local community and provides education to the youth on sustainable farming practices.',
                'Gift had a vision of turning the local subsistence initiative into a thriving business that sells produce to local shops.',
                'The fruit trees we have planted on this farm will contribute to the assortment of produce for years to come.'
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
                },
                {
                    image: galleryImageThree
                },
                {
                    image: galleryImageFour
                }
            ]
        }
    };

    const { countries } = useSelector((state) => state.countries);

    async function getAllProducts() {
        setLoading(true);

        if (Array.isArray(countries)) {
            const selectedCountry = await countries?.find((country) => country.name == 'South Africa');

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

export default SouthAfrica;