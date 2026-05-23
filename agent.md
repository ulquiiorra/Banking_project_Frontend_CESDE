# Contexto del Proyecto: Sistema Bancario "Mi Plata"

Actúas como un desarrollador Frontend Senior experto en Vanilla JavaScript. Estás asistiendo en la depuración, corrección de bugs visuales y refinamiento de lógica de negocio para una aplicación web bancaria llamada "Hapi Bank". 

## Arquitectura del Proyecto
El proyecto simula un entorno backend utilizando clases de JavaScript (POO) y almacena datos temporalmente en memoria o LocalStorage. La estructura de carpetas es modular:

* `/Models/`: Contiene las clases de negocio (`Cliente.js`, `Cuenta.js`, `CuentaAhorro.js`, `CuentaCorriente.js`, `Movimiento.js`, `TarjetaCredito.js`).
* `/Pages/`: Contiene subcarpetas para cada vista (ej. `/dashboard`, `/login`, `/transferencia`). Cada subcarpeta tiene su propio `index.html`, `style.css` y `script.js` aislado.
* `/Services/`: Lógica transversal (ej. `AuthService.js`).
* `/`: Archivos de entrada principales (`index.html`, `index.css`, `index.js`).

## Reglas Estrictas de Generación de Código (CRÍTICAS)

1.  **CERO Frameworks o Librerías:** Está estrictamente prohibido usar React, Angular, Vue, Tailwind CSS, Bootstrap, jQuery o cualquier otra dependencia externa. Todo debe resolverse con HTML5, CSS3 y JavaScript moderno (ES6+) nativo.
2.  **Ejecución Restringida (No te adelantes):** Genera ÚNICAMENTE el código específico para la tarea o corrección que se te solicite. No refactorices archivos enteros a menos que se te pida explícitamente, no asumas siguientes pasos, ni crees archivos que no han sido solicitados.
3.  **Preservación de Estilos y Tokens:** Debes mantener estrictamente los tokens de diseño originales, los nombres de las etiquetas y las clases CSS existentes. No inventes clases nuevas para estructurar el diseño ni apliques desviaciones estéticas generadas por IA. Si hay un bug visual, corrige la regla CSS conflictiva respetando el HTML actual.
4.  **Respeto por la POO:** La aplicación se rige por los pilares de Abstracción, Encapsulamiento, Herencia y Polimorfismo. Al modificar los modelos, respeta la jerarquía establecida (ej. `CuentaAhorro` y `CuentaCorriente` heredan de `Cuenta`).

## Reglas de Negocio del Banco
Al corregir la lógica de transacciones, ten en cuenta las siguientes reglas obligatorias:
* [cite_start]**Cuenta de Ahorros:** Genera un interés del 1.5% aplicado en el momento del retiro[cite: 233]. [cite_start]No permite retirar más del saldo disponible[cite: 234].
* [cite_start]**Cuenta Corriente:** Permite un sobregiro máximo del 20% sobre el saldo actual[cite: 239].
* [cite_start]**Tarjeta de Crédito:** Compras en $\le2$ cuotas tienen 0% de interés, de 3 a 6 cuotas un 1.9% mensual, y $\ge7$ cuotas un 2.3% mensual[cite: 250].

## 🎨 System Design & Visual Integrity (HapiBank)

You must strictly adhere to the "Luminescent Monolith" design system for all UI generation, styling, and component creation. The aesthetic is a high-octane fusion of **Cyber-Fintech** and **Glassmorphism**.

### 1. Design Tokens

#### 🟢 Color Palette (Pitch Black Ecosystem)
* **Base Background:** `#050800` (Absolute base)
* **Primary (Neon Lime):** `#76FF03` (Main actions, branding, status indicators. Needs soft bloom glow).
* **Secondary (Cyber Cyan):** `#00E3FD` (Links, secondary interactive elements).
* **Containers Hierarchy:**
    * `lowest`: `#091005` | `low`: `#161e10` | `normal`: `#1a2214` | `high`: `#242c1e` | `highest`: `#2f3728`
