import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { BsPrinter } from "react-icons/bs";
import currency  from "currency-formatter";
import moment from "moment";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { useDetailsQuery, useOrderStatusMutation } from "../../store/services/orderService";
import { discount } from "../../utils/discount";
import Spinner from "../../components/Spinner";

const OrderDetails = () => {
    const { id } = useParams();
    const componentRef = useRef();
    const { data, isFetching } = useDetailsQuery(id);
    console.log(data);
    let total = discount(data?.details?.productId?.price, data?.details?.productId?.discount) * data?.details?.quantity;
    const [orderStatus, response] = useOrderStatusMutation();
    const orderShipped = () => {
        orderStatus(data?.details?._id);
    }
    return(
        <Wrapper>
            <ScreenHeader>
                <div className="flex items-center">
                    <Link to='/dashboard/orders'><MdOutlineKeyboardBackspace /></Link>
                    <span className="ml-4">Order Details</span>
                    <span className="ml-4">
                        <ReactToPrint
                        trigger={() => <button className="flex items-center btn bg-indigo-600 py-1 text-sm font-semibold"><BsPrinter /> <span className="ml-2">print</span></button>}
                        content={() => componentRef.current}
                        />
                    </span>
                    <span className="ml-4">
                        {!isFetching && !data?.details?.status && 
                            <button className="btn bg-orange-600 py-1 text-sm font-semibold" onClick={orderShipped}>
                                {response?.isLoading ? 'Loading...' : 'delivered'}
                            </button>
                        }
                    </span>
                </div>
            </ScreenHeader>
            {!isFetching ? <div ref={componentRef}>
                <h3 className="capitalize text-gray-400">
                    order number: <span className="text-lg text-gray-300 ml-4">{data?.details?._id}</span>
                </h3>
                {data?.details?.received && <>
                    <h3 className="capitalize text-gray-400">
                        order date: <span className="text-lg text-gray-300 ml-4">{moment(data?.details?.createdAt).format('MMMM Do YYYY')}</span>
                    </h3>
                    <h3 className="capitalize text-gray-400">
                        received date: <span className="text-lg text-gray-300 ml-4">{moment(data?.details?.updatedAt).format('MMMM Do YYYY')}</span>
                    </h3>
                </>}
                <div className="flex flex-wrap -mx-5">
                    <div className="w-full md:w-8/12 p-5">
                        <div className="overflow-x-auto">
                            <table className="bg-transparent border border-gray-600 first-letter:rounded-none md:rounded-md dashboard-table">
                                <thead>
                                    <tr className="dashboard-tr">
                                        <th className="dashboard-th">image</th>
                                        <th className="dashboard-th">product name</th>
                                        <th className="dashboard-th">quantity</th>
                                        <th className="dashboard-th">size</th>
                                        <th className="dashboard-th">color</th>
                                        <th className="dashboard-th">price</th>
                                        <th className="dashboard-th">total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="dashboard-td">
                                            <img
                                            src={data?.details?.productId?.image1}
                                            alt="image name"
                                            className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="dashboard-td">
                                            {data?.details?.productId?.title}
                                        </td>
                                        <td className="dashboard-td">
                                            {data?.details?.quantity}
                                        </td>
                                        <td className="dashboard-td uppercase">
                                            {data?.details?.size !== "false" ? data?.details?.size : '-'}
                                        </td>
                                        <td className="dashboard-td uppercase">
                                            {data?.details?.color !== "false" ? 
                                                <span className="block w-[15px] h-[15px] rounded-full" style={{background: data?.details?.color}}>
                                                </span> : <span className="dashboard-td">-</span>}
                                            
                                        </td>
                                        <td className="dashboard-td">
                                            {currency.format(discount(data?.details?.productId?.price, data?.details?.productId?.discount), {code: 'INR'})}
                                        </td>
                                        <td className="dashboard-td">
                                            {currency.format(total, {code: 'INR'})}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-full md:w-4/12 p-5">
                        <div className="border border-gray-600 p-4 rounded-none md:rounded-md">
                            <div className="border-b pb-3 border-b-gray-600">
                                <h4 className="capitalize text-base text-gray-500">customer name</h4>
                                <span className="text-gray-400 text-base font-medium capitalize mt-2">
                                    {data?.details?.userId?.name}
                                </span>
                            </div>
                            <div className="border-b pb-3 border-b-gray-600">
                                <h4 className="capitalize text-base text-gray-500 mt-2">order date</h4>
                                <span className="text-gray-400 text-base font-medium capitalize mt-2">
                                    {moment(data?.details?.createdAt).format('MMMM Do YYYY')}
                                </span>
                            </div>
                            <div>
                                <h4 className="capitalize text-base text-gray-500 mt-2">shipping address</h4>
                                <div className="mt-2">
                                    <span className="text-gray-400 capitalize block">{data?.details?.address?.line1}, </span>
                                    <span className="text-gray-400 capitalize block">{data?.details?.address?.line2}</span>
                                    <span className="text-gray-400 capitalize block">{data?.details?.address?.city} - {data?.details?.address?.postal_code}.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <Spinner />}
        </Wrapper>
    )
}

export default OrderDetails;