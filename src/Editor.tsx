import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {GeneralStringObject, Template} from "./interfaces/interfaces.ts";
import Header from "./components/Header.tsx";
import {getFileFromStorage} from "./firebase/storage.ts";
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import StyledInput from "./components/elements/StyledInput.tsx";
import {downloadAsFile} from "./utils/general.ts";
import "./Editor.css";
import {BsFillFileEarmarkFill, BsFillPrinterFill, BsFloppyFill } from "react-icons/bs";


const Editor = () => {
    let [searchParams] = useSearchParams();

    const id = searchParams && searchParams.get('id') ?  searchParams.get('id') : undefined;
    const [template, setTemplate] = useState<Template|null>(null);
    const [formData, setFormData] = useState<GeneralStringObject>({});
    const targetRef = useRef(null);

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
        downloadAsFile(template.path ? template.path
                .replace('files/', '')
                .replace('.txt', '.html')
            : '', renderedContent);
    }

    const print = () => {
        if (window && window.print) {
            window.print();
        }
    };

    return (
        <>
            <Header />
            <div className="flex flex-row justify-between mt-4 no-print pb-4">
                <div></div>
                <div>
                    <h1>{template?.name || 'Template'}</h1>
                </div>
                <div>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                            <BsFillFileEarmarkFill />
                        </button>
                        <button type="button"
                                onClick={()=>download()}
                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                            <BsFloppyFill />
                        </button>
                        <button type="button"
                                onClick={()=>print()}
                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                            <BsFillPrinterFill />
                        </button>
                    </div>
                </div>
            </div>
            <form className="flex flex-row">
                <div className="flex-col w-full p-2 no-print">

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
                <div className="flex-col w-full">
                    <div className="bg-white text-black a4-print printable"
                         ref={targetRef}
                         dangerouslySetInnerHTML={{__html: renderedContent}} />
                </div>
            </form>

        </>
    );
}


export default Editor;