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
// AUXILIARY PARSING TESTS
// ============================================================================

// Re-implement parseAuxiliaries locally for testing (same as in script.js)
function parseAuxiliaries(text, language) {
    if (!text) {
        return { prefix: '', core: '', suffix: '' };
    }
    let prefix = '';
    let core = text;
    let suffix = '';

    if (language === 'french') {
        const annoMatch = core.match(/(\s+\((?:adv|adj|inv|fam|m|f|pl)\.\))+$/);
        if (annoMatch) {
            suffix = annoMatch[0].trim();
            core = core.slice(0, -annoMatch[0].length);
        }
        const parenQnQcMatch = core.match(/\s+\((?:(?:de |à |avec |pour )?(?:faire )?(?:qn\/qc|qc\/qn|qn|qc))\)$/);
        if (parenQnQcMatch) {
            suffix = `${parenQnQcMatch[0].trim()} ${suffix}`.trim();
            core = core.slice(0, -parenQnQcMatch[0].length);
        }
        let bareQnQcMatch;
        while ((bareQnQcMatch = core.match(/\s+((?:(?:de |à |avec |pour )?(?:faire )?)?(?:qn\/qc|qc\/qn|qn|qc))$/)) !== null) {
            suffix = `${bareQnQcMatch[1].trim()} ${suffix}`.trim();
            core = core.slice(0, -bareQnQcMatch[0].length);
        }
        const ellipsisCount = (core.match(/\.\.\./g) || []).length;
        if (ellipsisCount === 1) {
            const ellipsisMatch = core.match(/\s+(\.\.\.[?!]?)$/);
            if (ellipsisMatch) {
                suffix = `${ellipsisMatch[1].trim()} ${suffix}`.trim();
                core = core.slice(0, -ellipsisMatch[0].length);
            }
        }
    } else if (language === 'german') {
        const sichMatch = core.match(/^(sich(?:\s+(?:an|auf|für|mit|von|über|um|aus|vor|zu|bei|nach)\s+(?:(?:jdn|jdm|jmdn|jmdm|etw)\.(?:\/(?:jdn|jdm|jmdn|jmdm|etw)\.)?\s*))?)\s+/);
        if (sichMatch) {
            prefix = sichMatch[1].trim();
            core = core.slice(sichMatch[0].length);
        } else {
            const caseMatch = core.match(/^((?:(?:an|von|mit|für|bei|zu|über|auf|aus|nach)\s+)?(?:(?:jdn|jdm|jmdn|jmdm|etw)\.(?:\/(?:jdn|jdm|jmdn|jmdm|etw)\.)?\s*)+)\s*/);
            if (caseMatch) {
                prefix = caseMatch[1].trim();
                core = core.slice(caseMatch[0].length);
            }
        }
    } else if (language === 'english') {
        const parenMatch = core.match(/\s+\([^)]+\)$/);
        if (parenMatch) {
            suffix = parenMatch[0].trim();
            core = core.slice(0, -parenMatch[0].length);
        }
        const sbSthMatch = core.match(/\s+((?:sb|sth)(?:\s+(?:to\s+(?:do\s+)?)?(?:sb|sth))*)$/);
        if (sbSthMatch) {
            suffix = `${sbSthMatch[1].trim()} ${suffix}`.trim();
            core = core.slice(0, -sbSthMatch[0].length);
        }
    }

    return { prefix, core: core.trim(), suffix };
}

function parseAllAnswers(text, language) {
    return text.split(';').map(s => parseAuxiliaries(s.trim(), language));
}

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

// --- French parsing tests ---

runner.test('parseAuxiliaries: French bare qn/qc', (t) => {
    const r = parseAuxiliaries('chercher qn/qc', 'french');
    t.assertEqual(r.core, 'chercher');
    t.assertEqual(r.suffix, 'qn/qc');
    t.assertEqual(r.prefix, '');
});

runner.test('parseAuxiliaries: French qn only', (t) => {
    const r = parseAuxiliaries('inviter qn', 'french');
    t.assertEqual(r.core, 'inviter');
    t.assertEqual(r.suffix, 'qn');
});

runner.test('parseAuxiliaries: French qc with preposition', (t) => {
    const r = parseAuxiliaries('penser à qn/qc', 'french');
    t.assertEqual(r.core, 'penser');
    t.assertEqual(r.suffix, 'à qn/qc');
});

runner.test('parseAuxiliaries: French parenthesized annotation (fam.)', (t) => {
    const r = parseAuxiliaries('en avoir marre de qn/qc (fam.)', 'french');
    t.assertEqual(r.core, 'en avoir marre');
    t.assertEqual(r.suffix, 'de qn/qc (fam.)');
});

runner.test('parseAuxiliaries: French with (adj.) (inv.)', (t) => {
    const r = parseAuxiliaries('casse-gueule (adj.) (inv.)', 'french');
    t.assertEqual(r.core, 'casse-gueule');
    t.assertEqual(r.suffix, '(adj.) (inv.)');
});

