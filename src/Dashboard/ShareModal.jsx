import {useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";
import ToggleSwitch from "./ToggleSwitch.jsx";
import {fetchPagesSharedUserList, sharePageRequest} from "../services/serverRequests.js";

const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
export default function ShareModal({isOpen, modalContent, handleModal}) {

    const [shareError, setShareError] = useState();
    const [shareUsername, setShareUsername] = useState("");
    const [listOfSharedUsers, setListOfSharedUsers] = useState([]);
    const userData = useUser();
    const pageID = modalContent.pageID;
    const title = modalContent.pageTitle
    const username = userData.user.username;

    const clickShare = async () => {
        await sharePageRequest(shareUsername, pageID, username, title)
    }

    useEffect(() => {
        async function loadPagesSharedUserList() {
            const data = await fetchPagesSharedUserList(pageID);
            setListOfSharedUsers(data);
        }

        if (isOpen) {
            loadPagesSharedUserList();
        }

    }, [isOpen])


    return (
        <>

            {isOpen &&
                // modal
                <div onClick={handleModal}
                     className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">

                    <div onClick={(e) => e.stopPropagation()}
                         className="relative top-60 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        {/*Content*/}
                        <p className="text-2xl">Share  &quot;{title}&quot;</p>

                        <div className="flex mt-5 justify-between flex-row">
                            <input value={shareUsername} onChange={(e) => {
                                setShareUsername(e.target.value)
                            }} type="text"/>
                            <button onClick={clickShare}
                                    className="bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow">SHARE
                            </button>

                        </div>
                        {shareError && <p>That user does not exist</p>}

                        <div className="flex mt-3 gap-2 flex-col">
                            <p>People with access</p>
                            <div>
                                {
                                    listOfSharedUsers.map((el, i) => (
                                        <p key={i}>{el.share_with_username}</p>
                                    ))
                                }
                            </div>
                            <p>General access</p>
                            <ToggleSwitch></ToggleSwitch>

                            <div className="mt-6 flex justify-between flex-row">
                                <button
                                    className="bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow">Copy
                                    Link
                                </button>
                                <button
                                    className="bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow"
                                    onClick={handleModal}>Done
                                </button>
                            </div>
                        </div>

                    </div>
                </div>}
        </>
    )
}