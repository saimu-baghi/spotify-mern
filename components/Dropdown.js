import React, { useState } from 'react';

const Dropdown = ({ playlists, onSelect }) => {
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleSelectChange = (event) => {
        const selectedId = event.target.value;
        setSelectedItemId(selectedId);
        onSelect(selectedId);
    };

    return (
        <div>
            <select className="
            cursor-pointer
            flex 
            w-full 
            rounded-md 
            bg-neutral-700
            border
            border-transparent
            px-3 
            py-3 
            text-lg
            disabled:cursor-not-allowed 
            disabled:opacity-50
            focus:outline-none 
                     "
                onChange={handleSelectChange}>
                <option  value="">Select a playlist</option>
                {playlists.map((item) => (
                    <option key={item._id} value={item._id}>
                        {item.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
