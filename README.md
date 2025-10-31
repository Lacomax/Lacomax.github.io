# 📚 Vokabeltrainer - Interactive Vocabulary Learning App

A lightweight, client-side vocabulary training application designed for German language learners. Built specifically for students using **Découvertes 1** (French-German) and **Green Line 2** (German-English) textbooks from the Bavarian curriculum.

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## 🌟 Features

### 📖 Dual Course Support
- **French ⟷ German** (Découvertes 1 - Bayern)
- **German ⟷ English** (Green Line 2 - Bayern)

### 🎯 Learning Tools
- **Bidirectional Practice**: Learn in both translation directions
- **Smart Repetition**: Automatically repeats missed words until mastered
- **Adaptive Quizzes**: Words you miss are queued for review
- **Progress Tracking**: Real-time progress bar and statistics
- **Audio Feedback**: 25 different success sounds for engagement

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

## 📸 Screenshots

### Setup Screen
Select your book, lesson, module, and practice direction:

![Setup Screen](docs/screenshot-setup.png)

### Quiz Interface
Practice with real-time feedback and example sentences:

![Quiz Interface](docs/screenshot-quiz.png)

### Statistics
Track your progress and identify words that need more practice:

![Statistics](docs/screenshot-stats.png)

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
1. **Select a Book**: Choose between "Découvertes 1 - Bayern" (FR-DE) or "Green Line 2 - Bayern" (DE-EN)
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
├── index.html              # Main HTML structure
├── script.js               # Application logic
├── styles.css              # Styling and themes
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── vocabD1B.json          # French-German vocabulary
├── vocabGL2B.json         # German-English vocabulary
├── correct_mp3/           # Success sound effects
├── icons/                 # PWA icons (multiple sizes)
├── flag_france.png        # French flag
├── flag_germany.png       # German flag
├── flag_uk.png            # UK flag
├── favicon.ico            # Browser icon
├── tests/                 # Test suite
│   └── vocab.test.js      # Unit tests
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
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

- Vocabulary data based on **Découvertes 1** and **Green Line 2** textbooks (Klett Verlag)
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
