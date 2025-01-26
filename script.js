// Optimized Global Variables
const state = {
    vocabData: [],
    filteredWords: [],
    currentWords: [],
    currentIndex: 0,
    direction: "BOTH",
    isRandom: true,
    missedWords: [],
    attemptCounts: {},
    correctCount: 0,
    totalCount: 0,
    answeredWords: {},
    bookSelected: ""
};

// Cached DOM Elements
const elements = {
    bookSelect: document.getElementById('bookSelect'),
    lessonLabel: document.getElementById('lessonLabel'),
    moduleLabel: document.getElementById('moduleLabel'),
    directionLabel: document.getElementById('directionLabel'),
    lessonSelect: document.getElementById('lessonSelect'),
    moduleSelect: document.getElementById('moduleSelect'),
    directionSelect: document.getElementById('directionSelect'),
    randomOrderCheckbox: document.getElementById('randomOrder'),
    orderContainer: document.getElementById('orderContainer'),
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
    statsSummary: document.getElementById('statsSummary'),
    mostRepeatedList: document.getElementById('mostRepeatedList'),
    restartBtn: document.getElementById('restartBtn'),
    bannerContent: document.getElementById('bannerContent')
};

// Load Sounds Dynamically
const correctSounds = Array.from({ length: 25 }, (_, i) => `correct${i + 1}.mp3`);

// Utility Functions
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const clearOptions = (selectElement) => {
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
};

const populateSelect = (data, key, selectElement) => {
    clearOptions(selectElement);
    const uniqueItems = [...new Set(data.map(item => item[key]))];
    uniqueItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
};

// Event Handlers
elements.bookSelect.addEventListener('change', () => {
    const { bookSelect } = elements;
    state.bookSelected = bookSelect.value;

    if (!state.bookSelected) {
        hideFilters();
        return;
    }

    const jsonFile = state.bookSelected === "FR-DE" ? "./vocabD1B.json" : "./vocabGL2B.json";

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            state.vocabData = data;
            setupUIForBook();
            populateSelect(data, 'lesson', elements.lessonSelect);
            populateSelect(data, 'module', elements.moduleSelect);
        })
        .catch(console.error);
});

const hideFilters = () => {
    Object.values(elements).forEach(el => {
        if (el.style) el.style.display = 'none';
    });
};

const setupUIForBook = () => {
    const { bookSelected } = state;
    const { lessonLabel, moduleLabel, directionLabel, directionSelect, randomOrderCheckbox, startBtn } = elements;

    const isFRDE = bookSelected === "FR-DE";
    lessonLabel.textContent = isFRDE ? "Sélectionnez la leçon:" : "Select Lesson:";
    moduleLabel.textContent = isFRDE ? "Sélectionnez le module:" : "Select Module:";
    directionLabel.textContent = isFRDE ? "Direction de pratique:" : "Direction:";

    directionSelect.innerHTML = isFRDE
        ? `<option value="BOTH">Les deux</option><option value="FR->DE">FR -> DE</option><option value="DE->FR">DE -> FR</option>`
        : `<option value="BOTH">Both</option><option value="DE->EN">DE -> EN</option><option value="EN->DE">EN -> DE</option>`;

    randomOrderCheckbox.checked = true;
    startBtn.textContent = isFRDE ? "Commencer" : "Start";

    Object.values(elements).forEach(el => {
        if (el.style) el.style.display = 'block';
    });
};

const startQuiz = () => {
    const { vocabData, direction, isRandom } = state;
    const { lessonSelect, moduleSelect } = elements;

    const selectedLesson = lessonSelect.value;
    const selectedModule = moduleSelect.value;

    state.filteredWords = vocabData.filter(item => (
        (selectedLesson === 'all' || item.lesson === selectedLesson) &&
        (selectedModule === 'all' || item.module === selectedModule)
    ));

    if (!state.filteredWords.length) {
        alert(state.bookSelected === 'FR-DE' ? "Aucun mot trouvé." : "No words found.");
        return;
    }

    state.currentWords = isRandom ? shuffleArray([...state.filteredWords]) : [...state.filteredWords];
    state.currentIndex = 0;
    state.correctCount = 0;
    state.totalCount = state.filteredWords.length;
    state.missedWords = [];

    elements.setupPanel.style.display = 'none';
    elements.quizPanel.style.display = 'block';
    updateProgress();
    showNextWord();
};

const showNextWord = () => {
    const { currentIndex, currentWords, missedWords } = state;

    if (currentIndex >= currentWords.length) {
        if (missedWords.length) {
            state.currentWords = missedWords;
            state.missedWords = [];
            state.currentIndex = 0;
            if (state.isRandom) shuffleArray(state.currentWords);
        } else {
            showStats();
            return;
        }
    }

    const wordData = currentWords[currentIndex];
    elements.questionText.textContent = chooseDisplayWord(wordData);
    elements.answerInput.value = "";
    elements.answerInput.focus();
};

// Modularizing more functionalities... (continued in further optimizations if required)
const chooseDisplayWord = (wordData) => {
    const { bookSelected, direction } = state;

    if (bookSelected === "FR-DE") {
        if (direction === "FR->DE") return wordData.french;
        if (direction === "DE->FR") return wordData.german;
        return Math.random() < 0.5 ? wordData.french : wordData.german;
    } else {
        if (direction === "DE->EN") return wordData.german;
        if (direction === "EN->DE") return wordData.english;
        return Math.random() < 0.5 ? wordData.german : wordData.english;
    }
};

const updateProgress = () => {
    const { correctCount, totalCount } = state;
    const percentage = (correctCount / totalCount) * 100;

    elements.progressInfo.textContent = `${correctCount}/${totalCount}`;
    elements.progressBar.style.width = `${percentage}%`;
};

