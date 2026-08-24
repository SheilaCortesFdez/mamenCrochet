/* ═══════════════════════════════════════════
   mCrochet — app.js
   Tienda + fondo Three.js
   Three.js se carga como <script> global (THREE)
   ═══════════════════════════════════════════ */

/* ═══════════ DATOS (vienen de js/catalog.js) ═══════════ */
var products   = catalogData;
var categories = ["Todos"];
products.forEach(function (p) {
  if (categories.indexOf(p.category) === -1) categories.push(p.category);
});

/* ═══════════ FILTRO ═══════════ */
function getDesc(p) {
  if (typeof p.description === "string") return p.description;
  var lang = (typeof i18n !== "undefined") ? i18n.getLang() : "es";
  return (p.description && p.description[lang]) || (p.description && p.description["es"]) || "";
}

function filterProducts(items, filters) {
  var search = (filters.search || "").trim().toLowerCase();
  var cat    = filters.category || "Todos";
  var max    = Number.isFinite(filters.maxPrice) ? filters.maxPrice : Infinity;
  return items.filter(function (p) {
    var okCat    = cat === "Todos" || p.category === cat;
    var okSearch = !search || p.name.toLowerCase().includes(search) || getDesc(p).toLowerCase().includes(search);
    var okPrice  = p.price <= max;
    return okCat && okSearch && okPrice;
  });
}

/* ═══════════ ESTADO ═══════════ */
var maxCatalogPrice = products.length ? Math.ceil(Math.max.apply(null, products.map(function (p) { return p.price; }))) : 50;
var state = { search: "", category: "Todos", maxPrice: maxCatalogPrice, cartCount: 0 };


/* ═══════════ REFERENCIAS DOM ═══════════ */
var productsGrid  = document.getElementById("productsGrid");
var searchInput   = document.getElementById("searchInput");
var priceInput    = document.getElementById("priceInput");
var priceValue    = document.getElementById("priceValue");
var cartCountEl   = document.getElementById("cartCount");
var categoryChips = document.getElementById("categoryChips");

/* Ajustar slider al precio máximo del catálogo */
priceInput.max   = maxCatalogPrice;
priceInput.value = maxCatalogPrice;

/* ═══════════ RENDER ═══════════ */
function renderCategories() {
  categoryChips.innerHTML = categories.map(function (c) {
    return '<button class="chip ' + (state.category === c ? "active" : "") + '" data-category="' + c + '">' + c + '</button>';
  }).join("");
}

function renderProducts() {
  var visible = filterProducts(products, state);
  if (!visible.length) {
    productsGrid.innerHTML = '<p class="empty">No hay resultados para los filtros actuales.</p>';
    return;
  }
  productsGrid.innerHTML = visible.map(function (item) {
    var desc = getDesc(item);
    var catLabel = typeof i18n !== "undefined" ? i18n.tCat(item.category) : item.category;
    var stockLbl = typeof i18n !== "undefined" ? i18n.t("stockLabel") : "Stock";
    return '<article class="card" data-product-id="' + item.id + '">' +
      '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" />' +
      '<div class="card-content">' +
        '<p class="category">' + catLabel + '</p>' +
        '<h2>' + item.name + '</h2>' +
        '<p class="description">' + desc + '</p>' +
        '<p class="price">' + item.price.toFixed(2) + ' €</p>' +
        '<div class="card-actions">' +
          '<span>' + stockLbl + ': ' + item.stock + '</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join("");
}

/* ═══════════ EVENTOS ═══════════ */
searchInput.addEventListener("input", function (e) {
  state.search = e.target.value;
  renderProducts();
});

priceInput.addEventListener("input", function (e) {
  state.maxPrice = Number(e.target.value);
  priceValue.textContent = "Hasta " + state.maxPrice + " €";
  renderProducts();
});

categoryChips.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-category]");
  if (!btn) return;
  state.category = btn.dataset.category;
  renderCategories();
  renderProducts();
});

productsGrid.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-add]");
  if (!btn) return;
  state.cartCount++;
  cartCountEl.textContent = state.cartCount;
  btn.style.transform = "scale(1.15)";
  setTimeout(function () { btn.style.transform = ""; }, 200);
});

renderCategories();
renderProducts();

