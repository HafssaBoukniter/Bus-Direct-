const places = document.querySelector("#places-disponibles");
const totale = document.querySelector("#totale");

const sieges = document.querySelectorAll("#plan-sieges .siege");

const formRes = document.getElementById("form-reservation");
const passagerReserve = document.querySelector("#nom-reservation");
const selectReservation = document.getElementById("siege-reservation");
const parReserver = document.querySelector("#message-reservation");

const formModif = document.getElementById("form-modification");
const passagerSelectModif = document.querySelector("#passager-modification");
const nouveauNom = document.querySelector("#nouveau-nom");
const updateSelect = document.querySelector("#nouveau-siege");
const parModif = document.querySelector("#message-modification");

const formSupp = document.getElementById("form-suppression");
const passagerSupp = document.querySelector("#passager-suppression");
const parSupp = document.querySelector("#message-suppression");

const formRech = document.getElementById("form-recherche");
const passagerRechercher = document.querySelector("#rechercher-nom");
const parRech = document.querySelector("#message-rechercher");

const menu = document.getElementById("menu");
const mobileLinks = document.getElementById("mobile-links");

menu.addEventListener("click", ()=>{
    mobileLinks.classList.toggle("hidden");
    
    const menuOuv = !mobileLinks.classList.contains("hidden");

    menu.setAttribute("aria-expanded" , menuOuv);
})

//select form reservation
function reservationSelect() {
    selectReservation.innerHTML = '<option value="">Sélectionner un siège</option>';
    updateSelect.innerHTML = '<option value="">Sélectionner un nouveau siège</option>';

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
                const numS = siege.dataset.seat;

                const option1 = document.createElement("option");
                option1.value = numS;
                option1.textContent = nom;

                passagerSelectModif.appendChild(option1);
                passagerSupp.appendChild(option1.cloneNode(true));
            }
        }
    });
}

//place dispo
function placeDispo() {
    const siegesLibres = document.querySelectorAll(".siege.libre");
    places.textContent = siegesLibres.length;
}


//total
function totalP() {
    const siegesOccupes = document.querySelectorAll(".siege.occupe");
    totale.textContent = siegesOccupes.length * 80;
}


function chargerReservations() {
    let reservations = [];

    try{
        reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    }catch (error){
        reservations = [];
    }
    

    reservations.forEach(reservation => {
        const siege = Array.from(sieges).find(
            s => s.dataset.seat === reservation.siege
        );

        if (siege) {
            siege.classList.remove("libre");
            siege.classList.add("occupe");

            siege.innerHTML = `
                <span class="numero-siege">${reservation.siege}</span>
                <span class="passager" draggable="true" >${reservation.nom}</span>
            `;
        }
    });

    placeDispo();
    totalP();
    reservationSelect();
    modifSuppPassSelect();
}

