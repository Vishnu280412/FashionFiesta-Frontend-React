import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { BsHandbag } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { useSelector } from "react-redux";
import Search from "./Search";
import { useDispatch } from "react-redux";
import { toggleSearchBar } from "../../store/reducers/globalReducer";

const Nav = () => {
    const { userToken, user } = useSelector(state => state.authReducer);
    const { searchBar } = useSelector(state => state.globalReducer);
    const { items } = useSelector(state => state.cartReducer);
    const { item } = useSelector(state => state.wishlistReducer);

    const dispatch = useDispatch();
    return(
        <>
        <nav className="nav">
            <div className="my-container">
                <div className="flex justify-between items-center">
                    <Link to="/">
                        <img src="/FashionFiesta5a.png" className="h-full object-cover" alt="logo" />
                    </Link>
                    <ul className="flex items-center ">
                        <li className="nav-li cursor-pointer"><FiSearch size={20} onClick={() => dispatch(toggleSearchBar())} /></li>
                        {userToken ? <li className="nav-li"><Link to="/user" className="nav-link">{user?.name}</Link></li> : 
                        <li className="nav-li"><Link to="/login" className="nav-link">sign in</Link></li>}
                        <li className="nav-li relative">
                            <Link to="/wishlist">
                                <CiHeart size={25} />
                                {item === 0 ? <></> : <span className="nav-circle">{item}</span>}
                            </Link>
                        </li>
                        <li className="nav-li relative">
                            <Link to="/cart">
                                <BsHandbag size={20} />
                                <span className="nav-circle">{items}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <Search />
        </>
    )
}

export default Nav;