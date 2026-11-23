# Kisan Mitra (URDIP) — App Plan: Screens First, Then AI

## Look and feel
- Clean app layout (like Plantix and Yuka) with earthy colours: leaf green, soil brown, cream.
- Built for phones first, with 4 buttons at the bottom: Home, Agro, Schemes, Scanner.
- Big cards and big buttons. A switch at the top to change between English and Hindi.

## 1. Agro: Plant Doctor
- Take a photo with the camera or upload one from the gallery.
- The AI looks at the photo and shows a result card:
  - The plant's name
  - The disease name (or "Healthy") and how sure it is
  - Signs of the disease and what causes it
  - Medicines: chemical ones (name, how much to use, how to spray) plus organic/home remedies
  - How to prevent it next time
- A list of past scans.

## 2. Government Schemes
- A short step-by-step form: age, gender, marital status, state, area (village/city), caste category, yearly income, job (farmer, student, worker, etc.), studies, disability, widow/senior citizen.
- Results grouped into tabs: Schemes, Pensions, Scholarships. Each card shows the benefit and why the user qualifies.
- A "How to apply" button on each card shows the steps, documents needed, official website link and helpline number.

## 3. Product Safety Scanner
- Two options: scan the barcode, or take a photo of the ingredients label.
- Result:
  - A safety score with a colour (green / orange / red)
  - Each ingredient explained in simple words
  - Who should avoid it (diabetics, children, pregnant women, people with allergies, heart patients)
  - Benefits and harms of eating it
  - Healthier choices

## Build order
1. Screens and design for all 3 features with sample data, so you can see and test the whole app.
2. Then switch on the AI: photo analysis for plants and product labels, scheme matching, and barcode lookup.
3. Later: sign-in and saved history.

## Technical details
- Routes: /, /agro, /schemes, /scanner, plus their result screens. Each route sets its own page title and description.
- Phase 1 uses mock data; phase 2 adds Lovable Cloud with AI Gateway server functions (Gemini vision for images) and an Open Food Facts lookup for barcodes.
- Barcode scanning: html5-qrcode, loaded on the client only.
- Design tokens (oklch) in styles.css. Fonts: Fraunces for headings, Hind for body text (supports Hindi script).
