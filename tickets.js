const ticketsCard = document.querySelector("#tickets");
const numberBillets = document.querySelector("#number-billets");

const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

numberBillets.textContent = reservations.length;

ticketsCard.innerHTML="";
reservations.forEach(reservation => {
    ticketsCard.innerHTML += `
        <div class="mx-auto w-full max-w-3xl rounded-[22px] border-2 border-dashed border-slate-300  bg-white p-5 sm:p-7">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
            <h3 class="flex items-center gap-3 text-sm font-bold text-tral-800 sm:text-xl">
                <i class="fa-solid fa-ticket text-teal-700"></i>
                    BILLET BUSDIRECT
            </h3>
            <span class="whitespace-nowrap rounded-xl bg-teal-700 px-3 py-2 text-sm font-bold text-white sm:px-5 sm:text-lg">
                Siege N°${reservation.siege}
            </span>
        </div>
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 py-5 text-base sm:text-xl">
            <span class="font-medium text-slate-900">
                Safi → Marrakech
            </span>
            <span class="whitespace-nowrap font-bold text-teal-700">
                80 DH
            </span>
        </div>

        <div class="flex items-center gap-4 pt-4 text-lg font-bold text-slate-900 sm:text-2xl">
            <i class="fa-solid fa-user text-teal-700"></i>
            <span>${reservation.nom}</span>
        </div>

        </div>
    `;
});
