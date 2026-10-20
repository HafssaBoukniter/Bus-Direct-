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