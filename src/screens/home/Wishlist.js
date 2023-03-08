import { useSelector, useDispatch } from 'react-redux';
import currency from "currency-formatter";
import { BsTrash } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Nav from '../../components/home/Nav';
import { discount } from '../../utils/discount';
import { removeItem } from '../../store/reducers/wishlistReducer';

const Wishlist = () => {
  const { wishlist } = useSelector(state => state.wishlistReducer);
  const dispatch = useDispatch();

  const remove = (id) => {
    dispatch(removeItem(id));
  }

  return (
    <>
        <Nav />
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}} className="my-container mt-28">
          {wishlist.length > 0 ? (<>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="thead-tr">
                    <th className="thead-th">image</th>
                    <th className="thead-th">title</th>
                    <th className="thead-th">color</th>
                    <th className="thead-th">size</th>
                    <th className="thead-th">price</th>
                    <th className="thead-th">availability</th>
                    <th className="thead-th">remove</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map(item => {
                    
                    return(
                      <tr className="even:bg-gray-50" key={item._id}>
                        <td className="tbody-td">
                          <Link to={`/product/${item._id}`}>
                            <img src={item.image1} alt="image1" className="w-20 h-20 object-cover rounded-full" />
                          </Link>
                        </td>
                        <td className="tbody-td font-medium">
                          <Link to={`/product/${item._id}`}>{item.title}</Link>
                        </td>
                        <td className="tbody-td">
                          {item.color ? <span className="block w-[15px] h-[15px] rounded-full" style={{backgroundColor: item.color}}></span> : <span className="block text-2xl items-center">-</span>}
                        </td>
                        <td className="tbody-td">
                          {item.size ? <span className="font-semibold uppercase">{item.size}</span> : <span className="block text-2xl items-center">-</span>}
                        </td>
                        <td className="tbody-td font-bold text-gray-900">{currency.format(discount(item.price, item.discount), {code: "INR"})}</td>
                        <td className="tbody-td">
                          {item.stock > 20 ? <span className="text-green-600 font-semibold text-[12px] uppercase">in stock</span> 
                          : item.stock > 0 ? <span className="text-yellow-600 font-semibold text-[12px] uppercase">{`Only ${item.stock} items left!!`}</span> 
                          : <span className="text-red-600 font-semibold text-[12px] uppercase">Out of Stock</span>}
                        </td>
                        <td className="tbody-td">
                          <span className="cursor-pointer" onClick={() => {
                            if(window.confirm("Are you sure, you want to remove this item from wishlist?")) {
                              remove(item._id);
                            }
                          }}>
                            <BsTrash className="text-rose-600" size={20} />
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>) : (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md text-sm font-medium text-indigo-800">Your wishlist is empty.</div>
          )}
        </motion.div>
    </>
  )
}

export default Wishlist;