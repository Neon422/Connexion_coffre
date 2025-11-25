const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

function isPageSecure() {
    return window.location.protocol === 'https:';
}

function warnIfNotHttps() {
    if (!isPageSecure()) {
        console.warn('⚠️ Le site n\'est pas chargé en HTTPS. Certaines APIs peuvent être bloquées.');
        const el = document.createElement('div');
        el.id = 'insecure-warning';
        el.textContent = "Attention : site chargé en HTTP — certains éléments peuvent être bloqués.";
        el.style.cssText = 'position:fixed;bottom:8px;right:8px;padding:8px 12px;background:#ffcc00;color:#000;border-radius:6px;font-size:13px;z-index:9999';
        document.body.appendChild(el);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Autoriser le focus seulement sur les champs du formulaire
    const allowed = ["INPUT", "TEXTAREA", "SELECT"];

    document.addEventListener("mousedown", (e) => {
        // Si l'élément cliqué n'est pas un champ → bloquer le focus
        if (!allowed.includes(e.target.tagName)) {
            e.preventDefault();
        }
    });

    // Bonus : empêche aussi le focus via Tab
    document.addEventListener("focusin", (e) => {
        if (!allowed.includes(e.target.tagName)) {
            e.preventDefault();
            // Optionnel : renvoyer vers le premier champ
            document.getElementById("nom").focus();
        }
        form.addEventListener("submit", (e) => {
            e.preventDefault();  // empêche l’envoi du formulaire

            const nom = document.getElementById("nom").value;
            const mdp = document.getElementById("motdepasse").value;

            // Mot de passe sécurisé en SHA256 pré-généré
            const motdepasseCorrect = "ef797c8118f02d..."; // <- je peux te générer le tien

            // Transformer ce que tape l’utilisateur en SHA256
            crypto.subtle.digest("SHA-256", new TextEncoder().encode(mdp))
                .then(hash => {
                    const hex = [...new Uint8Array(hash)]
                        .map(b => b.toString(16).padStart(2, "0"))
                        .join("");

                    if (hex === motdepasseCorrect) {
                        // Redirection vers la page réservée
                        window.location.href = "page_esp32.html";
                    } else {
                        alert("Mot de passe incorrect.");
                    }
                });
        });
    });
});

// Exemple de fonction fetch pour récupérer un JSON local/remote
async function fetchJson(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Erreur fetchJson:', err);
        return null;
    }
}

const comptes = await fetch("comptes.json").then(r => r.json());

// Exemple d'initialisation principale
async function init() {
    // Vérifications / infos
    warnIfNotHttps();

    // Comportements d'UI
    setupMobileMenu();

    // Ex: charger un fichier data.json situé à la racine du site
    const data = await fetchJson('/data.json');
    if (data) {
        // Faire quelque chose avec les données
        console.info('Données chargées:', data);
    }

    // Autres initialisations possibles : animations, écouteurs, etc.
}

// Exposer certaines fonctions pour tests ou usage manuel
window.app = {
    init,
    isPageSecure,
    fetchJson,
};

// Lancer init au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // déjà prêt
    init();
}
