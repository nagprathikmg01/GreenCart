# 🌿 GreenCart

> **AI-Powered Sustainable Shopping Assistant**
>
> *Shop Smarter. Live Greener.*

---

## 📖 Overview

**GreenCart** is an intelligent web application designed to bridge the gap between e-commerce and environmental responsibility. It empowers users to make sustainable purchasing decisions by providing real-time, AI-driven insights into product impact, carbon footprint savings, and eco-friendly alternatives.

By leveraging **Agentic AI** and **Retrieval-Augmented Generation (RAG)**, GreenCart transforms the shopping experience into an educational journey, helping users understand *why* their choices matter.

---

## 🌍 Problem Statement

In the modern consumer landscape:
- **Information Gap:** Shoppers often lack clear, accessible data on the environmental impact of their purchases.
- **Greenwashing:** Misleading claims make it difficult to identify genuinely sustainable products.
- **Complexity:** Understanding metrics like "Carbon Footprint" or "Water Usage" requires research that most users don't have time for.

GreenCart addresses these challenges by embedding sustainability intelligence directly into the discovery process, making eco-conscious living accessible to everyone.

---

## ✨ Key Features

- **🌱 Smart Product Analysis**: Instantly breaks down the environmental benefits of second-hand vs. new items (e.g., CO2 saved, water conserved).
- **💬 AI Sustainability Chat**: An interactive assistant that answers questions about recycling, SDGs, and green living habits.
- **🔍 Intent-Based Search**: Natural language search that understands context (e.g., *"Find me a zero-waste gift for a coffee lover"*).
- **📊 Real-Time Impact Metrics**: Visual indicators of how each purchase contributes to a healthier planet.
- **🎨 Modern, Responsive UI**: A premium, engaging interface built with glassmorphism and smooth animations.

---

## 🤖 AI Architecture & Features

GreenCart serves as a reference implementation for **AI for Good** applications.

> **Note**: The AI components in this project are *simulated* for educational and demonstration purposes. This ensures reliable, explainable, and safe responses without the need for external API dependencies during local runs.

### 1. Agentic Workflow
The system employs a simplified **Shopping Agent** that autonomously detects user intent:
- **Analyzer Agent**: Evaluates product metadata against sustainability criteria.
- **Search Agent**: Parses natural language queries to filter inventory.
- **Education Agent**: Handles general inquiries using the knowledge base.

### 2. Retrieval-Augmented Generation (RAG)
For educational queries (e.g., *"Why is fast fashion bad?"*), GreenCart uses a local RAG pipeline:
- **Retrieval**: Fetches relevant facts from a curated `Sustainability Knowledge Base`.
- **Generation**: Synthesizes these facts into a coherent, user-friendly response.

### 3. Transparent Prompting
To aid developers and learners, the application exposes the internal **Prompt Engineering** logic, showing exactly how raw data is framed for the AI model to generate consistent, ethical outputs.

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Icons**: Lucide React
- **Logic**: Custom JavaScript Simulation Engine (Agent/RAG Mocking)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v14+)
- **npm** or **yarn**
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/GreenCart.git
    cd GreenCart
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Explore**
    Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## ⚖️ Responsible AI & Ethics

GreenCart is built with a "Safety First" approach to AI:
- **No Hallucinations**: By relying on a fixed knowledge base for the RAG simulation, the system avoids inventing false environmental facts.
- **Privacy Preserving**: All processing happens locally; no user data is transmitted to external LLM providers.
- **Objective Recommendations**: The recommendation engine uses transparent, rule-based sustainability scoring to ensure fairness.

---

## 🔮 Future Enhancements

- [ ] Integration with live Carbon Footprint APIs (e.g., Climatiq).
- [ ] Real-time barcode scanning for physical product lookup.
- [ ] User profiles for tracking long-time impact streaks.
- [ ] Community marketplace features for peer-to-peer sharing.

---

## ⚠️ Disclaimer

This project is a **functional demonstration** created for educational purposes. The "AI" reasoning and carbon savings calculations are simulated to showcase the potential of agentic systems in sustainability. They should not be used for rigorous scientific auditing or commercial certification.

---
