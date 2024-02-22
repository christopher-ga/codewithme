import {useState} from 'react';

const ThemeDropDown = ({content, handleTheme}) => {

    const options = content

    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("Javascript");
    function handleOnClick(value) {
        setSelection(value)
        setOpen(false)
        handleTheme(value);
    }

    return (
        <>
            <div className="relative">

                <button className='relative text-xs flex bg-white text-black px-2 py-1  border-2 border-black rounded heavy-shadow items-start bg-white' onClick={() => setOpen(!open)}>
                    {selection}
                    <img className="h-4" src="/icons8-chevron-down-24.png" alt=""/>
                </button>

                {open && <ul className="w-full z-50 overflow-y-auto max-h-40 absolute left-0  bg-white">
                    {/*{Object.entries(options).map(([themeId, themeName], index) => (*/}
                    {/*    <li onClick={() => handleOnClick(themeName)} key={themeId}>*/}
                    {/*        {themeName}*/}
                    {/*    </li>*/}
                    {/*))}*/}

                    <li  onClick={(e) => handleOnClick(e.target.textContent)}>
                        vs-dark
                    </li>
                    <li  onClick={(e) => handleOnClick(e.target.textContent)}>
                        light
                    </li>
                </ul>
                }

            </div>
        </>
    );
};

export default ThemeDropDown;