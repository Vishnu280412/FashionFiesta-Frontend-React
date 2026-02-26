import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AccountList from "../../components/home/AccountList";
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { useVerifyPaymentQuery } from "../../store/services/paymentService";
import { removeAllItems } from "../../store/reducers/cartReducer";

const Dashboard = () => {
    const { user } = useSelector(state => state.authReducer);
    const [params] = useSearchParams();
    const id = params.get('session_id');
    const { data, isSuccess } = useVerifyPaymentQuery(id, { skip: id ? false : true });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if(isSuccess && data?.status === 'paid') {
            dispatch(removeAllItems());
            localStorage.removeItem('cart');
            toast.success(data.msg);
            navigate('/user');
        } else if(isSuccess && data?.status !== 'paid') {
            toast.error(data?.msg || 'Payment is not completed.');
        }
    }, [isSuccess, data?.status, data?.msg, dispatch, navigate])
    return (
        <>
            <Nav />
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mt-[70px]">
                <Header>
                    my account
                </Header>
                <div className="my-container mt-[40px]">
                    <div className="flex flex-wrap -mx-6">
                        <div className="w-full md:w-4/12 p-6">
                            <AccountList />
                        </div>
                        <div className="w-full md:w-8/12 p-6">
                            <h1 className="heading">name</h1>
                            <span className="block mt-3 capitalize font-medium text-sm">{user?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
