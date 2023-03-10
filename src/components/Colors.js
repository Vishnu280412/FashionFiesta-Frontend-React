const Colors = ({ colors, deleteColor }) => {
    return (
        <div className="mb-6">
            {colors.length > 0 && <h1 className="label">selected colors list:</h1>} 
            {colors.length > 0 && <div className="flex flex-wrap -mx-1 mb-10">
                {colors.map(color => (
                    <div className="p-1" key={color.id}>
                        <div className="w-[30px] h-[30px] rounded-full cursor-pointer" style={{background: color.color}} onClick={() => deleteColor(color)}></div>
                    </div>
                ))}
                </div>}
        </div>
    )
}

export default Colors;