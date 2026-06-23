import RegistrationForm from "./components/RegistrationForm";
import RegisteredList from "./components/RegisteredList";
import AdminSection from "./components/AdminSection";
import { useState } from "react";
import { useAdminAuth} from "./hooks/useAdminAuth";
import "./App.css";

function App() {
    const admin = useAdminAuth();
    const [refresh, setRefresh] = useState(false);
    const handleRegistered = () => {
        // Toggle refresh to trigger RegisteredList reload
        setRefresh((r) => !r);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1 className="app-title">Portail d'inscription</h1>
                <p className="app-subtitle">Rejoignez notre communauté</p>
                <AdminSection admin={admin} />
            </header>
            <main className="app-main">
                <section className="section-form" aria-label="Formulaire d'inscription">
                    <RegistrationForm onRegistered={handleRegistered} />
                </section>
                <section className="section-list" aria-label="Liste des inscrits">
                    <RegisteredList refresh = {refresh}
                                    onUsersChanged={handleRegistered}
                                    adminToken={admin.token}/>
                </section>
            </main>
        </div>
    );
}

export default App;