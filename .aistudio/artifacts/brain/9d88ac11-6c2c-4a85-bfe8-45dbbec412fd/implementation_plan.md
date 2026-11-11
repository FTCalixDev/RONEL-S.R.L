# Ronel S.R.L. Automotores — Digital Showroom & Official Service Hub

A high-precision, mobile-first single-page web application for **Ronel S.R.L. Automotores**, the official Fiat service center, spare parts distributor, and vehicle dealership in Tacuarembó, Uruguay. Designed with the tactile clarity of a modern automotive cockpit, it unifies vehicle exploration, official maintenance scheduling, and OEM parts inquiries into an instant WhatsApp conversion workflow.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design decisions have been aligned based on your input and local grounding for Ronel S.R.L. in Tacuarembó:

- **Confirmed Primary Accent**: **Racing Red (`#D9381E`)** inspired by Fiat performance heritage, paired with deep obsidian/slate surfaces (`#0F172A`) and brushed metallic hairline borders (`white/10` in dark mode, `slate-200` in light mode).
- **Confirmed Vehicle Inventory**: **Official 0km Fiat Lineup** (Strada, Pulse, Fastback, Toro, Cronos, Mobi) alongside **Selected Certified Used Vehicles** (`Usados Seleccionados` with multi-point workshop inspection by Ronel S.R.L.), filterable via a swipeable horizontal category bar.
- **Confirmed Inquiry & Booking Workflow**: **Interactive Bottom Drawer / Modal** that captures context-specific details (vehicle model, test drive preference, license plate/kilometraje for service, or chassis/OEM part lookup) and generates a structured, pre-filled WhatsApp message to Ronel S.R.L. (`+598 91 839 000`).

---

### 1. Overview & Core Concept

- **What It Does**: Provides drivers and fleet owners in northern Uruguay with a unified digital platform to browse 0km Fiat models and inspected pre-owned vehicles, book official warranty-preserving maintenance, and request original spare parts with direct technical advisor routing.
- **Target Audience / Persona**: Vehicle buyers, rural pickup/utility fleet operators, and Fiat owners in Tacuarembó and surrounding northern departments seeking trusted official mechanical backing.
- **Key Value**: Eliminates friction between browsing and technical consultation by translating every card interaction into a contextualized WhatsApp inquiry ready to send to the workshop or sales desk at Dr. Washington Beltrán 318.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Hero & Quick Action**: Users arrive on a dark-by-default automotive cockpit interface featuring the regional trust marker (*"Service Oficial y Venta de Vehículos · Tacuarembó"*), the headline *"Tu próximo 0km y el mejor respaldo técnico en Tacuarembó."*, and the primary CTA *"Agendar Service o Test Drive"*.
  2. **Seamless Tab Navigation**: Below the hero, an ergonomic 3-tab controller (**Vehículos**, **Service Oficial**, **Repuestos**) switches views with smooth opacity/transform transitions (`<= 200ms`) and maintains scroll ergonomics.
  3. **Contextual Exploration**:
     - *Vehículos*: Users swipe or click category filters (*Todos*, *0km Fiat*, *Pickups & Utilitarios*, *Usados Seleccionados*), inspect technical specs (motor, transmisión, año, precio orientativo/financiación), and tap *"Cotizar / Test Drive"*.
     - *Service Oficial*: An asymmetric Bento Grid showcases official diagnostic computer scanning, scheduled warranty services (*10.000 km a 60.000 km+*), suspension/brakes, and multi-brand mechanical support, with direct *"Agendar Turno"* triggers.
     - *Repuestos*: A Bento showcase of genuine MOPAR/Fiat spare parts categories (filtros y lubricantes Selenia, distribución, frenos, carrocería y accesorios) with an instant chassis/part search trigger.
  4. **Interactive WhatsApp Drawer & Sticky Bottom Bar**: Clicking any CTA or the permanent bottom action bar (*"Consultar por WhatsApp"*) opens the pre-qualification drawer pre-populated with the selected item or service, allowing the user to enter their name and specific request before launching WhatsApp.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Precision Automotive Cockpit — industrial trustworthiness meets luxury instrument cluster refinement.
  - *Color Palette & Mood*:
    - **Dark Mode (Default)**: Deep Slate Canvas (`#0F172A`), Elevated Metallic Surface (`#1E293B` / `bg-white/5 backdrop-blur-md`), Brushed Silver Hairlines (`border-white/10`), Crisp Titanium Text (`#F8FAFC`), Muted Gauge Grey (`#94A3B8`), and **Racing Red (`#D9381E`)** primary actions.
    - **Light Mode**: Alabaster Showroom Canvas (`#F8FAFC`), Pure White Cards (`#FFFFFF`), Crisp Slate Borders (`#E2E8F0`), Deep Charcoal Typography (`#0F172A`), and **Racing Red (`#D9381E`)** accents.
  - *Typography & Hierarchy*:
    - **Display / Headings**: Geometric, muscular automotive proportions (`Outfit` / `Plus Jakarta Sans`) with `text-wrap: balance` and tight tracking.
    - **Body & Controls**: Clean, high-legibility sans-serif (`Plus Jakarta Sans` / `Inter`) with `whitespace-nowrap` on all interactive buttons and tabs.
    - **Technical Specs & Prices**: Tabular numerals (`tabular-nums`) for engine displacement, kilometraje intervals, prices, and workshop hours.
  - *Component Styling & Layout*: Full-width responsive desktop container (`max-w-7xl`) that adapts gracefully from a one-handed mobile viewport (`375px–430px`) to a multi-column showroom layout on desktop. Aggregate sticky surfaces (minimalist header + sticky bottom WhatsApp bar) stay strictly within the 15% mobile viewport cap.

