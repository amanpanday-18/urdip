# URDIP

**Live app → [https://urdip.lovable.app](https://urdip.lovable.app)**

URDIP is a bilingual (English + हिन्दी) web app for farmers and everyday consumers. It puts three
everyday problems on one phone screen: a sick plant, a government scheme you qualify for but never
heard of, and a packaged product whose label you can't decode.

---

## The idea

Most farm advice, welfare information and food-labelling knowledge is written for people who already
have time, money and English. A farmer with a yellowing leaf has to wait days for an extension
officer. A family that qualifies for a pension or scholarship has no single place to ask "am I
eligible?". A shopper reading a biscuit packet can't tell whether the ingredient list is safe for
them.

URDIP answers all three from a camera and a few taps — no forms, no jargon, no cost.

## What it does

| Feature | How it works |
| --- | --- |
| **Plant Doctor** | Click or upload a leaf photo → the in-browser AI model identifies the crop and the disease and names it with a confidence score → the AI doctor then writes the medicines (with Indian brand names and exact dosages), organic remedies, and prevention steps, in English or Hindi. |
| **Govt Schemes** | Answer a short, step-by-step form (age, state, marital status, income, occupation, etc.) → URDIP returns the schemes, **pensions** and **scholarships** you are eligible for, plus a "how to apply" walkthrough for any of them. |
| **Product Scanner** | Scan the barcode or photograph the label → ingredients are broken into plain words, with a safety score, who should avoid it, and the benefits and the harms. |

## Plant Doctor — the trained model

The recognition step is a model **we trained ourselves**, not a third-party API. It runs entirely
inside the user's browser, so scanning a leaf costs nothing and works on a weak connection.

**All 27 plants it works on:**

Apple · Blueberry · Cassava · Cherry · Coffee · Corn (Maize) · Cucumber · Grape · Guava · Jamun ·
Mango · Orange · Peach · Pepper (Bell) · Pomegranate · Potato · Raspberry · Rice · Rose · Soybean ·
Squash · Strawberry · Sugarcane · Tea · Tomato · Watermelon · Wheat

That is **90 disease classes** across those 27 crops — including the Indian staples Rice, Wheat,
Sugarcane, Mango, Guava, Jamun, Tea, Pomegranate, Cucumber and Watermelon.

### Dataset

| Version | Dataset | Images | Classes | Crops |
| --- | --- | --- | --- | --- |
| v1 (baseline) | [Kaggle — *New Plant Diseases Dataset* (PlantVillage)](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) | 54,000+ | 38 | 14 |
| v2 (current) | [Kaggle — *Leafy: plant pathology*](https://www.kaggle.com/datasets/ayyappaswamythati/leafy-plant-pathology) | 137,000+ | 90 | 27 |

Both datasets are public, already split into train / validation / test folders.

Downloaded straight into the Colab notebook with [`kagglehub`](https://github.com/Kaggle/kagglehub):

```python
import kagglehub
# v1 baseline
kagglehub.dataset_download("vipoooool/new-plant-diseases-dataset")
# v2 current (27 crops, 90 disease classes)
kagglehub.dataset_download("ayyappaswamythati/leafy-plant-pathology")
```

### Training setup

- **Google Colab** with a free **NVIDIA T4 GPU** runtime
- **Python** + **PyTorch**, **MobileNetV3** backbone (small enough to run on a phone)
- Image augmentation, `AdamW` optimiser, `CrossEntropyLoss`, **5 epochs**
- v1 reached **99.24% validation accuracy** on 38 classes; v2 was trained the same way on the
  larger 90-class set (accuracy is printed per epoch in the notebook)
- Exported to **ONNX** (`torch.onnx.export`, single self-contained file) so any device can run it

### How a scan flows

```
leaf photo  →  onnxruntime-web (in the browser, no server, no API key)
            →  disease label + confidence  (e.g. "Tomato - Late blight · 98%")
            →  AI doctor  →  medicines, doses, organic options, prevention  (EN / HI)
```

## Technology used

- **Frontend / full-stack:** TanStack Start (React 19) + Vite, Tailwind CSS v4, shadcn/ui
- **On-device AI:** `onnxruntime-web` running the trained MobileNetV3 ONNX model in the browser
- **AI language model:** Lovable AI Gateway (server-side only — no key ships to the phone) for
  prescriptions, scheme matching and ingredient explanations
- **Barcode / label reading:** `html5-qrcode` + the open **Open Food Facts** database (no key needed)
- **Model training:** Google Colab (T4 GPU), Python, PyTorch, MobileNetV3, ONNX export
- **Language:** English + हिन्दी toggle throughout
- **Testing:** Vitest; Playwright checks on a 390×844 phone viewport

## Pages

| Route | Screen |
| --- | --- |
| `/` | Animated home screen — project title, supervisor and team credits |
| `/agro` | Plant Doctor |
| `/schemes` | Government schemes, pensions & scholarships |
| `/scanner` | Product / barcode scanner |

## Project review status

Current progress: **45%**.

- **Done:** all four screens, bilingual UI, the trained 90-class plant model running in-browser,
  AI prescriptions, barcode + label scanning, scheme eligibility matching, live deployment
- **Remaining:** more crops (cotton, chilli), user accounts and scan history, offline PWA packaging
  for the Google Play Store, real-field photo testing

## Team

**Project Supervisor:** Dr. Velmurugan

| Registration No. | Name |
| --- | --- |
| 24BEY10038 | Aman Panday |
| 24MIP10143 | Somya Tiwari |
| 24BCE10080 | Pranav Kumar |
| 24BEY10178 | Himesh Jham |
| 24BCE11393 | Aarshi Jaiswal |
| 24MIM10067 | Suhana Bisht |

---

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/520c3aaf-e3e6-4bdb-a380-90f853f13bf3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
