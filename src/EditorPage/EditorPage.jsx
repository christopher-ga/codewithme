import OutputBox from "./OutputBox.jsx";
import EditorHeader from "./EditorHeader.jsx";
import MonacoEditorYjsChange from "./MonoacoEditor.jsx";
import {useState, useRef, useEffect, useCallback} from "react";
import {compileCode} from "../services/Judge0Service.js";
import debounce from "lodash.debounce";
import {useParams} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import io from 'socket.io-client';

const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
export default function EditorPage() {
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('javascript')
    const [languageId, setLanguageId] = useState("63");
    const [accessPermitted, setAccess] = useState(false);
    const [title, setTitle] = useState("Untitled");
    const [activeUsers, setActiveUsers] = useState([]);
    const [processingCode, setProcessingCode] = useState(false);
    const [compilerResponse, setCompilerResponse] = useState("");

    const editorRef = useRef(null);
    const socketRef = useRef(null);
    const {roomId} = useParams();
    const userData = useUser();

    let username;
    if (userData.user) {
        username = userData.user.username
    } else username = 'guest1234'

    const handleTitle = (e) => {
        setTitle(e.target.value)
        debounceSaveTitle(e.target.value, roomId)
    }

    const debounceSaveTitle = useCallback(
        debounce((newTitle, id) => saveTitle(newTitle, id), 2000), []);

    const saveTitle = async (newTitle, pageID) => {
        console.log('save title request going out')
        const response = await fetch(`${hostUrl}/savetitle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle,
                roomId: pageID
            })
        })

        if (!response.ok) {
            throw new Error('Failed to save title');
        }

    }
    const handleTheme = (dropDownTheme) => {
        setTheme(dropDownTheme)
    }

    const handleCodeSubmission = async () => {
        setProcessingCode(true);
        socketRef.current.emit("processingCode")
        let output = await compileCode(editorRef.current.getValue(), languageId);
        socketRef.current.emit('finishedProcessingCode', output)
        setCompilerResponse(output);
        setProcessingCode(false);
    }

    useEffect(() => {
        async function checkAccess() {
            const request = await fetch(`${hostUrl}/checkaccess?username=${username}&pageID=${roomId}`)
            const response = await request.json();
            console.log('access response', response);

            if (response.access === "Permitted") {
                setAccess(true)
                setTitle(response.title)
            }
        }

        checkAccess();
    }, []);


    useEffect(() => {
        if (accessPermitted) {
            setAccess(true);
            socketRef.current = io(`${hostUrl}`, {
                query: {roomId, username}
            })

            socketRef.current.on('userJoin', (roomState) => {
                setActiveUsers(roomState)
            });

            socketRef.current.on('userDisconnect', (roomState) => {
                setActiveUsers(roomState)
            })

            socketRef.current.on('newTitle', (newTitle) => {
                setTitle(newTitle);
            })

            socketRef.current.on('processingCode', () => {
                setProcessingCode(true)
            })

            socketRef.current.on('finishedProcessingCode', (output) => {
                setCompilerResponse(output);
                setProcessingCode(false)
            })

            return () => socketRef.current.disconnect();
        }

    }, [accessPermitted])


    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.emit("titleChange", title)
        }
    }, [title])


    return (
        <>
            {accessPermitted &&
                (
                    <>
                        <EditorHeader
                            setLanguage={setLanguage}
                            setLanguageId={setLanguageId}
                            handleTitle={handleTitle} title={title}
                            username={username}
                            activeUsers={activeUsers}
                            handleTheme={handleTheme}
                            handleCodeSubmission={handleCodeSubmission}
                            processingCode={processingCode}
                        />

                        <MonacoEditorYjsChange language={language} editorRef={editorRef} theme={theme}/>
                        <OutputBox processingCode={processingCode} compilerResponse={compilerResponse}/>
                    </>
                )}
            {!accessPermitted && <div>not allowed</div>}
        </>
    )
}