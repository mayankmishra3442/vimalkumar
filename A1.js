// CUSTOMIZE BEFORE DEPLOYING:
// 1. Replace OWNER_WHATSAPP with the owner's country code + number (digits only, no + or spaces).
// 2. Add the owner's UPI ID and QR image path. Keep the image inside this folder, e.g. "upi-qr.png".
// 3. e-District links vary by state. Replace the India.gov.in directory URL below with your state portal.
const OWNER_WHATSAPP = "919569585080";
const OWNER_UPI_ID = "";
const UPI_QR_IMAGE = "";

const DEFAULT_WHATSAPP_MESSAGE = "Mujhe PAN Card / Aadhaar / Form fill karwana hai";

const SERVICES = [
  {
    name: "UIDAI Official Portal",
    category: "Aadhaar",
    description: "Official Aadhaar information and online services.",
    url: "https://uidai.gov.in/",
    icon: "UID",
    tone: "blue",
    keywords: "uidai aadhaar aadhar identity"
  },
  {
    name: "Aadhaar Download & Status",
    category: "Aadhaar",
    description: "Download e-Aadhaar or check enrolment status.",
    url: "https://myaadhaar.uidai.gov.in/",
    icon: "ID",
    tone: "orange",
    keywords: "download status myaadhaar enrolment e-aadhaar"
  },
  {
    name: "Protean PAN Services",
    category: "PAN Card",
    description: "Apply for a PAN card or access PAN services.",
    url: "https://www.protean-tinpan.com/services/pan/pan-index.html",
    icon: "PAN",
    tone: "blue",
    keywords: "nsdl tin pan new application correction"
  },
  {
    name: "UTIITSL PAN Portal",
    category: "PAN Card",
    description: "PAN application, correction, and status services.",
    url: "https://www.pan.utiitsl.com/",
    icon: "PAN",
    tone: "purple",
    keywords: "uti pan card apply correction status"
  },
  {
    name: "e-District / State Services",
    category: "Citizen Services",
    description: "Find your state's e-District and citizen service portal.",
    url: "https://services.india.gov.in/",
    icon: "eD",
    tone: "green",
    keywords: "edistrict e-district state certificate income caste domicile"
  },
  {
    name: "DigiLocker",
    category: "Citizen Services",
    description: "Access and share issued digital documents.",
    url: "https://www.digilocker.gov.in/",
    icon: "DL",
    tone: "blue",
    keywords: "digilocker documents certificate driving licence"
  },
  {
    name: "Passport Seva",
    category: "Citizen Services",
    description: "Passport applications, appointments, and tracking.",
    url: "https://www.passportindia.gov.in/",
    icon: "PS",
    tone: "teal",
    keywords: "passport seva apply appointment track"
  },
  {
    name: "Voter Services",
    category: "Citizen Services",
    description: "Electoral roll, voter registration, and voter services.",
    url: "https://voters.eci.gov.in/",
    icon: "ECI",
    tone: "orange",
    keywords: "voter nvsp election card epic eci"
  },
  {
    name: "PM Kisan Samman Nidhi",
    category: "Citizen Services",
    description: "Farmer registration, beneficiary status, and updates.",
    url: "https://pmkisan.gov.in/",
    icon: "PM",
    tone: "green",
    keywords: "pm kisan farmer samman nidhi beneficiary"
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    category: "Citizen Services",
    description: "Official health assurance scheme information.",
    url: "https://pmjay.gov.in/",
    icon: "AB",
    tone: "red",
    keywords: "ayushman bharat health card pmjay"
  },
  {
    name: "Bharat BillPay",
    category: "Payments & Utilities",
    description: "Official bill payment network information.",
    url: "https://www.bharatbillpay.com/",
    icon: "₹",
    tone: "teal",
    keywords: "bill pay bharat billpay electricity water gas dth"
  },
  {
    name: "Electricity & Utility Portals",
    category: "Payments & Utilities",
    description: "Find state electricity, water, and other utility bill portals.",
    url: "https://services.india.gov.in/",
    icon: "IN",
    tone: "purple",
    keywords: "electricity utility bill state services portal"
  }
];

const searchInput = document.getElementById("service-search");
const categoryTabs = document.getElementById("category-tabs");
const serviceGrid = document.getElementById("service-grid");
const emptyState = document.getElementById("empty-state");
const resultCount = document.getElementById("results-count");
const upiDialog = document.getElementById("upi-dialog");
let selectedCategory = "All services";
let toastTimer;

