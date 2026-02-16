const STORAGE_KEYS = {
  isAdmin: 'daaianew_is_admin',
  menuPhoto: 'daaianew_menu_photo',
  menuItems: 'daaianew_menu_items',
  contact: 'daaianew_contact'
};

const ADMIN_PASSWORD = 'daaianew123';

const defaultMenuItems = [
  { id: crypto.randomUUID(), name: 'Cheesy Ensaymada', regular: '₱149 / tub of 3', premium: '', description: 'Soft ensaymada topped with rich cheese and buttery sweetness.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Egg Tart', regular: '₱35 / pc', premium: '', description: 'Classic flaky tart with creamy custard center.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Burnt Cheesecake', regular: '₱45 / pc', premium: '₱55', description: 'Caramelized top with a smooth, creamy cheesecake core.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Fudgy Brownies', regular: '₱45 / pc', premium: '₱55', description: 'Decadent cocoa brownies with dense fudgy texture.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Bento Cake', regular: '₱300', premium: '', description: 'Cute mini cake perfect for gifts and celebrations.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Crinkles', regular: '₱100 / tub of 10', premium: '₱150', description: 'Chocolate crinkles with crackled sugar-coated tops.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Cinnamon Rolls', regular: '₱120 / tub of 3', premium: '₱170', description: 'Pillowy rolls with cinnamon swirls and sweet glaze.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Garlic Rolls Bread', regular: '₱120 / tub of 3', premium: '', description: 'Savory garlic rolls baked until aromatic and golden.', image: 'assets/menu.png' },
  { id: crypto.randomUUID(), name: 'Banana Bread', regular: '₱110 / tub of loaf', premium: '₱150', description: 'Moist loaf made with ripe bananas and balanced sweetness.', image: 'assets/menu.png' }
];

const drinks = [
  { name: 'Strawberry Cheesecake', price: '₱99' },
  { name: 'Spanish Latte', price: '₱99' },
  { name: 'Cookies and Cream', price: '₱99' },
  { name: 'Salted Caramel', price: '₱99' },
  { name: 'Red Velvet Cheesecake', price: '₱99' }
];

const defaultContact = {
  instagram: '@yourhandle',
  phone: '+63 900 000 0000',
  location: 'Your City, Philippines',
  hours: 'Mon–Sun, 9:00 AM – 8:00 PM'
};

const state = {
  isAdmin: localStorage.getItem(STORAGE_KEYS.isAdmin) === 'true',
  menuPhoto: localStorage.getItem(STORAGE_KEYS.menuPhoto) || 'assets/menu.png',
  menuItems: getStoredArray(STORAGE_KEYS.menuItems, defaultMenuItems),
  contact: getStoredObject(STORAGE_KEYS.contact, defaultContact)
};

const roleStatus = document.getElementById('roleStatus');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminDialog = document.getElementById('adminDialog');
const closeAdminDialogBtn = document.getElementById('closeAdminDialogBtn');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPassword = document.getElementById('adminPassword');
const adminError = document.getElementById('adminError');

const menuPhoto = document.getElementById('menuPhoto');
const menuPhotoForm = document.getElementById('menuPhotoForm');
const menuPhotoFile = document.getElementById('menuPhotoFile');
const changePhotoBtn = document.getElementById('changePhotoBtn');

const menuTableBody = document.getElementById('menuTableBody');
const drinksList = document.getElementById('drinksList');

const contactGrid = document.getElementById('contactGrid');
const contactForm = document.getElementById('contactForm');
const editContactBtn = document.getElementById('editContactBtn');
const addMenuItemBtn = document.getElementById('addMenuItemBtn');