/* ═══════════ MODAL IMAGEN AMPLIADA ═══════════ */
var imageModalOverlay = document.getElementById("imageModalOverlay");
var imageModalImg     = document.getElementById("imageModalImg");
var imageModalName    = document.getElementById("imageModalName");
var imageModalDesc    = document.getElementById("imageModalDesc");
var imageModalPrice   = document.getElementById("imageModalPrice");
var closeImageModal   = document.getElementById("closeImageModal");

function openImageModal(product) {
  imageModalImg.src = product.image;
  imageModalImg.alt = product.name;
  imageModalName.textContent = product.name;
  imageModalDesc.textContent = getDesc(product);
  imageModalPrice.textContent = product.price.toFixed(2) + " €";
  imageModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeImageModalFn() {
  imageModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

/* Clic en tarjeta de producto — delegación de eventos */
productsGrid.addEventListener("click", function (e) {
  /* Ignorar si clican en un botón de acción (data-add) */
  if (e.target.closest("[data-add]")) return;
  var card = e.target.closest(".card[data-product-id]");
  if (!card) return;
  var productId = Number(card.getAttribute("data-product-id"));
  var product = products.find(function (p) { return p.id === productId; });
  if (product) openImageModal(product);
});

/* Cerrar con botón X */
closeImageModal.addEventListener("click", closeImageModalFn);

/* Cerrar al hacer clic fuera del modal */
imageModalOverlay.addEventListener("click", function (e) {
  if (e.target === imageModalOverlay) closeImageModalFn();
});

/* Cerrar con tecla Escape */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && imageModalOverlay.classList.contains("active")) {
    closeImageModalFn();
  }
});

/* ═══════════ FORMULARIO DE PEDIDO ═══════════ */
var checkSelectDropdown = document.getElementById("checkSelectDropdown");
var checkSelectToggle   = document.getElementById("checkSelectToggle");
var checkSelect         = document.getElementById("checkSelect");
var hiddenMunecos       = document.getElementById("hiddenMunecos");

/* Generar checkboxes a partir de los productos */
function buildCheckboxes() {
  checkSelectDropdown.innerHTML = "";
  products.forEach(function (p) {
    var item = document.createElement("label");
    item.className = "check-select-item";
    item.innerHTML =
      '<input type="checkbox" value="' + p.name + ' (' + p.price.toFixed(2) + ' €)" />' +
      '<span class="check-select-name">' + p.name + '</span>' +
      '<span class="check-select-price">' + p.price.toFixed(2) + ' €</span>';
    checkSelectDropdown.appendChild(item);
  });
}

buildCheckboxes();

/* Toggle abrir / cerrar */
checkSelectToggle.addEventListener("click", function () {
  checkSelect.classList.toggle("open");
});

/* Cerrar al hacer clic fuera */
document.addEventListener("click", function (e) {
  if (!checkSelect.contains(e.target)) {
    checkSelect.classList.remove("open");
  }
});

/* Actualizar resumen al marcar/desmarcar */
checkSelectDropdown.addEventListener("change", function () {
  var checked = checkSelectDropdown.querySelectorAll("input:checked");
  var names = [];
  checked.forEach(function (cb) { names.push(cb.value); });
  hiddenMunecos.value = names.join(", ");

  if (names.length === 0) {
    checkSelectToggle.firstChild.textContent = "— Selecciona uno o varios muñecos — ";
  } else {
    checkSelectToggle.firstChild.textContent = names.length + (names.length === 1 ? " muñeco" : " muñecos") + " seleccionado" + (names.length === 1 ? "" : "s") + " ";
  }
});

var orderForm = document.getElementById("orderForm");

/* ═══════════ CONSENTIMIENTO Y MODAL ═══════════ */
var consentCheck       = document.getElementById("consentCheck");
var submitBtn          = document.getElementById("submitBtn");
var policyModalOverlay = document.getElementById("policyModalOverlay");
var closePolicyModal   = document.getElementById("closePolicyModal");
var acceptPolicyBtn    = document.getElementById("acceptPolicyBtn");

/* Referencias a campos obligatorios */
var inputNombre    = orderForm.querySelector('[name="nombre"]');
var inputEmail     = orderForm.querySelector('[name="email"]');
var inputTelefono  = orderForm.querySelector('[name="telefono"]');
var inputDireccion = orderForm.querySelector('[name="direccion"]');

