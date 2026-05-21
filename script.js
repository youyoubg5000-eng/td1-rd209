const codePostal = document.getElementById("codePostal");
const commune = document.getElementById("commune");

const btnCommunes = document.getElementById("btnCommunes");
const btnReset = document.getElementById("btnReset");

const zoneCodePostal = document.getElementById("zoneCodePostal");
const zoneCommune = document.getElementById("zoneCommune");

const resultat = document.getElementById("resultat");

const TOKEN = "d4bb7784c16e78bc33c186d536228b6cd0f19c19c7ea4253c67d18604d24b908";

btnCommunes.addEventListener("click", chargerCommunes);
commune.addEventListener("change", chargerMeteo);
btnReset.addEventListener("click", resetRecherche);


// Charger les communes à partir du code postal
async function chargerCommunes() {

    const cp = codePostal.value.trim();

    if (cp.length !== 5) {
        alert("Veuillez entrer un code postal valide.");
        return;
    }

    try {

        const reponse = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${cp}`
        );

        const data = await reponse.json();

        if (data.length === 0) {
            alert("Aucune commune trouvée.");
            return;
        }

        commune.innerHTML = "";

        // Option vide
        const optionVide = document.createElement("option");
        optionVide.textContent = "Choisissez une commune";
        optionVide.value = "";
        commune.appendChild(optionVide);

        // Ajouter les communes
        data.forEach(ville => {

            const option = document.createElement("option");

            option.value = ville.code;
            option.textContent = ville.nom;

            commune.appendChild(option);

        });

        // Cacher la recherche code postal
        zoneCodePostal.style.display = "none";

        // Afficher la liste des communes
        zoneCommune.style.display = "flex";

    } catch (erreur) {

        alert("Erreur lors de la récupération des communes.");
        console.error(erreur);

    }
}


// Charger la météo
async function chargerMeteo() {

    const codeVille = commune.value;

    if (!codeVille) {
        return;
    }

    try {

        const reponse = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily?token=${TOKEN}&insee=${codeVille}`
        );

        const data = await reponse.json();

        const meteo = data.forecast[0];

        resultat.innerHTML = `
            <h2>${commune.options[commune.selectedIndex].text}</h2>
            <p>Température min : ${meteo.tmin} °C</p>
            <p>Température max : ${meteo.tmax} °C</p>
            <p>Probabilité de pluie : ${meteo.probarain} %</p>
            <p>Ensoleillement : ${meteo.sun_hours} h</p>
        `;

        // Afficher le bouton reset
        btnReset.style.display = "block";

    } catch (erreur) {

        alert("Erreur lors de la récupération météo.");
        console.error(erreur);

    }
}


// Recommencer une recherche
function resetRecherche() {

    codePostal.value = "";
    commune.innerHTML = "";
    resultat.innerHTML = "";

    // Cacher la liste des communes
    zoneCommune.style.display = "none";

    // Réafficher la recherche par code postal
    zoneCodePostal.style.display = "flex";

    // Cacher le bouton reset
    btnReset.style.display = "none";

}