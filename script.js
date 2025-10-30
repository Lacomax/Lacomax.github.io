/**
 * Vokabeltrainer - Interactive Vocabulary Learning Application
 * @author Lacomax
 * @license GPL-2.0
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONFIG = {
    CORRECT_ANSWER_DELAY_MS: 2000,
    TOTAL_CORRECT_SOUNDS: 25,
    AUDIO_PATH: 'correct_mp3/',
    JSON_FILES: {
        'FR-DE': './vocabD1B.json',
        'DE-EN': './vocabGL2B.json'
    },
    STORAGE_KEY: 'vokabeltrainer_progress'
};

// ============================================================================
// TRANSLATIONS / i18n
// ============================================================================

const TRANSLATIONS = {
    'FR-DE': {
        selectLesson: 'Sélectionnez la leçon:',
        selectModule: 'Sélectionnez le module:',
        direction: 'Direction de pratique:',
        directionBoth: 'Les deux',
        directionForward: 'FR → DE',
        directionBackward: 'DE → FR',
        randomOrder: 'Ordre aléatoire',
        start: 'Commencer',
        check: 'Valider',
        correctFR: 'Très bien!',
        correctDE: 'Richtig!',
        incorrect: 'Oops!',
        noWords: 'Aucun mot trouvé.',
        placeholderDE: 'Deine antwort...',
        placeholderFR: 'Votre réponse...',
        statsTitle: 'Statistiques',
        mostRepeated: 'Mots les plus répétés:',
        restart: 'Réessayer',
        statsSummary: (correct, total, avg) =>
            `Vous avez répondu correctement à ${correct} mots sur ${total}. Tentatives moyennes par mot: ${avg}.`,
        attempts: 'tentatives',
        errorLoading: 'Erreur de chargement des données. Veuillez réessayer.',
        flag1: { src: 'flag_france.png', alt: 'Drapeau français' },
        flag2: { src: 'flag_germany.png', alt: 'Flagge Deutschlands' },
        bannerFlag: { src: 'flag_france.png', alt: 'Drapeau français' }
    },
    'DE-EN': {
        selectLesson: 'Select Lesson:',
        selectModule: 'Select Module:',
        direction: 'Direction:',
        directionBoth: 'Both',
        directionForward: 'DE → EN',
        directionBackward: 'EN → DE',
        randomOrder: 'Random order',
        start: 'Start',
        check: 'Check',
        correctDE: 'Richtig!',
        correctEN: 'Good job!',
        incorrect: 'Oops!',
        noWords: 'No words found.',
        placeholderDE: 'Deine antwort...',
        placeholderEN: 'Your answer...',
        statsTitle: 'Statistics',
        mostRepeated: 'Most repeated words:',
        restart: 'Try again',
        statsSummary: (correct, total, avg) =>
            `You answered correctly ${correct} out of ${total} words. Average attempts per word: ${avg}.`,
        attempts: 'attempts',
        errorLoading: 'Error loading data. Please try again.',
        flag1: { src: 'flag_germany.png', alt: 'German flag' },
        flag2: { src: 'flag_uk.png', alt: 'UK flag' },
        bannerFlag: { src: 'flag_uk.png', alt: 'UK flag' }
    }
};

// ============================================================================
// APPLICATION STATE
// ============================================================================

const AppState = {
    vocabData: [],
    filteredWords: [],
    currentWords: [],
    currentIndex: 0,
    direction: 'BOTH',
    isRandom: true,
    missedWords: [],
    attemptCounts: {},
    correctCount: 0,
    totalCount: 0,
    answeredWords: {},
    bookSelected: '',
    isProcessingAnswer: false,
    audioCache: new Map()
};

// ============================================================================
// DOM ELEMENTS CACHE
// ============================================================================

const DOM = {
    bookSelect: document.getElementById('bookSelect'),
    lessonLabel: document.getElementById('lessonLabel'),
    moduleLabel: document.getElementById('moduleLabel'),
    directionLabel: document.getElementById('directionLabel'),
    lessonSelect: document.getElementById('lessonSelect'),
    moduleSelect: document.getElementById('moduleSelect'),
    directionSelect: document.getElementById('directionSelect'),
    randomOrderCheckbox: document.getElementById('randomOrder'),
    orderContainer: document.getElementById('orderContainer'),
    orderLabel: document.getElementById('orderLabel'),
    startBtn: document.getElementById('startBtn'),
    quizPanel: document.querySelector('.quiz-panel'),
    setupPanel: document.querySelector('.setup-panel'),
    statsPanel: document.querySelector('.stats-panel'),
    questionText: document.getElementById('questionText'),
    answerInput: document.getElementById('answerInput'),
    checkAnswerBtn: document.getElementById('checkAnswerBtn'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    exampleSentence: document.getElementById('exampleSentence'),
    progressBar: document.getElementById('progressBar'),
    progressInfo: document.getElementById('progressInfo'),
    progressContainer: document.querySelector('.progress-container'),
    statsSummary: document.getElementById('statsSummary'),
    statsTitle: document.getElementById('statsTitle'),
    mostRepeatedTitle: document.getElementById('mostRepeatedTitle'),
    mostRepeatedList: document.getElementById('mostRepeatedList'),
    restartBtn: document.getElementById('restartBtn'),
    keyboard: document.querySelector('.keyboard'),
    bannerTitle: document.getElementById('bannerTitle'),
    flag1: document.getElementById('flag1'),
    flag2: document.getElementById('flag2'),
    bannerContent: document.getElementById('bannerContent')
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Shuffles array in place using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Shows loading overlay
 */
