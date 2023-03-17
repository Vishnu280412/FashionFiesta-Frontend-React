import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Wrapper from "./Wrapper";
import ScreenHeader from "../../components/ScreenHeader";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from "../../store/services/userService";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Customers = () => {
    let { page } = useParams();
    if(!page) {
        page = 1;
    }
    const { data = [], isFetching } = useGetUsersQuery(page);
    const dispatch = useDispatch();    

    const [delUser, response] = useDeleteUserMutation();
    const deleteUser = (id) => {
        if(window.confirm("Do you really want to remove this User?")) {
            delUser(id);
        }
    }

    const [updateUserRole, response2] = useUpdateUserRoleMutation();
    const promoteUser = (id) => {
        if(window.confirm("Do you really want to promote this User?")) {
            updateUserRole(id);
        }
    }

    useEffect(() => {
        if(response?.isSuccess) {
            toast.success(response?.data?.msg);
        }
    }, [response?.isSuccess]);

    useEffect(() => {
        if(response2?.isSuccess) {
            toast.success(response2?.data?.msg);
        }
    }, [response2?.isSuccess]);

    return(
        <Wrapper>
            <ScreenHeader>Customers</ScreenHeader>
            <Toaster position="top-right" />
            {!isFetching ? data?.users?.length > 0 ? <div>
                <table className="w-full bg-gray-900 rounded-md">
                    <thead>
                        <tr className="border-b border-gray-800 text-left">
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">name</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">email</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">role</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">update role</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users?.map(user => (
                            <tr key={user._id} className="odd:bg-gray-800">
                                <td className="p-3 capitalize text-sm font-normal text-gray-400">{user.name}</td>
                                <td className="p-3 text-sm font-normal text-gray-400">{user.email}</td>
                                <td className="p-3 capitalize text-sm font-normal text-gray-400">
                                    {user.admin ? 'admin' : 'user'}
                                </td>
                                <td className="p-3 capitalize text-sm font-normal text-gray-400">
                                    {!user.admin ? 
                                        <button className="btn btn-warning" onClick={() => promoteUser(user._id)}>
                                            <i className="bi bi-arrow-up"></i>
                                        </button> :
                                        <button className="btn btn-warning" type="disabled">
                                            <i className="bi bi-arrow-up"></i>
                                        </button>
                                    }
                                </td>
                                <td className="p-3 capitalize text-sm font-normal text-gray-400">
                                    {!user.admin ? 
                                        <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>
                                            <i className="bi bi-trash-fill"></i>
                                        </button> :
                                        <button className="btn btn-danger" type="disabled">
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
                <Pagination page={parseInt(page)} perPage={data.perPage} count={data.count} path="dashboard/customers" />
            </div> : 'No Customers!!' : <Spinner />}
        </Wrapper>
    )
}

export default Customers;