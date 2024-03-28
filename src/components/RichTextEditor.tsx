import {useEffect, useRef, useState} from "react";
import {Editor} from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from 'tinymce';

const RichTextEditor = ({text, setText}: {text?: string, setText?: Function}) => {
    const editorRef = useRef<TinyMCEEditor>();
    const [dirty, setDirty] = useState(false);
    useEffect(() => setDirty(false), [text]);


    const save = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            setDirty(false);
            editorRef.current.setDirty(false);
            // an application would save the editor content to the server here
            if (typeof setText === "function") {
                setText(content);
            }
        }
    };
    return (
        <>
            <Editor
                init={{plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ]}}
                apiKey={import.meta.env.VITE_TINYMCE}
                initialValue={text}
                onInit={(_evt, editor) => editorRef.current = editor}
                onDirty={() => setDirty(true)}
            />
            <div className="p-1 flex flex-row justify-between z-10">
                <button className="flex" onClick={save} type="button">Finalize</button>
                {dirty && <p>You have unsaved content!</p>}
            </div>
        </>
    );
};

export default RichTextEditor;