const itemDialog = document.getElementById('itemDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const dialogImage = document.getElementById('dialogImage');
const dialogTitle = document.getElementById('dialogTitle');
const dialogPrice = document.getElementById('dialogPrice');
const dialogDescription = document.getElementById('dialogDescription');

const itemFormDialog = document.getElementById('itemFormDialog');
const closeFormDialogBtn = document.getElementById('closeFormDialogBtn');
const itemFormTitle = document.getElementById('itemFormTitle');
const itemForm = document.getElementById('itemForm');

const filterButtons = document.querySelectorAll('.filter-btn');
const sections = document.querySelectorAll('.menu-section');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

init();

function init() {
  menuPhoto.src = state.menuPhoto;
  renderAll();

  adminLoginBtn.addEventListener('click', () => {
    adminError.textContent = '';
    adminLoginForm.reset();
    adminDialog.showModal();
  });

  closeAdminDialogBtn.addEventListener('click', () => adminDialog.close());

  adminLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (adminPassword.value === ADMIN_PASSWORD) {
      state.isAdmin = true;
      localStorage.setItem(STORAGE_KEYS.isAdmin, 'true');
      adminDialog.close();
      renderAdminVisibility();
    } else {
      adminError.textContent = 'Incorrect password.';
    }
  });

  adminLogoutBtn.addEventListener('click', () => {
    state.isAdmin = false;
    localStorage.setItem(STORAGE_KEYS.isAdmin, 'false');
    renderAdminVisibility();
  });

  changePhotoBtn.addEventListener('click', () => {
    menuPhotoForm.hidden = !menuPhotoForm.hidden;
  });

  menuPhotoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      return;
    }

    const file = menuPhotoFile.files?.[0];
    if (!file) {
      return;
    }

    const imageData = await fileToDataUrl(file);
    state.menuPhoto = imageData;
    localStorage.setItem(STORAGE_KEYS.menuPhoto, state.menuPhoto);
    menuPhoto.src = state.menuPhoto;
    menuPhotoForm.hidden = true;
    menuPhotoForm.reset();
  });

  addMenuItemBtn.addEventListener('click', () => {
    if (!isAdmin()) {
      return;
    }
    openItemForm();
  });

  menuTableBody.addEventListener('click', (event) => {
    const previewButton = event.target.closest('[data-action="preview"]');
    const editButton = event.target.closest('[data-action="edit"]');
    const deleteButton = event.target.closest('[data-action="delete"]');

    if (previewButton) {
      const id = previewButton.dataset.id;
      const item = state.menuItems.find((entry) => entry.id === id);
      if (item) {
        openPreview(item);
      }
      return;
    }

    if (!isAdmin()) {
      return;
    }

    if (editButton) {
      const id = editButton.dataset.id;
      const item = state.menuItems.find((entry) => entry.id === id);
      if (item) {
        openItemForm(item);
      }
    }

    if (deleteButton) {
      const id = deleteButton.dataset.id;
      state.menuItems = state.menuItems.filter((entry) => entry.id !== id);
      persistMenuItems();
      renderMenuTable();
    }
  });

  closeDialogBtn.addEventListener('click', () => itemDialog.close());
  closeFormDialogBtn.addEventListener('click', () => itemFormDialog.close());

  itemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      return;
    }

    const formData = new FormData(itemForm);
    const editingId = String(formData.get('id') || '');
    const current = state.menuItems.find((entry) => entry.id === editingId);
    const selectedFile = itemForm.elements.imageFile.files?.[0];

    let imageValue = current?.image || state.menuPhoto;
    if (selectedFile) {
      imageValue = await fileToDataUrl(selectedFile);
    }

    const payload = {
      id: editingId || crypto.randomUUID(),
      name: String(formData.get('name') || '').trim(),
      regular: String(formData.get('regular') || '').trim(),
      premium: String(formData.get('premium') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      image: imageValue
    };

    const index = state.menuItems.findIndex((entry) => entry.id === payload.id);
    if (index >= 0) {
      state.menuItems[index] = payload;
    } else {
      state.menuItems.push(payload);
    }

    persistMenuItems();
    renderMenuTable();
    itemFormDialog.close();
  });

  editContactBtn.addEventListener('click', () => {
    if (!isAdmin()) {
      return;
    }

    contactForm.hidden = !contactForm.hidden;
    if (!contactForm.hidden) {
      contactForm.elements.instagram.value = state.contact.instagram;
      contactForm.elements.phone.value = state.contact.phone;
      contactForm.elements.location.value = state.contact.location;
      contactForm.elements.hours.value = state.contact.hours;
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!isAdmin()) {
      return;
    }

    state.contact = {
      instagram: contactForm.elements.instagram.value.trim(),
      phone: contactForm.elements.phone.value.trim(),
      location: contactForm.elements.location.value.trim(),
      hours: contactForm.elements.hours.value.trim()
    };

    localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(state.contact));
    contactForm.hidden = true;
    renderContact();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((entry) => {
        const active = entry === button;
        entry.classList.toggle('active', active);
        entry.setAttribute('aria-pressed', String(active));
      });

      sections.forEach((section) => {
        section.hidden = !(filter === 'all' || section.dataset.category === filter);
      });
    });
  });
}

