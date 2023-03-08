const SizeList = ({ list, deleteSize }) => {
    return (
        <div>
            {list.length > 0 && <h1 className="label">selected sizes list:</h1>} 
            {list.length > 0 && <div className="flex flex-wrap -mx-3 mb-10">
                {list.map((size) => (
                    <div key={size.name} className="size mt-0.5" onClick={() => deleteSize(size.name)}>{size.name}</div>
                ))}
                </div>}
        </div>
    )
}

export default SizeList;