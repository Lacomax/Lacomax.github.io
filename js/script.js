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
    AUDIO_PATH: 'audio/correct/',
    JSON_FILES: {
        'FR-DE': './vocabulary/decouvertes-1-bayern.json',
        'FR-DE-2': './vocabulary/decouvertes-2-bayern.json',
        'DE-EN': './vocabulary/greenline-2-bayern.json',
        'DE-EN-3': './vocabulary/greenline-3-bayern.json'
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
        flag1: { src: 'images/flags/france.png', alt: 'Drapeau français' },
        flag2: { src: 'images/flags/germany.png', alt: 'Flagge Deutschlands' },
        bannerFlag: { src: 'images/flags/france.png', alt: 'Drapeau français' }
    },
    'FR-DE-2': {
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
        flag1: { src: 'images/flags/france.png', alt: 'Drapeau français' },
        flag2: { src: 'images/flags/germany.png', alt: 'Flagge Deutschlands' },
        bannerFlag: { src: 'images/flags/france.png', alt: 'Drapeau français' }
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
        flag1: { src: 'images/flags/germany.png', alt: 'German flag' },
        flag2: { src: 'images/flags/uk.png', alt: 'UK flag' },
        bannerFlag: { src: 'images/flags/uk.png', alt: 'UK flag' }
    },
    'DE-EN-3': {
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
        flag1: { src: 'images/flags/germany.png', alt: 'German flag' },
        flag2: { src: 'images/flags/uk.png', alt: 'UK flag' },
        bannerFlag: { src: 'images/flags/uk.png', alt: 'UK flag' }
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
    audioCache: new Map(),
    quizStartTime: 0,
    quizEndTime: 0,
    currentQuestionField: '',
    currentParsedAnswers: null
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
    bannerContent: document.getElementById('bannerContent'),
    questionPrefix: document.getElementById('questionPrefix'),
    questionSuffix: document.getElementById('questionSuffix'),
    answerPrefix: document.getElementById('answerPrefix'),
    answerSuffix: document.getElementById('answerSuffix')
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

// ============================================================================
// AUXILIARY TEXT PARSING
// ============================================================================

/**
 * Parses auxiliary grammatical text from a vocabulary term.
 * Returns { prefix, core, suffix } where core is the main word to type.
 * @param {string} text - The vocabulary term
 * @param {string} language - 'french', 'german', or 'english'
 * @returns {{ prefix: string, core: string, suffix: string }}
 */
function parseAuxiliaries(text, language) {
    if (!text) {
        return { prefix: '', core: '', suffix: '' };
    }

    let prefix = '';
    let core = text;
    let suffix = '';

    if (language === 'french') {
        // 1. Parenthesized annotations: (adv.), (adj.), (inv.), (fam.), (m.), (f.), (pl.)
        const annoMatch = core.match(/(\s+\((?:adv|adj|inv|fam|m|f|pl)\.\))+$/);
        if (annoMatch) {
            suffix = annoMatch[0].trim();
            core = core.slice(0, -annoMatch[0].length);
        }

        // 2. Parenthesized qn/qc: (de qc), (à qn), etc.
        const parenQnQcMatch = core.match(/\s+\((?:(?:de |à |avec |pour )?(?:faire )?(?:qn\/qc|qc\/qn|qn|qc))\)$/);
        if (parenQnQcMatch) {
            suffix = `${parenQnQcMatch[0].trim()} ${suffix}`.trim();
            core = core.slice(0, -parenQnQcMatch[0].length);
        }

        // 3. Bare qn/qc at end with optional preposition (loop for chained markers)
        let bareQnQcMatch;
        while ((bareQnQcMatch = core.match(/\s+((?:(?:de |à |avec |pour )?(?:faire )?)?(?:qn\/qc|qc\/qn|qn|qc))$/)) !== null) {
            suffix = `${bareQnQcMatch[1].trim()} ${suffix}`.trim();
            core = core.slice(0, -bareQnQcMatch[0].length);
        }

        // 4. Trailing ellipsis (only if no other ... in the text)
        const ellipsisCount = (core.match(/\.\.\./g) || []).length;
        if (ellipsisCount === 1) {
            const ellipsisMatch = core.match(/\s+(\.\.\.[?!]?)$/);
            if (ellipsisMatch) {
                suffix = `${ellipsisMatch[1].trim()} ${suffix}`.trim();
                core = core.slice(0, -ellipsisMatch[0].length);
            }
        }
    } else if (language === 'german') {
        // 1. sich + optional preposition + case markers
        const sichMatch = core.match(/^(sich(?:\s+(?:an|auf|für|mit|von|über|um|aus|vor|zu|bei|nach)\s+(?:(?:jdn|jdm|jmdn|jmdm|etw)\.(?:\/(?:jdn|jdm|jmdn|jmdm|etw)\.)?\s*))?)\s+/);
        if (sichMatch) {
            prefix = sichMatch[1].trim();
            core = core.slice(sichMatch[0].length);
        } else {
            // 2. Case markers without sich: jdn., jdm., etw., etc. with optional preposition
            const caseMatch = core.match(/^((?:(?:an|von|mit|für|bei|zu|über|auf|aus|nach)\s+)?(?:(?:jdn|jdm|jmdn|jmdm|etw)\.(?:\/(?:jdn|jdm|jmdn|jmdm|etw)\.)?\s*)+)\s*/);
            if (caseMatch) {
                prefix = caseMatch[1].trim();
                core = core.slice(caseMatch[0].length);
            }
        }
    } else if (language === 'english') {
        // 1. Parenthesized annotations: (AE), (infml), (+ -ing), etc.
        const parenMatch = core.match(/\s+\([^)]+\)$/);
        if (parenMatch) {
            suffix = parenMatch[0].trim();
            core = core.slice(0, -parenMatch[0].length);
        }

        // 2. sb/sth at end
        const sbSthMatch = core.match(/\s+((?:sb|sth)(?:\s+(?:to\s+(?:do\s+)?)?(?:sb|sth))*)$/);
        if (sbSthMatch) {
            suffix = `${sbSthMatch[1].trim()} ${suffix}`.trim();
            core = core.slice(0, -sbSthMatch[0].length);
        }
    }

    return { prefix, core: core.trim(), suffix };
}

