import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {collection, doc, getDoc, getFirestore, onSnapshot, query} from 'firebase/firestore';

const  app  =  initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

export const firebaseCollections = {
    templates: import.meta.env.VITE_FIREBASE_DB_TEMPLATES || 'templates',
    documents: import.meta.env.VITE_FIREBASE_DB_DOCUMENTS || 'documents',
};

export const firebaseAuth = getAuth(app);

export const db = getFirestore(app);

export const getCollection = (type: string): Promise<object[]> => {
    return new Promise((resolve) => {
        const q = query(collection(db, type));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const receivedData: object[] = [];
            querySnapshot.forEach((doc) => {
                receivedData.push({ ...doc.data(), id: doc.id });
            });
            resolve(receivedData);
            return () => unsubscribe()
        })
    });
};

export const getById = async (id: string, collection: string): Promise<object|null> => {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

export default app;