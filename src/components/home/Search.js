import { FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { toggleSearchBar } from "../../store/reducers/globalReducer";

const Search = () => {
    const navigate = useNavigate();
    const [state, setState] = useState('');
    const { searchBar } = useSelector(state => state.globalReducer);
    const dispatch = useDispatch();
    const closeSearch = e => {
        const id = e.target.id;
        if(id === "search") {
            dispatch(toggleSearchBar());
        }
    }
    const searchProducts = () => {
        if(state === '') return;
        navigate(`/search-products/${state}/1`);
        dispatch(toggleSearchBar());
    }
  return searchBar && (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}} id="search" onClick={closeSearch} className="fixed inset-0 w-full h-full bg-black/50 z-[300]">
        <div className="flex -mx-8 justify-center">
            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-8 mt-8 relative">
                <input type="text" name="" id="" className="w-full bg-white h-[50px] rounded pl-3 pr-14 outline-none border border-gray-300" placeholder="Search for products..." value={state} onChange={e => setState(e.target.value)} />
                <FiSearch className="absolute top-[17px] right-12 text-lg text-gray-500 cursor-pointer" onClick={searchProducts} />
            </div>
        </div>
    </motion.div>
  )
}

export default Search;