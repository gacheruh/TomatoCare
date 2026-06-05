# TomatoCare 🍅
**An Intelligent Web-Based Tomato Disease Diagnosis System**

TomatoCare is a smart, web-based platform designed specifically to empower smallholder farmers in Kenya. By leveraging cutting-edge Artificial Intelligence, TomatoCare provides real-time identification of tomato plant diseases and offers expert, localized advisory to help farmers mitigate crop loss and improve yields.

---

##  Key Features

* **Real-time Disease Detection (Computer Vision):** Uses a Convolutional Neural Network (CNN) to instantly classify diseases from uploaded images of tomato leaves.
* **Expert Advisory System (NLP):** Natural Language Processing powers a conversational interface to provide actionable treatment recommendations, preventive measures, and agricultural best practices in simple, easy-to-understand language.
* **Localized Context:** Tailored for smallholder farmers in Kenya, considering local environmental conditions, common local pests, and available agricultural resources.
* **Web-Based Accessibility:** Requires no specialized app installation; accessible via any standard mobile or desktop web browser.

---

##  Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database & Auth:** Supabase
- **AI/ML:** TensorFlow/Keras (CNN)
- **Advisory:** NLP (NLTK/spaCy)

## 👥 Project Roles & Collaboration

### 1. Model Specialist (Training & Testing)
**Focus:** The "Brain" of the system.
- **Data Pipeline:** Preprocessing and augmenting the PlantVillage and local datasets.
- **Model Engineering:** Designing, training, and fine-tuning the CNN architecture.
- **Performance Evaluation:** Testing for accuracy, precision, and recall.
- **Exporting:** Saving the final model (e.g., `.h5` or `.keras`) for the integration team.
- **Database:** Managing user sessions and diagnostic history via Supabase.
- **Backend/API:** Building the FastAPI layer to connect the CNN model with the NLP logic.

### 2. Integration Specialist (NLP & Web)
**Focus:** The "Body" and "Voice" of the system.
- **NLP Advisory System:** Building the rule-based advisory logic (No generative AI/LLMs) using expert-validated knowledge bases.
- **Web Development:** Creating the Next.js interface for image uploads and results display.


## 🚀 Getting Started

### 1. Clone the Private Repository
```bash
git clone git@github.com:gacheruh/TomatoCare.git
cd TomatoCare 
```
### 2. Repository Structure
- `/model-dev`: Scripts for CNN training, testing, and data augmentation.

- `/backend`: FastAPI server and NLP advisory logic.

- `/frontend`: Next.js web application.

- `/docs`: Project proposal and documentation.

## Workflow for Two-Person Collaboration
To ensure we don't overwrite each other's work, we use Feature Branching:

### 1. Pull latest changes:

```bash 
git checkout main
git pull origin main
```

### 2. Create your specific branch:

- Model Specialist: ```git checkout -b model/training-v1```

- Integration Specialist: ```git checkout -b feat/nlp-logic```

### 3. Commit and Push:

```Bash
git add .
git commit -m "Brief summary of work (e.g., added data augmentation)"
git push origin your-branch-name 
```
### 4. Merge via Pull Request (PR):
Open a PR on GitHub. The other partner must review the code to ensure the integration (e.g., connecting the model to the API) is working correctly.

## ⚠️ Important Guidelines
- **Large Files:** Do not commit raw datasets or model files larger than 100MB to GitHub.

- **Dependencies:** If you install a new library (like spaCy or scikit-learn), remember to run: 
```Bash
pip freeze > requirements.txt
```
- **Privacy:** Keep `.env` files out of the repository. Use env.example as a template for keys and database URLs.
