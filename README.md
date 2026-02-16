# Daaianew Menu Website

A simple, responsive, single-page website for **Daaianew** built with vanilla HTML, CSS, and JavaScript.

## Overview

This website presents:
- A menu photo area with ornate/lace card styling.
- A menu + drinks listing with pricing.
- Item detail preview dialog (photo + description + pricing).
- Contact & Orders section.
- Messenger-based **Order Now** button.

## Tech Stack

- HTML5 (semantic structure)
- CSS3 (responsive layout + custom properties)
- Vanilla JavaScript (UI interactions + local storage)

## Features

### Public / Customer View
- View menu photo and pricing content.
- Filter content by: **All / Menu / Drinks**.
- Click menu item names to open an item detail modal.
- Use **Order Now** to open Messenger link.

### Admin View (Password-gated)
- Admin authentication modal (front-end password flow).
- Edit and save menu photo.
- Add / edit / delete menu items:
  - item name
  - regular price
  - premium price
  - description
  - image upload
- Edit Contact & Orders details.

## Admin Login

Default demo password in code:

```txt
daaianew123
```

> ⚠️ This is a client-side demo password only. Do not use this approach for production security.

## Data Persistence

This project currently stores editable data in browser `localStorage`:
- admin session state
- menu photo
- menu items
- contact info

### Important Production Note
`localStorage` is browser-specific. It will not reliably persist across:
- different devices
- different browsers
- cleared storage/cache

For real deployment, use a backend stack:
- **Database** (menu/contact records)
- **Object/File storage** (uploaded images)
- **Authenticated API** (secure admin actions)

## Project Structure

```txt
.
├── index.html
├── styles.css
├── script.js
└── assets/
    └── menu.png   # place your menu image here
```

## Setup

1. Place your image file at:
   - `assets/menu.png`
2. Open `index.html` in a browser.

Optional local server:

```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000`

## Accessibility & UX Notes

- Uses semantic sections (`header`, `main`, `section`, `footer`).
- Includes keyboard focus styles.
- Uses responsive layout for desktop and mobile.
- Provides readable contrast and clear controls.

## Customization

- Update Messenger link in `index.html` (`Order Now` button).
- Update the admin password constant in `script.js`.
- Adjust theme variables in `styles.css` under `:root`.

## License

This project is for demonstration and customization use.
