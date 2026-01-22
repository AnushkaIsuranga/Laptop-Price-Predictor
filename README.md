# Laptop Price & Spec Predictor

An end-to-end project that predicts a laptop's specification score and estimated price from a few key inputs. It includes:

- A Python FastAPI backend that serves trained machine learning models
- A Next.js frontend for an interactive demo
- Data and EDA artifacts used for model development

## What This Project Is

This project lets you input simple specs (GPU, screen size, RAM, CPU threads and cores) and get:

- Specification score: a normalized measure of overall performance potential
- Price estimation: a predicted retail price given the configuration

It is designed for demonstration and learning: the frontend can run standalone with mock predictions, or call the backend for real model outputs.

## How It Works

### Data & EDA
- Raw dataset: `data/laptop.csv`
- Cleaned dataset: `data/laptop_cleaned.csv`
- Exploration and feature selection: `EDA.ipynb`

### Feature Encoding
- Categorical values (e.g., GPU models) are label-encoded.
- Mappings are stored in `laptop_price_spec_predictor/data/label_mappings.json` and consumed by the frontend.

### Models & API
- Trained models saved with `joblib` and loaded by the backend:
  - `final_model_spec.pkl`: predicts the specification score
  - `final_model_price.pkl`: predicts the price
- FastAPI app: `main.py`
  - `POST /predict/spec_score` → body: `{ "features": [gpuEncoded, screenSize, threads, ram, cores] }`
  - `POST /predict/price` → body: `{ "features": [gpuEncoded, threads, ram, cores] }`
- CORS allows requests from `http://localhost:3000` for local dev.

### Frontend (Next.js)
- Location: `laptop_price_spec_predictor/`
- UI at `app/page.tsx` collects inputs and shows results.
- By default, it returns mock predictions for a fast demo.
- Axios is installed and can be used to call the FastAPI endpoints.

## Run a Quick Demo (Windows)

### Option A — Frontend Only (mock predictions)
1. Open a terminal (PowerShell) in the project root.
2. Run the frontend:

```powershell
cd .\laptop_price_spec_predictor
npm install
npm run dev
```

3. Visit http://localhost:3000 and experiment with the form.

### Option B — Backend API (real predictions)
1. Ensure the model files exist next to `main.py`: `final_model_spec.pkl`, `final_model_price.pkl`.
2. Activate the Python environment and install dependencies:

```powershell
./Scripts/Activate.ps1
pip install -r requirements.txt
pip install fastapi uvicorn joblib pydantic
```

3. Start the API server:

```powershell
uvicorn main:app --reload
```

4. Test endpoints with a tool like `curl` or Postman. Examples:

```powershell
# Spec score (features: [gpuEncoded, screenSize, threads, ram, cores])
curl -X POST http://127.0.0.1:8000/predict/spec_score ^
  -H "Content-Type: application/json" ^
  -d "{\"features\":[12,15.6,8,16,6]}"

# Price (features: [gpuEncoded, threads, ram, cores])
curl -X POST http://127.0.0.1:8000/predict/price ^
  -H "Content-Type: application/json" ^
  -d "{\"features\":[12,8,16,6]}"
```

### Option C — Wire Frontend to the API (optional)
If you want the UI to use the FastAPI predictions instead of mock values:

1. Ensure the backend is running on `http://127.0.0.1:8000`.
2. In `app/page.tsx`, replace the mock `setTimeout` with an Axios call like:

```ts
import axios from "axios";

// ... inside handlePredict(f)
const endpoint = activeTab === "spec"
  ? "http://127.0.0.1:8000/predict/spec_score"
  : "http://127.0.0.1:8000/predict/price";

const { data } = await axios.post(endpoint, { features: f });
if (activeTab === "spec") {
  setSpecScore(String(data.spec_score));
} else {
  setPrice(String(data.price));
}
```

3. Keep CORS in `main.py` aligned with your frontend origin (default is `http://localhost:3000`).

## Troubleshooting
- Install missing Python runtime packages for the API:

```powershell
pip install fastapi uvicorn joblib pydantic
```

- Common PowerShell quoting: use `^` for line continuation.
- If models are missing, train and export them (notebook or script) to `final_model_spec.pkl` and `final_model_price.pkl` before running the backend.

## Repository Structure

```
EDA.ipynb
main.py
requirements.txt
data/
  laptop.csv
  laptop_cleaned.csv
laptop_price_spec_predictor/
  app/page.tsx
  data/label_mappings.json
  package.json
  next.config.ts
```
# Laptop Price & Spec Predictor

