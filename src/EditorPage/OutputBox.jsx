export default function OutputBox({compilerResponse, processingCode}) {

    return (
        <>
            <div><p>Output</p></div>
            <div className="bg-[#171717] mt-5  h-52  overflow-y-auto rounded">
                <p className="text-white">
                    {processingCode && (
                     <div className="loader"></div>
                    )}

                    {!processingCode && (
                        <p>{compilerResponse}</p>
                    )}
                </p>
            </div>
        </>
    )
}