- **Interactive Feedback & Motion**:
  - Framer Motion handles smooth tab crossfades (`opacity`, `y` transform), tactile button press scaling (`active:scale-[0.98]`), and slide-up spring physics for the WhatsApp inquiry drawer.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pre-Qualified WhatsApp Drawer vs. Static External Link**
  - *Chosen Approach*: Interactive slide-up drawer that structures the customer's inquiry (Vehicle Model / Service Interval / Part Name + Customer Name + Notes) before opening the `wa.me` link, plus a one-tap instant WhatsApp shortcut inside the drawer and header.
  - *Why*: Dealerships and workshops in Uruguay rely heavily on WhatsApp; receiving structured messages (*"Hola Ronel S.R.L., quiero agendar el Service Oficial de 20.000 km para mi Fiat Pulse..."*) saves technical advisors time and increases conversion rates compared to blank *"Hola"* messages.
  - *Alternatives Considered*: Backend email forms (slow response perception for mobile users) or raw links with no context.

- **Decision 2: Mobile-First Ergonomics with Full Desktop Showroom Presence**
  - *Chosen Approach*: Sticky bottom action bar (`z-50`) and horizontal touch-scroll filter rails optimized for mobile thumbs, paired with a balanced 12-column Bento & Showroom grid on desktop screens.
  - *Why*: Ensures mobile visitors on the go in Tacuarembó have effortless thumb reach while desktop visitors experience an authoritative dealership platform.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Ronel S.R.L. Application State                       │
│   [theme: 'dark' | 'light']  [activeTab: 'vehiculos'|'service'|'repuestos']│
│   [vehicleFilter: string]    [drawerState: { open, type, prefillData }]  │
└───────────────┬──────────────────────────────────────────┬───────────────┘
                │                                          │
                ▼                                          ▼
┌───────────────────────────────────────┐  ┌───────────────────────────────┐
│        Primary Layout Views           │  │  Interactive Inquiry System   │
├───────────────────────────────────────┤  ├───────────────────────────────┤
│ • Sticky Top Header                   │  │ • Slide-Up Consultation Drawer│
│   (Brand, Nav/Tabs, Theme, WA Icon)   │  │   - Dynamic mode selector     │
│ • Hero Showcase                       │  │     (Test Drive / Service /   │
│   (Showroom Visual, Trust Kicker, CTA)│  │      Repuesto / Consulta Gral)│
│ • Multi-Page Tab Controller           │  │   - Context-aware fields      │
│   ├─ Tab 1: Vehículos (0km & Usados)  │  │     (Modelo, Matrícula/Km,    │
│   │  └─ Swipeable Category Filter     │  │      Repuesto/Chasis)         │
│   │  └─ Vehicle Spec Cards + Modal    │  │   - Live WhatsApp Message     │
│   ├─ Tab 2: Service Oficial (Bento)   │  │     Preview & Direct Launch   │
│   │  └─ Asymmetric Bento Service Grid │  ├───────────────────────────────┤
│   │  └─ Interactive Km Interval Picker│  │ • Sticky Bottom Action Bar    │
│   └─ Tab 3: Repuestos Originales      │  │   (Permanent z-50 Mobile CTA: │
│      └─ MOPAR Bento Grid & Fast Lookup│  │    "Consultar por WhatsApp")  │
│ • Location & Workshop Info Footer     │  └───────────────────────────────┘
│   (Dr. Washington Beltrán 318, Horario│
└───────────────────────────────────────┘
```

- **Data Model & State**:
  - **Vehicle Catalog**: Structured records with ID, title, category (`0km Fiat`, `Pickups & Utilitarios`, `Usados Seleccionados`), year, engine/transmission specs, condition status, price/financing reference, key highlights, and custom generated showroom imagery.
  - **Official Service Bento Items**: Structured asymmetric grid items (`col-span-1` and `col-span-2`) covering *Diagnóstico Computarizado Original*, *Service Oficial en Garantía (10k–60k+ km)*, *Mecánica Ligera, Frenos y Suspensión*, and *Alineación, Balanceo y Flotas*, plus an interactive Service Plan Estimator by kilometraje.
  - **Genuine Spare Parts (Repuestos) Bento Items**: Structured MOPAR/Fiat categories (*Filtros y Lubricantes Selenia*, *Kits de Distribución y Motor*, *Frenos y Embragues*, *Carrocería, Ópticas y Accesorios*) with an inline quick-lookup input for part name or chassis number.

- **Interactive Component & State Mapping**:
  - **Theme Controller**: Toggles `.dark` on `document.documentElement` (initialized to `'dark'` by default) with complete light/dark surface pairings across every card, border, and badge.
  - **Tab & Filter Transitions**: Selecting a tab updates `activeTab` and triggers a clean `AnimatePresence` transition; selecting a vehicle category or entering a part query dynamically filters the displayed items with instant zero-latency feedback.
  - **Drawer Pre-Fill Handler**: Clicking *"Agendar Service o Test Drive"*, any vehicle card CTA, any Service Bento card, or the sticky bottom *"Consultar por WhatsApp"* bar opens the consultation drawer pre-loaded with that item's context and formats a ready-to-send WhatsApp URI (`https://wa.me/59891839000?text=...`).