function showLoading() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading"></div>';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

/**
 * Hides loading overlay
 */
function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Saves current progress to localStorage
 */
function saveProgress() {
    try {
        const progress = {
            bookSelected: AppState.bookSelected,
            attemptCounts: AppState.attemptCounts,
            timestamp: Date.now()
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

/**
 * Loads progress from localStorage
 */
function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const progress = JSON.parse(saved);
            // Only restore if less than 24 hours old
            if (Date.now() - progress.timestamp < 86400000) {
                return progress;
            }
        }
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
    return null;
}

/**
 * Gets translation text for current book
 * @param {string} key - Translation key
 * @returns {*} Translation value
 */
function t(key) {
    const translations = TRANSLATIONS[AppState.bookSelected];
    return translations ? translations[key] : key;
}

/**
 * Sanitizes HTML to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// AUDIO MANAGEMENT
// ============================================================================

/**
 * Preloads correct answer audio files
 */
function preloadAudio() {
    for (let i = 1; i <= CONFIG.TOTAL_CORRECT_SOUNDS; i++) {
        const formattedNumber = i < 10 ? `0${i}` : `${i}`;
        const soundFile = `correct${formattedNumber}.mp3`;
        const audio = new Audio(`${CONFIG.AUDIO_PATH}${soundFile}`);
        audio.preload = 'auto';
        AppState.audioCache.set(i, audio);
    }
}

/**
 * Plays a random correct answer sound
 */
function playRandomCorrectSound() {
    try {
        const randomNumber = Math.floor(Math.random() * CONFIG.TOTAL_CORRECT_SOUNDS) + 1;
        const audio = AppState.audioCache.get(randomNumber);

        if (audio) {
            // Clone the audio to allow overlapping plays
            const clone = audio.cloneNode();
            clone.play().catch(error => {
                console.warn('Audio playback failed:', error);
            });
        }
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// ============================================================================
// UI MANAGEMENT
// ============================================================================

/**
 * Hides all filter elements
 */
function hideFilters() {
    DOM.lessonLabel.style.display = 'none';
    DOM.moduleLabel.style.display = 'none';
    DOM.directionLabel.style.display = 'none';
    DOM.directionSelect.style.display = 'none';
    DOM.lessonSelect.style.display = 'none';
    DOM.moduleSelect.style.display = 'none';
    DOM.orderContainer.style.display = 'none';
    DOM.startBtn.style.display = 'none';
    DOM.flag1.style.display = 'none';
    DOM.flag2.style.display = 'none';
}

/**
 * Sets up UI based on selected book
 */
function setupUIForBook() {
    const trans = TRANSLATIONS[AppState.bookSelected];

    // Update labels
    DOM.lessonLabel.textContent = trans.selectLesson;
    DOM.moduleLabel.textContent = trans.selectModule;
    DOM.directionLabel.textContent = trans.direction;

    // Update direction options
    DOM.directionSelect.innerHTML = `
        <option value="BOTH">${trans.directionBoth}</option>
        <option value="FORWARD">${trans.directionForward}</option>
        <option value="BACKWARD">${trans.directionBackward}</option>
    `;

    // Update order label with new checkbox
    DOM.orderLabel.innerHTML = `
        <input type="checkbox" id="randomOrder" checked aria-label="${trans.randomOrder}" />
        ${trans.randomOrder}
    `;

    // Re-assign checkbox reference after innerHTML change
    AppState.randomOrderCheckbox = document.getElementById('randomOrder');

    // Update flags
    DOM.flag1.src = trans.flag1.src;
    DOM.flag1.alt = trans.flag1.alt;
    DOM.flag2.src = trans.flag2.src;
    DOM.flag2.alt = trans.flag2.alt;

    // Update button texts
    DOM.startBtn.textContent = trans.start;
    DOM.checkAnswerBtn.textContent = trans.check;
    DOM.statsTitle.textContent = trans.statsTitle;
    DOM.mostRepeatedTitle.textContent = trans.mostRepeated;
    DOM.restartBtn.textContent = trans.restart;

    // Show UI elements
    DOM.flag1.style.display = 'inline';
    DOM.flag2.style.display = 'inline';
    DOM.lessonLabel.style.display = 'block';
    DOM.moduleLabel.style.display = 'block';
    DOM.directionLabel.style.display = 'block';
    DOM.directionSelect.style.display = 'block';
    DOM.lessonSelect.style.display = 'block';
    DOM.moduleSelect.style.display = 'block';
    DOM.orderContainer.style.display = 'block';
    DOM.startBtn.style.display = 'block';
}

/**
 * Populates lesson filter dropdown
 * @param {Array} data - Vocabulary data
 */
function populateLessonFilter(data) {
    while (DOM.lessonSelect.options.length > 1) {
        DOM.lessonSelect.remove(1);
    }
    const lessons = [...new Set(data.map(item => item.lesson))];
    lessons.forEach(lesson => {
        const opt = document.createElement('option');
        opt.value = lesson;
        opt.textContent = lesson;
        DOM.lessonSelect.appendChild(opt);
    });
}

/**
 * Populates module filter dropdown
 * @param {Array} data - Vocabulary data
 * @param {string} selectedLesson - Currently selected lesson
 */
function populateModuleFilter(data, selectedLesson = 'all') {
    while (DOM.moduleSelect.options.length > 1) {
        DOM.moduleSelect.remove(1);
    }

    let modules;
    if (selectedLesson === 'all') {
        modules = [...new Set(data.map(item => item.module))];
    } else {
        modules = [...new Set(
            data.filter(d => d.lesson === selectedLesson)
                .map(item => item.module)
        )];
    }

    modules.forEach(mod => {
        const opt = document.createElement('option');
        opt.value = mod;
        opt.textContent = mod;
        DOM.moduleSelect.appendChild(opt);
    });
}

/**
 * Updates progress bar and info
 */
function updateProgress() {
    DOM.progressInfo.textContent = `${AppState.correctCount}/${AppState.totalCount}`;
    const percentage = (AppState.correctCount / AppState.totalCount) * 100;
    DOM.progressBar.style.width = percentage + '%';

    // Update ARIA attribute for screen readers
    DOM.progressContainer.setAttribute('aria-valuenow', Math.round(percentage));
}

/**
 * Updates answer input placeholder based on current question
 * @param {Object} wordData - Current word data
 * @param {string} displayedWord - Currently displayed word
 */
function updatePlaceholder(wordData, displayedWord) {
    if (AppState.bookSelected === 'FR-DE') {
        if (displayedWord === wordData.french) {
            DOM.answerInput.placeholder = t('placeholderDE');
        } else {
            DOM.answerInput.placeholder = t('placeholderFR');
        }
    } else {
        if (displayedWord === wordData.german) {
            DOM.answerInput.placeholder = t('placeholderEN');
        } else {
            DOM.answerInput.placeholder = t('placeholderDE');
        }
    }
}

// ============================================================================
// QUIZ LOGIC
// ============================================================================

/**
 * Chooses which word to display based on direction
 * @param {Object} wordData - Vocabulary item
 * @returns {string} Word to display
 */
function chooseDisplayWord(wordData) {
    if (AppState.bookSelected === 'FR-DE') {
        if (AppState.direction === 'FORWARD') return wordData.french;
        if (AppState.direction === 'BACKWARD') return wordData.german;
        return Math.random() < 0.5 ? wordData.french : wordData.german;
    } else {
        if (AppState.direction === 'FORWARD') return wordData.german;
        if (AppState.direction === 'BACKWARD') return wordData.english;
        return Math.random() < 0.5 ? wordData.german : wordData.english;
    }
}

/**
 * Gets correct answers for current word
 * @param {Object} wordData - Current word data
 * @returns {Object} Correct answers array and question language
 */
function getCorrectAnswers(wordData) {
    let correctAnswerArr;
    let questionLanguage;

    if (AppState.bookSelected === 'FR-DE') {
        if (DOM.questionText.textContent === wordData.french) {
            correctAnswerArr = wordData.german.split(';').map(s => s.trim());
            questionLanguage = 'FR->DE';
        } else {
            correctAnswerArr = wordData.french.split(';').map(s => s.trim());
            questionLanguage = 'DE->FR';
        }
    } else {
        if (DOM.questionText.textContent === wordData.german) {
            correctAnswerArr = wordData.english.split(';').map(s => s.trim());
            questionLanguage = 'DE->EN';
        } else {
            correctAnswerArr = wordData.german.split(';').map(s => s.trim());
            questionLanguage = 'EN->DE';
        }
    }

    return { correctAnswers: correctAnswerArr, questionLanguage };
}

/**
 * Generates unique key for a word pair
 * @param {Object} wordData - Vocabulary item
 * @returns {string} Unique key
 */
function getKeyForWord(wordData) {
    if (AppState.bookSelected === 'FR-DE') {
        return `${wordData.french}|${wordData.german}`;
    } else {
        return `${wordData.german}|${wordData.english}`;
    }
}

/**
 * Starts the quiz
 */
function startQuiz() {
    AppState.currentIndex = 0;
    AppState.missedWords = [];
    AppState.attemptCounts = {};
    AppState.correctCount = 0;
    AppState.totalCount = AppState.filteredWords.length;
    AppState.answeredWords = {};
    AppState.isProcessingAnswer = false;

    AppState.currentWords = AppState.filteredWords.slice();
    if (AppState.isRandom) {
        shuffleArray(AppState.currentWords);
    }

    updateProgress();
    showNextWord();
}

/**
 * Shows the next word in the quiz
 */
function showNextWord() {
    if (AppState.currentIndex >= AppState.currentWords.length) {
        if (AppState.missedWords.length > 0) {
            AppState.currentWords = AppState.missedWords;
            AppState.missedWords = [];
            AppState.currentIndex = 0;
            if (AppState.isRandom) shuffleArray(AppState.currentWords);
            showNextWord();
        } else {
            showStats();
        }
        return;
    }

    const wordData = AppState.currentWords[AppState.currentIndex];
    const displayWord = chooseDisplayWord(wordData);

    DOM.questionText.textContent = displayWord;
    DOM.feedbackMessage.textContent = '';
    DOM.feedbackMessage.className = 'feedback';
    DOM.exampleSentence.textContent = '';

    updatePlaceholder(wordData, displayWord);

    DOM.answerInput.value = '';
    DOM.answerInput.disabled = false;
    DOM.checkAnswerBtn.disabled = false;
    DOM.answerInput.focus();

    AppState.isProcessingAnswer = false;
}

/**
 * Checks the user's answer
 */
function checkAnswer() {
    if (AppState.isProcessingAnswer) return;

    const userAnswer = DOM.answerInput.value.trim();
    if (!userAnswer) return;

    const wordData = AppState.currentWords[AppState.currentIndex];
    const { correctAnswers, questionLanguage } = getCorrectAnswers(wordData);

    const key = getKeyForWord(wordData);
    AppState.attemptCounts[key] = (AppState.attemptCounts[key] || 0) + 1;

    if (correctAnswers.includes(userAnswer)) {
        handleCorrectAnswer(questionLanguage, key);
    } else {
        handleIncorrectAnswer(correctAnswers, wordData);
    }

    saveProgress();
}

/**
 * Handles correct answer
 * @param {string} questionLanguage - Direction of question
 * @param {string} key - Word key
 */
function handleCorrectAnswer(questionLanguage, key) {
    playRandomCorrectSound();

    DOM.feedbackMessage.className = 'feedback success';

    // Set correct feedback based on question direction
    if (AppState.bookSelected === 'FR-DE') {
        DOM.feedbackMessage.textContent = questionLanguage === 'FR->DE'
            ? t('correctDE')
            : t('correctFR');
    } else {
        DOM.feedbackMessage.textContent = questionLanguage === 'DE->EN'
            ? t('correctEN')
            : t('correctDE');
    }

    AppState.correctCount++;
    AppState.answeredWords[key] = (AppState.answeredWords[key] || 0) + 1;

    updateProgress();

    // Disable input and button temporarily
    DOM.answerInput.disabled = true;
    DOM.checkAnswerBtn.disabled = true;
    AppState.isProcessingAnswer = true;

    setTimeout(() => {
        AppState.currentIndex++;
        showNextWord();
    }, CONFIG.CORRECT_ANSWER_DELAY_MS);
}

/**
 * Handles incorrect answer
 * @param {Array} correctAnswers - Array of correct answers
 * @param {Object} wordData - Current word data
 */
function handleIncorrectAnswer(correctAnswers, wordData) {
    DOM.feedbackMessage.className = 'feedback error';
    DOM.feedbackMessage.textContent = t('incorrect');

    const correctStr = correctAnswers.join(' ; ');

    // Fix XSS vulnerability: use textContent instead of innerHTML
    const correctDiv = document.createElement('div');
    correctDiv.style.fontWeight = 'bold';
    correctDiv.style.fontSize = '2em';
    correctDiv.style.marginTop = '20px';
    correctDiv.textContent = correctStr;

    const exampleDiv = document.createElement('div');
    exampleDiv.textContent = wordData.example || '';

    DOM.exampleSentence.textContent = '';
    DOM.exampleSentence.appendChild(correctDiv);
    DOM.exampleSentence.appendChild(exampleDiv);

    if (!AppState.missedWords.includes(wordData)) {
        AppState.missedWords.push(wordData);
    }

    // Disable input and button, enable on next click
    DOM.answerInput.disabled = true;
    DOM.checkAnswerBtn.disabled = true;
    AppState.isProcessingAnswer = true;

    // Change button text to indicate next action
    const originalText = DOM.checkAnswerBtn.textContent;
    DOM.checkAnswerBtn.textContent = '→';

    // Set up one-time click handler for next word
    const nextHandler = () => {
        DOM.checkAnswerBtn.textContent = originalText;
        DOM.checkAnswerBtn.removeEventListener('click', nextHandler);
        DOM.answerInput.removeEventListener('keyup', nextKeyHandler);
        AppState.currentIndex++;
        showNextWord();
    };

    const nextKeyHandler = (e) => {
        if (e.key === 'Enter') {
            nextHandler();
        }
    };

    DOM.checkAnswerBtn.addEventListener('click', nextHandler);
    DOM.answerInput.addEventListener('keyup', nextKeyHandler);

    // Re-enable inputs for navigation
    DOM.answerInput.disabled = false;
    DOM.checkAnswerBtn.disabled = false;
    DOM.answerInput.focus();
}

/**
 * Shows statistics after quiz completion
 */
function showStats() {
    DOM.quizPanel.style.display = 'none';
    DOM.statsPanel.style.display = 'block';

    const totalAttempts = Object.values(AppState.attemptCounts).reduce((a, b) => a + b, 0);
    const averageAttempts = (totalAttempts / AppState.totalCount).toFixed(2);

    DOM.statsSummary.textContent = t('statsSummary')(
        AppState.correctCount,
        AppState.totalCount,
        averageAttempts
    );

    const entries = Object.entries(AppState.attemptCounts)
        .sort((a, b) => b[1] - a[1]);

    DOM.mostRepeatedList.innerHTML = '';
    entries.slice(0, 5).forEach(([key, val]) => {
        const parts = key.split('|');
        const li = document.createElement('li');
        li.textContent = `${parts[0]} - ${parts[1]} : ${val} ${t('attempts')}`;
        DOM.mostRepeatedList.appendChild(li);
    });
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handles book selection change
 */
DOM.bookSelect.addEventListener('change', () => {
    AppState.bookSelected = DOM.bookSelect.value;

    if (!AppState.bookSelected) {
        hideFilters();
        return;
    }

    showLoading();

    const jsonFile = CONFIG.JSON_FILES[AppState.bookSelected];

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            AppState.vocabData = data;
            setupUIForBook();
            populateLessonFilter(data);
            populateModuleFilter(data, 'all');
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading vocabulary:', error);
            hideLoading();
            alert(TRANSLATIONS[AppState.bookSelected]?.errorLoading ||
                  'Error loading data. Please try again.');
        });
});

/**
 * Handles lesson selection change
 */
DOM.lessonSelect.addEventListener('change', () => {
    populateModuleFilter(AppState.vocabData, DOM.lessonSelect.value);
});

/**
 * Handles start button click
 */
DOM.startBtn.addEventListener('click', () => {
    // Map old direction values to new ones
    const directionValue = DOM.directionSelect.value;
    AppState.direction = directionValue;

    // Get checkbox value (re-query in case it was recreated)
    const randomCheckbox = document.getElementById('randomOrder');
    AppState.isRandom = randomCheckbox ? randomCheckbox.checked : true;

    const selectedLesson = DOM.lessonSelect.value;
    const selectedModule = DOM.moduleSelect.value;

    AppState.filteredWords = AppState.vocabData.filter(item => {
        return (selectedLesson === 'all' || item.lesson === selectedLesson) &&
               (selectedModule === 'all' || item.module === selectedModule);
    });

    if (AppState.filteredWords.length === 0) {
        alert(t('noWords'));
        return;
    }

    // Update banner
    DOM.bannerTitle.style.display = 'none';
    DOM.bannerContent.innerHTML = '';

    const bookName = DOM.bookSelect.options[DOM.bookSelect.selectedIndex].textContent;
    const lessonModuleLine = `${selectedLesson === 'all' ? 'All' : selectedLesson} | ${selectedModule === 'all' ? 'All' : selectedModule}`;

    const trans = TRANSLATIONS[AppState.bookSelected];
    const bannerFlag = trans.bannerFlag;

    const bookDiv = document.createElement('div');
    const bookBold = document.createElement('b');
    bookBold.textContent = bookName;
    bookDiv.appendChild(bookBold);

    const lessonModuleDiv = document.createElement('div');
    lessonModuleDiv.textContent = lessonModuleLine;

    const bannerImg = document.createElement('img');
    bannerImg.src = bannerFlag.src;
    bannerImg.alt = bannerFlag.alt;
    bannerImg.className = 'banner-flag';

    DOM.bannerContent.appendChild(bookDiv);
    DOM.bannerContent.appendChild(lessonModuleDiv);
    DOM.bannerContent.appendChild(bannerImg);

    DOM.setupPanel.style.display = 'none';
    DOM.quizPanel.style.display = 'block';
    DOM.statsPanel.style.display = 'none';

    startQuiz();
});

/**
 * Handles check answer button click
 */
DOM.checkAnswerBtn.addEventListener('click', () => {
    if (!AppState.isProcessingAnswer || DOM.checkAnswerBtn.textContent === '→') {
        checkAnswer();
    }
});

/**
 * Handles answer input keyup (Enter key)
 */
DOM.answerInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !AppState.isProcessingAnswer) {
        checkAnswer();
    }
});

