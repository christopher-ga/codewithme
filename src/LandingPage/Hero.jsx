import {Navigate, useNavigate} from "react-router-dom";
import {SignInButton, SignOutButton} from "@clerk/clerk-react";
import {useState} from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function Hero() {

    let navigate = useNavigate();

    const [navigateData, setNavigateData] = useState(null);

    const createPublicPage = async () => {

        const response = await fetch(`${baseUrl}/createpage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log(await response.json());
            return;
        }

        const data = await response.json();
        setNavigateData({path:`/rooms/${data.pageID}`})

    }

    return (
        <div className="background h-screen flex flex-col">

                <div className="">
                    <div className="test px-10 py-10 mx-auto max-w-3xl">
                        <img
                            className="object-contain h-16 mx-auto"
                            src="/codewithmelogo.png"
                        />

                        <h1 className="text-center mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl  ">
                            A collaborative online code editor
                        </h1>
                        <p className="text-center mt-6 text-lg leading-8 text-gray-600">
                            Sign in to start saving your code pages, or create a new page and share the link to code with others
                        </p>
                        <div className="mt-10 flex justify-center items-center gap-x-6">
                            <button
                                onClick={() => navigate('/signin')}
                                className="bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow">
                                Sign in
                            </button>
                            <a href="#" onClick={createPublicPage} className="c">
                                Create a page <span aria-hidden="true">→</span>
                            </a>

                        </div>
                    </div>
                </div>


                {/*image container*/}
                <div className="overflow-hidden flex-grow mx-32 justify-center ">

                    <img
                        className="rounded-tr-[50px] rounded-tl-[50px] object-contain "
                        src="/hero.png"
                        alt=""
                    />
                </div>

            {navigateData && (<Navigate to={navigateData.path}/>)}
        </div>
    )
}