/* Función que comprueba si todos los requisitos se cumplen */
var telRegex = /^\+?\d[\d\s]{7,15}$/;
function validateForm() {
  var nombreOk    = inputNombre.value.trim() !== "";
  var emailOk     = inputEmail.value.trim() !== "" && inputEmail.validity.valid;
  var telefonoOk  = telRegex.test(inputTelefono.value.trim());
  var direccionOk = inputDireccion.value.trim() !== "";
  var munecosOk   = hiddenMunecos.value.trim() !== "";
  var consentOk   = consentCheck.checked;

  submitBtn.disabled = !(nombreOk && emailOk && telefonoOk && direccionOk && munecosOk && consentOk);
}

/* Escuchar cambios en todos los campos obligatorios */
inputNombre.addEventListener("input", validateForm);
inputEmail.addEventListener("input", validateForm);
inputTelefono.addEventListener("input", validateForm);
inputDireccion.addEventListener("input", validateForm);
consentCheck.addEventListener("change", validateForm);
/* Los muñecos se validan también al marcar/desmarcar (desde el change del dropdown) */
checkSelectDropdown.addEventListener("change", function () {
  /* (el hiddenMunecos ya se actualiza en el listener anterior) */
  setTimeout(validateForm, 0); /* ejecutar después de que el otro listener actualice hiddenMunecos */
});
/* ═══════════ PEDIDO POR WHATSAPP ═══════════ */

var pedidoWhatsappBtn = document.getElementById("pedidoWhatsapp");

if (pedidoWhatsappBtn) {
  pedidoWhatsappBtn.addEventListener("click", function () {

    var munecos = hiddenMunecos.value;

    var url = "/.netlify/functions/pedido?producto=" + encodeURIComponent(munecos);
    window.open(url, "_blank");
  });
}

/* Abrir modal — delegación porque el enlace se re-crea al cambiar idioma */
document.addEventListener("click", function (e) {
  var link = e.target.closest("#openPolicyModal, .policy-link");
  if (link) {
    e.preventDefault();
    policyModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
});

/* Cerrar modal con botón X */
closePolicyModal.addEventListener("click", function () {
  policyModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
});

/* Cerrar modal con botón "Entendido" */
acceptPolicyBtn.addEventListener("click", function () {
  policyModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
});

/* Cerrar modal al hacer clic fuera */
policyModalOverlay.addEventListener("click", function (e) {
  if (e.target === policyModalOverlay) {
    policyModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});

/* Cerrar modal con Escape */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && policyModalOverlay.classList.contains("active")) {
    policyModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});



/* ═══════════ ENVÍO DEL FORMULARIO ═══════════ */
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  /* Validar consentimiento */
  if (!consentCheck.checked) {
    alert("Debes aceptar la política de cancelación para enviar el pedido.");
    return;
  }

  var form = e.target;
  var data = new FormData(form);
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  fetch(form.dataset.endpoint, {
    method: "POST",
    body: data,
    headers: { "Accept": "application/json" }
  }).then(async function (res) {
      if (res.ok) {
      form.reset();
      /* Resetear checkboxes de muñecos */
      checkSelectDropdown.querySelectorAll("input:checked").forEach(function (cb) { cb.checked = false; });
      hiddenMunecos.value = "";
      checkSelectToggle.firstChild.textContent = "— Selecciona uno o varios muñecos — ";
      checkSelect.classList.remove("open");
      /* Resetear consentimiento */
      consentCheck.checked = false;

      submitBtn.textContent = "¡Pedido enviado! ✅";
      setTimeout(function () {
        submitBtn.textContent = "Enviar pedido ✉️";
        validateForm(); /* Re-evaluar: tras reset todo está vacío → deshabilitado */
      }, 3000);
    } else {
      submitBtn.textContent = "Error al enviar ❌";
      submitBtn.disabled = false;
    }
  }).catch(function () {
    submitBtn.textContent = "Error de red ❌";
    submitBtn.disabled = false;
  });
});

/* ═══════════════════════════════════════════
   THREE.JS — Fondo decorativo animado
   Ovillos, agujas, corazones, hilos, partículas
   ═══════════════════════════════════════════ */

