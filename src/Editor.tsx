import {useSearchParams} from "react-router-dom";
import {firebaseCollections, getById} from "./firebase/BaseConfig.ts";
import {useEffect, useState} from "react";
import {GeneralStringObject, Template} from "./interfaces/interfaces.ts";
import Header from "./components/Header.tsx";
import {getFileURL} from "./firebase/storage.ts";
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
        const template = await getById(id, firebaseCollections.templates) as Template;
        if (template) {

            const url = template.path;
            if (url) {
                const response = await fetch(await getFileURL(url));
                if (response && response.ok) {
                    const content = await response.text();
                    if (content) {
                        template.content = content;
                    }
                }
            }
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
            <form className="flex-row">
                <div className="flex-col">

                    {variableKeys.map(key=>(
                        <StyledInput type="text" name={key}
                                     value={formData[key]}
                                     onChange={(e) => changeFormData(e, key)}
                                     label={key}
                        ></StyledInput>
                    ))}
                </div>
                <div className="flex-col">
                    <div>
                        {renderedContent}
                    </div>
                </div>
                <button type="button" onClick={()=>download()}>Download</button>
            </form>
        </>
    );
}


export default Editor;