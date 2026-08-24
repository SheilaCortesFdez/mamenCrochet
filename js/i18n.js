/* ═══════════════════════════════════════════
   mCrochet — i18n.js
   Sistema de internacionalización ES / EN
   ═══════════════════════════════════════════ */

var i18n = (function () {

  var currentLang = localStorage.getItem("mcrochet-lang") || "es";

  /* ── Diccionario ── */
  var dict = {
    es: {
      /* Meta */
      pageTitle: "Mamen Crochet | Tienda de muñecos de crochet",

      /* Nav */
      navCatalogo:    "Catálogo",
      navColecciones: "Colecciones",
      navContacto:    "Contacto",
      navSobreMi:     "Sobre mí",

      /* Hero */
      heroTitle: "Muñecos de crochet hechos a mano",
      heroDesc:  "Descubre piezas únicas para regalar, decorar o coleccionar. Cada muñeco se teje con mucho detalle y materiales suaves.",

      /* Toolbar */
      labelBuscar:      "Buscar",
      placeholderBuscar: "Ej: conejita, sirena...",
      labelPrecio:       "Precio máximo",
      precioHasta:       "Hasta {n} €",

      /* Categorías */
      catTodos:     "Todos",
      catFantasia:  "Fantasía",
      catMuñeca:    "Muñeca/o",
      catAnimales:  "Animal",


      /* Cards */
      noResults:  "No hay resultados para los filtros actuales.",

      /* Formulario */
      formTitle:       "Haz tu pedido",
      formSubtitle:    "Rellena el formulario y te contactaremos para confirmar tu encargo.",
      labelNombre:     "Nombre completo",
      phNombre:        "Tu nombre y apellidos",
      labelEmail:      "Correo electrónico",
      phEmail:         "tu@email.com",
      labelTelefono:   "Teléfono",
      phTelefono:      "+34 600 000 000",
      titleTelefono:   "Introduce un teléfono válido (9-15 dígitos, puede empezar con +)",
      labelDireccion:  "Dirección completa",
      phDireccion:     "Calle, número, piso, código postal, ciudad",
      labelMunecos:    "Muñecos que deseas encargar",
      selectPlaceholder: "— Selecciona uno o varios muñecos —",
      labelMensaje:    "Mensaje adicional (opcional)",
      phMensaje:       "¿Algún detalle o personalización?",

      /* Política */
      policyWarning: '<strong>Política de cancelación:</strong> Dado que cada muñeco se elabora artesanalmente bajo pedido, en caso de cancelación antes de finalizar la confección, se retendrá el <strong>70 %</strong> del importe como compensación por materiales y trabajo invertido, devolviéndose únicamente el <strong>30 %</strong> del precio. <em>Ejemplo: si una figura cuesta 20 €, se le devolverán 6 €.</em>',
      policyBizum: 'El pago se realizará vía <strong>Bizum</strong> al número de teléfono: <strong>0123456789</strong>',
      consentLabel: 'He leído y acepto la <a href="#" id="openPolicyModal" class="policy-link">política de consentimiento y cancelación</a>',
      btnEnviar:     "Enviar pedido ✉️",
      btnEnviando:   "Enviando...",
      btnEnviado:    "¡Pedido enviado! ✅",
      btnErrorEnvio: "Error al enviar ❌",
      btnErrorRed:   "Error de red ❌",
      alertConsent:  "Debes aceptar la política de cancelación para enviar el pedido.",

      /* Muñecos seleccionados */
      muneco1:  "muñeco",
      munecoN:  "muñecos",
      seleccionado1: "seleccionado",
      seleccionadoN: "seleccionados",

      /* Modal */
      modalTitle:  "Política de consentimiento y cancelación",
      modalIntro:  'Al realizar un pedido en <strong>Mamen Crochet</strong>, acepta las siguientes condiciones relativas al consentimiento y cancelación:',
      modalLi1:    '<strong>Trabajo artesanal:</strong> Cada muñeco se elabora íntegramente a mano, desde la selección de materiales hasta el acabado final. El proceso comienza inmediatamente tras confirmar el pedido.',
      modalLi2:    '<strong>Cancelación antes de finalizar:</strong> Si el cliente decide cancelar el pedido antes de que el muñeco esté terminado, se le devolverá únicamente el <strong>30 %</strong> del importe total abonado. El <strong>70 %</strong> restante se retendrá como compensación por los materiales utilizados y el tiempo de trabajo invertido.',
      modalLi3:    '<strong>Ejemplo práctico:</strong> Para un muñeco con un precio de <strong>20 €</strong>, en caso de cancelación se devolverán <strong>6 €</strong> y se retendrán <strong>14 €</strong>.',
      modalLi4:    '<strong>Pedido finalizado:</strong> Una vez el muñeco esté terminado y listo para envío, no se aceptarán cancelaciones ni se realizarán devoluciones.',
      modalLi5:    '<strong>Forma de pago:</strong> El pago del pedido se realizará exclusivamente a través de <strong>Bizum</strong>.<br><strong>No se comenzará el pedido hasta no verificar el pago.</strong>',
      modalLi6:    '<strong>Aceptación:</strong> Al marcar la casilla de consentimiento y enviar el formulario, el cliente confirma que ha leído, comprendido y aceptado esta política de cancelación.',
      modalNote:   "Si tiene cualquier duda, no dude en consultarnos antes de realizar su pedido.",
      modalAccept: "Entendido",

      /* Footer */
      footer: "Mamen Crochet © 2026 — Taller artesanal. Pedidos personalizados por mensaje directo.",

      /* Botón idioma */
      langSwitch: "EN 🇬🇧"
    },

    en: {
      pageTitle: "Mamen Crochet | Handmade Crochet Dolls Shop",

      navCatalogo:    "Catalogue",
      navColecciones: "Collections",
      navContacto:    "Contact",

      heroTitle: "Handmade crochet dolls",
      heroDesc:  "Discover unique pieces to gift, decorate or collect. Each doll is knitted with great detail and soft materials.",

      labelBuscar:      "Search",
      placeholderBuscar: "E.g.: bunny, mermaid...",
      labelPrecio:       "Max price",
      precioHasta:       "Up to {n} €",

      catTodos:     "All",
      catAnimales:  "Animals",
      catFantasia:  "Fantasy",
      catColeccion: "Collection",
      catBebes:     "Babies",


      stockLabel: "Stock",
      noResults:  "No results for the current filters.",

      formTitle:       "Place your order",
      formSubtitle:    "Fill in the form and we will contact you to confirm your order.",
      labelNombre:     "Full name",
      phNombre:        "Your full name",
      labelEmail:      "Email address",
      phEmail:         "you@email.com",
      labelTelefono:   "Phone",
      phTelefono:      "+34 600 000 000",
      titleTelefono:   "Enter a valid phone number (9-15 digits, may start with +)",
      labelDireccion:  "Full address",
      phDireccion:     "Street, number, floor, postal code, city",
      labelMunecos:    "Dolls you wish to order",
      selectPlaceholder: "— Select one or more dolls —",
      labelMensaje:    "Additional message (optional)",
      phMensaje:       "Any details or customisation?",

      policyWarning: '<strong>Cancellation policy:</strong> Since each doll is handcrafted to order, in case of cancellation before completion, <strong>70 %</strong> of the amount will be retained as compensation for materials and labour, with only <strong>30 %</strong> of the price being refunded. <em>Example: for a 20 € figure, 6 € will be refunded.</em>',
      policyBizum: 'Payment will be made via <strong>Bizum</strong> to the phone number: <strong>0123456789</strong>',
      consentLabel: 'I have read and accept the <a href="#" id="openPolicyModal" class="policy-link">consent and cancellation policy</a>',
      btnEnviar:     "Send order ✉️",
      btnEnviando:   "Sending...",
      btnEnviado:    "Order sent! ✅",
      btnErrorEnvio: "Sending error ❌",
      btnErrorRed:   "Network error ❌",
      alertConsent:  "You must accept the cancellation policy to submit your order.",

      muneco1:  "doll",
      munecoN:  "dolls",
      seleccionado1: "selected",
      seleccionadoN: "selected",

      modalTitle:  "Consent and cancellation policy",
      modalIntro:  'By placing an order at <strong>Mamen Crochet</strong>, you accept the following conditions regarding consent and cancellation:',
      modalLi1:    '<strong>Handcrafted work:</strong> Each doll is made entirely by hand, from the selection of materials to the final finish. The process begins immediately after confirming the order.',
      modalLi2:    '<strong>Cancellation before completion:</strong> If the customer decides to cancel the order before the doll is finished, only <strong>30 %</strong> of the total amount paid will be refunded. The remaining <strong>70 %</strong> will be retained as compensation for materials used and time invested.',
      modalLi3:    '<strong>Practical example:</strong> For a doll priced at <strong>20 €</strong>, in case of cancellation, <strong>6 €</strong> will be refunded and <strong>14 €</strong> will be retained.',
      modalLi4:    '<strong>Completed order:</strong> Once the doll is finished and ready for shipping, no cancellations or refunds will be accepted.',
      modalLi5:    '<strong>Payment method:</strong> Payment for the order will be made exclusively via <strong>Bizum</strong>.<br><strong>The order will not begin until payment is verified.</strong>',
      modalLi6:    '<strong>Acceptance:</strong> By ticking the consent box and submitting the form, the customer confirms that they have read, understood and accepted this cancellation policy.',
      modalNote:   "If you have any questions, please do not hesitate to contact us before placing your order.",
      modalAccept: "Understood",

      footer: "Mamen Crochet © 2026 — Artisan workshop. Custom orders via direct message.",

      langSwitch: "ES 🇪🇸"
    }
  };

  /* ── Mapa de categoría interna → clave i18n ── */
  var catKeyMap = {
    "Todos":     "catTodos",
    "Animales":  "catAnimales",
    "Fantasía":  "catFantasia",
    "Colección": "catColeccion",
    "Bebés":     "catBebes"
  };

  /* ── Obtener texto ── */
  function t(key, replacements) {
    var text = dict[currentLang][key] || dict["es"][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(function (k) {
        text = text.replace("{" + k + "}", replacements[k]);
      });
    }
    return text;
  }

  /* ── Traducir categoría interna ── */
  function tCat(internalName) {
    var key = catKeyMap[internalName];
    return key ? t(key) : internalName;
  }
  }

  /* ── Aplicar traducciones a todos los elementos con data-i18n ── */
  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      el.innerHTML = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.placeholder = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      el.title = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", t(key));
    });

    /* Título de la página */
    document.title = t("pageTitle");
    document.documentElement.lang = currentLang;
  }

  /* ── Cambiar idioma ── */
  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("Mamen crochet-lang", lang);
    applyStatic();

    /* Disparar evento para que app.js re-renderice */
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function getLang() {
    return currentLang;
  }

  /* ── Crear botón de idioma ── */
  function createLangButton() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var btn = document.createElement("button");
    btn.className = "lang-btn";
    btn.id = "langToggle";
    btn.textContent = t("langSwitch");
    btn.addEventListener("click", function () {
      setLang(currentLang === "es" ? "en" : "es");
      btn.textContent = t("langSwitch");
    });
    header.appendChild(btn);
  }

  /* ── Inicializar ── */
  function init() {
    createLangButton();
    applyStatic();
  }

  return {
    t: t,
    tCat: tCat,
    getLang: getLang,
    setLang: setLang,
    init: init,
    applyStatic: applyStatic
  };

})();

/* Inicializar cuando el DOM esté listo */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", i18n.init);
} else {
  i18n.init();
}

