import { getDownloadURL, getStorage, ref, uploadBytes, UploadResult, uploadString, deleteObject } from "firebase/storage";
import app from "./BaseConfig.ts";

export const storage = getStorage(app);

export const uploadFile = (path: string, file: File|Blob|Uint8Array): Promise<UploadResult> => {
    const storageRef  = ref(storage, path);

    return uploadBytes(storageRef, file);
}

export const uploadFileDataURL = (path: string, message: string): Promise<UploadResult> => {
    const storageRef  = ref(storage, path);

    return uploadString(storageRef, message, 'data_url');
}

export const uploadFileBase64 = (path: string, message: string): Promise<UploadResult> => {
    const storageRef  = ref(storage, path);

    return uploadString(storageRef, message, 'base64');
}

export const uploadFileBase64URL = (path: string, message: string): Promise<UploadResult> => {
    const storageRef  = ref(storage, path);

    return uploadString(storageRef, message, 'base64url');
}

export const uploadFileString = (path: string, message: string): Promise<UploadResult> => {
    const storageRef  = ref(storage, path);

    return uploadString(storageRef, message);
}

export const getFileURL = (path: string): Promise<string> => {
    const storageRef  = ref(storage, path);
    return getDownloadURL(storageRef);
}

export const deleteFile = (path: string): Promise<void> => {
    const deleteRef = ref(storage, path);
    return deleteObject(deleteRef);
}