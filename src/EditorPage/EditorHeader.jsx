import Dropdown from "./Dropdown.jsx";
import Profile from "./Profile.jsx";

import {languageOptions} from "../languageOptions.js";

export default function EditorHeader({title, setLanguage, setLanguageId, handleTheme, activeUsers, username, processingCode, handleTitle, handleCodeSubmission}) {

    const currentUsers = activeUsers.filter((item, index, array) => {
        return array.indexOf(item) === index && item !== username;
    });

    return (
        <>
            <div className="background-dashboard-nav">
                <div className='flex mx-5 py-3 items-center content-center justify-between bg-green'>

                    <div className="flex items-center">
                        <a href="/">
                            <img className="w-20" src="/codewithmelogo.png" alt=""/>
                        </a>

                        <div className="flex justify-center flex-col">
                            <div className="flex mx-10 my-3 gap-x-10 ">
                                <input  className="text-2xl border-dashed  p-0 bg-transparent outline-none" onChange={handleTitle} value={title} type="text"/>
                            </div>

                            <ul className="mx-10 flex gap-x-10">
                                <button  onClick={handleCodeSubmission} className="bg-white text-black px-2 py-2  border-2 border-black rounded heavy-shadow">
                                    <div className="flex pr-1 flex-row items-center gap-2">
                                        {processingCode && (
                                            <div className="loader"></div>
                                        )}

                                        {!processingCode && (
                                            <>
                                                <img  className='h-4' src="/icons8-play-64.png" alt=""/>
                                                <p>Compile and Run</p>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <Dropdown setLanguageId={setLanguageId} setLanguage={setLanguage} content={languageOptions}/>

                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-5 flex-row">
                        {currentUsers.map((el, i) => (
                            <Profile profile="/duck.jpeg" key={i} username={el}></Profile>
                        ))}

                        <div className=" pl-4 border-l-2 m-l-4 ">
                            <Profile profile="/giraffe.jpg" username={username}></Profile>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}