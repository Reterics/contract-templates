import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GeneralStringObject, Template} from "./interfaces/interfaces.ts";
import Header from "./components/Header.tsx";
import {getFileFromStorage} from "./firebase/storage.ts";
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import StyledInput from "./components/elements/StyledInput.tsx";
import {downloadAsFile} from "./utils/general.ts";


const Editor = () => {
    let [searchParams] = useSearchParams();

    const id = searchParams && searchParams.get('id') ?  searchParams.get('id') : undefined;
    const [template, setTemplate] = useState<Template|null>(null);
    const [formData, setFormData] = useState<GeneralStringObject>({});

    const updateFromCloud = async (id: string) => {
        const template = await getFileFromStorage(id);
        if (template) {
            setTemplate({ ...template } as Template);
        }
    };

    useEffect(() => {
        if (id && !template) {
            void updateFromCloud(id);
        }
    }, [id]);

    if (!id) return (<><Header /><p>404 - There is no id provided</p></>);
    if (!template) return (<><Header /><p>400 - No Valid Template</p></>);
    if (!template.content) return (<><Header /><p>404 - No Valid Template Content</p></>);


    const renderedContent = render(template.content, formData, undefined);

    const variableKeys = (template.content.match(REGEXPS.variable.regexp) || [])
        .map(key=>{
            const startLength = REGEXPS.variable.start.length
            return key.substring(startLength, key.length - startLength - REGEXPS.variable.end.length + 2);
        });

    const changeFormData = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const value = e.target.value;
        setFormData((formData) => {
            const obj = {...formData};
            obj[key] = value;
            return obj;
        })
    }

    const download = () => {
        downloadAsFile(template.path ? template.path.replace('files/', '') : '', renderedContent);
    }

    return (
        <>
            <Header />
            <h1>{template?.name || 'Template'}</h1>
            <form className="flex flex-row p-4 mt-4">
                <div className="flex-col w-full p-2">

                    {variableKeys.map((key, index)=>(
                        <div className="flex text-right" key={'input_'+index}>
                            <div className="w-[140px] mt-4 pr-2">{key}:</div>
                            <StyledInput type="text" name={key}
                                         value={formData[key]}
                                         onChange={(e) => changeFormData(e, key)}
                                         label={key}
                            ></StyledInput>
                        </div>

                    ))}
                </div>
                <div className="flex-col w-full p-2">
                    <div>
                        {renderedContent}
                    </div>
                </div>
            </form>
            <button type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100
            focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800
            dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600
            dark:focus:ring-gray-700"
                    onClick={()=>download()}>
                Download</button>
        </>
    );
}


export default Editor;