function isAdmin() {
  return state.isAdmin;
}

function renderAll() {
  renderMenuTable();
  renderDrinks();
  renderContact();
  renderAdminVisibility();
}

function renderMenuTable() {
  menuTableBody.innerHTML = state.menuItems
    .map((item) => {
      const premium = item.premium || '—';
      const adminActions = isAdmin()
        ? `<td class="actions-cell"><button class="small-btn" type="button" data-action="edit" data-id="${item.id}">Edit</button><button class="small-btn" type="button" data-action="delete" data-id="${item.id}">Delete</button></td>`
        : '';

      return `<tr>
        <th scope="row">
          <button class="item-btn" type="button" data-action="preview" data-id="${item.id}">${escapeHtml(item.name)}</button>
        </th>
        <td>${escapeHtml(item.regular)}</td>
        <td>${escapeHtml(premium)}</td>
        ${adminActions}
      </tr>`;
    })
    .join('');
}

function renderDrinks() {
  drinksList.innerHTML = drinks
    .map((drink) => `<li><span>${escapeHtml(drink.name)}</span><strong>${escapeHtml(drink.price)}</strong></li>`)
    .join('');
}

function renderContact() {
  contactGrid.innerHTML = `
    <p><span>Instagram</span> ${escapeHtml(state.contact.instagram)}</p>
    <p><span>Phone</span> ${escapeHtml(state.contact.phone)}</p>
    <p><span>Location</span> ${escapeHtml(state.contact.location)}</p>
    <p><span>Operating Hours</span> ${escapeHtml(state.contact.hours)}</p>
  `;
}

function renderAdminVisibility() {
  const showAdmin = isAdmin();
  roleStatus.textContent = showAdmin ? 'Admin View' : 'Customer View';

  adminLoginBtn.hidden = showAdmin;
  adminLogoutBtn.hidden = !showAdmin;

  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach((element) => {
    element.hidden = !showAdmin;
  });

  if (!showAdmin) {
    menuPhotoForm.hidden = true;
    contactForm.hidden = true;
    if (itemFormDialog.open) {
      itemFormDialog.close();
    }
  }

  renderMenuTable();
}

function openPreview(item) {
  dialogImage.src = item.image || state.menuPhoto;
  dialogTitle.textContent = item.name;
  dialogPrice.textContent = item.premium
    ? `Regular: ${item.regular} | Premium: ${item.premium}`
    : `Price: ${item.regular}`;
  dialogDescription.textContent = item.description;
  itemDialog.showModal();
}

function openItemForm(item) {
  itemForm.reset();
  if (item) {
    itemFormTitle.textContent = 'Edit Menu Item';
    itemForm.elements.id.value = item.id;
    itemForm.elements.name.value = item.name;
    itemForm.elements.regular.value = item.regular;
    itemForm.elements.premium.value = item.premium;
    itemForm.elements.description.value = item.description;
  } else {
    itemFormTitle.textContent = 'Add Menu Item';
  }
  itemFormDialog.showModal();
}

function persistMenuItems() {
  localStorage.setItem(STORAGE_KEYS.menuItems, JSON.stringify(state.menuItems));
}

function getStoredArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function getStoredObject(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
