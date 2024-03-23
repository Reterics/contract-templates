import {ModalArguments, Template} from "../../interfaces/interfaces.ts";
import GeneralModal from "./GeneralModal.tsx";
import StyledInput from "../elements/StyledInput.tsx";
import {useState} from "react";
import StyledFile from "../elements/StyledFile.tsx";


export default function TemplateModal({
    visible,
    onClose,
    title

} :ModalArguments) {

    if (visible === false) return null;

    const [template, setTemplate] = useState<Template>({id: ""});
    const [file, setFile] = useState<File|null>(null)

    const changeType = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const value = e.target.value;
        setTemplate((currentTemplate: any) => {
            const obj = {...currentTemplate};
            obj[key] = value;
            return obj;
        });
    };

    const uploadAndClose = ()=> {
        if (!file) {
            alert('You need to upload a file for creating a template')
            return;
        }
        const extension = file.name.substring(file.name.lastIndexOf('.'));

        const rawDocument = {
            file: file,
            document: {
                ...template,
                path: 'files/' + (template.name || '') + extension
            }
        };
        if (typeof onClose === "function"){
            onClose(rawDocument)
        }
    };

    const close = () => {
        if (typeof onClose === "function"){
            onClose(false)
        }
    }

    const buttons = [
        {
            value: 'Save',
            onClick: uploadAndClose,
            primary: true
        },
        {
            value: 'Close',
            onClick: close,
            primary: false
        }
    ]
    return (
        <GeneralModal title={title || "Template Modal"} buttons={buttons}>

            <div className="w-full max-w-screen-lg p-6 bg-white border border-gray-200 rounded-lg shadow
                        dark:bg-gray-800 dark:border-gray-700 mr-1 pt-9">

                <StyledInput
                    type="text" name="name"
                    value={template.name}
                    onChange={(e) => changeType(e, 'name')}
                    label="Template name"
                />
                <StyledFile name="model" label="Model" onChange={(file: File)=>setFile(file)} />

            </div>
        </GeneralModal>
    )
}