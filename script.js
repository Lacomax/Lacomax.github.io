// Global variables
let vocabData = [];
let filteredWords = [];
let currentWords = [];
let currentIndex = 0;
let direction = "BOTH";
let isRandom = true;
let missedWords = [];  
let attemptCounts = {};
let correctCount = 0;
let totalCount = 0;
let answeredWords = {};
let bookSelected = ""; 

// Elements
const bookSelect = document.getElementById('bookSelect');
const lessonLabel = document.getElementById('lessonLabel');
const moduleLabel = document.getElementById('moduleLabel');
const directionLabel = document.getElementById('directionLabel');
const lessonSelect = document.getElementById('lessonSelect');
const moduleSelect = document.getElementById('moduleSelect');
const directionSelect = document.getElementById('directionSelect');
const randomOrderCheckbox = document.getElementById('randomOrder');
const orderContainer = document.getElementById('orderContainer');
const orderLabel = document.getElementById('orderLabel');
const startBtn = document.getElementById('startBtn');
const quizPanel = document.querySelector('.quiz-panel');
const setupPanel = document.querySelector('.setup-panel');
const statsPanel = document.querySelector('.stats-panel');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const checkAnswerBtn = document.getElementById('checkAnswerBtn');
const feedbackMessage = document.getElementById('feedbackMessage');
const exampleSentence = document.getElementById('exampleSentence');
const progressBar = document.getElementById('progressBar');
const progressInfo = document.getElementById('progressInfo');
const statsSummary = document.getElementById('statsSummary');
const statsTitle = document.getElementById('statsTitle');
const mostRepeatedTitle = document.getElementById('mostRepeatedTitle');
const mostRepeatedList = document.getElementById('mostRepeatedList');
const restartBtn = document.getElementById('restartBtn');
const keyboard = document.querySelector('.keyboard');
const bannerTitle = document.getElementById('bannerTitle');
const flag1 = document.getElementById('flag1');
const flag2 = document.getElementById('flag2');
const bannerContent = document.getElementById('bannerContent');

// Correct sounds (1 to 25)
let correctSounds = [];
for (let i = 1; i <= 25; i++) {
    correctSounds.push(`correct${i}.mp3`);
}

bookSelect.addEventListener('change', () => {
    bookSelected = bookSelect.value;
    if (!bookSelected) {
        hideFilters();
        return;
    }

    let jsonFile = bookSelected === "FR-DE" ? "./vocabD1B.json" : "./vocabGL2B.json";
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            vocabData = data;
            setupUIForBook();
            populateLessonFilter(data);
            populateModuleFilter(data, 'all');
        })
        .catch(err => console.error(err));
});

function hideFilters() {
    lessonLabel.style.display = 'none';
    moduleLabel.style.display = 'none';
    directionLabel.style.display = 'none';
    directionSelect.style.display = 'none';
    lessonSelect.style.display = 'none';
    moduleSelect.style.display = 'none';
    orderContainer.style.display = 'none';
    startBtn.style.display = 'none';
    flag1.style.display = 'none';
    flag2.style.display = 'none';
}

function setupUIForBook() {
    if (bookSelected === "FR-DE") {
        lessonLabel.textContent = "Sélectionnez la leçon:";
        moduleLabel.textContent = "Sélectionnez le module:";
        directionLabel.textContent = "Direction de pratique:";
        directionSelect.innerHTML = `
            <option value="BOTH">Les deux</option>
            <option value="FR->DE">FR -> DE</option>
            <option value="DE->FR">DE -> FR</option>
        `;
        orderLabel.innerHTML = '<input type="checkbox" id="randomOrder" checked /> Ordre aléatoire';
        flag1.src = "flag_france.png";
        flag1.alt = "Drapeau français";
        flag2.src = "flag_germany.png";
        flag2.alt = "Flagge Deutschlands";

        statsTitle.textContent = "Statistiques";
        mostRepeatedTitle.textContent = "Mots les plus répétés:";
        restartBtn.textContent = "Réessayer";

        startBtn.textContent = "Commencer";
        checkAnswerBtn.textContent = "Valider";
    } else {
        lessonLabel.textContent = "Select Lesson:";
        moduleLabel.textContent = "Select Module:";
        directionLabel.textContent = "Direction:";
        directionSelect.innerHTML = `
            <option value="BOTH">Both</option>
            <option value="DE->EN">DE -> EN</option>
            <option value="EN->DE">EN -> DE</option>
        `;
        orderLabel.innerHTML = '<input type="checkbox" id="randomOrder" checked /> Random order';
        flag1.src = "flag_germany.png";
        flag1.alt = "German flag";
        flag2.src = "flag_uk.png";
        flag2.alt = "UK flag";

        statsTitle.textContent = "Statistics";
        mostRepeatedTitle.textContent = "Most repeated words:";
        restartBtn.textContent = "Try again";

        startBtn.textContent = "Start";
        checkAnswerBtn.textContent = "Check";
    }

    flag1.style.display = 'inline';
    flag2.style.display = 'inline';

    lessonLabel.style.display = 'block';
    moduleLabel.style.display = 'block';
    directionLabel.style.display = 'block';
    directionSelect.style.display = 'block';
    lessonSelect.style.display = 'block';
    moduleSelect.style.display = 'block';
    orderContainer.style.display = 'block';
    startBtn.style.display = 'block';
}

