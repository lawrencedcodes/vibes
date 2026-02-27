<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
🚀 TechContent Multiplier
From Raw Code to Community-Ready Content in Seconds
TechContent Multiplier is a specialized developer advocacy tool designed to solve the "Context-Switching Tax." Originally prototyped in Google AI Studio, this application takes raw technical inputs—like GitHub READMEs, code snippets, or raw blog drafts—and transforms them into a cohesive distribution kit for LinkedIn, Discord, and Video.

✨ Features
Deep Technical Analysis: Automatically identifies key value propositions and performance gains (with special logic for the Java/Spring Boot ecosystem).

Multi-Channel Output: Generates a 3-part LinkedIn series, a technical TL;DR for Discord/Slack, and a structured "Getting Started" video script.

Developer-First UX: Clean, Material Design-inspired interface with one-click "Copy to Clipboard" functionality.

Gemini Powered: Built using the latest Google Gemini models via AI Studio for high-fidelity technical reasoning.

🛠️ Built With
Google AI Studio – Initial prompt engineering and UI scaffolding.

Gemini 1.5 Flash/Pro – The LLM engine driving the technical analysis.

JavaScript/Next.js – The frontend framework for the local exported app.

🚀 Getting Started
Prerequisites
A Google AI API Key. You can get one for free at aistudio.google.com.

Installation
Clone the repo:

Bash
git clone https://github.com/lawrencedcodes/vibes.git
cd vibes/techcontent-multiplier
Install dependencies:

Bash
npm install
Set up your Environment Variables:
Create a .env file in the root directory (refer to .env.example):

Code snippet
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
Run the app:

Bash
npm run dev
Open http://localhost:3000 in your browser.

📖 Usage
Input: Paste a link to a GitHub repo or a raw code snippet.

Process: The app analyzes the complexity and "Developer Soul" of the project.

Output: Use the generated tabs to grab your content for LinkedIn, Discord, or YouTube.

🤝 Contributing
This project started as an experiment in Google AI Studio. If you’d like to add new "Content Engines" (e.g., Twitter/X threads or Podcast outlines), feel free to fork this repo and submit a PR!

⚖️ License
Distributed under the MIT License. See LICENSE for more information.

----- Below are original instructions from Google AI Studio ------
# Run and deploy your AI Studio app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
