
"use strict";

/* =====================================================
   STONNEGAMS — INTERACTIONS DU SITE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. NAVIGATION VERS LES SECTIONS */

    const boutonRealisations = document.getElementById("veiw-btn");
    const sectionRealisations = document.querySelector(".realisation");

    if (boutonRealisations && sectionRealisations) {
        boutonRealisations.addEventListener("click", () => {
            sectionRealisations.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }


    /* 2. BOUTONS QUI OUVRENT LA PAGE CONTACT */

    const boutonsContact = [
        document.getElementById("start-btn"),
        document.getElementById("contact-btn")
    ];

    boutonsContact.forEach((bouton) => {
        if (!bouton) return;

        bouton.addEventListener("click", () => {
            window.location.href = "contact.html#formular";
        });
    });


    /* 3. NAVIGATION ACTIVE */

    const pageActuelle = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".nav-links a").forEach((lien) => {
        const destination = lien.getAttribute("href");

        if (!destination) return;

        const nomDestination = destination
            .split("/")
            .pop()
            .split("#")[0]
            .toLowerCase();

        const estActif =
            nomDestination === pageActuelle ||
            (pageActuelle === "" && nomDestination === "index.html");

        if (estActif) {
            lien.classList.add("active");
            lien.setAttribute("aria-current", "page");
        } else {
            lien.classList.remove("active");
            lien.removeAttribute("aria-current");
        }
    });


    /* 4. LIEN WHATSAPP */

    const boutonWhatsApp = document.getElementById("whatsapp-btn");

    if (boutonWhatsApp) {
        boutonWhatsApp.href = "https://wa.me/243844583063";
        boutonWhatsApp.target = "_blank";
        boutonWhatsApp.rel = "noopener noreferrer";
        boutonWhatsApp.setAttribute(
            "aria-label",
            "Contacter Stonnegams sur WhatsApp"
        );
    }


    /* 5. VALIDATION DU FORMULAIRE */

    const formulaire = document.querySelector(".formular-form form");

    if (formulaire) {
        const champNom = formulaire.querySelector("#name");
        const champEmail = formulaire.querySelector("#email");
        const champTelephone = formulaire.querySelector("#phone");
        const champMessage = formulaire.querySelector("#message");
        const boutonEnvoyer = formulaire.querySelector("#submit");

        // Évite les espaces seuls dans le nom.
        if (champNom) {
            champNom.addEventListener("input", () => {
                champNom.setCustomValidity(
                    champNom.value.trim().length < 2
                        ? "Veuillez saisir un nom d'au moins 2 caractères."
                        : ""
                );
            });
        }

        // Vérifie la longueur du message.
        if (champMessage) {
            champMessage.addEventListener("input", () => {
                const longueur = champMessage.value.trim().length;

                if (longueur < 7) {
                    champMessage.setCustomValidity(
                        "Votre message doit contenir au moins 7 caractères."
                    );
                } else if (longueur > 500) {
                    champMessage.setCustomValidity(
                        "Votre message ne peut pas dépasser 500 caractères."
                    );
                } else {
                    champMessage.setCustomValidity("");
                }
            });
        }

        // Le téléphone reste facultatif.
        if (champTelephone) {
            champTelephone.addEventListener("input", () => {
                const telephone = champTelephone.value.trim();

                champTelephone.setCustomValidity(
                    telephone && !/^[+\d\s().-]{7,20}$/.test(telephone)
                        ? "Veuillez saisir un numéro de téléphone valide."
                        : ""
                );
            });
        }

        formulaire.addEventListener("submit", (event) => {

            // Nettoyage des espaces superflus.
            if (champNom) {
                champNom.value = champNom.value.trim();
            }

            if (champEmail) {
                champEmail.value = champEmail.value.trim();
            }

            if (champTelephone) {
                champTelephone.value = champTelephone.value.trim();
            }

            if (champMessage) {
                champMessage.value = champMessage.value.trim();
            }

            // Utilise les validations HTML et JavaScript.
            if (!formulaire.checkValidity()) {
                event.preventDefault();
                formulaire.reportValidity();
                return;
            }

            // Un formulaire sans destination ne peut pas envoyer
            // les données à un service de réception.
            const action = formulaire.getAttribute("action");

            if (!action || !action.trim()) {
                event.preventDefault();

                alert(
                    "Le formulaire n'est pas encore connecté à un service d'envoi. " +
                    "Configure son attribut action avant de recevoir les demandes."
                );

                return;
            }

            // Empêche les doubles clics pendant la soumission.
            if (boutonEnvoyer) {
                boutonEnvoyer.disabled = true;
                boutonEnvoyer.textContent = "Envoi en cours...";
            }
        });
    }


    /* 6. APPARITION PROGRESSIVE DES CARTES */

    const elementsAAnimer = document.querySelectorAll(
        ".blocs-content figure, .article-content article"
    );

    const mouvementReduit = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !mouvementReduit) {

        const observateur = new IntersectionObserver(
            (entrees, observer) => {
                entrees.forEach((entree) => {
                    if (entree.isIntersecting) {
                        entree.target.classList.add("is-visible");
                        observer.unobserve(entree.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        elementsAAnimer.forEach((element) => {
            element.classList.add("reveal");
            observateur.observe(element);
        });

    } else {
        elementsAAnimer.forEach((element) => {
            element.classList.add("is-visible");
        });
    }


    /* 7. ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE */

    const copyright = document.querySelector("footer > p");

    if (copyright) {
        copyright.textContent = copyright.textContent.replace(
            /©\s*\d{4}/,
            `© ${new Date().getFullYear()}`
        );
    }

});