/**
 * Parses all semicolon-separated answer alternatives.
 * @param {string} text - The full answer text with semicolons
 * @param {string} language - 'french', 'german', or 'english'
 * @returns {Array<{ prefix: string, core: string, suffix: string }>}
 */
function parseAllAnswers(text, language) {
    return text.split(';').map(s => parseAuxiliaries(s.trim(), language));
}

/**
 * Determines the answer field name based on book and question field.
 * @returns {string} 'french', 'german', or 'english'
 */
function getAnswerField() {
    const book = AppState.bookSelected;
    const qf = AppState.currentQuestionField;
    if (book === 'FR-DE' || book === 'FR-DE-2') {
        return qf === 'french' ? 'german' : 'french';
    }
    return qf === 'german' ? 'english' : 'german';
}

/**
 * Normalizes text for answer comparison.
 * Maps all apostrophe-like characters (curly quotes, backtick, acute accent,
 * modifier letter apostrophe, prime) to the ASCII straight apostrophe so the
 * quiz accepts answers regardless of which variant the user's keyboard yields.
 * @param {string} str
 * @returns {string}
 */
function normalizeAnswer(str) {
    return str.replace(/[‘’`´ʼ′]/g, "'");
}

/**
 * Finds common prefix/suffix across parsed answer alternatives.
 * @param {Array<{ prefix: string, core: string, suffix: string }>} parsed
 * @returns {{ commonPrefix: string, commonSuffix: string }}
 */
function findCommonAux(parsed) {
    if (parsed.length === 0) {
        return { commonPrefix: '', commonSuffix: '' };
    }
    const firstPrefix = parsed[0].prefix;
    const firstSuffix = parsed[0].suffix;
    const commonPrefix = parsed.every(p => p.prefix === firstPrefix) ? firstPrefix : '';
    const commonSuffix = parsed.every(p => p.suffix === firstSuffix) ? firstSuffix : '';
    return { commonPrefix, commonSuffix };
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
 * @param {Array|string} selectedLessons - Currently selected lessons (array for multiple selection)
 */
function populateModuleFilter(data, selectedLessons = 'all') {
    while (DOM.moduleSelect.options.length > 1) {
        DOM.moduleSelect.remove(1);
    }

    let modules;

    // Handle both single string and array of lessons
    if (selectedLessons === 'all' || (Array.isArray(selectedLessons) && selectedLessons.includes('all'))) {
        modules = [...new Set(data.map(item => item.module))];
    } else {
        // Convert to array if it's a single value
        const lessonsArray = Array.isArray(selectedLessons) ? selectedLessons : [selectedLessons];
        modules = [...new Set(
            data.filter(d => lessonsArray.includes(d.lesson))
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
    DOM.progressBar.style.width = `${percentage}%`;

    // Update ARIA attribute for screen readers
    DOM.progressContainer.setAttribute('aria-valuenow', Math.round(percentage));
}

/**
 * Updates answer input placeholder based on current question field
 */
function updatePlaceholder() {
    const qf = AppState.currentQuestionField;
    if (AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2') {
        DOM.answerInput.placeholder = qf === 'french' ? t('placeholderDE') : t('placeholderFR');
    } else {
        DOM.answerInput.placeholder = qf === 'german' ? t('placeholderEN') : t('placeholderDE');
    }
}

// ============================================================================
// QUIZ LOGIC
// ============================================================================

/**
 * Chooses which word to display based on direction.
 * Also sets AppState.currentQuestionField.
 * @param {Object} wordData - Vocabulary item
 * @returns {string} Word to display
 */
function chooseDisplayWord(wordData) {
    if (AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2') {
        if (AppState.direction === 'FORWARD') {
            AppState.currentQuestionField = 'french';
            return wordData.french;
        }
        if (AppState.direction === 'BACKWARD') {
            AppState.currentQuestionField = 'german';
            return wordData.german;
        }
        if (Math.random() < 0.5) {
            AppState.currentQuestionField = 'french';
            return wordData.french;
        }
        AppState.currentQuestionField = 'german';
        return wordData.german;
    } else {
        if (AppState.direction === 'FORWARD') {
            AppState.currentQuestionField = 'german';
            return wordData.german;
        }
        if (AppState.direction === 'BACKWARD') {
            AppState.currentQuestionField = 'english';
            return wordData.english;
        }
        if (Math.random() < 0.5) {
            AppState.currentQuestionField = 'german';
            return wordData.german;
        }
        AppState.currentQuestionField = 'english';
        return wordData.english;
    }
}

/**
 * Gets correct answers for current word using parsed cores.
 * @param {Object} wordData - Current word data
 * @returns {Object} Correct answers array and question language
 */
function getCorrectAnswers(wordData) {
    let questionLanguage;
    const qf = AppState.currentQuestionField;

    if (AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2') {
        questionLanguage = qf === 'french' ? 'FR->DE' : 'DE->FR';
    } else {
        questionLanguage = qf === 'german' ? 'DE->EN' : 'EN->DE';
    }

    const correctAnswerArr = AppState.currentParsedAnswers
        ? AppState.currentParsedAnswers.map(p => p.core)
        : wordData[getAnswerField()].split(';').map(s => s.trim());

    return { correctAnswers: correctAnswerArr, questionLanguage };
}

/**
 * Generates unique key for a word pair
 * @param {Object} wordData - Vocabulary item
 * @returns {string} Unique key
 */
function getKeyForWord(wordData) {
    if (AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2') {
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
    AppState.quizStartTime = Date.now();

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
            if (AppState.isRandom) {
                shuffleArray(AppState.currentWords);
            }
            showNextWord();
        } else {
            showStats();
        }
        return;
    }

    const wordData = AppState.currentWords[AppState.currentIndex];
    const displayWord = chooseDisplayWord(wordData);

    // Parse question auxiliary text
    const questionLang = AppState.currentQuestionField;
    const parsedQuestion = parseAuxiliaries(displayWord, questionLang);
    DOM.questionPrefix.textContent = parsedQuestion.prefix;
    DOM.questionText.textContent = parsedQuestion.core;
    DOM.questionSuffix.textContent = parsedQuestion.suffix;

    // Parse answer auxiliary text
    const answerField = getAnswerField();
    const answerText = wordData[answerField];
    const parsedAnswers = parseAllAnswers(answerText, answerField);
    AppState.currentParsedAnswers = parsedAnswers;

    // Show common prefix/suffix hints around the input
    const { commonPrefix, commonSuffix } = findCommonAux(parsedAnswers);
    DOM.answerPrefix.textContent = commonPrefix;
    DOM.answerSuffix.textContent = commonSuffix;

    DOM.feedbackMessage.textContent = '';
    DOM.feedbackMessage.className = 'feedback';
    DOM.exampleSentence.textContent = '';

    updatePlaceholder();

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
    if (AppState.isProcessingAnswer) {
        return;
    }

    const userAnswer = DOM.answerInput.value.trim();
    if (!userAnswer) {
        return;
    }

    const wordData = AppState.currentWords[AppState.currentIndex];
    const { correctAnswers, questionLanguage } = getCorrectAnswers(wordData);

    const key = getKeyForWord(wordData);
    AppState.attemptCounts[key] = (AppState.attemptCounts[key] || 0) + 1;

    const normalizedUser = normalizeAnswer(userAnswer);
    const isCorrect = correctAnswers.some(ans => normalizeAnswer(ans) === normalizedUser);
    if (isCorrect) {
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
    if (AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2') {
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

    // Build styled correct answer display using parsed auxiliaries
    const correctDiv = document.createElement('div');
    correctDiv.style.fontSize = '2em';
    correctDiv.style.marginTop = '20px';

    const parsed = AppState.currentParsedAnswers || [];
    parsed.forEach((p, i) => {
        if (i > 0) {
            const sep = document.createElement('span');
            sep.textContent = ' ; ';
            correctDiv.appendChild(sep);
        }
        if (p.prefix) {
            const prefixSpan = document.createElement('span');
            prefixSpan.className = 'correct-answer-aux';
            prefixSpan.textContent = `${p.prefix} `;
            correctDiv.appendChild(prefixSpan);
        }
        const coreSpan = document.createElement('span');
        coreSpan.className = 'correct-answer-core';
        coreSpan.textContent = p.core;
        correctDiv.appendChild(coreSpan);
        if (p.suffix) {
            const suffixSpan = document.createElement('span');
            suffixSpan.className = 'correct-answer-aux';
            suffixSpan.textContent = ` ${p.suffix}`;
            correctDiv.appendChild(suffixSpan);
        }
    });

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
    DOM.questionPrefix.textContent = '';
    DOM.questionSuffix.textContent = '';
    DOM.answerPrefix.textContent = '';
    DOM.answerSuffix.textContent = '';

    DOM.quizPanel.style.display = 'none';
    DOM.statsPanel.style.display = 'block';

    // Calculate time spent
    AppState.quizEndTime = Date.now();
    const timeSpentMs = AppState.quizEndTime - AppState.quizStartTime;
    const timeSpentSeconds = Math.floor(timeSpentMs / 1000);
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeFormatted = minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

    // Calculate statistics
    const totalAttempts = Object.values(AppState.attemptCounts).reduce((a, b) => a + b, 0);
    const averageAttempts = totalAttempts > 0 ? (totalAttempts / AppState.totalCount).toFixed(2) : '0.00';
    const accuracy = totalAttempts > 0 ? ((AppState.correctCount / totalAttempts) * 100).toFixed(1) : '100.0';
    const firstAttemptCorrect = Object.values(AppState.attemptCounts).filter(count => count === 1).length;
    // Calculate words per minute using total seconds (even if < 1 minute)
    const wordsPerMinute = timeSpentSeconds > 0 ? (AppState.correctCount / (timeSpentSeconds / 60)).toFixed(1) : '0.0';

    // Determine if French-German or German-English
    const isFrenchGerman = AppState.bookSelected === 'FR-DE' || AppState.bookSelected === 'FR-DE-2';

    // Build enhanced summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'stats-summary-enhanced';

    // Main stats
    const mainStatsHTML = `
        <div class="stat-grid">
            <div class="stat-box">
                <div class="stat-value">${AppState.correctCount}/${AppState.totalCount}</div>
                <div class="stat-label">${isFrenchGerman ? 'Mots complétés' : 'Words completed'}</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${timeFormatted}</div>
                <div class="stat-label">${isFrenchGerman ? 'Temps total' : 'Total time'}</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${accuracy}%</div>
                <div class="stat-label">${isFrenchGerman ? 'Précision' : 'Accuracy'}</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${averageAttempts}</div>
                <div class="stat-label">${isFrenchGerman ? 'Tentatives moy.' : 'Avg. attempts'}</div>
            </div>
        </div>
        <div class="stat-details">
            <p><strong>${isFrenchGerman ? '✓ Correct du premier coup' : '✓ First attempt correct'}:</strong> ${firstAttemptCorrect}/${AppState.totalCount}</p>
            <p><strong>${isFrenchGerman ? '⚡ Vitesse' : '⚡ Speed'}:</strong> ${wordsPerMinute} ${isFrenchGerman ? 'mots/min' : 'words/min'}</p>
            <p><strong>${isFrenchGerman ? '📊 Total de tentatives' : '📊 Total attempts'}:</strong> ${totalAttempts}</p>
        </div>
    `;

    summaryDiv.innerHTML = mainStatsHTML;
    DOM.statsSummary.innerHTML = '';
    DOM.statsSummary.appendChild(summaryDiv);

    // Most repeated words
    const entries = Object.entries(AppState.attemptCounts)
        .sort((a, b) => b[1] - a[1]);

    DOM.mostRepeatedList.innerHTML = '';

    if (entries.length > 0 && entries[0][1] > 1) {
        entries.slice(0, 5).forEach(([key, val]) => {
            if (val > 1) { // Only show words that needed more than 1 attempt
                const parts = key.split('|');
                const li = document.createElement('li');
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word-pair';
                wordSpan.textContent = `${parts[0]} - ${parts[1]}`;
                const badgeSpan = document.createElement('span');
                badgeSpan.className = 'attempt-badge';
                badgeSpan.textContent = `${val} ${t('attempts')}`;
                li.appendChild(wordSpan);
                li.appendChild(badgeSpan);
                DOM.mostRepeatedList.appendChild(li);
            }
        });
    } else {
        const li = document.createElement('li');
        li.className = 'perfect-score';
        li.textContent = isFrenchGerman
            ? '🎉 Parfait! Tous les mots corrects du premier coup!'
            : '🎉 Perfect! All words correct on first try!';
        DOM.mostRepeatedList.appendChild(li);
    }
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
    const selectedLessons = Array.from(DOM.lessonSelect.selectedOptions).map(opt => opt.value);
    populateModuleFilter(AppState.vocabData, selectedLessons);
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

    // Get selected lessons and modules (multiple selection)
    const selectedLessons = Array.from(DOM.lessonSelect.selectedOptions).map(opt => opt.value);
    const selectedModules = Array.from(DOM.moduleSelect.selectedOptions).map(opt => opt.value);

    // Filter vocabulary based on multiple selections
    AppState.filteredWords = AppState.vocabData.filter(item => {
        const lessonMatch = selectedLessons.includes('all') || selectedLessons.includes(item.lesson);
        const moduleMatch = selectedModules.includes('all') || selectedModules.includes(item.module);
        return lessonMatch && moduleMatch;
    });

    if (AppState.filteredWords.length === 0) {
        alert(t('noWords'));
        return;
    }

    // Update banner
    DOM.bannerTitle.style.display = 'none';
    DOM.bannerContent.innerHTML = '';

    const bookName = DOM.bookSelect.options[DOM.bookSelect.selectedIndex].textContent;

    // Display selected lessons and modules
    const lessonDisplay = selectedLessons.includes('all') ? 'All' : selectedLessons.join(', ');
    const moduleDisplay = selectedModules.includes('all') ? 'All' : selectedModules.join(', ');
    const lessonModuleLine = `${lessonDisplay} | ${moduleDisplay}`;

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
    DOM.questionPrefix.textContent = '';
    DOM.questionSuffix.textContent = '';
    DOM.answerPrefix.textContent = '';
    DOM.answerSuffix.textContent = '';
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
