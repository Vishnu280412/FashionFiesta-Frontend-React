import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import currency from "currency-formatter";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import AccountList from "../../components/home/AccountList";
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { useDetailsQuery } from "../../store/services/userOrdersService";
import moment from "moment";
import Spinner from "../../components/Spinner";
import { discount } from "../../utils/discount";
import ReviewForm from "../../components/ReviewForm";
import DetailsList from "../../components/DetailsList";

const UserOrderDetails = () => {
    const [state, setState] = useState(false);
    const toggleReview = () => {
        setState(!state);
    }
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isFetching } = useDetailsQuery(id);
    const total = currency.format(discount(data?.details?.productId?.price, data?.details?.productId?.discount) * data?.details?.quantity, { code: 'INR' });
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <ReviewForm state={state} data={data} toggleReview={toggleReview}/>
            <Nav />
            <div className="mt-[70px]">
                <Header>
                    order details
                </Header>
                <div className="my-container mt-[40px]">
                    <div className="flex flex-wrap -mx-6">
                        <div className="w-full md:w-4/12 p-6">
                            <AccountList />
                        </div>
                        <div className="w-full md:w-8/12 p-6">
                            <h1 className="heading flex items-center">
                                <MdOutlineKeyboardBackspace className="cursor-pointer text-gray-500" onClick={() => navigate(-1)} />
                                <span className="ml-5">details</span>
                            </h1>
                            {!isFetching ? <div className="flex flex-col md:flex-row flex-wrap my-5">
                                <div className="w-[130px] md:w-[160px] h-[130px] md:h-[160px] overflow-hidden">
                                    <img src={data?.details?.productId.image1} alt="image1" className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div className="flex-1 my-4 md:my-0 md:ml-4">
                                    <DetailsList label="order number" data={data?.details?._id} />
                                    <DetailsList label="product name" data={data?.details?.productId?.title} />
                                    <DetailsList label="order received" data={data?.details?.received ? 'Yes' : 'No'} />
                                    <DetailsList label="order date" data={moment(data?.details?.createdAt).format('MMMM Do YYYY')} />
                                    {data?.details?.received && <DetailsList label="received date" data={moment(data?.details?.updatedAt).format('MMMM Do YYYY')} />}
                                    {data?.details?.received && !data?.details?.review &&
                                        <div className="flex mt-3 mb-5 items-center justify-between">
                                            <h4 className="capitalize text-base font-normal text-gray-600 mr-5">add rating: </h4>
                                            <button 
                                                className="btn-indigo !px-6 !py-1 rounded"
                                                onClick={() => toggleReview()}>add review</button>
                                        </div> }
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full">
                                        <thead>
                                            <tr className="thead-tr">
                                                <th className="thead-th">color</th>
                                                <th className="thead-th">size</th>
                                                <th className="thead-th">price</th>
                                                <th className="thead-th">quantity</th>
                                                <th className="thead-th">total</th>
                                                <th className="thead-th">delievered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="even:bg-gray-50">
                                                <td className="tbody-td">
                                                    {data?.details?.color !== "false" ? 
                                                        <span className="block w-[15px] h-[15px] rounded-full" style={{backgroundColor: data?.details?.color}}></span> : 
                                                        <span className="block text-2xl items-center">-</span>}
                                                </td>
                                                <td className="tbody-td">
                                                    {data?.details?.size !== "false" ? 
                                                        <span className="uppercase">{data?.details?.size}</span> : 
                                                        <span className="block text-2xl items-center">-</span>}
                                                </td>
                                                <td className="tbody-td">
                                                    {currency.format(discount(data?.details?.productId?.price, data?.details?.productId?.discount), {code: "INR"})}
                                                </td>
                                                <td className="tbody-td">
                                                    {data?.details?.quantity}
                                                </td>
                                                <td className="tbody-td">
                                                    {total}
                                                </td>
                                                <td className="tbody-td">
                                                    {data?.details?.status ? "Yes" : "No"}
                                                </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> : <Spinner />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserOrderDetails;