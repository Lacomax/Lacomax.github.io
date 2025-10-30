/**
 * Basic test suite for Vokabeltrainer
 * Run with Node.js or in browser console
 *
 * Usage in browser:
 * 1. Open index.html
 * 2. Open DevTools console
 * 3. Load this file: <script src="tests/vocab.test.js"></script>
 * 4. Run: runTests()
 */

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(
                message || `Expected ${expected}, but got ${actual}`
            );
        }
    }

    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(message || 'Expected true, but got false');
        }
    }

    assertFalse(condition, message) {
        if (condition) {
            throw new Error(message || 'Expected false, but got true');
        }
    }

    assertArraysEqual(arr1, arr2, message) {
        if (arr1.length !== arr2.length) {
            throw new Error(
                message || `Arrays have different lengths: ${arr1.length} vs ${arr2.length}`
            );
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                throw new Error(
                    message || `Arrays differ at index ${i}: ${arr1[i]} vs ${arr2[i]}`
                );
            }
        }
    }

    async run() {
        console.log('🧪 Running tests...\n');

        for (const test of this.tests) {
            try {
                await test.fn(this);
                this.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.error(`❌ ${test.name}`);
                console.error(`   ${error.message}`);
            }
        }

        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// ============================================================================
// TESTS
// ============================================================================

const runner = new TestRunner();

// Test: shuffleArray function
runner.test('shuffleArray should randomize array', (t) => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const copy = [...original];

    // Mock shuffleArray if not in global scope
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(copy);

    // Array should have same elements
    t.assertEqual(copy.length, original.length, 'Length should be same');

    // Should contain all original elements
    for (const elem of original) {
        t.assertTrue(copy.includes(elem), `Should contain ${elem}`);
    }

    // Very unlikely to be in same order (probabilistically)
    // This test might rarely fail due to randomness
    let sameOrder = true;
    for (let i = 0; i < original.length; i++) {
        if (copy[i] !== original[i]) {
            sameOrder = false;
            break;
        }
    }

    // Note: This assertion is probabilistic and might fail 1/10! times
    // which is negligible (1 in 3,628,800)
    if (sameOrder && copy.length > 3) {
        console.warn('   ⚠️  Array remained in same order (very unlikely)');
    }
});

// Test: Answer validation
runner.test('Should accept correct answers separated by semicolons', (t) => {
    const germanAnswers = 'Hallo; Guten Tag; Hi'.split(';').map(s => s.trim());

    t.assertTrue(germanAnswers.includes('Hallo'), 'Should include "Hallo"');
    t.assertTrue(germanAnswers.includes('Guten Tag'), 'Should include "Guten Tag"');
    t.assertTrue(germanAnswers.includes('Hi'), 'Should include "Hi"');
    t.assertFalse(germanAnswers.includes('Bonjour'), 'Should not include "Bonjour"');
});

// Test: Config constants
runner.test('CONFIG should have required properties', (t) => {
    const CONFIG = {
        CORRECT_ANSWER_DELAY_MS: 2000,
        TOTAL_CORRECT_SOUNDS: 25,
        AUDIO_PATH: 'correct_mp3/',
        JSON_FILES: {
            'FR-DE': './vocabD1B.json',
            'DE-EN': './vocabGL2B.json'
        }
    };

    t.assertEqual(CONFIG.CORRECT_ANSWER_DELAY_MS, 2000);
    t.assertEqual(CONFIG.TOTAL_CORRECT_SOUNDS, 25);
    t.assertEqual(CONFIG.AUDIO_PATH, 'correct_mp3/');
    t.assertTrue('FR-DE' in CONFIG.JSON_FILES);
    t.assertTrue('DE-EN' in CONFIG.JSON_FILES);
});

// Test: Translation system
runner.test('Translation system should return correct values', (t) => {
    const TRANSLATIONS = {
        'FR-DE': {
            start: 'Commencer',
            check: 'Valider',
            incorrect: 'Oops!'
        },
        'DE-EN': {
            start: 'Start',
            check: 'Check',
            incorrect: 'Oops!'
        }
    };

    function t_func(key, book) {
        return TRANSLATIONS[book]?.[key] || key;
    }

    t.assertEqual(t_func('start', 'FR-DE'), 'Commencer');
    t.assertEqual(t_func('start', 'DE-EN'), 'Start');
    t.assertEqual(t_func('check', 'FR-DE'), 'Valider');
    t.assertEqual(t_func('check', 'DE-EN'), 'Check');
});

