const PDetailsImage = ({ image }) => {
  return (
    <div className="w-full sm:w-6/12 p-1">
        <img src={image} alt="product image" className="w-full h-auto object-cover" />
    </div>
  )
}

export default PDetailsImage;