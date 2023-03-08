import { Link } from "react-router-dom";
import { useCatProductsQuery } from "../../store/services/homeProducts";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const HomeProduct = ({ category }) => {
    const { data, isFetching } = useCatProductsQuery({ name: category.name, page: "" });
  return isFetching ? <ProductSkeleton /> : data?.products?.length > 0 && (
    <>
        <div className="flex justify-between mt-10 mb-0">
            <span className="text-lg font-medium capitalize">{category.name}</span>
            <span className="capitalize"><Link to={`/cat-products/${category.name}`}>see all products</Link></span>
        </div>
        <div className="flex flex-wrap -mx-5 mt-0">
            {data?.products?.map((product) => (
                <ProductCard product={product} key={product._id} />
            ))}
        </div>
    </>
  );
}

export default HomeProduct;