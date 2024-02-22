import {SignOutButton, useUser} from "@clerk/clerk-react";
import {useEffect, useRef, useState} from "react";

export default function Profile({username, isDashboard, profile}) {

    const [isDropdownOpen, setDropdown] = useState(false)
    const dropDownRef = useRef (null);

    const userData = useUser();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div ref={dropDownRef} onClick={() => setDropdown(!isDropdownOpen)} className="relative group">
                <img src={profile} alt="Giraffe"
                     className="border-2 border-amber-600 w-14 h-14 rounded-full object-contain hover:cursor-pointer"/>

                {!isDropdownOpen && !isDashboard && ( <div className="absolute hidden group-hover:flex justify-center w-full bottom-0 translate-y-full">
                    <div className="bg-black text-white text-xs rounded py-1">
                        {username ? username : userData.user.username}
                    </div>
                    <div className="w-3 h-3 bg-black rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>)}

                {isDropdownOpen && (<div>
                    <ul className="rounded-2xl shadow w-max p-2 z-50 flex gap-2 flex-col max-h-40 absolute right-1  bg-white">
                        <li className="gap-x-3 flex flex-row">
                            <img className="h-8" src="/icons8-board-96.png" alt=""/>
                            <button>Dashboard</button>
                        </li>

                        <li className="gap-x-3 flex flex-row">
                            <img className="h-8" src="/icons8-sign-out-100.png" alt=""/>
                            <SignOutButton></SignOutButton>
                        </li>

                    </ul>
                </div>)
                }

            </div>
        </>
    )
}