import {useState} from 'react';

const DropDown = ({content, setLanguage, setLanguageId}) => {

    const options = content
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("JavaScript (Node.js 12.14.0)");

    function handleLanguageClick(option) {
        setSelection(option.name);
        setOpen(false);
        setLanguage(option.value);
        setLanguageId(option.id);
    }

    return (
        <>
            <div className="relative">

                <button className='relative flex text-base bg-white text-black px-2 py-2  border-2 border-black rounded heavy-shadow items-start w-30 bg-white items-center gap-2' onClick={() => setOpen(!open)}>
                    {selection}
                    <img className="h-4" src="/icons8-chevron-down-24.png" alt=""/>
                </button>

                {open && <ul className="w-full z-50 overflow-y-auto max-h-40 absolute left-0  bg-white">
                    {options.map((option, i) => (
                        <li onClick={() => handleLanguageClick(option)} key={i}>
                            {option.name}
                        </li>
                    ))}
                </ul>
                }

            </div>
        </>
    );
};

export default DropDown;