function initThreeBackground() {
  if (typeof THREE === "undefined") {
    console.warn("Three.js no se ha cargado. El fondo animado no estará disponible.");
    return;
  }

  var canvas   = document.getElementById("bg-canvas");
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  /* — Luces (tonos cálidos profesionales) — */
  scene.add(new THREE.AmbientLight(0xf5f0e8, 0.7));
  var dir = new THREE.DirectionalLight(0xffecd2, 1.0);
  dir.position.set(4, 5, 6);
  scene.add(dir);
  var pk = new THREE.PointLight(0xb08d57, 0.9, 25);
  pk.position.set(-3, 2, 5);
  scene.add(pk);
  var lv = new THREE.PointLight(0x8a7e6e, 0.6, 20);
  lv.position.set(3, -1, 4);
  scene.add(lv);

  /* Paleta profesional: dorados, bronce, tierra, slate, crema */
  var yC = [0xb08d57, 0xc9a96e, 0x8a7e6e, 0xa39280, 0xd5c4a1, 0x6b6560, 0xc4bdb4, 0x3a3632];

  /* — Ovillos de lana (distribuidos en laterales) — */
  var balls = [];
  for (var i = 0; i < 14; i++) {
    var r   = 0.35 + Math.random() * 0.45;
    var col = yC[i % 8];
    var m   = new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 32),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 })
    );
    /* Lateral: mitad izquierda, mitad derecha, evitando el centro */
    var side = (i % 2 === 0) ? -1 : 1;
    var xPos = side * (5.5 + Math.random() * 3.5);
    var yPos = (Math.random() - 0.5) * 8;
    var zPos = -1 + Math.random() * 2;
    m.position.set(xPos, yPos, zPos);
    var ng = 2 + Math.floor(Math.random() * 3);
    for (var g = 0; g < ng; g++) {
      var t = new THREE.Mesh(
        new THREE.TorusGeometry(r * .92, r * .08, 8, 32),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(col).multiplyScalar(.85), roughness: .9 })
      );
      t.rotation.x = (Math.PI / ng) * g + Math.random() * .3;
      t.rotation.z = Math.random() * Math.PI;
      m.add(t);
    }
    balls.push({ m: m, by: m.position.y, sp: .3 + Math.random() * .5, am: .2 + Math.random() * .35, rt: (Math.random() - .5) * .4 });
    scene.add(m);
  }

  /* — Agujas de crochet (en los laterales) — */
  var needles = [];
  var nC = [0x8b7355, 0x6b5b4a, 0xa08c72];
  for (var i = 0; i < 6; i++) {
    var grp = new THREE.Group();
    var bM  = new THREE.MeshStandardMaterial({ color: nC[i % 3], roughness: .4, metalness: .15 });
    grp.add(new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 3.5, 8), bM));
    var hk = new THREE.Mesh(new THREE.TorusGeometry(.09, .035, 8, 12, Math.PI), bM);
    hk.position.y = 1.75;
    hk.rotation.z = Math.PI / 2;
    grp.add(hk);
    var gr = new THREE.Mesh(
      new THREE.CylinderGeometry(.07, .055, .65, 8),
      new THREE.MeshStandardMaterial({ color: yC[i * 2 % 8], roughness: .7 })
    );
    gr.position.y = -1.4;
    grp.add(gr);
    /* Lateral: alternar izquierda/derecha */
    var side = (i % 2 === 0) ? -1 : 1;
    var xPos = side * (6 + Math.random() * 3);
    var yPos = (Math.random() - 0.5) * 7;
    grp.position.set(xPos, yPos, 0 + Math.random() * 1);
    grp.rotation.z = side * (0.3 + Math.random() * 0.6);
    needles.push({ g: grp, by: grp.position.y, sp: .2 + Math.random() * .3, am: .25 + Math.random() * .2, rt: (Math.random() - .5) * .15 });
    scene.add(grp);
  }

  /* — Corazones (en laterales) — */
  var hearts = [];
  var s  = .1;
  var hS = new THREE.Shape();
  hS.moveTo(0, s * 2);
  hS.bezierCurveTo(0, s * 3, -s * 3, s * 3, -s * 3, s * 1.5);
  hS.bezierCurveTo(-s * 3, 0, 0, -s, 0, -s * 2.5);
  hS.bezierCurveTo(0, -s, s * 3, 0, s * 3, s * 1.5);
  hS.bezierCurveTo(s * 3, s * 3, 0, s * 3, 0, s * 2);
  var hG = new THREE.ExtrudeGeometry(hS, { depth: .06, bevelEnabled: true, bevelThickness: .03, bevelSize: .03 });
  for (var i = 0; i < 10; i++) {
    var hm = new THREE.Mesh(hG, new THREE.MeshStandardMaterial({
      color: Math.random() > .5 ? 0xb08d57 : 0xc9a96e,
      roughness: .6,
      transparent: true,
      opacity: .45 + Math.random() * .35
    }));
    var side = (i % 2 === 0) ? -1 : 1;
    var xPos = side * (5 + Math.random() * 4.5);
    hm.position.set(xPos, (Math.random() - .5) * 9, -1 - Math.random() * 2);
    hm.scale.setScalar(.7 + Math.random() * 1.0);
    hearts.push({ m: hm, by: hm.position.y, sp: .15 + Math.random() * .25, am: .15 + Math.random() * .25, rt: (Math.random() - .5) * .3 });
    scene.add(hm);
  }

  /* — Partículas — */
  var pN  = 60;
  var pP  = new Float32Array(pN * 3);
  var pCl = new Float32Array(pN * 3);
  for (var i = 0; i < pN; i++) {
    pP[i * 3]     = (Math.random() - .5) * 18;
    pP[i * 3 + 1] = (Math.random() - .5) * 10;
    pP[i * 3 + 2] = (Math.random() - .5) * 6 - 1;
    var c = new THREE.Color(yC[Math.floor(Math.random() * 8)]);
    pCl[i * 3]     = c.r;
    pCl[i * 3 + 1] = c.g;
    pCl[i * 3 + 2] = c.b;
  }
  var pGe = new THREE.BufferGeometry();
  pGe.setAttribute("position", new THREE.BufferAttribute(pP, 3));
  pGe.setAttribute("color", new THREE.BufferAttribute(pCl, 3));
  var pts = new THREE.Points(pGe, new THREE.PointsMaterial({
    size: .08, vertexColors: true, transparent: true, opacity: .6, sizeAttenuation: true
  }));
  scene.add(pts);

  /* — Hilos curvados (en laterales) — */
  for (var i = 0; i < 8; i++) {
    var cp = [];
    var side = (i % 2 === 0) ? -1 : 1;
    var sx = side * (5 + Math.random() * 4);
    var sy = (Math.random() - .5) * 8;
    for (var j = 0; j < 6; j++) {
      cp.push(new THREE.Vector3(
        sx + (Math.random() - .5) * 1.5,
        sy + j * .7 + (Math.random() - .5) * .4,
        -1 - Math.random()
      ));
    }
    scene.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cp), 32, .025, 6, false),
      new THREE.MeshStandardMaterial({ color: yC[i % 8], roughness: .8, transparent: true, opacity: .4 })
    ));
  }

  /* — Paralaje con ratón — */
  var mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", function (e) {
    mouse.x = (e.clientX / innerWidth - .5) * 2;
    mouse.y = (e.clientY / innerHeight - .5) * 2;
  });

  /* — Resize — */
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  }
  window.addEventListener("resize", resize);
  resize();

  /* — Loop de animación — */
  function animate(time) {
    var t = time * .001;

    balls.forEach(function (b) {
      b.m.position.y = b.by + Math.sin(t * b.sp) * b.am;
      b.m.rotation.y += b.rt * .01;
      b.m.rotation.x += b.rt * .005;
    });

    needles.forEach(function (n) {
      n.g.position.y = n.by + Math.sin(t * n.sp + 1) * n.am;
      n.g.rotation.z += n.rt * .003;
    });

    hearts.forEach(function (h) {
      h.m.position.y = h.by + Math.sin(t * h.sp + 2) * h.am;
      h.m.rotation.z += h.rt * .008;
    });

    var pa = pts.geometry.attributes.position.array;
    for (var i = 0; i < pN; i++) {
      pa[i * 3 + 1] += .002;
      if (pa[i * 3 + 1] > 6) pa[i * 3 + 1] = -6;
    }
    pts.geometry.attributes.position.needsUpdate = true;

    camera.position.x += (mouse.x * .5 - camera.position.x) * .02;
    camera.position.y += (-mouse.y * .3 - camera.position.y) * .02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

try {
  initThreeBackground();
} catch (e) {
  console.error("Error al inicializar el fondo Three.js:", e);
}

