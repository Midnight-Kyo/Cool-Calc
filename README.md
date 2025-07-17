# Cyberpunk Calculator

A sleek, cyberpunk-themed calculator built with React, TypeScript, and Vite. Features a glowing neon UI, animated display, sound effects, and both light/dark modes. Designed for desktop, with plans for future web/mobile expansion.

## ✨ Features
- Futuristic cyberpunk UI with neon glows and glassmorphism
- Responsive, animated calculator display with blinking cursor
- Fully functional: add, subtract, multiply, divide, decimals, clear, backspace
- Chained operations and error handling (e.g., divide by zero)
- Light/Dark mode toggle
- Subtle animated grid background
- Button sound effects

## 🚀 Tech Stack
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast development
- CSS for custom themes and animations

## 🖥️ Setup & Usage
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## 🛠️ Project Structure
- `src/` — All React components and styles
- `public/` — Static assets (add your own sound file here if desired)
- `App.tsx` — App entry point
- `Calculator.tsx` — Main calculator logic and state
- `Display.tsx` — Calculator display
- `ButtonPad.tsx` — Button grid
- `Button.tsx` — Individual button with sound

## 🎨 Credits
- **Font:** [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts)
- **Button Sound:** [Beep Ping by Mike Koenig](https://soundbible.com/1133-Beep-Ping.html) (Attribution 3.0)
- **UI Inspiration:** Cyberpunk/retro-futuristic design

## 📦 License
This project is open source and free to use for personal and educational purposes. See [LICENSE](LICENSE) for details.

---

Enjoy your cyberpunk calculator! 🚀

## 🚀 Deploying to GitHub Pages

1. Run `npm run build` to generate the production build in the `docs/` folder.
2. Commit and push the `docs/` folder to your repository.
3. In your repository settings on GitHub, set GitHub Pages to serve from the `/docs` folder.
4. Visit `https://<your-username>.github.io/Cool-Calc/` to see your deployed app.
