# 🌿 GreenCart - AI-Powered Sustainable Shopping Assistant

> **"Shop Smarter, Live Greener."**
>
> *Empowering consumers to make eco-friendly choices through AI-driven insights.*

---

## 🎓 Internship Context

This project was developed as part of the **1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship**. 
It serves as a capstone project demonstrating how Artificial Intelligence can be leveraged to solve real-world sustainability challenges.

*Note: This is a learning-oriented, certificate-focused internship project, not a production-ready commercial application.*

---

## 🌍 The Problem

In today's fast-paced consumer world, **sustainable shopping is difficult**. 
- Consumers lack clear information about the environmental impact of their purchases.
- "Greenwashing" makes it hard to trust product claims.
- Finding verified eco-friendly alternatives is time-consuming.
- The connection between individual shopping habits and global climate change often feels abstract.

GreenCart solves this by bringing **transparency** and **AI-guided education** directly to the shopping experience, making sustainability actionable and easy.

---

## 🌱 SDG Alignment

This project directly aligns with the **United Nations Sustainable Development Goals (SDGs)**:

### 🎯 Primary Goal: SDG 12
**Responsible Consumption and Production**
By promoting second-hand goods, recycling, and informed purchasing decisions, GreenCart encourages a circular economy and reduces waste.

### 🍃 Secondary Goal: SDG 13
**Climate Action**
By quantifying Carbon Footprint savings (e.g., "50kg CO2 saved"), users are educated on the climate impact of extending a product's lifecycle.

---

## 💡 Solution Overview

**GreenCart** is a web-based "Sustainable Second-Hand Marketplace" simulation. It features an intelligent **Eco-Assistant** that helps users:
1.  **Analyze Products**: Instantly see the environmental benefits of buying used vs. new (CO2 saved, water saved).
2.  **Find Items**: Use natural language to search for products (e.g., *"I need a desk for my study"*).
3.  **Learn**: Ask questions about sustainability, recycling, and eco-habits.

The goal is to nudge user behavior towards more sustainable patterns through "Just-in-Time" education.

---

## 🤖 AI Features Explained

GreenCart leverages simplified **Agentic AI** concepts for educational purposes. 

> **Transparency Note**: The AI responses in this demo are *simulated* to demonstrate how such a system would function in the real world. This ensures a controlled, safe, and consistent learning environment without requiring live API keys for every user.

### 1. 🧠 Prompt Engineering (Simulated)
The system demonstrates how structured prompts are sent to an LLM.
- **Feature**: When a user analyzes a product, the "hidden mechanism" shows the prompt used (e.g., *"Act as an environmental scientist..."*).
- **Goal**: Teaches users how to craft effective prompts for AI.

### 2. 🕵️ Agentic AI (Intent Recognition)
The **Shopping Agent** intelligently determines what the user wants:
- **Analyze**: *"Is this couch eco-friendly?"* → Triggers the Sustainability Analyzer.
- **Search**: *"Find me a bamboo toothbrush"* → Triggers the Product Search.
- **Chat**: *"What is SDG 12?"* → Triggers the Educational Chat.

### 3. 📚 Retrieval-Augmented Generation (RAG)
For general questions, the system simulates a RAG pipeline:
- **Retrieval**: Searches a local "Sustainability Knowledge Base" for relevant context.
- **Generation**: Combines the user's question + retrieved context to formulate a helpful answer.

---

## 🎨 UI & UX Highlights

GreenCart is designed to be **visually engaging** and **modern**, proving that sustainability apps don't have to be boring.

- **✨ Glassmorphism & Gradients**: A premium, clean visual style inspired by nature.
- **🛸 Framer Motion Animations**: Smooth transitions, hover effects, and animated chat bubbles make the interface feel "alive."
- **📱 Responsive Design**: Fully optimized for desktop and tablet learning experiences.
- **⚡ Fast Performance**: Built with React and optimized assets.

---

## 🛠️ Tech Stack

### Frontend
- **React 18**: Core UI framework.
- **Tailwind CSS**: Utility-first styling for rapid, beautiful design.
- **Framer Motion**: For complex animations and micro-interactions.
- **Lucide React**: Modern, clean icon set.

### AI & Logic
- **Custom Simulation Engine**: Mimics latency, "reasoning" steps, and LLM token generation.
- **JavaScript (ES6+)**: Logic for the Agent and RAG systems.

---

## 📸 Screenshots

| **Home Page** | **Sustainability Chat** |
|:---:|:---:|
| ![Home Page](https://via.placeholder.com/600x350?text=Home+Page+Preview) | ![AI Chat](https://via.placeholder.com/600x350?text=Sustainability+Chat+Preview) |
| *Modern landing page with eco-products* | *Agentic AI answering user queries* |

| **Product Analysis** | **Mobile View** |
|:---:|:---:|
| ![Analysis](https://via.placeholder.com/600x350?text=Product+Eco-Analysis) | ![Mobile UI](https://via.placeholder.com/600x350?text=Mobile+Responsive+View) |
| *Detailed breakdown of environmental impact* | *Seamless experience on smaller screens* |

*(Note: Replace placeholders with actual project screenshots)*

---

## 🚀 How to Run the Project Locally

Follow these steps to explore GreenCart on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher) installed.
- [Git](https://git-scm.com/) installed.

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/GreenCart.git
    cd GreenCart
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm start
    ```

4.  **Open in Browser**
    Visit `http://localhost:3000` to see the app in action!

---

## ⚖️ Responsible AI Considerations

As an AI-focused project, we prioritize ethical considerations:
- **Privacy First**: No personal data is stored or sent to external servers in this demo.
- **Transparency**: The UI clearly labels AI-generated content (e.g., "AI Analysis").
- **No Hallucinations**: By using a restricted knowledge base (RAG Simulation), we prevent the AI from inventing false eco-facts.
- **Fairness**: The product recommendations treat all sustainable categories equally without bias.

---

## 🌟 Expected Impact

- **For Users**: Increased awareness of how small shopping choices affect the planet.
- **For Developers**: A template for building "AI for Good" applications using modern web tech.
- **For Society**: Promoting the values of SDG 12 (Responsible Consumption).

---

## ⚠️ Disclaimer

**This is an educational project.** 
The "AI" responses are simulated for demonstration purposes to showcase the *potential* of such a system. The carbon footprint calculations are estimates based on general sustainability data and should not be used for scientific auditing.

---
**Made with 💚 by a 1M1B Future Tech Leader.**