function populateLessonFilter(data) {
    while (lessonSelect.options.length > 1) {
        lessonSelect.remove(1);
    }
    const lessons = [...new Set(data.map(item => item.lesson))];
    lessons.forEach(les => {
        const opt = document.createElement('option');
        opt.value = les;
        opt.textContent = les;
        lessonSelect.appendChild(opt);
    });
}

function populateModuleFilter(data, selectedLesson = 'all') {
    while (moduleSelect.options.length > 1) {
        moduleSelect.remove(1);
    }

    let modules;
    if (selectedLesson === 'all') {
        modules = [...new Set(data.map(item => item.module))];
    } else {
        modules = [...new Set(data.filter(d => d.lesson === selectedLesson).map(item => item.module))];
    }

    modules.forEach(mod => {
        const opt = document.createElement('option');
        opt.value = mod;
        opt.textContent = mod;
        moduleSelect.appendChild(opt);
    });
}

lessonSelect.addEventListener('change', () => {
    populateModuleFilter(vocabData, lessonSelect.value);
});

startBtn.addEventListener('click', () => {
    direction = directionSelect.value;
    isRandom = randomOrderCheckbox.checked;

    const selectedLesson = lessonSelect.value;
    const selectedModule = moduleSelect.value;

    filteredWords = vocabData.filter(item => {
        return (selectedLesson === 'all' || item.lesson === selectedLesson) &&
               (selectedModule === 'all' || item.module === selectedModule);
    });

    if (filteredWords.length === 0) {
        alert(bookSelected === 'FR-DE' ? "Aucun mot trouvé." : "No words found.");
        return;
    }

    // Hide "Vokabeltrainer"
    bannerTitle.style.display = 'none';
    bannerContent.innerHTML = '';

    // Book name in bold
    const bookName = bookSelect.options[bookSelect.selectedIndex].textContent;
    const lessonModuleLine = `${(selectedLesson === 'all' ? 'All' : selectedLesson)} | ${(selectedModule === 'all' ? 'All' : selectedModule)}`;

    // Choose the appropriate flag
    let bannerFlagSrc = '';
    let bannerFlagAlt = '';
    if (bookSelected === 'FR-DE') {
        bannerFlagSrc = 'flag_france.png';
        bannerFlagAlt = 'Drapeau français';
    } else {
        bannerFlagSrc = 'flag_uk.png';
        bannerFlagAlt = 'UK flag';
    }

    const bookDiv = document.createElement('div');
    bookDiv.innerHTML = `<b>${bookName}</b>`;
    const lessonModuleDiv = document.createElement('div');
    lessonModuleDiv.textContent = lessonModuleLine;
    const bannerImg = document.createElement('img');
    bannerImg.src = bannerFlagSrc;
    bannerImg.alt = bannerFlagAlt;
    bannerImg.className = 'banner-flag';

    bannerContent.appendChild(bookDiv);
    bannerContent.appendChild(lessonModuleDiv);
    bannerContent.appendChild(bannerImg);

    setupPanel.style.display = 'none';
    quizPanel.style.display = 'block';
    statsPanel.style.display = 'none';
    
    startQuiz();
});

function startQuiz() {
    currentIndex = 0;
    missedWords = [];
    attemptCounts = {};
    correctCount = 0;
    totalCount = filteredWords.length;
    answeredWords = {};

    currentWords = filteredWords.slice();
    if (isRandom) {
        shuffleArray(currentWords);
    }

    updateProgress();
    showNextWord();
}

function showNextWord() {
    if (currentIndex >= currentWords.length) {
        if (missedWords.length > 0) {
            currentWords = missedWords;
            missedWords = [];
            currentIndex = 0;
            if (isRandom) shuffleArray(currentWords);
            showNextWord();
        } else {
            showStats();
        }
        return;
    }

    const wordData = currentWords[currentIndex];
    let displayWord = chooseDisplayWord(wordData);

    questionText.textContent = displayWord;
    feedbackMessage.textContent = "";
    exampleSentence.textContent = "";

    updatePlaceholder(wordData, displayWord);

    answerInput.value = "";
    answerInput.focus();
}

let waitingForNextAfterIncorrect = false;

checkAnswerBtn.addEventListener('click', handleAnswer);
answerInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        handleAnswer();
    }
});