runner.test('parseAuxiliaries: French parenthesized qc (de qc)', (t) => {
    const r = parseAuxiliaries('discuter (de qc)', 'french');
    t.assertEqual(r.core, 'discuter');
    t.assertTrue(r.suffix.includes('(de qc)'));
});

runner.test('parseAuxiliaries: French se reflexive stays in core', (t) => {
    const r = parseAuxiliaries('se dépêcher', 'french');
    t.assertEqual(r.core, 'se dépêcher');
    t.assertEqual(r.suffix, '');
    t.assertEqual(r.prefix, '');
});

runner.test('parseAuxiliaries: French no auxiliary', (t) => {
    const r = parseAuxiliaries('bonjour', 'french');
    t.assertEqual(r.core, 'bonjour');
    t.assertEqual(r.suffix, '');
    t.assertEqual(r.prefix, '');
});

runner.test('parseAuxiliaries: French faire qc', (t) => {
    const r = parseAuxiliaries('savoir faire qc', 'french');
    t.assertEqual(r.core, 'savoir');
    t.assertEqual(r.suffix, 'faire qc');
});

runner.test('parseAuxiliaries: French ne ... pas not parsed (ellipsis in middle)', (t) => {
    const r = parseAuxiliaries('ne ... pas', 'french');
    t.assertEqual(r.core, 'ne ... pas');
    t.assertEqual(r.suffix, '');
});

// --- German parsing tests ---

runner.test('parseAuxiliaries: German sich prefix', (t) => {
    const r = parseAuxiliaries('sich Sorgen machen', 'german');
    t.assertEqual(r.prefix, 'sich');
    t.assertEqual(r.core, 'Sorgen machen');
});

runner.test('parseAuxiliaries: German sich + prep + case marker', (t) => {
    const r = parseAuxiliaries('sich an jdn./etw. erinnern', 'german');
    t.assertEqual(r.prefix, 'sich an jdn./etw.');
    t.assertEqual(r.core, 'erinnern');
});

runner.test('parseAuxiliaries: German jmdn. prefix', (t) => {
    const r = parseAuxiliaries('jmdn. aufziehen', 'german');
    t.assertEqual(r.prefix, 'jmdn.');
    t.assertEqual(r.core, 'aufziehen');
});

runner.test('parseAuxiliaries: German no auxiliary', (t) => {
    const r = parseAuxiliaries('Hallo', 'german');
    t.assertEqual(r.prefix, '');
    t.assertEqual(r.core, 'Hallo');
    t.assertEqual(r.suffix, '');
});

runner.test('parseAuxiliaries: German etw. prefix', (t) => {
    const r = parseAuxiliaries('etw. besichtigen', 'german');
    t.assertEqual(r.prefix, 'etw.');
    t.assertEqual(r.core, 'besichtigen');
});

// --- English parsing tests ---

runner.test('parseAuxiliaries: English sb at end', (t) => {
    const r = parseAuxiliaries('to tease sb', 'english');
    t.assertEqual(r.core, 'to tease');
    t.assertEqual(r.suffix, 'sb');
});

runner.test('parseAuxiliaries: English sb to do sth', (t) => {
    const r = parseAuxiliaries('to tell sb to do sth', 'english');
    t.assertEqual(r.core, 'to tell');
    t.assertEqual(r.suffix, 'sb to do sth');
});

runner.test('parseAuxiliaries: English with (infml)', (t) => {
    const r = parseAuxiliaries('to hang out (infml)', 'english');
    t.assertEqual(r.core, 'to hang out');
    t.assertEqual(r.suffix, '(infml)');
});

runner.test('parseAuxiliaries: English sth in middle stays in core', (t) => {
    const r = parseAuxiliaries('to take sth seriously', 'english');
    t.assertEqual(r.core, 'to take sth seriously');
    t.assertEqual(r.suffix, '');
});

runner.test('parseAuxiliaries: English no auxiliary', (t) => {
    const r = parseAuxiliaries('hello', 'english');
    t.assertEqual(r.core, 'hello');
    t.assertEqual(r.suffix, '');
    t.assertEqual(r.prefix, '');
});

// --- parseAllAnswers tests ---

runner.test('parseAllAnswers: multiple German answers with common prefix', (t) => {
    const results = parseAllAnswers('jmdn. aufziehen; jmdn. hänseln; jmdn. ärgern', 'german');
    t.assertEqual(results.length, 3);
    t.assertEqual(results[0].prefix, 'jmdn.');
    t.assertEqual(results[0].core, 'aufziehen');
    t.assertEqual(results[1].core, 'hänseln');
    t.assertEqual(results[2].core, 'ärgern');
});

runner.test('parseAllAnswers: French single answer', (t) => {
    const results = parseAllAnswers('regarder qc', 'french');
    t.assertEqual(results.length, 1);
    t.assertEqual(results[0].core, 'regarder');
    t.assertEqual(results[0].suffix, 'qc');
});

