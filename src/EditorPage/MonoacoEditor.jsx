import {useCallback, useEffect, useRef, useState} from "react";
import Editor from '@monaco-editor/react';
import {WebsocketProvider} from 'y-websocket'
import {fromUint8Array, toUint8Array} from 'js-base64'
import * as Y from "yjs"
import {MonacoBinding} from "y-monaco"
import {useParams} from "react-router-dom";

import debounce from "lodash.debounce";

const hostWsUrl = import.meta.env.VITE_REACT_APP_YJS_URL;
const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;

function MonacoEditor({editorRef, theme, language}) {

    const doc = new Y.Doc();
    const {roomId} = useParams();
    const [liveContent, setLiveContent] = useState("");

    useEffect(() => {
        async function getPageContent() {
            let response = await fetch(`${hostUrl}/getpagecontent?pageId=${roomId}`)
            let data = await response.json();
            setLiveContent(data)
            console.log('page content', data)
            console.log('decoded', toUint8Array(data))
            Y.applyUpdate(doc, toUint8Array(data))
            Y.logUpdate(toUint8Array(data))
        }

        getPageContent();
    }, []);

    const savePageContent = async (content, id) => {
        try {
            const response = await fetch(`${hostUrl}/savepagecontent`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentEditorContent: content,
                    pageId: id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Save successful:', data);
        } catch (error) {
            console.error('Failed to save page content:', error);
        }
    };

    //debounce function
    const debouncedSavePageContent = useCallback(
        debounce((content, id) => savePageContent(content, id), 2000),
        []
    );


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

        const provider = new WebsocketProvider(hostWsUrl, roomId, doc)
        const type = doc.getText("monaco");

        if (type.toString() === "") {
            type.insert(0, liveContent);
        }

        const awareness = provider.awareness

        awareness.setLocalState({name: "John Doe", email: "johndoe@gmail.com"});

        function updateUserStyle(clientId, color) {
            const styleElementId = `user-style-${clientId}`;
            let styleElement = document.getElementById(styleElementId);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleElementId;
                document.head.appendChild(styleElement);
            }

            const styleRules = `
        .yRemoteSelection-${clientId} { background-color: ${color}; }
        .yRemoteSelectionHead-${clientId} { border-color: ${color}; }
        .yRemoteSelectionHead-${clientId}::after {border-color: ${color} !important; /* Apply the color */}
        `;
            styleElement.textContent = styleRules;
        }

        awareness.on('update', () => {
            const clients = awareness.getStates();
            clients.forEach((state, clientId) => {
                const color = getUserColor(clientId);
                updateUserStyle(clientId, color);
            });
        });

        const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];

        function getUserColor(clientId) {
            const index = clientId % colors.length;
            return colors[index];
        }

        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), awareness);

        editor.getModel().onDidChangeContent(() => {
            const content = editor.getValue();
            const encodedUpdate = Y.encodeStateAsUpdate(doc)
            const base64Encoded = fromUint8Array(encodedUpdate)
            debouncedSavePageContent(base64Encoded, roomId);
        });
    }

    return (
        <>
            <Editor
                onMount={handleEditorDidMount}
                height="60vh"
                defaultLanguage="javascript"
                language={language}
                theme="vs-dark"
                className="mb-6"
            />
        </>
    )
}

export default MonacoEditor
