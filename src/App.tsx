import {useContext} from 'react'
import logo from '/logo.svg'
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
            <div>
                <a href="https://reterics.com" target="_blank">
                    <img src={logo} className="logo react reterics" alt="Reterics logo"/>
                </a>
            </div>
            <h1>Vite + React + Firebase Auth + TailwindCSS</h1>
            {loading && <PageLoading/>}

        </>
    )
}

export default App