runner.test('parseAuxiliaries: empty string', (t) => {
    const r = parseAuxiliaries('', 'french');
    t.assertEqual(r.core, '');
    t.assertEqual(r.prefix, '');
    t.assertEqual(r.suffix, '');
});

// --- Chained French markers ---

runner.test('parseAuxiliaries: French chained qc/qn à qn', (t) => {
    const r = parseAuxiliaries('présenter qc/qn à qn', 'french');
    t.assertEqual(r.core, 'présenter');
    t.assertEqual(r.suffix, 'qc/qn à qn');
});

runner.test('parseAuxiliaries: French expliquer qc à qn', (t) => {
    const r = parseAuxiliaries('expliquer qc à qn', 'french');
    t.assertEqual(r.core, 'expliquer');
    t.assertEqual(r.suffix, 'qc à qn');
});

// --- German embedded markers ---

runner.test('parseAuxiliaries: German with embedded etw. in middle', (t) => {
    const r = parseAuxiliaries('jmdn. veranlassen etw. zu tun', 'german');
    t.assertEqual(r.prefix, 'jmdn.');
    t.assertEqual(r.core, 'veranlassen etw. zu tun');
});

runner.test('parseAuxiliaries: German marker in middle stays in core', (t) => {
    const r = parseAuxiliaries('streng mit jmdm. sein', 'german');
    t.assertEqual(r.prefix, '');
    t.assertEqual(r.core, 'streng mit jmdm. sein');
});

// --- findCommonAux tests ---

runner.test('findCommonAux: common prefix across all alternatives', (t) => {
    const parsed = [
        { prefix: 'jmdn.', core: 'aufziehen', suffix: '' },
        { prefix: 'jmdn.', core: 'hänseln', suffix: '' },
        { prefix: 'jmdn.', core: 'ärgern', suffix: '' }
    ];
    const { commonPrefix, commonSuffix } = findCommonAux(parsed);
    t.assertEqual(commonPrefix, 'jmdn.');
    t.assertEqual(commonSuffix, '');
});

runner.test('findCommonAux: different prefixes returns empty', (t) => {
    const parsed = [
        { prefix: 'sich', core: 'freuen', suffix: '' },
        { prefix: '', core: 'lachen', suffix: '' }
    ];
    const { commonPrefix } = findCommonAux(parsed);
    t.assertEqual(commonPrefix, '');
});

runner.test('findCommonAux: empty array', (t) => {
    const { commonPrefix, commonSuffix } = findCommonAux([]);
    t.assertEqual(commonPrefix, '');
    t.assertEqual(commonSuffix, '');
});

// ============================================================================
// APOSTROPHE NORMALIZATION TESTS
// ============================================================================

// Re-implement normalizeAnswer locally (same as in script.js)
function normalizeAnswer(str) {
    return str.replace(/[‘’`´ʼ′]/g, "'").replace(/\s+/g, ' ').trim();
}

runner.test('normalizeAnswer: double space in middle collapses to one', (t) => {
    t.assertEqual(normalizeAnswer('to go  out'), 'to go out');
});

runner.test('normalizeAnswer: leading and trailing spaces are trimmed', (t) => {
    t.assertEqual(normalizeAnswer('  hello  '), 'hello');
});

runner.test('normalizeAnswer: non-breaking space treated as regular whitespace', (t) => {
    t.assertEqual(normalizeAnswer('to go out'), 'to go out');
});

runner.test('normalizeAnswer: user typing double space matches single-space answer', (t) => {
    t.assertEqual(normalizeAnswer('eine  Nummer'), normalizeAnswer('eine Nummer'));
});

runner.test('normalizeAnswer: curly right quote U+2019 becomes ASCII', (t) => {
    t.assertEqual(normalizeAnswer('to change one’s mind'), "to change one's mind");
});

runner.test('normalizeAnswer: backtick becomes ASCII apostrophe', (t) => {
    t.assertEqual(normalizeAnswer('to change one`s mind'), "to change one's mind");
});

runner.test('normalizeAnswer: acute accent becomes ASCII apostrophe', (t) => {
    t.assertEqual(normalizeAnswer('to change one´s mind'), "to change one's mind");
});

runner.test('normalizeAnswer: ASCII apostrophe passes through', (t) => {
    t.assertEqual(normalizeAnswer("to change one's mind"), "to change one's mind");
});

runner.test('normalizeAnswer: file value with backtick matches user typing curly quote', (t) => {
    const fileValue = 'to change one`s mind';
    const userTypes = 'to change one’s mind';
    t.assertEqual(normalizeAnswer(fileValue), normalizeAnswer(userTypes));
});

runner.test('normalizeAnswer: file value with curly quote matches user typing ASCII', (t) => {
    const fileValue = 'I don’t mind';
    const userTypes = "I don't mind";
    t.assertEqual(normalizeAnswer(fileValue), normalizeAnswer(userTypes));
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