function createServiceCard(service) {
  const article = document.createElement("article");
  article.className = "service-card";

  const top = document.createElement("div");
  top.className = "card-top";
  const icon = document.createElement("span");
  icon.className = `service-icon ${service.tone}`;
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = service.icon;
  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = service.category;
  top.append(icon, category);

  const title = document.createElement("h3");
  title.textContent = service.name;
  const description = document.createElement("p");
  description.textContent = service.description;
  const link = document.createElement("a");
  link.className = "service-link";
  link.href = service.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${service.name} (opens in a new tab)`);
  link.innerHTML = "<span>Open official website</span><span aria-hidden=\"true\">↗</span>";

  article.append(top, title, description, link);
  return article;
}

function getVisibleServices() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  return SERVICES.filter((service) => {
    const matchesCategory = selectedCategory === "All services" || service.category === selectedCategory;
    const searchableText = `${service.name} ${service.category} ${service.description} ${service.keywords}`.toLocaleLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });
}

function renderServices() {
  const visibleServices = getVisibleServices();
  serviceGrid.replaceChildren(...visibleServices.map(createServiceCard));
  emptyState.hidden = visibleServices.length > 0;
  serviceGrid.hidden = visibleServices.length === 0;
  resultCount.textContent = `${visibleServices.length} ${visibleServices.length === 1 ? "service" : "services"}`;
}

function renderCategoryTabs() {
  const categories = ["All services", ...new Set(SERVICES.map((service) => service.category))];
  categoryTabs.replaceChildren(...categories.map((categoryName) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tab";
    button.textContent = categoryName;
    button.setAttribute("aria-pressed", String(categoryName === selectedCategory));
    button.addEventListener("click", () => {
      selectedCategory = categoryName;
      renderCategoryTabs();
      renderServices();
    });
    return button;
  }));
}

function makeWhatsAppUrl(message) {
  const number = OWNER_WHATSAPP.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function configureWhatsAppLinks() {
  const defaultUrl = makeWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);
  ["header-whatsapp", "hero-whatsapp", "floating-whatsapp"].forEach((id) => {
    document.getElementById(id).href = defaultUrl;
  });

  document.getElementById("send-whatsapp").addEventListener("click", () => {
    const message = document.getElementById("custom-message").value.trim() || DEFAULT_WHATSAPP_MESSAGE;
    window.open(makeWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function configurePayments() {
  const placeholder = document.getElementById("qr-placeholder");
  if (UPI_QR_IMAGE) {
    const image = document.createElement("img");
    image.src = UPI_QR_IMAGE;
    image.alt = "Cafe UPI payment QR code";
    image.addEventListener("error", () => {
      image.remove();
      showToast("Couldn't load the UPI QR image. Check its file path.");
    });
    placeholder.replaceChildren(image);
  }

  if (OWNER_UPI_ID.trim()) {
    document.getElementById("upi-id-value").textContent = OWNER_UPI_ID.trim();
    document.getElementById("upi-id-row").hidden = false;
  }

  const utilityServices = SERVICES.filter((service) => service.category === "Payments & Utilities");
  const utilityLinks = document.getElementById("utility-links");
  utilityLinks.replaceChildren(...utilityServices.map((service) => {
    const link = document.createElement("a");
    link.className = "utility-link";
    link.href = service.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${service.name} ↗`;
    return link;
  }));

  document.getElementById("show-upi").addEventListener("click", () => {
    if (typeof upiDialog.showModal === "function") {
      upiDialog.showModal();
    } else {
      showToast("UPI details are available at the cafe counter.");
    }
  });
  document.querySelector(".dialog-close").addEventListener("click", () => upiDialog.close());
  upiDialog.addEventListener("click", (event) => {
    if (event.target === upiDialog) upiDialog.close();
  });
}

function setCurrentDate() {
  const now = new Date();
  document.getElementById("today-date").textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(now);
  document.getElementById("current-year").textContent = now.getFullYear();
}

function setupInteractions() {
  searchInput.addEventListener("input", renderServices);
  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    selectedCategory = "All services";
    renderCategoryTabs();
    renderServices();
    searchInput.focus();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape" && upiDialog.open) upiDialog.close();
  });

  if ("IntersectionObserver" in window) {
    const floatingWhatsApp = document.getElementById("floating-whatsapp");
    const contactObserver = new IntersectionObserver(([entry]) => {
      floatingWhatsApp.classList.toggle("is-hidden", entry.isIntersecting);
    }, { threshold: 0.1 });
    contactObserver.observe(document.getElementById("contact"));
  }
}

document.getElementById("service-total").textContent = SERVICES.length;
renderCategoryTabs();
renderServices();
configureWhatsAppLinks();
configurePayments();
setCurrentDate();
setupInteractions();