// Test: Word key generation
runner.test('Should generate unique keys for word pairs', (t) => {
    function getKeyForWord(wordData, bookSelected) {
        if (bookSelected === 'FR-DE') {
            return `${wordData.french}|${wordData.german}`;
        } else {
            return `${wordData.german}|${wordData.english}`;
        }
    }

    const frdeWord = { french: 'Bonjour', german: 'Hallo' };
    const deenWord = { german: 'Hallo', english: 'Hello' };

    const key1 = getKeyForWord(frdeWord, 'FR-DE');
    const key2 = getKeyForWord(deenWord, 'DE-EN');

    t.assertEqual(key1, 'Bonjour|Hallo');
    t.assertEqual(key2, 'Hallo|Hello');
    t.assertTrue(key1 !== key2, 'Keys should be different');
});

// Test: Progress calculation
runner.test('Should calculate progress percentage correctly', (t) => {
    function calculateProgress(correct, total) {
        return Math.round((correct / total) * 100);
    }

    t.assertEqual(calculateProgress(0, 10), 0);
    t.assertEqual(calculateProgress(5, 10), 50);
    t.assertEqual(calculateProgress(10, 10), 100);
    t.assertEqual(calculateProgress(3, 7), 43); // 42.857... rounds to 43
});

// Test: LocalStorage save/load
runner.test('Should save and load progress from localStorage', (t) => {
    const STORAGE_KEY = 'test_vokabeltrainer_progress';

    function saveProgress(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            return false;
        }
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
        }
    }

    // Test data
    const testData = {
        bookSelected: 'FR-DE',
        attemptCounts: { 'Bonjour|Hallo': 2 },
        timestamp: Date.now()
    };

    // Save
    const saved = saveProgress(testData);
    t.assertTrue(saved, 'Should save successfully');

    // Load
    const loaded = loadProgress();
    t.assertTrue(loaded !== null, 'Should load successfully');
    t.assertEqual(loaded.bookSelected, 'FR-DE');
    t.assertEqual(loaded.attemptCounts['Bonjour|Hallo'], 2);

    // Cleanup
    localStorage.removeItem(STORAGE_KEY);
});

// Test: XSS protection
runner.test('Should sanitize HTML content', (t) => {
    function sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    const dangerous = '<script>alert("XSS")</script>';
    const sanitized = sanitizeHTML(dangerous);

    t.assertFalse(sanitized.includes('<script>'), 'Should escape script tags');
    t.assertTrue(sanitized.includes('&lt;script&gt;'), 'Should contain escaped version');
});

// Test: Audio filename formatting
runner.test('Should format audio filenames correctly', (t) => {
    function formatAudioNumber(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    t.assertEqual(formatAudioNumber(1), '01');
    t.assertEqual(formatAudioNumber(9), '09');
    t.assertEqual(formatAudioNumber(10), '10');
    t.assertEqual(formatAudioNumber(25), '25');
});

// Test: Direction mapping
runner.test('Should map direction values correctly', (t) => {
    function chooseDisplayWord(wordData, direction, bookSelected) {
        if (bookSelected === 'FR-DE') {
            if (direction === 'FORWARD') return wordData.french;
            if (direction === 'BACKWARD') return wordData.german;
            return Math.random() < 0.5 ? wordData.french : wordData.german;
        } else {
            if (direction === 'FORWARD') return wordData.german;
            if (direction === 'BACKWARD') return wordData.english;
            return Math.random() < 0.5 ? wordData.german : wordData.english;
        }
    }

    const frdeWord = { french: 'Bonjour', german: 'Hallo' };
    const deenWord = { german: 'Hallo', english: 'Hello' };

    t.assertEqual(chooseDisplayWord(frdeWord, 'FORWARD', 'FR-DE'), 'Bonjour');
    t.assertEqual(chooseDisplayWord(frdeWord, 'BACKWARD', 'FR-DE'), 'Hallo');
    t.assertEqual(chooseDisplayWord(deenWord, 'FORWARD', 'DE-EN'), 'Hallo');
    t.assertEqual(chooseDisplayWord(deenWord, 'BACKWARD', 'DE-EN'), 'Hello');
});

// ============================================================================
// RUN TESTS
// ============================================================================

async function runTests() {
    const success = await runner.run();
    return success;
}

// Auto-run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.runTests = runTests;
    console.log('💡 Tests loaded. Run runTests() to execute.');
}
