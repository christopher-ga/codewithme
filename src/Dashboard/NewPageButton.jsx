import {useState} from "react";
import {Navigate} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import {createNewPageRequest} from "../services/serverRequests.js";

const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;

export default function NewPageButton() {
    const [navigateData, setNavigateData] = useState(null);
    const userData = useUser();
    const userID = userData.user.id;
    const username = userData.user.username

    const clickNewPage = async (e) => {
        e.preventDefault();
        const data = await createNewPageRequest(userID, username);
        setNavigateData({path:`/rooms/${data.pageID}`})
    }

    return (
        <>
            <button className=" mt-10 bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow" onClick={clickNewPage}>NEW PAGE</button>
            {navigateData && (<Navigate to={navigateData.path}/>)}
        </>
    )
}