function handleAnswer() {
    if (waitingForNextAfterIncorrect) {
        waitingForNextAfterIncorrect = false;
        currentIndex++;
        showNextWord();
        return;
    }
    checkAnswer();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (!userAnswer) return;

    const wordData = currentWords[currentIndex];
    let {correctAnswers, questionLanguage} = getCorrectAnswers(wordData);

    const key = getKeyForWord(wordData);
    attemptCounts[key] = (attemptCounts[key] || 0) + 1;

    if (correctAnswers.includes(userAnswer)) {
        playRandomCorrectSound();

        feedbackMessage.style.color = "green";
        feedbackMessage.textContent =
            bookSelected === "FR-DE"
                ? (questionLanguage === "FR->DE" ? "Richtig!" : "Très bien!")
                : (questionLanguage === "DE->EN" ? "Good job!" : "Richtig!");

        correctCount++;
        answeredWords[key] = (answeredWords[key] || 0) + 1;

        updateProgress();

        // Disable input and button temporarily
        answerInput.disabled = true;
        checkAnswerBtn.disabled = true;

        setTimeout(() => {
            currentIndex++;
            answerInput.disabled = false;
            checkAnswerBtn.disabled = false;
            showNextWord();
        }, 2000); // Wait 2 seconds before showing the next word
    } else {
        feedbackMessage.style.color = "red";
        feedbackMessage.textContent = "Oops!";

        const correctStr = correctAnswers.join(" ; ");
        exampleSentence.innerHTML = `<div style="font-weight:bold; font-size:2em; margin-top:20px;">${correctStr}</div><div>${wordData.example}</div>`;

        if (!missedWords.includes(wordData)) {
            missedWords.push(wordData);
        }

        waitingForNextAfterIncorrect = true;
    }
}


function getCorrectAnswers(wordData) {
    let correctAnswerArr;
    let questionLanguage;
    if (bookSelected === "FR-DE") {
        if (questionText.textContent === wordData.french) {
            correctAnswerArr = wordData.german.split(';').map(s=>s.trim());
            questionLanguage = "FR->DE";
        } else {
            correctAnswerArr = wordData.french.split(';').map(s=>s.trim());
            questionLanguage = "DE->FR";
        }
    } else {
        if (questionText.textContent === wordData.german) {
            correctAnswerArr = wordData.english.split(';').map(s=>s.trim());
            questionLanguage = "DE->EN";
        } else {
            correctAnswerArr = wordData.german.split(';').map(s=>s.trim());
            questionLanguage = "EN->DE";
        }
    }
    return {correctAnswers: correctAnswerArr, questionLanguage};
}

function chooseDisplayWord(wordData) {
    if (bookSelected === "FR-DE") {
        if (direction === "FR->DE") return wordData.french;
        if (direction === "DE->FR") return wordData.german;
        return (Math.random()<0.5) ? wordData.french : wordData.german;
    } else {
        if (direction === "DE->EN") return wordData.german;
        if (direction === "EN->DE") return wordData.english;
        return (Math.random()<0.5) ? wordData.german : wordData.english;
    }
}

function updatePlaceholder(wordData, displayedWord) {
    if (bookSelected === "FR-DE") {
        if (displayedWord === wordData.french) {
            answerInput.placeholder = "Deine antwort...";
        } else {
            answerInput.placeholder = "Votre réponse...";
        }
    } else {
        if (displayedWord === wordData.german) {
            answerInput.placeholder = "Your answer...";
        } else {
            answerInput.placeholder = "Deine antwort...";
        }
    }
}

function getKeyForWord(wordData) {
    if (bookSelected === "FR-DE") {
        return wordData.french + "|" + wordData.german;
    } else {
        return wordData.german + "|" + wordData.english;
    }
}

function updateProgress() {
    progressInfo.textContent = `${correctCount}/${totalCount}`;
    const percentage = (correctCount / totalCount) * 100;
    progressBar.style.width = percentage + "%";
}

function showStats() {
    quizPanel.style.display = 'none';
    statsPanel.style.display = 'block';

    const totalAttempts = Object.values(attemptCounts).reduce((a,b)=>a+b,0);
    const averageAttempts = (totalAttempts / totalCount).toFixed(2);

    if (bookSelected === 'FR-DE') {
        statsSummary.textContent = `Vous avez répondu correctement à ${correctCount} mots sur ${totalCount}. Tentatives moyennes par mot: ${averageAttempts}.`;
    } else {
        statsSummary.textContent = `You answered correctly ${correctCount} out of ${totalCount} words. Average attempts per word: ${averageAttempts}.`;
    }

    const entries = Object.entries(attemptCounts).sort((a,b)=>b[1]-a[1]);
    mostRepeatedList.innerHTML = "";
    entries.slice(0,5).forEach(([key, val]) => {
        const parts = key.split("|");
        const li = document.createElement('li');
        li.textContent = `${parts[0]} - ${parts[1]} : ${val} ${bookSelected === 'FR-DE' ? 'tentatives' : 'attempts'}`;
        mostRepeatedList.appendChild(li);
    });
}

restartBtn.addEventListener('click', () => {
    statsPanel.style.display = 'none';
    setupPanel.style.display = 'block';
    bannerTitle.style.display = 'block';
    bannerTitle.textContent = "Vokabeltrainer";
    bannerContent.innerHTML = "";
});

function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random()* (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

keyboard.addEventListener('click', (e) => {
    if (e.target.dataset.char) {
        const char = e.target.dataset.char;
        answerInput.value += char;
        answerInput.focus();
    }
});

function playRandomCorrectSound() {
    const soundFile = correctSounds[Math.floor(Math.random() * correctSounds.length)];
    const audio = new Audio("./correct_mp3/" + soundFile);
    audio.play();
}
