# Code-Coffee

Where Great Coffee Meets Great Ideas.

Code-Coffee is a modern, premium, and fully responsive coffee shop website template. It features a beautiful dark-mode aesthetic with warm coffee tones, 3D interactive elements, and a smooth user experience designed to showcase premium coffee products and services.

## Features

- **Modern & Premium Design:** A highly polished UI with a curated dark color palette, smooth gradients, and elegant typography.
- **Fully Responsive:** Adapts perfectly to mobile phones, tablets, laptops, and desktop screens.
- **Interactive 3D Elements:** Uses Three.js for an engaging floating coffee cup in the hero section and an interactive showcase.
- **Dynamic Menu:** A filterable coffee menu loaded dynamically, complete with an "Add to Order" toast notification.
- **Services Section:** Highlights the core offerings including fresh coffee, fast service, and comfortable environment.
- **Special Offers:** A built-in countdown timer for limited-time deals.
- **Gallery Lightbox:** Clickable gallery images that open in a full-screen lightbox.
- **Contact Form Validation:** Client-side form validation ensuring required fields and proper formats are met.

## Technologies Used

- **HTML5:** Semantic markup and structure.
- **CSS3:** Custom styles, Flexbox, Grid layout, CSS variables, and micro-animations.
- **JavaScript (ES6):** Logic for navigation, filtering, custom cursor, scroll reveals, and form validation.
- **Three.js:** For rendering the 3D coffee cup scenes.
- **Font Awesome:** For scalable vector icons.
- **Google Fonts:** Fraunces (Display) and Manrope (Body).

*(Note: Tailwind and Bootstrap were originally referenced but have been cleaned up to improve performance and remove unnecessary bloat, strictly relying on custom CSS).*

## Project Structure

```
code-coffee/
│
├── assets/
│   ├── icons/           # (Scalable icons if any)
│   └── images/          # (Image assets)
│
├── css/
│   └── style.css        # (Main stylesheet, contains all layout and styling)
│
├── js/
│   └── script.js        # (Main JavaScript logic and Three.js implementation)
│
├── index.html           # (Main HTML document)
└── README.md            # (Project documentation)
```

## How to Run

1. Clone or download this repository.
2. No build tools or package installations are strictly required to run this static site.
3. Simply open `index.html` in your favorite modern web browser.
   - *For the best experience with Three.js and to avoid CORS issues if you add local textures, it is recommended to run a local development server (e.g., using VS Code Live Server, or `python -m http.server`).*

## Screenshots

*(Placeholder for future screenshots)*
- **Hero Section:** Shows the 3D cup and primary CTA.
- **Menu Section:** Shows the filterable grid of coffee products.
- **Mobile View:** Shows the responsive hamburger navigation and stacked layout.

## Future Improvements

- Backend integration for processing contact form submissions and live orders.
- Shopping cart functionality to manage selected coffee items.
- User authentication and profiles for loyalty points.
- Online reservation system for table bookings.
- More complex 3D scenes or textures for the interactive showcase.

## Developer Information

**Designed & Developed by:** Muhammad Haris O
**Email:** harismhdharis313@gmail.com
**Location:** India

Feel free to reach out for collaborations or project inquiries!
