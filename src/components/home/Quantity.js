import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const Quantity = ({ quantity, inc, dec, theme, disableInc = false, disableDec = false }) => {
  return (
    <div className="flex last:border-r last:rounded-tr-lg last:rounded-br-lg first:rounded-tl-lg first:rounded-bl-lg overflow-hidden ">
      <span
        className={`flex border p-4 border-r-0 transition-all ${disableDec ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-indigo-500 hover:text-white'} ${theme === 'indigo' && 'bg-indigo-600 text-white'}`}
        onClick={() => !disableDec && dec()}
      >
        <AiOutlineMinus />
      </span>
      <span className="flex-1 border flex items-center justify-center p-3 font-medium border-r-0">{quantity}</span>
      <span
        className={`flex border p-4 border-r-0 transition-all ${disableInc ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-indigo-500 hover:text-white'} ${theme === 'indigo' && 'bg-indigo-600 text-white'}`}
        onClick={() => !disableInc && inc()}
      >
        <AiOutlinePlus />
      </span>
    </div>
  )
}

export default Quantity;
