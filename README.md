# 📚 Vokabeltrainer - Interactive Vocabulary Learning App

A lightweight, client-side vocabulary training application designed for German language learners. Built specifically for students using the **Découvertes 1–5** (French-German), **Green Line 2–6** (German-English) and **Encuentros hoy 1** (Spanish-German) textbooks from the Bavarian curriculum.

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## 🌟 Features

### 📖 Eleven Books Supported
- **French ⟷ German** (Découvertes 1–5 - Bayern)
- **German ⟷ English** (Green Line 2–6 - Bayern)
- **Spanish ⟷ German** (Encuentros hoy 1)

### 🎯 Learning Tools
- **Bidirectional Practice**: Learn in both translation directions
- **Smart Repetition**: Automatically repeats missed words until mastered
- **Adaptive Quizzes**: Words you miss are queued for review
- **Progress Tracking**: Real-time progress bar and statistics
- **Audio Feedback**: 47 different success sounds for engagement

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Special Character Keyboard**: Easy input for accented characters (é, ä, ç, ß, etc.)
- **Multiple Quiz Modes**:
  - Sequential or random order
  - Filter by lesson and module
  - Choose translation direction
- **Dark Mode**: Automatic theme switching based on system preferences
- **Offline Support**: PWA with Service Worker for offline learning

### ♿ Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly with ARIA labels
- High contrast color schemes

## 🚀 Demo

Visit the live application: [https://lacomax.github.io](https://lacomax.github.io)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with multilingual support
- **CSS3**: Modern responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **JSON**: Structured vocabulary data storage
- **PWA**: Progressive Web App with offline capabilities
- **Service Worker**: Caching strategy for offline support

## 📦 Installation

### Use Online (Recommended)
Simply visit [https://lacomax.github.io](https://lacomax.github.io)

### Install as PWA
1. Visit the site in a modern browser (Chrome, Edge, Safari)
2. Click the "Install" button in the address bar
3. The app will be installed as a native application

### Run Locally
```bash
# Clone the repository
git clone https://github.com/Lacomax/Lacomax.github.io.git

# Navigate to the directory
cd Lacomax.github.io

# Serve with any static server, for example:
python -m http.server 8000
# or
npx serve

# Open browser at http://localhost:8000
```

## 📚 Usage Instructions

### Getting Started
1. **Select a Book**: Découvertes 1–5 (FR-DE … FR-DE-5), Green Line 2–6 (DE-EN … DE-EN-6) or Encuentros hoy 1 (ES-DE)
2. **Choose Lesson**: Select a specific lesson or "All" to practice everything
3. **Pick Module** (optional): Focus on specific topics within lessons
4. **Set Direction**: Choose translation direction or "Both" for bidirectional practice
5. **Random Order**: Toggle to practice words in random or sequential order
6. **Start**: Click "Commencer" (FR) or "Start" (EN) to begin

### During Quiz
- Type your answer in the input field
- Use special character buttons for accented letters
- Press **Enter** or click **Valider/Check** to submit
- ✅ Correct answers: Progress bar advances, word is marked complete
- ❌ Incorrect answers: See the correct answer and example sentence, word will be repeated

### After Quiz
- View your statistics and performance
- See which words needed the most attempts
- Click "Réessayer/Try again" to restart with the same or different settings

### Keyboard Shortcuts
- **Enter**: Submit answer
- **Special Character Buttons**: Click to insert é, ä, ç, ß, etc.
- **Tab**: Navigate between inputs and buttons

## 📊 Data Structure

Vocabulary data is stored in JSON format:

```json
{
  "lesson": "Au début",
  "module": "Bienvenue",
  "french": "Bonjour",
  "german": "Guten Tag",
  "example": "Bonjour! Comment allez-vous?",
  "phonetic": ""
}
```

- **Multiple Answers**: Separate alternatives with semicolons (`;`)
- **Example Sentences**: Provide context for better learning
- **Phonetics**: IPA transcriptions for English words (Green Line 2)

## 🗂️ Project Structure

```
Lacomax.github.io/
├── index.html                          # Main HTML structure (single page)
├── manifest.json                       # PWA manifest
├── sw.js                               # Service Worker (bump CACHE_VERSION when deploying)
├── package.json                        # npm scripts + dev dependencies
├── css/
│   └── styles.css                      # Styling and themes
├── js/
│   └── script.js                       # Application logic (CONFIG, TRANSLATIONS, quiz flow)
├── vocabulary/
│   ├── decouvertes-1-bayern.json       # French-German (Découvertes 1) ... decouvertes-5-bayern.json
│   ├── greenline-2-bayern.json         # German-English (Green Line 2) ... greenline-6-bayern.json
│   └── encuentros-hoy-1.json           # Spanish-German (Encuentros hoy 1)
├── audio/
│   └── correct/                        # correct01.mp3 ... correct47.mp3
├── images/
│   ├── favicon.ico                     # Browser icon
│   └── flags/                          # france.png, germany.png, spain.png, uk.png
├── icons/
│   ├── ios/                            # Icons referenced by manifest.json and index.html
│   ├── android/                        # Additional generated icon sets
│   ├── windows11/
│   ├── icons.json
│   └── README.md
├── tests/
│   └── vocab.test.js                   # Unit tests (custom runner, no Jest)
├── .eslintrc.json
├── .prettierrc.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🧪 Development

### Prerequisites
- Modern web browser with ES6+ support
- Text editor or IDE
- (Optional) Node.js for development tools

### Setup Development Environment
```bash
# Install development dependencies (optional)
npm install

# Run linter
npm run lint

# Run tests
npm test

# Format code
npm run format
```

### Code Quality
- **ESLint**: Enforces code style and catches common errors
- **Prettier**: Automatic code formatting
- **JSDoc**: Documentation for all functions
- **Tests**: Unit tests for core functionality

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style (use ESLint and Prettier)
- Add tests for new features
- Update documentation as needed
- Ensure accessibility standards are maintained

## 📝 License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lacomax**
- GitHub: [@Lacomax](https://github.com/Lacomax)

## 🙏 Acknowledgments

- Vocabulary data based on the **Découvertes 1–5** and **Green Line 2–6** textbooks (Klett Verlag) and **Encuentros hoy 1** (Cornelsen)
- Success sound effects for positive reinforcement
- Inspired by modern language learning platforms

## 📞 Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/Lacomax/Lacomax.github.io/issues)
- Check existing issues for solutions
- Contact via GitHub

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Additional textbook support
- [ ] Custom vocabulary lists
- [ ] Spaced repetition algorithm (SRS)
- [ ] Voice recognition for pronunciation practice
- [ ] Multiplayer quiz mode
- [ ] Export/import progress data
- [ ] Gamification with achievements

## 📈 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

## 📱 Mobile Support

Fully responsive and tested on:
- iOS Safari (14+)
- Android Chrome (90+)
- Mobile Firefox (88+)

---

**Happy Learning! Viel Erfolg! Bonne chance!** 🎓
