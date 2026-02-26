import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import currency from "currency-formatter";
import { BsTrash } from 'react-icons/bs';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Nav from '../../components/home/Nav';
import { discount } from '../../utils/discount';
import Quantity from '../../components/home/Quantity';
import { incQuantity, decQuantity, removeItem, syncCartInventory } from '../../store/reducers/cartReducer';
import { useSendPaymentMutation } from '../../store/services/paymentService';

const Cart = () => {
  const { cart, total } = useSelector(state => state.cartReducer);
  const { userToken } = useSelector(state => state.authReducer);
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
  const hasUnavailableItem = cart.some(item => {
    const stock = parseInt(item.stock, 10);
    return Number.isInteger(stock) ? stock < 1 || item.quantity > stock : false;
  });
  const pay =  () => {
    if(hasUnavailableItem) {
      toast.error('Your cart has unavailable quantities. Please update quantities before checkout.');
      return;
    }

    if(userToken) {
      sendPayment({cart});
    } else{
      navigate('/login');
    }
  }
  useEffect(() => {
    if(response?.isSuccess && response?.data?.url) {
      window.location.href = response.data.url;
    }
  }, [response?.isSuccess, response?.data?.url])

  useEffect(() => {
    if(response?.isError) {
      const unavailableItems = response?.error?.data?.unavailableItems;
      if(Array.isArray(unavailableItems) && unavailableItems.length > 0) {
        dispatch(syncCartInventory(unavailableItems));
      }
      const errorMessage = response?.error?.data?.errors?.[0]?.msg || response?.error?.data?.error || 'Unable to proceed to checkout';
      toast.error(errorMessage);
    }
  }, [response?.isError, response?.error, dispatch]);
  return (
    <>
        <Nav />
        <Toaster position="top-right" reverseOrder={false} />
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
                    const parsedStock = parseInt(item.stock, 10);
                    const availableStock = Number.isInteger(parsedStock) && parsedStock >= 0 ? parsedStock : 0;
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
                          <Quantity
                            quantity={item.quantity}
                            inc={() => inc(item._id)}
                            dec={() => dec(item._id)}
                            theme="indigo"
                            disableInc={item.quantity >= availableStock}
                            disableDec={item.quantity <= 1}
                          />
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
            {hasUnavailableItem && (
              <div className="bg-rose-100 text-rose-700 border border-rose-200 p-3 rounded-md mt-4 text-sm font-medium">
                Some items in your cart exceed current stock. Reduce quantity to continue.
              </div>
            )}
            <div className="bg-indigo-50 p-3 flex mt-5 rounded-md items-center">
              <div className="w-full flex justify-between">
                <span className="text-lg font-semibold text-indigo-700">Total Price:</span>
                <span className="text-lg font-semibold text-indigo-700 mr-5">{currency.format(total, {code: "INR"})}</span>
              </div>
              <button
                className="btn flex bg-indigo-600 text-sm font-medium mx-2.5 py-2.5"
                disabled={response.isLoading || hasUnavailableItem}
                onClick={pay}
              >
                {response.isLoading ? 'Loading...' : 'Checkout'}
              </button>
            </div>
          </>) : (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md text-sm font-medium text-indigo-800">Cart is empty.</div>
          )}
        </motion.div>
    </>
  )
}

export default Cart; 
