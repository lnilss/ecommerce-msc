## SoSci Integrated Checkout Prototype for Master's Thesis at JTH

This repository contains a single-page ecommerce checkout prototype built for integration with **SoSci Survey**. The page showcases an `Ergonomique Office Chair` product with a modern storefront layout, interactive image zoom, cart sidebar, and instrumentation hooks for SoSci internal variables.

### Project structure

- **`ecommerce-msc/`** – main project folder
  - **`sosci-checkout.html`** – HTML file (no !DOCTYPE) with inline styles and JavaScript implementing:
    - Product detail view (image, price, description, features)
    - Colour selection
    - Add‑to‑cart button and client-side cart state
    - Slide-in cart sidebar with order summary
    - Image zoom and pan interaction
    - SoSci logging via internal variables (`IC05_01`, `IC05_02`, `IC05_03`)

### Prerequisites

No build step or external dependencies are required. Any modern web browser (Chrome, Edge, Firefox, Safari) can be used.

If you want to work on the file locally, using a simple static web server is recommended so that browser security features don’t interfere with scripts.

### Running locally

- **Quick preview (double-click)**
  - On Windows, you can double‑click `ecommerce-msc/sosci-checkout.html` to open it directly in your default browser.

- **Recommended: use a lightweight HTTP server**  
  From the `ecommerce-msc` directory (the inner folder that contains `sosci-checkout.html`), you can serve the page with e.g. Python:

```bash
cd ecommerce-msc
python -m http.server 8000
```

Then open `http://localhost:8000/sosci-checkout.html` in your browser.

### Integration with SoSci Survey

The checkout page is designed to be embedded in a SoSci question:

- The JavaScript uses helper functions like `setInternalVar` and `appendInternalLog` to write to SoSci internal variables.
- Example variables used:
  - `IC05_01` – logs zoom interactions (`zoom@<ms_since_load>`)
  - `IC05_02` – stores timestamp of the first add‑to‑cart click
  - `IC05_03` – logs colour button clicks (`clicked@<ms_since_load>`)
- On checkout, the script populates `window.cartData` and `window.cartTotal`, then advances the questionnaire via `SoSci.nextPage()` or falls back to form submission.

To connect this to your actual SoSci project, configure the corresponding internal variables (e.g. `IC05_01`, `IC05_02`, `IC05_03`) and embed this HTML in a SoSci HTML question or template, ensuring the element IDs used in the script exist in the SoSci page (these variables will differ depending on your questionnaire setup and section names).

### Customisation

- **Product content** – Change name, price, description, image URL, and features in `sosci-checkout.html` (`productData` object and the product markup).
- **Styling** – All styles are defined in a `<style>` block at the top of `sosci-checkout.html`. You can safely adjust colours, spacing, and typography there.
- **Instrumentation** – If your SoSci project uses different internal variable IDs, update them in the JavaScript (`setInternalVar` / `appendInternalLog` calls).
