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
import { userContext } from '../../context/UserContext';

function CardProduct() {

    const getDefaultQuantity = (productType, weight) => {
        if (user?.role === "wholesaler") {
            return weight === 2 ? 5 : 2;
        }
        return 1;
    };


    const [select, setSelect] = useState('kashmir');
    const [productData, setProductData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState({
        kashmir: { weight: 2, price: 525, _id: '' },
        spain: { weight: 2, price: 575, _id: '' }
    });
    const { user } = useContext(userContext);
    const { addToCart, cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isKashmirInCart, setIsKashmirInCart] = useState(false);
    const [isSpainInCart, setIsSpainInCart] = useState(false);
    const [selectedWeight, setSelectedWeight] = useState(2);
    const [kashmirItemCount, setKashmirItemCount] = useState(getDefaultQuantity('kashmir', selectedWeight));
    const [spainItemCount, setSpainItemCount] = useState(getDefaultQuantity('spain', selectedWeight));

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
    
    useEffect(() => {
        setKashmirItemCount(getDefaultQuantity('kashmir', selectedWeight));
        setSpainItemCount(getDefaultQuantity('spain', selectedWeight));
    }, [selectedWeight, user]);

    const handleClick = (val) => {
        setSelect(val);
        setSelectedVariant({
            ...selectedVariant,
            [val]: productData[val === 'kashmir' ? 0 : 1].variants[0]
        });
    };

    

    const handleQuantityChange = (type, action) => {
        if (type === 'spain') {
            setSpainItemCount(prevCount => action === 'inc' ? prevCount + 1 : Math.max(prevCount - getDefaultQuantity('spain', selectedWeight), getDefaultQuantity('spain', selectedWeight)));
        } else if (type === 'kashmir') {
            setKashmirItemCount(prevCount => action === 'inc' ? prevCount + 1 : Math.max(prevCount - getDefaultQuantity('kashmir', selectedWeight), getDefaultQuantity('kashmir', selectedWeight)));
        }
    };

    const handleVariantChange = (productType, variant) => {
        setSelectedVariant({
            ...selectedVariant,
            [productType]: variant
        });
        setSelectedWeight(variant.weight);
    };

    const handleAddToCart = (productType) => {
        const selectedProduct = productType === 'kashmir' ? productData[0] : productData[1];
        const variant = selectedProduct.variants.find(
            (v) => v.weight === selectedVariant[productType].weight
        );

        if (variant) {
            const product = {
                _id: variant._id,
                name: selectedProduct.name,
                quantity: productType === 'kashmir' ? kashmirItemCount : spainItemCount,
                weight: selectedVariant[productType].weight,
                price: selectedVariant[productType].price,
                img: selectedProduct.img,
            };
            addToCart(product);
            console.log(product);

            if (productType === 'kashmir') {
                setIsKashmirInCart(true);
            } else {
                setIsSpainInCart(true);
            }
        } else {
            console.error('Variant not found for the selected weight.');
        }
    };

    const handleBuyNow = (productType) => {
        handleAddToCart(productType);
        navigate("/checkout"); // Redirect to checkout
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!productData) {
        return <div>Loading...</div>;
    }

    const currentProduct = select === 'kashmir' ? productData[0] : productData[1];
    const currentVariant = selectedVariant[select];

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
                                    className={`variant-button ${currentVariant._id === variant._id ? 'selected' : ''}`}
                                >
                                    {variant.weight} g
                                </button>
                            ))}
                        </div>
                        <div>
                            <p>In stock ({currentVariant.stock} Boxes Available)</p>
                        </div>
                        <div>
                          <p>Price: Rs {currentVariant.price}</p>
                        </div>
                    </div>
                    <div className={`cp_div22_1 ${select}`}>
                        <img src={saffron1} alt={productData[0].name} width={200} height={100} style={{ backgroundSize: "cover", borderRadius: "20px", objectFit: "cover", width: "100%", height: "100%" }} />
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
                        <img src={saffron2} alt={productData[1].name} width={200} height={100} style={{ backgroundSize: "cover", borderRadius: "20px", objectFit: "cover", width: "100%", height: "100%" }} />
                        <div className='cp_div22_11'>
                            <div className='cp_div22_11_1'><h1>{productData[1].name}</h1></div>
                            <div className='cp_div22_11_2'>
                                {isSpainInCart ? (
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
