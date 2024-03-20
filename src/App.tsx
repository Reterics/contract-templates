import {useContext} from 'react'
import './App.css'
import {AuthContext} from "./store/AuthContext.tsx";
import PageLoading from "./components/PageLoading.tsx";
import Header from "./components/Header.tsx";
import SignInComponent from "./components/SignIn.tsx";

function App() {
    const {user, loading} = useContext(AuthContext);

    if (!user) return <SignInComponent />;

    return (
        <>
            <Header />
            <h1>Vite + React + Firebase Auth + TailwindCSS</h1>
            {loading && <PageLoading/>}

        </>
    )
}

export default App