An end-to-end project that predicts a laptop's specification score and estimated price from a few key inputs. It includes:

- A Python FastAPI backend that serves trained machine learning models
- A Next.js frontend for an interactive demo
- Data and EDA artifacts used for model development

## What This Project Is

This project lets you input simple specs (GPU, screen size, RAM, CPU threads and cores) and get:

- Specification score: a normalized measure of overall performance potential
- Price estimation: a predicted retail price given the configuration

It is designed for demonstration and learning: the frontend can run standalone with mock predictions, or call the backend for real model outputs.

## How It Works

### Data & EDA
- Raw dataset: `data/laptop.csv`
- Cleaned dataset: `data/laptop_cleaned.csv`
- Exploration and feature selection: `EDA.ipynb`

### Feature Encoding
- Categorical values (e.g., GPU models) are label-encoded.
- Mappings are stored in `laptop_price_spec_predictor/data/label_mappings.json` and consumed by the frontend.

### Models & API
- Trained models saved with `joblib` and loaded by the backend:
	- `final_model_spec.pkl`: predicts the specification score
	- `final_model_price.pkl`: predicts the price
- FastAPI app: `main.py`
	- `POST /predict/spec_score` → body: `{ "features": [gpuEncoded, screenSize, threads, ram, cores] }`
	- `POST /predict/price` → body: `{ "features": [gpuEncoded, threads, ram, cores] }`
- CORS allows requests from `http://localhost:3000` for local dev.

### Frontend (Next.js)
- Location: `laptop_price_spec_predictor/`
- UI at `app/page.tsx` collects inputs and shows results.
- By default, it returns mock predictions for a fast demo.
- Axios is installed and can be used to call the FastAPI endpoints.

## Run a Quick Demo (Windows)

### Option A — Frontend Only (mock predictions)
1. Open a terminal (PowerShell) in the project root.
2. Run the frontend:

```powershell
cd .\laptop_price_spec_predictor
npm install
npm run dev
```

3. Visit http://localhost:3000 and experiment with the form.

### Option B — Backend API (real predictions)
1. Ensure the model files exist next to `main.py`: `final_model_spec.pkl`, `final_model_price.pkl`.
2. Activate the Python environment and install dependencies:

```powershell
.# if a venv is present in this repo
.\n+.
.
```

```powershell
.
```

3. Start the API server:

```powershell
uvicorn main:app --reload
```

4. Test endpoints with a tool like `curl` or Postman. Examples:

```powershell
# Spec score (features: [gpuEncoded, screenSize, threads, ram, cores])
curl -X POST http://127.0.0.1:8000/predict/spec_score ^
	-H "Content-Type: application/json" ^
	-d "{\"features\":[12,15.6,8,16,6]}"

# Price (features: [gpuEncoded, threads, ram, cores])
curl -X POST http://127.0.0.1:8000/predict/price ^
	-H "Content-Type: application/json" ^
	-d "{\"features\":[12,8,16,6]}"
```

### Option C — Wire Frontend to the API (optional)
If you want the UI to use the FastAPI predictions instead of mock values:

1. Ensure the backend is running on `http://127.0.0.1:8000`.
2. In `app/page.tsx`, replace the mock `setTimeout` with an Axios call like:

```ts
import axios from "axios";

// ... inside handlePredict(f)
const endpoint = activeTab === "spec"
	? "http://127.0.0.1:8000/predict/spec_score"
	: "http://127.0.0.1:8000/predict/price";

const { data } = await axios.post(endpoint, { features: f });
if (activeTab === "spec") {
	setSpecScore(String(data.spec_score));
} else {
	setPrice(String(data.price));
}
```

3. Keep CORS in `main.py` aligned with your frontend origin (default is `http://localhost:3000`).

## Troubleshooting
- Install missing Python runtime packages for the API:

```powershell
pip install fastapi uvicorn joblib pydantic
```

- Common PowerShell quoting: use `^` for line continuation.
- If models are missing, train and export them (notebook or script) to `final_model_spec.pkl` and `final_model_price.pkl` before running the backend.

## Repository Structure

```
EDA.ipynb
main.py
requirements.txt
data/
	laptop.csv
	laptop_cleaned.csv
laptop_price_spec_predictor/
	app/page.tsx
	data/label_mappings.json
	package.json
	next.config.ts
```

