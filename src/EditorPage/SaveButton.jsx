const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
export default function SaveButton({editorRef, pageId, pageTitle}) {

    console.log(pageTitle, pageId)
    const handleSaveClick = async (e) => {
        e.preventDefault();
        const currentEditorContent = editorRef.current.getValue();

        const response = await fetch(`${hostUrl}/savepagecontent`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentEditorContent,
                pageId,
                pageTitle
            }),
        })

        const data = await response.json();
        console.log(data);



    }
    return (
        <>
            <button onClick={handleSaveClick}>save</button>
        </>
    )
}