const showStats = () => {
    const { correctCount, totalCount, attemptCounts, bookSelected } = state;

    elements.quizPanel.style.display = 'none';
    elements.statsPanel.style.display = 'block';

    const totalAttempts = Object.values(attemptCounts).reduce((a, b) => a + b, 0);
    const averageAttempts = (totalAttempts / totalCount).toFixed(2);

    elements.statsSummary.textContent = bookSelected === 'FR-DE'
        ? `Vous avez répondu correctement à ${correctCount} mots sur ${totalCount}. Tentatives moyennes par mot: ${averageAttempts}.`
        : `You answered correctly ${correctCount} out of ${totalCount} words. Average attempts per word: ${averageAttempts}.`;

    const entries = Object.entries(attemptCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    elements.mostRepeatedList.innerHTML = "";
    entries.forEach(([key, val]) => {
        const [word1, word2] = key.split("|");
        const listItem = document.createElement('li');
        listItem.textContent = `${word1} - ${word2}: ${val} ${bookSelected === 'FR-DE' ? 'tentatives' : 'attempts'}`;
        elements.mostRepeatedList.appendChild(listItem);
    });
};

// Answer Handling
elements.checkAnswerBtn.addEventListener('click', handleAnswer);
elements.answerInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter") handleAnswer();
});

const handleAnswer = () => {
    const { currentWords, currentIndex, answeredWords, attemptCounts, missedWords, bookSelected } = state;
    const userAnswer = elements.answerInput.value.trim();

    if (!userAnswer) return;

    const wordData = currentWords[currentIndex];
    const { correctAnswers, questionLanguage } = getCorrectAnswers(wordData);

    const key = getKeyForWord(wordData);
    attemptCounts[key] = (attemptCounts[key] || 0) + 1;

    if (correctAnswers.includes(userAnswer)) {
        state.correctCount++;
        answeredWords[key] = (answeredWords[key] || 0) + 1;
        playFeedback(true, questionLanguage);

        setTimeout(() => {
            state.currentIndex++;
            showNextWord();
        }, 2000); // Wait before showing the next word
    } else {
        if (!missedWords.includes(wordData)) missedWords.push(wordData);
        playFeedback(false, questionLanguage, correctAnswers, wordData);
    }

    updateProgress();
};

const getCorrectAnswers = (wordData) => {
    const { bookSelected, direction } = state;
    let correctAnswers, questionLanguage;

    if (bookSelected === "FR-DE") {
        if (elements.questionText.textContent === wordData.french) {
            correctAnswers = wordData.german.split(";").map(s => s.trim());
            questionLanguage = "FR->DE";
        } else {
            correctAnswers = wordData.french.split(";").map(s => s.trim());
            questionLanguage = "DE->FR";
        }
    } else {
        if (elements.questionText.textContent === wordData.german) {
            correctAnswers = wordData.english.split(";").map(s => s.trim());
            questionLanguage = "DE->EN";
        } else {
            correctAnswers = wordData.german.split(";").map(s => s.trim());
            questionLanguage = "EN->DE";
        }
    }
    return { correctAnswers, questionLanguage };
};

const getKeyForWord = (wordData) => {
    return state.bookSelected === "FR-DE"
        ? `${wordData.french}|${wordData.german}`
        : `${wordData.german}|${wordData.english}`;
};

const playFeedback = (isCorrect, questionLanguage, correctAnswers = [], wordData = null) => {
    const { feedbackMessage, exampleSentence } = elements;

    if (isCorrect) {
        feedbackMessage.style.color = "green";
        feedbackMessage.textContent = questionLanguage.includes("FR")
            ? (questionLanguage === "FR->DE" ? "Richtig!" : "Très bien!")
            : (questionLanguage === "DE->EN" ? "Good job!" : "Richtig!");
    } else {
        feedbackMessage.style.color = "red";
        feedbackMessage.textContent = "Oops!";

        const correctStr = correctAnswers.join(" ; ");
        exampleSentence.innerHTML = `<div style="font-weight:bold; font-size:1.5em; margin-top:10px;">${correctStr}</div>`;
    }
};
// Restart Quiz
elements.restartBtn.addEventListener('click', () => {
    elements.statsPanel.style.display = 'none';
    elements.setupPanel.style.display = 'block';
    resetState();
});

const resetState = () => {
    state.filteredWords = [];
    state.currentWords = [];
    state.currentIndex = 0;
    state.correctCount = 0;
    state.totalCount = 0;
    state.missedWords = [];
    state.attemptCounts = {};
    state.answeredWords = {};
};

// Example Utility Functions for Extra Features
const playRandomCorrectSound = () => {
    const randomSound = correctSounds[Math.floor(Math.random() * correctSounds.length)];
    const audio = new Audio(randomSound);
    audio.play();
};

// Advanced Progress Bar Updates (Optional)
const animateProgressBar = (percentage) => {
    elements.progressBar.style.transition = 'width 0.5s ease-in-out';
    elements.progressBar.style.width = `${percentage}%`;
};

// Enhancing Example Sentences (Optional)
const showExampleSentence = (wordData) => {
    if (wordData.example) {
        elements.exampleSentence.innerHTML = `<div><em>${wordData.example}</em></div>`;
    } else {
        elements.exampleSentence.innerHTML = "";
    }
};

// Debugging Helper (Optional)
const logState = () => {
    console.log(JSON.stringify(state, null, 2));
};

// Finalization: Initiating Quiz
elements.startBtn.addEventListener('click', () => {
    startQuiz();
});