function dragItem(){
    let drag;
    sieges.forEach(siege =>{
        siege.addEventListener("dragstart", e =>{

            if(!siege.classList.contains("occupe")){
                e.preventDefault();
                return;
            }
 
            drag = siege;
            e.dataTransfer.setData("text/plain", siege.dataset.seat);
            e.dataTransfer.effectAllowed = "move";
        });


        siege.addEventListener("dragover", e =>{
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        siege.addEventListener("drop", e =>{
            e.preventDefault();

            if(!drag || siege === drag) return;
            if(!siege.classList.contains("libre")) return;

            const passager = drag.querySelector(".passager");

            if(!passager) return;

            const nom = passager.textContent.trim();
            const siegeNum = drag.dataset.seat;
            const nouvNum = siege.dataset.seat;

            drag.classList.remove("occupe");
            drag.classList.add("libre");
            drag.innerHTML= `
                <span class="">${siegeNum}</span>
            `;

            siege.classList.remove("libre");
            siege.classList.add("occupe");
            siege.innerHTML = `
                <span class="numero-siege">${nouvNum}</span>
                <span class="passager" draggable="true">${nom}</span>
            `;

            let reservations =  JSON.parse(localStorage.getItem("reservations")) || [];
            reservations = reservations.map(reservation =>{
                if(String(reservation.siege) === String(siegeNum)){
                    return{
                        nom : reservation.nom,
                        siege : nouvNum
                    }
                }
                return reservation;
            });

            localStorage.setItem("reservations",JSON.stringify(reservations));
            console.log("Reservations enregistrées :", reservations);
            placeDispo();
            totalP();
            reservationSelect();
            modifSuppPassSelect();
        });
    });
}

function selectionnerSiege(){
    sieges.forEach(siege =>{
        siege.addEventListener("click" , () =>{
            if(siege.classList.contains("libre")){
                selectReservation.value = siege.dataset.seat;
            }else if(siege.classList.contains("occupe")){
                const passager = siege.querySelector(".passager");

                if(passager){
                    passagerSelectModif.value = siege.dataset.seat;
                }
            }
        });
    });
}


//form reserve
formRes.addEventListener("submit", e => {
    e.preventDefault();
    const nom = passagerReserve.value.trim();
    if (nom === "") {
        parReserver.textContent = "Veuillez saisir le nom du passager.";
        setTimeout(() => {
            parReserver.textContent = "";
        }, 3000);
        return;
    }

    const nomExist = document.querySelectorAll("#plan-sieges .passager");
    for (const passager of nomExist) {
        if (passager.textContent.trim().toLowerCase() === nom.toLowerCase()) {
            parReserver.textContent = "Ce passager possède déjà une réservation.";
            setTimeout(() => {
                parReserver.textContent = "";
            }, 3000);
            return;
        }
    }

    const siegesLibres = document.querySelectorAll("#plan-sieges .siege.libre");
    if (siegesLibres.length === 0) {
        alert("Le bus est complet.");
        return;
    }

    const numSiege = selectReservation.value;
    let siege;

    if (numSiege !== "") {
        siege = Array.from(siegesLibres).find(s => s.dataset.seat === numSiege);
    } else {
        siege = siegesLibres[0];
    }

    const numS = siege.dataset.seat;
    siege.classList.remove("libre");
    siege.classList.add("occupe");

    siege.innerHTML = `
        <span class="numero-siege">${numS}</span>
        <span class="passager" draggable="true">${nom}</span>
    `;

    let reservations = [];

    try{
        reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    }catch (error){
        reservations = [];
    }

    const reservation = {
        nom: nom,
        siege: numS
    };

    reservations.push(reservation);

    localStorage.setItem("reservations", JSON.stringify(reservations));

    placeDispo();
    totalP();
    reservationSelect();
    modifSuppPassSelect();

    parReserver.textContent = "Réservation effectuée avec succès !";
    setTimeout(() => {
        parReserver.textContent = "";
    }, 3000);
});

formModif.addEventListener("submit", e => {
    e.preventDefault();
    const passExist = passagerSelectModif.value;
    const nouvPass = nouveauNom.value.trim();
    const nouvSiege = updateSelect.value;

    if(passExist === ""){
        parModif.textContent = "Veuillez saisir le nom du passager !";
        setTimeout(() => {
            parModif.textContent = "";
        }, 3000);
    }

    const siegeExist = Array.from(sieges).find(siege =>
        siege.dataset.seat === passExist && siege.classList.contains("occupe")
    );

    const ancienPassager = siegeExist.querySelector(".passager").textContent.trim();

    let nomExist = false;
    sieges.forEach(siege =>{
        if(siege.classList.contains("occupe")){
            const passager = siege.querySelector(".passager");
            if(passager && passager.textContent.trim().toLowerCase=== nouvPass.toLowerCase() && siege.dataset.seat !== passExist){
                nomExist = true;
            }
        }
    });
    if(nomExist){
        parModif.textContent = "Ce passager possède déjà existe.";
        setTimeout(() => {
            parModif.textContent = "";
        }, 3000);
        return;
    }
    if(nouvSiege !== "" && nouvSiege !== passExist){
        let nouvNum;
        sieges.forEach(siege =>{
            if(siege.dataset.seat == nouvSiege && siege.classList.contains("libre")){
                nouvNum = siege;
            }
        });
        
        siegeExist.classList.remove("occupe");
        siegeExist.classList.add("libre");
        siegeExist.textContent = passExist;
        nouvNum.classList.remove("libre");
        nouvNum.classList.add("occupe");
        if(nouvPass){
            nouvNum.innerHTML =`
            <span class="numero-siege">${nouvSiege}</span>
            <span class="passager">${nouvPass}</span>
        `;
        }else{
            nouvNum.innerHTML =`
            <span class="numero-siege">${nouvSiege}</span>
            <span class="passager">${ancienPassager}</span>
        `;
        }
        
    }else{
        if (nouvPass !== "") {
            const passager = siegeExist.querySelector(".passager");
            passager.textContent = nouvPass;
        }
    }

    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    reservations = reservations.map(reservation => {
        if (reservation.siege === passExist) {
            return {
                nom: nouvPass || reservation.nom,
                siege: nouvSiege || reservation.siege
            };
        }
        return reservation;
    });

    localStorage.setItem("reservations", JSON.stringify(reservations));

    reservationSelect();
    modifSuppPassSelect();
    placeDispo();
    totalP();
    formModif.reset();
    parModif.textContent = "Modification effectuée avec succès !";
    setTimeout(() => {
        parModif.textContent = "";
    }, 3000);
});

formSupp.addEventListener("submit", e =>{
    e.preventDefault();

    const passExist = passagerSupp.value;
    if(passExist === ""){
        parSupp.textContent = "Veuillez saisir le nom du passager !";
        setTimeout(() => {
            parSupp.textContent = "";
        }, 3000);
    }

    const siegeExist = Array.from(sieges).find(siege =>
        siege.dataset.seat === passExist && siege.classList.contains("occupe")
    );

    siegeExist.classList.remove("occupe");
    siegeExist.classList.add("libre");
    siegeExist.textContent = passExist;

    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    const index = reservations.findIndex(
        reservation => reservation.siege === passExist
    );

    if(index !== -1){
        reservations.splice(index,1);
    }

    localStorage.setItem("reservations", JSON.stringify(reservations));

    reservationSelect();
    modifSuppPassSelect();
    placeDispo();
    totalP();
    formSupp.reset();
    parSupp.textContent = "Suppression effectuée avec succès !";
    setTimeout(() => {
        parSupp.textContent = "";
    }, 3000);
});

formRech.addEventListener("submit" ,e =>{
    e.preventDefault();

    const passagerR = passagerRechercher.value.trim();

    if(passagerR ===""){
        parRech.textContent = "Veuillez saisir le nom du passager !";
        setTimeout(() =>{
            parRech.textContent = "";
        },3000);

        return;
    }

    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    const resTrouve = reservations.find(
        reservation => reservation.nom.toLowerCase() == passagerR.toLowerCase()
    );

    if(!resTrouve){
        parRech.textContent = "Aucun passager trouver !";
        setTimeout(() =>{
            parRech.textContent ="";
        });

        return;
    }

    const siegeMatch = resTrouve.siege;

    console.log(siegeMatch);

    console.log("Toutes les réservations :", reservations);
    console.log("Première réservation :", reservations[0]);

    parRech.textContent = `Le passager ${passagerR} est assis au siège ${siegeMatch}`;

});

chargerReservations();
reservationSelect();
modifSuppPassSelect();
dragItem();
selectionnerSiege();