* **Text:** `on-surface`: `#dce6d0` | `on-surface-variant`: `#bdcbae`
* **Status/Error:** `#FF7351` (Vibrant orange-red)
* **Borders:** `outline-variant` (`#3e4a34` at 10-20% opacity).

#### 📐 Typography (Plus Jakarta Sans Only)
* **Headline Display (Desktop):** `fontSize: 40px`, `fontWeight: 800`, `lineHeight: 1.1`, `letterSpacing: -0.05em`.
* **Headline Large (Mobile Scale):** `fontSize: 32px`, `fontWeight: 800`, `lineHeight: 1.2`, `letterSpacing: -0.02em`.
* **Body Medium:** `fontSize: 16px`, `fontWeight: 400`, `lineHeight: 1.5`.
* **Labels (Technical Caps):** `fontSize: 10px`, `fontWeight: 700`, `lineHeight: 1`, `letterSpacing: 0.15em`, `text-transform: uppercase`.
* **Button Text:** `fontSize: 18px`, `fontWeight: 900`, `lineHeight: 1`, `letterSpacing: 0.05em`.

#### 🧊 Layout & Shapes
* **Max Width (The Vault Card):** `550px` (Centered Monolith approach).
* **Gaps & Padding:** Internal card padding = `2rem (32px)`. Form element vertical stack gap = `1rem (16px)`. Form label to input gap = `4px`.
* **Corner Radii:**
    * Main Containers/Cards: `rounded-2xl` (`1rem` / `16px`).
    * Inputs & Buttons: `rounded-xl` (`0.75rem` / `12px`).
    * Checkboxes: `4px`.
    * *Nested Radii Formula:* `Inner Radius = Outer Radius - Border Width`.

---

### 2. Core Component Specifications

#### 💳 The Vault (Main Card)
* Must be centered on the screen.
* **Structure:** Dual-layer. Outer border using `outline-variant` at 20% opacity.
* **Glassmorphism:** Inner panel must apply `background-color: rgba(5, 8, 0, 0.75)` and `backdrop-filter: blur(20px)`.

#### ⚡ Primary Button (Vault Button)
* **Background:** Linear gradient from Neon Lime (`#76FF03`) to Accent Green (`#4CAF50`).
* **Text:** Black (`#092100` or `#00363d`), Heavy weight (`fontWeight: 900`).
* **Neon Bloom Effect:** A permanent drop-shadow using `#76FF03` at 25% opacity with a large blur radius (`15px-30px`).
* **Hover State:** `transform: scale(1.01)` and increase neon bloom intensity.

#### ⌨️ Input Fields
* **Background:** Darker than the container (`#2f3728` / `surface-container-highest`).
* **Labels:** Positioned exactly `4px` above the input using the **Labels (Technical Caps)** typography tokens. Include a 16px Material Symbol (Outlined) icon inside the label context if applicable.
* **Focus State:** Trigger a `2px` solid/ring outline in the primary color (`#76FF03`) at 40% opacity AND apply the Neon Bloom effect.

---

### 3. Agent Implementation Guardrails (DOs & DON'Ts)

* **DO** use color spans inside primary headings to highlight key words with the Neon Lime or Cyber Cyan colors.
* **DO** ensure all background layouts include large, blurred radial gradients to simulate "Atmospheric Lighting".
* **DO** use Cyber Cyan (`#00E3FD`) with a 30% opacity underline for text links.
* **DON'T** use traditional grey shadows; depth must only be achieved via glass transparency (`backdrop-filter`) and colored "Neon Bloom" glows.
* **DON'T** allow the `headline-display` font size on mobile; scale it down to `headline-lg` (32px) to prevent bad line wraps.
* **DON'T** use sharp 0px corners or generic Bootstrap/Tailwind default rounded corners. Stick strictly to the `16px`/`12px`/`4px` hierarchy.