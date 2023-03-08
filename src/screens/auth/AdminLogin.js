import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuthLoginMutation } from "../../store/services/authService";
import { setAdminToken } from "../../store/reducers/authReducer";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: '',
        password: ''
    });
    const handleInputs = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const [login, response] = useAuthLoginMutation();
    const errors = response?.error?.data?.errors ? response?.error?.data?.errors : [] ;
    const adminLoginFunction = e => {
        e.preventDefault();
        login(state);
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if(response.isSuccess && response?.data?.admin === true) {
            localStorage.setItem('admin-token', response?.data?.token);
            dispatch(setAdminToken(response?.data?.token));
            navigate('/dashboard/products')
        } else if(response.isSuccess && response?.data?.admin === false) {
            toast.error('Enter valid admin credentials.');
        }
    }, [response.isSuccess])

    return (
        <div className="bg-charcoal h-screen flex justify-center items-center">
            <Toaster />
            <form className="bg-matteBlack p-5 w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 rounded" onSubmit={adminLoginFunction}>
                <h3 className="mb-4 text-white capitalize font-semibold text-lg">Login Dashboard</h3>
                <div className="mb-4">
                    <input type="email" name="email" className="w-full bg-charcoal text-white p-4 rounded outline-none" onChange={handleInputs} value={state.email} placeholder="Enter Email" />
                </div>
                {errors.length>0 && errors.filter((error, key) => (
                    error.param === 'email'
                )).map((error, key) => (
                    <div key={key}>
                        <p className="alert-danger"><span className="bg-red-100 p-1 rounded-sm">{error.msg}</span></p>
                    </div>
                ))}

                <div className="mb-4">
                    <input type="password" name="password" className="w-full bg-charcoal text-white p-4 rounded outline-none" onChange={handleInputs} value={state.password} placeholder="Enter Password" />
                </div>
                {errors.length>0 && errors.filter((error, key) => (
                    error.param === 'password'
                )).map((error, key) => (
                    <div key={key}>
                        <p className="alert-danger"><span className="bg-red-100 p-1 rounded-sm">{error.msg}</span></p>
                    </div>
                ))}
                
                <div className="mb-4 mt-5">
                    <input type="submit" className="bg-green-600 w-full p-2 rounded text-white uppercase font-semibold cursor-pointer" value={response.isLoading ? 'Loading...' : 'Sign In'} />
                </div>
            </form>
        </div>
    )
}

export default AdminLogin;