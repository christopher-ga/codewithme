import {useState} from "react";
import {useUser} from "@clerk/clerk-react";
import {Navigate} from "react-router-dom";

export default function AccessPage() {

    const [navigateData, setNavigateData] = useState(null);
    const [pageTitle, setPageTitle] = useState("");
    const userData = useUser();
    const handleExistingPage = async (e) => {
        e.preventDefault();
        let userId = userData.user.id;

        const response = await fetch(`http://localhost:3636/getpage?userId=${userId}&pageTitle=${pageTitle}`)

        if (!response.ok) {
            console.log('oops, that does not exist');
            return
        }

        let data = await response.json();
        console.log(data);
        let pageName = data.title;
        let pageID = data.pageID;
        let content = data.content;
        setNavigateData({content, pageID, pageName, path: `/rooms/${pageName + userId}`})
    }

    return (
        <>
            <input type="text" value={pageTitle} onChange={(e) => {setPageTitle(e.target.value)}} />
            <button onClick={handleExistingPage}>AccessPage</button>

            {navigateData && (
                <Navigate
                    to={navigateData.path}
                    state={{currentContent:navigateData.content, pageID: navigateData.pageID, pageTitle: navigateData.pageName}}
                />
            )}
        </>
    )
}