# 🍐 Pear Media — AI Creative Lab

> A responsive React web application with two AI-powered creative workflows: prompt-to-image generation and image style variation.

---

## 🔗 Submission Links

| | Link |
|---|---|
| **GitHub Repository** | https://github.com/abishek1405/pear-media |
| **Live Demo (Vercel)** | https://pear-media-ten.vercel.app/ |
| **Screen Recording** | https://drive.google.com/file/d/1saot-UgvsLcXUB7Iz2K3ccFdc9jxwqWi/view?usp=sharing |


---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (Vite) |
| Styling | CSS3 with CSS Variables — "Clean Tech" aesthetic |
| Text Enhancement | OpenAI GPT-4o-mini |
| Image Analysis | OpenAI GPT-4o (Vision) |
| Image Generation | OpenAI DALL-E 3 |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## ✨ Features

### Workflow A — Creative Studio (Text → Image)
- User enters a simple idea (e.g. *"a cat in a spacesuit"*)
- GPT-4o-mini enhances it into a rich 50-word professional prompt with lighting, camera angle, and artistic style
- Human-in-the-loop approval step — the user can read and edit the enhanced prompt before proceeding
- DALL-E 3 generates a 1024×1024 image from the approved prompt

### Workflow B — Style Lab (Image → Variation)
- User uploads any image (JPEG, PNG, WebP — up to 20 MB)
- GPT-4o Vision analyses the image and extracts: main subject, color palette, artistic style, lighting, and mood
- A structured variation prompt is automatically built from the analysis
- DALL-E 3 generates a stylistic variation image

### General
- Animated step indicator showing current progress
- Live loading progress bar during API calls
- Colour-coded status messages (success / error)
- Fully responsive — works on mobile and desktop
- All API keys stored securely in `.env` (never committed to Git)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18 or higher
- An OpenAI API key — get one at [platform.openai.com](https://platform.openai.com)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pearmedia-ai-prototype.git
cd pearmedia-ai-prototype

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Open `.env` and add your key:
```
VITE_OPENAI_KEY=sk-your-actual-key-here
```

```bash
# 4. Start the development server
npm run dev
```

The app will open at **http://localhost:5173**

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🌐 Deployment (Vercel)

```bash
# 1. Push your code to GitHub
git add .
git commit -m "initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
3. In **Settings → Environment Variables**, add:
   - Key: `VITE_OPENAI_KEY`
   - Value: your OpenAI API key
4. Click **Deploy**

---

## 📁 Project Structure

```
pearmedia-ai-prototype/
├── .env                        # Secret API keys — never commit this
├── .env.example                # Safe template for other developers
├── .gitignore                  # Excludes node_modules, .env, build/
├── README.md                   # This file
├── package.json                # Project dependencies and scripts
├── index.html                  # Vite HTML entry point
└── src/
    ├── App.jsx                 # Tab layout — Creative Studio / Style Lab
    ├── App.css                 # Global styles and animations
    ├── components/
    │   ├── Navbar.jsx    
    │   ├── WorkflowText.jsx    # Step 1: input → Step 2: approve → Step 3: image
    │   └── WorkflowImage.jsx   # Step 1: upload → Step 2: analyse → Step 3: variation
    └── utils/
        └── apiHelpers.js       # All OpenAI API calls (text, vision, image generation)
```

---

## 💰 API Cost Estimate

| API Call | Model | Est. Cost |
|---|---|---|
| Enhance prompt | GPT-4o-mini | ~$0.0001 |
| Analyse image | GPT-4o Vision | ~$0.003 |
| Generate image | DALL-E 3 | ~$0.040 |
| **Full workflow run** | | **~$0.043** |

A $5 OpenAI credit covers approximately **100+ full workflow runs** — more than enough for development and demo.

---
## 👤 Author

** T Abishek **  
Submitted for: Pear Media Assignment