/**
 * Handles special character keyboard clicks
 */
DOM.keyboard.addEventListener('click', (e) => {
    if (e.target.dataset.char) {
        const char = e.target.dataset.char;
        const cursorPos = DOM.answerInput.selectionStart;
        const currentValue = DOM.answerInput.value;

        DOM.answerInput.value =
            currentValue.substring(0, cursorPos) +
            char +
            currentValue.substring(cursorPos);

        // Move cursor after inserted character
        DOM.answerInput.selectionStart = DOM.answerInput.selectionEnd = cursorPos + 1;
        DOM.answerInput.focus();
    }
});

/**
 * Handles restart button click
 */
DOM.restartBtn.addEventListener('click', () => {
    DOM.statsPanel.style.display = 'none';
    DOM.setupPanel.style.display = 'block';
    DOM.bannerTitle.style.display = 'block';
    DOM.bannerTitle.textContent = 'Vokabeltrainer';
    DOM.bannerContent.innerHTML = '';
});

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function init() {
    // Preload audio files for better performance
    preloadAudio();

    // Load saved progress if available
    const savedProgress = loadProgress();
    if (savedProgress && savedProgress.bookSelected === AppState.bookSelected) {
        AppState.attemptCounts = savedProgress.attemptCounts || {};
    }

    console.log('Vokabeltrainer initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
