const sidebar = document.querySelector(".sidebar");
const navItems = document.querySelectorAll(".nav li");
const sections = document.querySelectorAll(".content");
const headerTitle = document.querySelector(".header h1");
const headerBtn = document.querySelector(".add");
const API_URL = "https://697b7dc30e6ff62c3c5c3d92.mockapi.io/products";

let selectedFile = null; 
const form = document.getElementById("productForm");
const uploadArea = document.querySelector(".image-upload");
const fileInput = document.getElementById("productImage");
const imageDisplay = document.getElementById("imageDisplay");
const productsContainer = document.querySelector('section[data-section="products"]');

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setActiveSection("products");
});

function setActiveSection(sectionName) {
  navItems.forEach((el) => el.classList.remove("active"));
  const activeNav = Array.from(navItems).find((el) => el.dataset.section === sectionName);
  if (activeNav) activeNav.classList.add("active");

  sections.forEach((sec) => sec.classList.remove("active"));
  const activeSection = document.querySelector(`.content[data-section="${sectionName}"]`);
  if (activeSection) activeSection.classList.add("active");

  if (headerBtn) {
    headerBtn.style.display = sectionName === "products" ? "flex" : "none";
  }

  if (headerTitle && activeNav) {
    headerTitle.textContent = activeNav.querySelector("span").textContent;
  }

  if (window.innerWidth < 768) closeSidebar();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const sectionName = item.dataset.section;
    if (sectionName) setActiveSection(sectionName);
  });
});

function closeSidebar() {
  if (sidebar) sidebar.classList.remove("active");
}

function openModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    resetForm();
  }
}

if (headerBtn) headerBtn.addEventListener("click", openModal);

document.querySelectorAll('[data-close="modal"]').forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

if (uploadArea && fileInput) {
  uploadArea.addEventListener("click", () => fileInput.click());
  
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("drag-over");
  });

  uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("drag-over"));

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
}

function handleFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024; 

  if (file.size > MAX_SIZE) {
    showError("image", "Файл слишком большой! Максимум 5 МБ.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    showError("image", "Можно загружать только изображения.");
    return;
  }

  compressImage(file, 800, 0.7).then(compressedDataUrl => {
    selectedFile = compressedDataUrl;
    if (imageDisplay) {
      imageDisplay.src = compressedDataUrl;
      imageDisplay.classList.add("visible");
    }
    if (uploadArea) uploadArea.classList.add("has-image");
    hideError("image");
  });
}

function compressImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
  });
}

function showError(field, message) {
  const errorElement = document.querySelector(`[data-error="${field}"]`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }
  const input = document.getElementById(`product${field.charAt(0).toUpperCase() + field.slice(1)}`);
  if (input) input.classList.add("error");
  if (field === "image" && uploadArea) uploadArea.classList.add("error");
}

function hideError(field) {
  const errorElement = document.querySelector(`[data-error="${field}"]`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }
  const input = document.getElementById(`product${field.charAt(0).toUpperCase() + field.slice(1)}`);
  if (input) input.classList.remove("error");
  if (field === "image" && uploadArea) uploadArea.classList.remove("error");
}

function validateForm() {
  let isValid = true;
  if (!selectedFile) {
    showError("image", "Загрузите фотографию товара");
    isValid = false;
  } else {
    hideError("image");
  }

  const title = document.getElementById("productTitle")?.value.trim();
  if (!title || title.length < 3) {
    showError("title", "Минимум 3 символа");
    isValid = false;
  } else hideError("title");

  const category = document.getElementById("productCategory")?.value;
  if (!category) {
    showError("category", "Выберите категорию");
    isValid = false;
  } else hideError("category");

  const price = Number(document.getElementById("productPrice")?.value);
  if (!price || price <= 0) {
    showError("price", "Укажите цену");
    isValid = false;
  } else hideError("price");

  const count = Number(document.getElementById("productCount")?.value);
  if (isNaN(count) || count < 0) {
    showError("count", "Укажите количество");
    isValid = false;
  } else hideError("count");

  const desc = document.getElementById("productDescription")?.value.trim();
  if (!desc || desc.length < 10) {
    showError("description", "Минимум 10 символов");
    isValid = false;
  } else hideError("description");

  return isValid;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await submitProduct();
  });
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    renderProducts(products);
  } catch (err) {
    console.error(err);
  }
}

function renderProducts(products) {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__image"><img src="${p.photos?.[0] || ''}" alt=""></div>
      <div class="card__title"><h2>${p.title}</h2><span>#${p.id}</span></div>
      <div class="card__meta">
        <div class="info"><span>Наличие:</span> <span>${p.count} шт</span></div>
        <div class="info"><span>Цена:</span> <span>${p.price.toLocaleString()} сум</span></div>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

async function submitProduct() {
  const btn = form.querySelector(".save");
  if (btn) { btn.disabled = true; btn.classList.add("loading"); }

  try {
    const values = {
      title: document.getElementById("productTitle").value.trim(),
      category: document.getElementById("productCategory").value,
      price: Number(document.getElementById("productPrice").value),
      count: Number(document.getElementById("productCount").value),
      material: document.getElementById("productMaterial")?.value.trim() || "",
      description: document.getElementById("productDescription").value.trim(),
      isVisible: document.getElementById("productVisible")?.checked ?? true,
      photos: selectedFile ? [selectedFile] : []
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!res.ok) throw new Error();
    closeModal();
    await fetchProducts();
    alert("Успешно!");
  } catch (err) {
    alert("Ошибка!");
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
  }
}

function resetForm() {
  if (form) form.reset();
  selectedFile = null;
  document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
  document.querySelectorAll(".error-message").forEach(el => el.classList.remove("visible"));
  if (imageDisplay) { imageDisplay.src = ""; imageDisplay.classList.remove("visible"); }
}