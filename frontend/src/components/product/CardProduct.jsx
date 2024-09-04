import React, { useState, useEffect, useContext } from 'react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { GrFormCheckmark } from "react-icons/gr";
import axios from 'axios';
import './CardProduct.css';
import CartIcon from './CartIcon';
import CartModel from './CartModel';
import { CartContext } from '../../context/CartContext';
import saffron1 from "/saffron-1.jpg"; 
import saffron2 from "/saffron-2.jpg";
import { useNavigate } from 'react-router-dom';

function CardProduct() {
    const [select, setSelect] = useState('kashmir');
    const [productData, setProductData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState({
        kashmir: { weight: 2, price: 525, _id: '' },
        spain: { weight: 2, price: 575, _id: '' }
    });
    const [kashmirItemCount, setKashmirItemCount] = useState(1);
    const [spainItemCount, setSpainItemCount] = useState(1);
    const [isKashmirInCart, setIsKashmirInCart] = useState(false);
    const [isSpainInCart, setIsSpainInCart] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addToCart, cartItems } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products'); // Adjust the endpoint based on your backend setup
                const productData = response.data.map((product, index) => ({
                    ...product,
                    img: index % 2 === 0 ? saffron1 : saffron2, // Assign images alternately or based on some logic
                }));
                setProductData(productData);
                setSelectedVariant({
                    kashmir: productData[0].variants[0],
                    spain: productData[1].variants[0]
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
    
        fetchProducts();
    }, []);
    

    const handleClick = (val) => {
        setSelect(val);
        // Change the selected variant when switching products
        setSelectedVariant({
            ...selectedVariant,
            [val]: productData[val === 'kashmir' ? 0 : 1].variants[0]
        });
    };

    const handleQuantityChange = (type, action) => {
        if (type === 'spain') {
            setSpainItemCount(prevCount => action === 'inc' ? prevCount + 1 : Math.max(prevCount - 1, 1));
        } else if (type === 'kashmir') {
            setKashmirItemCount(prevCount => action === 'inc' ? prevCount + 1 : Math.max(prevCount - 1, 1));
        }
    };

    const handleVariantChange = (productType, variant) => {
        setSelectedVariant({
            ...selectedVariant,
            [productType]: variant
        });
    };

    const handleAddToCart = (productType) => {
        const selectedProduct = productType === 'kashmir' ? productData[0] : productData[1];
        const variant = selectedProduct.variants.find(
            (v) => v.weight === selectedVariant[productType].weight
        );

        if (variant) {
            const product = {
                _id: variant._id, // Add variant ID here
                name: selectedProduct.name,
                quantity: productType === 'kashmir' ? kashmirItemCount : spainItemCount,
                weight: selectedVariant[productType].weight,
                price: selectedVariant[productType].price,
                img: selectedProduct.img, // Add image URL here
            };
            addToCart(product);
            console.log(product);

            if (productType === 'kashmir') {
                setIsKashmirInCart(true);
                setKashmirItemCount(1); // Reset quantity to 1 after adding to cart
            } else {
                setIsSpainInCart(true);
                setSpainItemCount(1); // Reset quantity to 1 after adding to cart
            }
        } else {
            console.error('Variant not found for the selected weight.');
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/checkout"); // Redirect to checkout
      };

    const navigate = useNavigate();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!productData) {
        return <div>Loading...</div>;
    }

    const currentProduct = select === 'kashmir' ? productData[0] : productData[1];
    const currentVariant = selectedVariant[select];
    const currentImage = select === 'kashmir' ? saffron1 : saffron2; // Set the appropriate image

    return (
        <div className='cp_main'>
            <div className='cp_div1'>
                <div>
                    <h1>Z PRINCESSAFFRON</h1>
                </div>
            </div>
            <div className='cp_div2'>
                <div className='cp_div21'>
                    <h1>EXPERIENCE OUR SAFFRON</h1>
                </div>
                <div className='cp_div22'>
                    <div className='cp_div22_3'>
                        <h1>{currentProduct.name}</h1>
                        <h5 style={{paddingTop: "5px", paddingBottom: "5px"}}>{currentProduct.description}</h5>
                        <p>{currentProduct.content}</p>
                        <div className='cp_div22_31'>
                            {currentProduct.variants.map((variant) => (
                                <button
                                    key={variant._id}
                                    onClick={() => handleVariantChange(select, variant)}
                                    className={currentVariant._id === variant._id ? 'selected' : ''}
                                >
                                    {variant.weight} g
                                </button>
                            ))}
                        </div>
                        <div>
                            <p>In stock ({currentVariant.stock} Available)</p>
                        </div>
                        <div>
                          <p>Price: Rs {currentVariant.price}</p>
                        </div>
                    </div>
                    <div className={`cp_div22_1 ${select}`}>
                        <img src={saffron1} alt={productData[0].name} width={200} height={100} style={{ backgroundSize: "cover", borderRadius: "20px", objectFit: "cover", width: "100%", height: "100%" }} /> {/* Kashmir Saffron Image */}
                        <div className='cp_div22_11'>
                            <div className='cp_div22_11_1'><h1>{productData[0].name}</h1></div>
                            <div className='cp_div22_11_2'>
                                {isKashmirInCart ? (
                                    <div className='cp_cart_hover'>
                                        <button onClick={() => handleQuantityChange('kashmir', 'dec')}>-</button> 
                                        <p>{kashmirItemCount}</p> 
                                        <button onClick={() => handleQuantityChange('kashmir', 'inc')}>+</button>
                                        <button onClick={() => {handleAddToCart('kashmir'), setIsKashmirInCart(false)} }><GrFormCheckmark /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleAddToCart('kashmir')}>ADD TO CART</button>
                                )}
                                <button onClick={() => handleBuyNow('kashmir')}>BUY</button>
                            </div>
                        </div>
                    </div>
                    <div className={`cp_div22_2 ${select}`}>
                        <img src={saffron2} alt={productData[1].name} width={200} height={100} style={{ backgroundSize: "cover", borderRadius: "20px", objectFit: "cover", width: "100%", height: "100%" }} /> {/* Spain Saffron Image */}
                        <div className='cp_div22_11'>
                            <div className='cp_div22_11_1'><h1>{productData[1].name}</h1></div>
                            <div className='cp_div22_11_2'>
                                {isSpainInCart > 0 ? (
                                    <div className='cp_cart_hover'>
                                        <button onClick={() => handleQuantityChange('spain', 'dec')}>-</button> 
                                        <p>{spainItemCount}</p> 
                                        <button onClick={() => handleQuantityChange('spain', 'inc')}>+</button>
                                        <button onClick={() => {handleAddToCart('spain'), setIsSpainInCart(false)} }><GrFormCheckmark /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleAddToCart('spain')}>ADD TO CART</button>
                                )}
                                <button onClick={() => handleBuyNow('spain')}>BUY</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='cp_div23'></div>
                <div className='cp_div3'>
                    <div className='cp_div31'>
                        <div className='cp_div31_1'>
                            <div className={`cp_div31_11 ${select}`}></div>
                        </div>
                    </div>
                    <div className='cp_div32'>
                        <button onClick={() => handleClick('kashmir')}><FaArrowLeft /></button>
                        <button onClick={() => handleClick('spain')}><FaArrowRight /></button>
                    </div>
                </div>
            </div>
            <CartIcon itemCount={cartItems.length} onClick={handleOpenModal} />
            <CartModel isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}

export default CardProduct;
