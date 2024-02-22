import {useState} from "react";
import {Navigate} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";

export default function NewPageButton() {
    const [navigateData, setNavigateData] = useState(null);
    const userData = useUser();
    const userID = userData.user.id;
    const username = userData.user.username

    const handleCreatePage = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3636/createpage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                username
            }),
        });

        if (!response.ok) {
            console.log(await response.json())
            return;
        }

        const data = await response.json();
        setNavigateData({path:`/rooms/${data.pageID}`})
    }

    return (
        <>
            <button className=" mt-10 bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow" onClick={handleCreatePage}>NEW PAGE</button>
            {navigateData && (<Navigate to={navigateData.path}/>)}
        </>
    )
}