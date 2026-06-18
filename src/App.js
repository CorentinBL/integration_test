import RegistrationForm from "./components/RegistrationForm";
import "./App.css";

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1 className="app-title">Portail d'inscription</h1>
                <p className="app-subtitle">Rejoignez notre communauté</p>
            </header>
            <main className="app-main">
                <section className="section-form" aria-label="Formulaire d'inscription">
                    <RegistrationForm />
                </section>
                <section className="section-list" aria-label="Liste des inscrits">
                    <RegisteredList/>
                </section>
            </main>
        </div>
    );
}

export default App;