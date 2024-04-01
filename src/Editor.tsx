import {useSearchParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {GeneralStringObject, Template} from "./interfaces/interfaces.ts";
import Header from "./components/Header.tsx";
import {getFileFromStorage} from "./firebase/storage.ts";
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import StyledInput from "./components/elements/StyledInput.tsx";
import {downloadAsFile} from "./utils/general.ts";
import "./Editor.css";
import {AuthContext} from "./store/AuthContext.tsx";
import SignInComponent from "./components/SignIn.tsx";
import PageLoading from "./components/PageLoading.tsx";
import {TableViewActions} from "./components/elements/TableViewComponent.tsx";


const Editor = () => {
    const {user, loading} = useContext(AuthContext);
    let [searchParams] = useSearchParams();

    const id = searchParams && searchParams.get('id') ?  searchParams.get('id') : undefined;
    // Handle null and undefined differently to avoid infinite Rest API loops
    const [template, setTemplate] = useState<Template|null|undefined>(undefined);
    const [formData, setFormData] = useState<GeneralStringObject>({});
    const targetRef = useRef(null);

    if (!user) return <SignInComponent />;
    if (loading) return (<><Header /><PageLoading/></>);

    const updateFromCloud = async (id: string) => {
        const template = await getFileFromStorage(id);
        if (template) {
            setTemplate({ ...template } as Template);
        } else {
            setTemplate(null);
        }
    };

    useEffect(() => {
        if (id && template === undefined) {
            void updateFromCloud(id);
        }
    }, [id]);

    if (!id) return (<><Header /><p>404 - There is no id provided</p></>);
    if (template === null) return (<><Header /><p>400 - No Valid Template</p></>);
    if (template === undefined) return (<><Header /><PageLoading/></>);
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

    const extractFileName = (path?: string) => {
        if (!path) {
            return '';
        }
        return path
            .replace('files/', '')
            .replace('.txt', '');
    };

    const download = () => {
        downloadAsFile(extractFileName(template.path) + ".html", renderedContent);
    };

    const exportCode = ()=> {
        downloadAsFile(extractFileName(template.path) + ".json", JSON.stringify(formData));
    };

    const reset = () => {
        setFormData({});
    };

    const print = () => {
        if (window && window.print) {
            window.print();
        }
    };

    return (
        <>
            <Header />
            <div className="flex flex-row justify-between mt-2 no-print pb-4 p-2">
                <div></div>
                <div>
                    <h1>{template?.name || 'Template'}</h1>
                </div>
                <div>
                    {TableViewActions({
                        onCreate: () => reset(),
                        onSave: () => download(),
                        onCode: () => exportCode(),
                        onPrint: () => print()
                    })}
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