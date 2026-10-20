const places = document.querySelector("#places-disponibles");
const totale = document.querySelector("#totale");

const sieges = document.querySelectorAll("#plan-sieges .siege");

const formRes = document.getElementById("form-reservation");
const passagerReserve = document.querySelector("#nom-reservation");
const selectReservation = document.getElementById("siege-reservation");
const parReserver = document.querySelector("#message-reservation")

const formModif = document.getElementById("form-modification");
const passagerSelectModif = document.querySelector("#passager-modification");
const nouveauNom = document.querySelector("#nouveau-nom");
const updateSelect = document.querySelector("#nouveau-siege");
const parModif = document.querySelector("#message-modification");

const formSupp = document.getElementById("form-suppression");
const passagerSupp = document.querySelector("#passager-suppression");
const parSupp = document.querySelector("#message-suppression");

//select form reservation
function reservationSelect() {
    selectReservation.innerHTML ='<option value="">Sélectionner un siège</option>';
    updateSelect.innerHTML ='<option value="">Sélectionner un siège</option>';

    sieges.forEach(siege => {
        if (siege.classList.contains("libre")) {
            const option = document.createElement("option");

            option.value = siege.dataset.seat;
            option.textContent = `Siège ${siege.dataset.seat}`;

            selectReservation.appendChild(option);
            updateSelect.appendChild(option.cloneNode(true));
        }
    });
}

//select form modif et supp
function modifSuppPassSelect() {
    passagerSelectModif.innerHTML = '<option value="">Choisir un passager</option>';
    passagerSupp.innerHTML = '<option value="">Choisir un passager</option>';

    sieges.forEach(siege => {
        if (siege.classList.contains("occupe")) {
            const passager = siege.querySelector(".passager");

            if (passager) {
                const nom = passager.textContent.trim();

                const option1 = document.createElement("option");
                option1.value = siege.dataset.seat;
                option1.textContent = nom;

                passagerSelectModif.appendChild(option1);
                passagerSupp.appendChild(option1.cloneNode(true));
            }
        }
    });
}

//place dispo
function placeDispo(){
    const siegesLibres = document.querySelectorAll(".siege.libre");
    places.textContent = siegesLibres.length;
}


//total
function totalP(){
    const siegesOccupes = document.querySelectorAll(".siege.occupe");
    totale.textContent = siegesOccupes.length * 80;
}


//form reserve
formRes.addEventListener("submit", function(e) {
    e.preventDefault();
    const nom = passagerReserve.value.trim();
    if (nom === "") {
        parReserver.textContent = "Veuillez saisir le nom du passager.";
        return;
    }

    const nomExist = document.querySelectorAll("#plan-sieges .passager");
    for (const passager of nomExist) {
        if (passager.textContent.trim().toLowerCase() === nom.toLowerCase()) {
            parReserver.textContent = "Ce passager possède déjà une réservation.";
            return;
        }
    }

    const siegesLibres = document.querySelectorAll("#plan-sieges .siege.libre");
    if (siegesLibres.length === 0) {
        messageReservation.textContent = "Le bus est complet.";
        return;
    }

    const numSiege = selectReservation.value;
    let siege;

    if (numSiege !== "") {
        siege = Array.from(siegesLibres).find(s => s.dataset.seat === numSiege);
    } else {
        siege = siegesLibres[0];
    }

    if (!siege) {
        parReserver.textContent = "Veuillez choisir un siège libre.";
        return;
    }

    const numS = siege.dataset.seat;
    siege.classList.remove("libre");
    siege.classList.add("occupe");

    siege.innerHTML = `
        <span class="numero-siege">${numS}</span>
        <span class="passager">${nom}</span>
    `;

    placeDispo();
    totalP();
    reservationSelect();
    modifSuppPassSelect();

    parReserver.textContent = "Réservation effectuée avec succès !";
});

reservationSelect()
modifSuppPassSelect();
