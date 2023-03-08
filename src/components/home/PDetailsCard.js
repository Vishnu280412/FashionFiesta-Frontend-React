import { useState } from "react";
import currency from "currency-formatter";
import { motion } from "framer-motion";
import h2p from "html2plaintext";
import { BsCheck2 } from "react-icons/bs";
import htmlParser from "html-react-parser";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CiHeart } from "react-icons/ci";
import PDetailsImage from "./PDetailsImage";
import Quantity from "./Quantity";
import { addCart } from "../../store/reducers/cartReducer";
import { addWishlist } from "../../store/reducers/wishlistReducer";
import { discount } from "../../utils/discount";

const PDetailsCard = ({ product }) => {
    const [sizeState, setSizeState] = useState(product?.sizes?.length > 0 && product.sizes[0].name);
    const [colorState, setColorState] = useState(product?.colors?.length > 0 && product.colors[0].color);
    const [quantity, setQuantity] = useState(1);
    const inc = () => {
        setQuantity(quantity + 1);
    }
    const dec = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }
    const discountedPrice = discount(product.price, product.discount);
    let desc = h2p(product.description);
    desc = htmlParser(desc);
    const dispatch = useDispatch();

    const addToCart = () => {
        const {['colors']: colors, ['sizes']: sizes, ['createdAt']: createdAt, ['updatedAt']: updatedAt, ...newProduct} = product;
        newProduct['size'] = sizeState;
        newProduct['color'] = colorState;
        newProduct['quantity'] = quantity;
        const cart = localStorage.getItem('cart');
        const cartItems = cart ? JSON.parse(cart) : [];
        const checkItem = cartItems.find( item => item._id === newProduct._id);
        if(!checkItem) {
            cartItems.push(newProduct);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            dispatch(addCart(newProduct));
            toast.success("Product added to cart successfully!!");
        } else {
            toast.error(`${newProduct.title} is already in your cart`);
            return;
        }
    }

    const addToWishlist = () => {
        const {['colors']: colors, ['sizes']: sizes, ['createdAt']: createdAt, ['updatedAt']: updatedAt, ...newProduct} = product;
        newProduct['size'] = sizeState;
        newProduct['color'] = colorState;
        const wishlist = localStorage.getItem('wishlist');
        const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
        const checkItem = wishlistItems.find( item => item._id === newProduct._id);
        if(!checkItem) {
            wishlistItems.push(newProduct);
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
            dispatch(addWishlist(newProduct));
            toast.success("Product added to wishlist successfully!!");
        } else {
            toast.error(`${product.title} is already in your wishlist`);
            return;
        }
    }

  return (
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}} className="flex flex-wrap -mx-5">
        <Toaster />
        <div className="w-full order-2 md:order-1 md:w-6/12 p-6">
            <div className="flex flex-wrap -mx-1">
                <PDetailsImage image={product.image1}/>
                <PDetailsImage image={product.image2}/>  
                <PDetailsImage image={product.image3}/>
            </div>
        </div>
        <div className="w-full order-1 md:order-2 md:w-6/12 p-6">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{product.title}</h1>
            <div className="flex justify-between my-5">
                <span className="text-xl font-bold text-gray-900">{currency.format(discountedPrice, {code: "INR"})}</span>
                <span className="text-lg line-through text-gray-500">{currency.format(product.price, {code: "INR"})}</span>
            </div>
            {product.sizes.length > 0 && <>
                <h3 className="text-base font-medium capitalize text-gray-600 mb-1">sizes</h3>
                <div className="flex flex-wrap -mx-2">
                    {product.sizes.map((size, index) => (
                        <div className={`p-1.5 px-2.5 m-2 border border-gray-300 rounded cursor-pointer ${sizeState === size.name && 'bg-indigo-600'}`} key={size.name} onClick={() => setSizeState(size.name)}>
                            <span className={`text-sm font-semibold uppercase ${sizeState === size.name ? "text-white" : "text-gray-900"}`}>
                                {size.name}
                            </span>
                        </div>
                    ))}
                </div>
            </>}
            {product.colors.length > 0 && (<>
                <h3 className="text-base font-medium capitalize text-gray-600 mb-1 mt-4">colors</h3>
                <div className="flex flex-wrap -mx-2">
                    {product.colors.map((color, index) => (
                        <div className="m-2 p-1 border border-gray-300 rounded cursor-pointer" key={color.color} onClick={() => setColorState(color.color)}>
                            <span className="min-w-[40px] min-h-[40px] rounded flex items-center justify-center" style={{backgroundColor: color.color}}>
                                {colorState === color.color && <BsCheck2 className="text-white" size={25} />}
                            </span>
                        </div>
                    ))}
                </div>
            </>)}
            <div className="flex -mx-3 items-center">
                <div className="w-full sm:w-6/12 p-3">
                    <Quantity quantity={quantity} inc={inc} dec={dec} />
                </div>
                <div className="w-full sm:w-6/12 p-3">
                    <button className="btn btn-indigo" onClick={addToCart}>add to cart</button>
                </div>
            </div>
            <div className="flex -mx-3 items-center">
                <div className="w-full sm:w-6/12 p-3">
                    <CiHeart className="cursor-pointer" onClick={addToWishlist} size={30} />
                </div>
            </div>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-1 mt-4">description</h3>
            <div className="mt-4 leading-[27px] description">{desc}</div>
        </div>
    </motion.div>
  )
}

export default PDetailsCard;