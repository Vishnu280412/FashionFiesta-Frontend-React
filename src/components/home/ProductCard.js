import { Link } from 'react-router-dom';
import currency from "currency-formatter";
import { motion } from "framer-motion";
import { AiFillStar } from 'react-icons/ai';

const ProductCard = ({ product }) => {
    const discount = product.discount;
    const discountedPrice = product.price - (product.price * discount) / 100;
    let result = 0;
    let one = 0,
        two = 0,
        three = 0,
        four = 0,
        five = 0,
        total = 0;
    if(product?.reviews?.length > 0) {
      product?.reviews?.forEach(element => {
        if(element.rating === 1) {
          one += 1;
        } else if(element.rating === 2) {
          two += 1;
        } else if(element.rating === 3) {
          three += 1;
        } else if(element.rating === 4) {
          four += 1;
        } else if(element.rating === 5) {
          five += 1;
        }
      });
      total = one + two + three + four + five;
      result = ((one * 1) + (two * 2) + (three * 3) + (four * 4) + (five * 5)) / total;
    } else {
      result = 0;
      total = 0;
    }
    const finalResult = parseFloat(result).toFixed(1);
  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="w-full sm:w-6/12 md:w-4/12 xl:w-3/12 px-5 py-10" key={product._id}>
        <Link to={`/product/${product._id}`}>
        <div className="w-full">
            <img src={`${product.image1}`} alt="product image" className="w-full h-[350px] object-cover" />
        </div>
        <p className="capitalize text-base font-medium text-black my-2.5">{product.title}</p>
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mb-1">
            <span>{finalResult}</span>
            <AiFillStar color="orange" />
            <span>({total})</span>
          </div>
        </div>
        <div className="flex justify-between">
            <span className="text-lg font-medium text-black">{currency.format(discountedPrice, {code: 'INR'})}</span>
            <span className="text-lg font-medium text-gray-600 line-through">{currency.format(product.price, {code: 'INR'})}</span>
        </div>
        </Link>
    </motion.div>
  )
}

export default ProductCard