import React, { memo, useEffect, useState } from "react";
import { HeadingSecondary, HeadingTertiary, Spinner, TextPrimary } from "../../element";
import siteImage from '../../assets/images/mozambique-asset-01.webp';
import AboutImageOne from '../../assets/images/mozambique-asset-02.webp';
import AboutImageTwo from '../../assets/images/mozambique-asset-03.webp';
import AboutImageThree from '../../assets/images/mozambique-asset-04.webp';
import galleryImageOne from '../../assets/images/mozambique-asset-05.webp';
import galleryImageTwo from '../../assets/images/mozambique-asset-06.webp';
import galleryImageThree from '../../assets/images/mozambique-asset-07.webp';
import galleryImageFour from '../../assets/images/mozambique-asset-08.webp';
import storyImage from '../../assets/images/mozambique-asset-09.webp';
import { CrossGridSectionSecondary, JustTextImageSlider, ProductCardPrimary } from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../actions/productAction";
import { Link } from "react-router-dom";
import axios from "axios";

const Mozambique = () => {
    const dispatch = useDispatch();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState({ products: [] });
    const [error, setError] = useState(null);

    const data = {
        heading: 'Mozambique',
        textOne: 'In Mozambique, diverse landscapes and rich biodiversity depend on forests playing a vital role in social, environmental, and economic prosperity. Unfortunately, over 8 million hectares of forests (equivalent to approximately 12,800 square kilometers) have been lost due to factors such as cyclones, floods, unsustainable fuelwood and charcoal consumption, extensive land clearance for agriculture, and commercial logging. Addressing these causes is crucial to combat deforestation in Mozambique.',
        textTwo: 'With over 45% of Mozambique`s population living beneath the poverty line, communities rely heavily on natural resources and forests.',

        planting: {
            heading: 'Djabissa',
            text: 'Situated to the south of Maputo, Mozambique`s capital city, the Djabissa mangrove reforestation site rests along a prominent waterway leading to Maputo Bay. This initiative focuses on restoring mangrove forests devastated by charcoal production and logging. Restoration is run by Eden Reforestation Projects with a predominantly female workforce.',
            image: siteImage,
            action: {
                label: 'Planting site',
                link: 'https://www.google.com/maps/d/viewer?mid=1dBy7JgzNBfqOdPKQZ1-jSnHcaenYx8s&ll=-26.175481186669444%2C32.419463003805404&z=14'
            }
        },

        about: [
            {
                heading: 'About the country',
                text: 'Located in southeastern Africa, Mozambique boasts extensive and ecologically vital mangrove forests. These lush coastal habitats play a crucial role in preserving biodiversity, protecting shorelines from erosion, and serving as essential nurseries for various marine species.',
                image: AboutImageOne
            },
            {
                heading: 'About the need',
                text: 'Mozambique has experienced significant mangrove loss due to human activities. This is significant, because mangrove forests act as natural buffers, safeguarding coastal communities from the impacts of storms, tidal surges, and sea-level rise, which have become worse with climate change. As seen with hurricane Eloise in 2021, the flooding along the coast destroyed homes and affected over 440,000 people.',
                image: AboutImageTwo
            },
            {
                heading: 'The benefits',
                text: 'Mangrove forests provide a multitude of benefits, including coastal protection against erosion, fostering biodiversity, acting as nurseries for marine species, and contributing to climate change mitigation through carbon sequestration. It makes up a vital ecosystem that houses over 470 bird species. The local community benefits from the fishing opportunities and protection from severe storms and floods.',
                image: AboutImageThree
            }
        ],

        story: {
            heading: 'Amélia`s Story',
            text: [
                'Meet Amélia Chilengue, a young mother from Mozambique, who faced immense challenges after her husband`s tragic murder in January 2021. With two small children to raise and no source of income, she began cleaning homes but struggled to make ends meet.',
                'Fortunately, a kind neighbour who monitored mangroves at a site in Chilhale came to Amélia`s aid. They helped her secure a job as a planter, a turning point in her life. Fast-forward to today, Amélia wakes up at 5:00 AM every workday, tending to her family`s needs before carefully planting propagules in the muddy mangrove planting site.',
                'With your support, Amélia can provide for her daughters and ensure their education. She takes immense pride in her work, knowing she`s leaving a meaningful legacy for her children—one that involves contributing to restoring the environment through tree planting.'
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
            const selectedCountry = await countries?.find((country) => country.name == 'Mozambique');

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

export default memo(Mozambique);