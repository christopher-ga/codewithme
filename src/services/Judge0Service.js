import axios from "axios";

const API_BASE_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_HEADERS = {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPID_API_KEY,
    "X-RapidAPI-Host": import.meta.env.VITE_REACT_APP_RAPID_API_HOST
}
const compileCode = async (code, id) => {
    let token = await judge0SubmitCode(code, id)
    return await checkResult(token);
}
const judge0SubmitCode = async (code, id) => {

    const options = {
        method: "POST",
        url: API_BASE_URL,
        params: {
            base64_encoded: 'true',
            fields: "*",
        },
        headers: API_HEADERS,
        data: {
            language_id: id,
            source_code: btoa(code),
        }

    };
    console.log('submitting code');
    const response = await axios.request(options);
    console.log(response.data.token, 'recieved this token')
    return response.data.token;

}

const checkResult = async (token) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPID_API_KEY,
            "X-RapidAPI-Host": import.meta.env.VITE_REACT_APP_RAPID_API_HOST
        }
    };

    let response, statusId;

    do {
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            console.log('checking response')
            response = await axios.request(options);
            statusId = response.data.status.id;

            if (statusId !== 1 && statusId !== 2) {
                return processData(response.data, statusId)
            }

        } catch (e) {
            console.log(e);
            return 'error sending request occured ' + e;
        }
    } while (statusId === 1 || statusId === 2);


}

const processData = (data, statusId) => {

    if (statusId === 6) {
        console.log('status id 6')
        return atob(data.compile_output)

    } else if (statusId === 3) {
        console.log('status id 3')
        return atob(data.stdout)

    } else if (statusId === 5) {
        console.log('status id 5')
        return "Time Limit Exceeded"

    } else {
        console.log('status id other')
        return atob(data.stderr);
    }

}

export {compileCode};