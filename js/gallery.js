// ═══════════ DATOS GALERÍA ═══════════

const galleryData = [
    {
        name: "Desdentao",
        image: "desdentao.jpg",
        description: "Amigurumi tejido a mano inspirado en el mundo de los dragones.",
        availability: "🧶 Disponible por encargo"
    },
    {
        name: "Demogorgon",
        image: "demogorgon.jpg",
        description: "Creación artesanal inspirada en mundos fantásticos.",
        availability: "✨ Se puede volver a crear"
    },
    {
        name: "Chopper",
        image: "chopper.jpg",
        description: "Un pequeño personaje tejido con mucho cariño.",
        availability: "🧶 Disponible por encargo"
    }
];


// ═══════════ CREAR TARJETAS ═══════════

const galleryContainer = document.getElementById("gallery-container");

galleryData.forEach(creation => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <img
            class="gallery-image"
            src="../img/sold/${creation.image}"
            alt="${creation.name} de crochet"
        >

        <div class="product-info">
            <h3>${creation.name}</h3>
            <p class="availability">${creation.availability}</p>
        </div>
    `;

    galleryContainer.appendChild(card);

});


// ═══════════ MODAL IMAGEN ═══════════

const modal = document.getElementById("imageModalOverlay");
const modalImg = document.getElementById("imageModalImg");
const closeModal = document.getElementById("closeImageModal");

let zoom = 1;


document.querySelectorAll(".gallery-image").forEach(img => {

    img.addEventListener("click", () => {

        modal.classList.add("active");

        modalImg.src = img.src;
        modalImg.alt = img.alt;

        zoom = 1;
        modalImg.style.transform = "scale(1)";
        modalImg.classList.remove("zoomed");

    });

});


// ═══════════ CERRAR MODAL ═══════════

function closeImageModal() {

    modal.classList.remove("active");

    zoom = 1;

    modalImg.style.transform = "scale(1)";
    modalImg.classList.remove("zoomed");

}


closeModal.addEventListener("click", closeImageModal);


modal.addEventListener("click", e => {

    if (e.target === modal) {
        closeImageModal();
    }

});


// ═══════════ TECLA ESC ═══════════

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
        closeImageModal();
    }

});


// ═══════════ ZOOM CON RUEDA ═══════════

modalImg.addEventListener("wheel", e => {

    if (!modal.classList.contains("active")) {
        return;
    }

    e.preventDefault();

    zoom += e.deltaY < 0 ? 0.15 : -0.15;

    if (zoom < 1) zoom = 1;
    if (zoom > 4) zoom = 4;

    modalImg.style.transform = `scale(${zoom})`;

    modalImg.classList.toggle("zoomed", zoom > 1);

}, { passive: false });