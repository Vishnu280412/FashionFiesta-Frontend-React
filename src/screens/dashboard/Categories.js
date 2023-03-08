import { useEffect } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Wrapper from "./Wrapper";
import { clearMessage, setSuccess } from "../../store/reducers/globalReducer";
import { useGetQuery, useDeleteCategoryMutation } from "../../store/services/categoryService";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Categories = () => {
    let { page } = useParams();
    if(!page) {
        page = 1;
    }
    const { success } = useSelector(state => state.globalReducer);
    const dispatch = useDispatch();
    const { data = [],  isFetching } = useGetQuery(page);
    const [removeCategory, response] = useDeleteCategoryMutation();
    const deleteCategory = id => {
        if(window.confirm("Do you really want to delete the category?")) {
            removeCategory(id);
        }
    }
    useEffect(() => {
        if(response.isSuccess) {
            dispatch(setSuccess(response?.data?.message));
        } 
        return () => {
            dispatch(clearMessage());
        }
    }, [response?.data?.message]);

    useEffect(() => {
        if(success) {
            // dispatch(setSuccess(success));
            toast.success(success);
            dispatch(clearMessage());
        }
        return () => {
            dispatch(clearMessage());
        }
    }, []);

    return(
        <Wrapper>
            <ScreenHeader>
                <Link to="/dashboard/create-category" className="btn-dark"><i className="bi bi-plus"> </i>add categories</Link>
            </ScreenHeader>
            <Toaster position="top-right" />
            {/* {success && <div className="alert-success">{success}</div>} */}
            {!isFetching ? data?.categories?.length > 0 && <><div>
                <table className="w-full bg-gray-900 rounded-md">
                    <thead>
                        <tr className="border-b border-gray-800 text-left">
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">name</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">edit</th>
                            <th className="p-3 uppercase text-sm font-medium text-gray-500">delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.categories?.map(category => (
                            <tr key={category._id} className="odd:bg-gray-800">
                                <td className="p-3 capitalize text-sm font-normal text-gray-400">{category.name}</td>
                                <td className="p-3 capitalize text-sm font-normal text-gray-400"><Link to={`/dashboard/update-category/${category._id}`} className="btn btn-warning"><i className="bi bi-pencil-square"></i></Link></td>
                                <td className="p-3 capitalize text-sm font-normal text-gray-400"><button className="btn btn-danger" onClick={() => deleteCategory(category._id)}><i className="bi bi-trash-fill"></i></button></td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div><Pagination page={parseInt(page)} perPage={data.perPage} count={data.count} path="dashboard/categories" /></> : <Spinner />}
        </Wrapper>
    )
}

export default Categories;