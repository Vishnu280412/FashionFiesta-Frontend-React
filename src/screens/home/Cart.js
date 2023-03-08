import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import currency from "currency-formatter";
import { BsTrash } from 'react-icons/bs';
import { motion } from 'framer-motion';
import Nav from '../../components/home/Nav';
import { discount } from '../../utils/discount';
import Quantity from '../../components/home/Quantity';
import { incQuantity, decQuantity, removeItem } from '../../store/reducers/cartReducer';
import { Link } from 'react-router-dom';
import { useSendPaymentMutation } from '../../store/services/paymentService';

const Cart = () => {
  const { cart, total } = useSelector(state => state.cartReducer);
  const { userToken, user } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const inc = (id) => {
    dispatch(incQuantity(id));
  }
  const dec = (id) => {
    dispatch(decQuantity(id));
  }
  const remove = (id) => {
    dispatch(removeItem(id));
  }
  const navigate = useNavigate();
  const [sendPayment, response] = useSendPaymentMutation();
  const pay =  () => {
    if(userToken) {
      sendPayment({cart, id: user.id});
    } else{
      navigate('/login');
    }
  }
  useEffect(() => {
    if(response?.isSuccess) {
      window.location.href = response?.data?.url;
    }
  }, [response])
  return (
    <>
        <Nav />
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}} className="my-container mt-28">
          {cart.length > 0 ? (<>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="thead-tr">
                    <th className="thead-th">image</th>
                    <th className="thead-th">name</th>
                    <th className="thead-th">color</th>
                    <th className="thead-th">size</th>
                    <th className="thead-th">price</th>
                    <th className="thead-th">quantity</th>
                    <th className="thead-th">total</th>
                    <th className="thead-th">remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => {
                    return(
                      <tr className="even:bg-gray-50" key={item._id}>
                        <td className="tbody-td">
                          <img src={item.image1} alt="image1" className="w-20 h-20 object-cover rounded-full" />
                        </td>
                        <td className="tbody-td font-medium">{item.title}</td>
                        <td className="tbody-td">
                          {item.color ? <span className="block w-[15px] h-[15px] rounded-full" style={{backgroundColor: item.color}}></span> : <span className="block text-2xl items-center">-</span>}
                        </td>
                        <td className="tbody-td">
                          {item.size ? <span className="font-semibold uppercase">{item.size}</span> : <span className="block text-2xl items-center">-</span>}
                        </td>
                        <td className="tbody-td font-bold text-gray-900">{currency.format(discount(item.price, item.discount), {code: "INR"})}</td>
                        <td className="tbody-td">
                          <Quantity quantity={item.quantity} inc={() => inc(item._id)} dec={() => dec(item._id)} theme="indigo" />
                        </td>
                        <td className="tbody-td font-bold">{currency.format(discount(item.price, item.discount) * item.quantity, {code: "INR"})}</td>
                        <td className="tbody-td">
                          <span className="cursor-pointer" onClick={() => {
                            if(window.confirm("Are you sure, you want to remove this item from cart?")) {
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
            <div className="bg-indigo-50 p-3 flex mt-5 rounded-md items-center">
              <div className="w-full flex justify-between">
                <span className="text-lg font-semibold text-indigo-700">Total Price:</span>
                <span className="text-lg font-semibold text-indigo-700 mr-5">{currency.format(total, {code: "INR"})}</span>
              </div>
              <button className="btn flex bg-indigo-600 text-sm font-medium mx-2.5 py-2.5" onClick={pay}>{response.isLoading ? 'Loading...' : 'Checkout'}</button>
            </div>
          </>) : (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md text-sm font-medium text-indigo-800">Cart is empty.</div>
          )}
        </motion.div>
    </>
  )
}

export default Cart; 