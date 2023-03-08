import { Link, useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useGetProductQuery } from "../../store/services/productService";
import Nav from "../../components/home/Nav";
import PDetailsCard from "../../components/home/PDetailsCard";
import ProductLoader from "../../components/home/ProductLoader";

const Product = () => {
  const { id } = useParams();
  const {data, isFetching} = useGetProductQuery(id);
  return <>
    <Nav />
    <div className="my-container mt-24">
      {isFetching ? <ProductLoader /> : (
      <>
      <ul className="flex items-center">
        <li className="capitalize text-base text-gray-600">
          <Link to="/">home</Link>
        </li>
        <FiChevronRight className="block mx-2 " />
        <li className="capitalize text-base text-gray-600">
          <Link to={`/cat-products/${data.category}`}>{data.category}</Link>
        </li>
        <FiChevronRight className="block mx-2 " />
        <li className="capitalize text-base text-gray-600">
          <Link to={`/product/${data._id}`}>{data.title}</Link>
        </li>
      </ul>
      <PDetailsCard product={data} />
      </>)}
    </div>
  </>
}

export default Product;