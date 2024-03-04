const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;

const deletePageRequest = async (pageID) => {
    const response = await fetch(`${hostUrl}/deletepage?pageId=${pageID}`)

    if (!response.ok) {
        return
    }

    return 'deleted page'
}

const fetchUserPagesRequest = async (userID) => {
    const response = await fetch(`${hostUrl}/getuserpages?userID=${userID}`)
    if (!response.ok) {
        return null
    }
     return await response.json();
}

const createNewPageRequest = async (userID, username) => {
    const response = await fetch(`${hostUrl}/createpage`, {
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
        return;
    }

    return await response.json();
}

const fetchUserSharedPagesRequest = async (username) => {
    const response = await fetch(`${hostUrl}/getsharedpages?username=${username}`)

    if (!response.ok) {
        return;
    }

    return await response.json();
}

const sharePageRequest = async (shareWithUsername, pageID, username, title) => {
    const response = await fetch(`${hostUrl}/sharepage?shareusername=${shareWithUsername}&pageID=${pageID}&ownerusername=${username}&title=${title}`)

    if (!response.ok) {
        console.log(await response.json())
        return;
    }

    return response.json();
}

const fetchPagesSharedUserList = async (pageID) => {
    const response = await fetch(`${hostUrl}/getuserssharingpage?pageID=${pageID}`);
    if (!response.ok) {

        return;
    }
    return await response.json();
}

export {sharePageRequest, fetchPagesSharedUserList, deletePageRequest, fetchUserPagesRequest, createNewPageRequest, fetchUserSharedPagesRequest}

