/**
 * Enhanced Features for Learning Hub
 * All interactive features: search, progress, dark mode, keyboard shortcuts, etc.
 */

// ============================================================
// GLOBAL STATE MANAGEMENT
// ============================================================
const AppState = {
    darkMode: localStorage.getItem('darkMode') === 'true',
    progress: JSON.parse(localStorage.getItem('progress') || '{}'),
    studyTime: JSON.parse(localStorage.getItem('studyTime') || '{}'),
    currentPage: window.location.pathname.split('/').pop().replace('.html', ''),
    
    saveProgress() {
        localStorage.setItem('progress', JSON.stringify(this.progress));
    },
    
    saveStudyTime() {
        localStorage.setItem('studyTime', JSON.stringify(this.studyTime));
    },
    
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        document.body.classList.toggle('dark-mode', this.darkMode);
    }
};

// ============================================================
// SEARCH FUNCTIONALITY
// ============================================================
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.items = [];
    }
    
    init(containerSelector) {
        // Create search UI
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const searchHTML = `
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="🔍 Search questions..." autocomplete="off">
                    <span class="search-icon">⌘K</span>
                </div>
                <div class="search-stats" id="searchStats"></div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', searchHTML);
        
        this.searchInput = document.getElementById('searchInput');
        this.items = document.querySelectorAll('.qa-item, .mcq-item, .quiz-item');
        
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Keyboard shortcut: Cmd/Ctrl + K
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }
    
    handleSearch(query) {
        const lowerQuery = query.toLowerCase().trim();
        let visibleCount = 0;
        
        this.items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(lowerQuery);
            
            item.classList.toggle('hidden', !matches && lowerQuery !== '');
            if (matches || lowerQuery === '') visibleCount++;
            
            // Highlight matching text
            if (matches && lowerQuery) {
                this.highlightText(item, lowerQuery);
            } else {
                this.removeHighlight(item);
            }
        });
        
        // Update stats
        const stats = document.getElementById('searchStats');
        if (lowerQuery) {
            stats.textContent = `Found ${visibleCount} of ${this.items.length} questions`;
        } else {
            stats.textContent = '';
        }
    }
    
    highlightText(element, query) {
        const h3 = element.querySelector('h3');
        if (!h3) return;
        
        const originalText = h3.getAttribute('data-original') || h3.textContent;
        h3.setAttribute('data-original', originalText);
        
        const regex = new RegExp(`(${query})`, 'gi');
        h3.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
    }
    
    removeHighlight(element) {
        const h3 = element.querySelector('h3');
        if (!h3) return;
        
        const original = h3.getAttribute('data-original');
        if (original) {
            h3.textContent = original;
            h3.removeAttribute('data-original');
        }
    }
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
class BackToTopButton {
    constructor() {
        this.button = null;
        this.init();
    }
    
    init() {
        // Create button
        this.button = document.createElement('button');
        this.button.id = 'backToTop';
        this.button.innerHTML = '↑';
        this.button.title = 'Back to top (Ctrl + ↑)';
        document.body.appendChild(this.button);
        
        // Event listeners
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }
    
    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================================
// DARK MODE TOGGLE
// ============================================================
class DarkModeToggle {
    constructor() {
        this.button = null;
        this.init();
    }
    
    init() {
        // Create toggle button
        this.button = document.createElement('button');
        this.button.className = 'theme-toggle';
        this.button.title = 'Toggle dark mode (D)';
        this.updateIcon();
        document.body.appendChild(this.button);
        
        // Apply saved theme
        if (AppState.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Event listeners
        this.button.addEventListener('click', () => this.toggle());
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                this.toggle();
            }
        });
    }
    
    toggle() {
        AppState.toggleDarkMode();
        this.updateIcon();
    }
    
    updateIcon() {
        this.button.innerHTML = AppState.darkMode ? '☀️' : '🌙';
    }
}

// ============================================================
// PROGRESS TRACKING
// ============================================================
class ProgressTracker {
    constructor() {
        this.pageKey = AppState.currentPage;
        this.learned = new Set(AppState.progress[this.pageKey] || []);
    }
    
    init(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        // Create progress UI
        const progressHTML = `
            <div class="progress-container">
                <h3>📊 Learning Progress</h3>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="progressBar">0%</div>
                </div>
                <div class="progress-stats">
                    <div class="progress-stat">
                        <div class="progress-stat-value" id="learnedCount">0</div>
                        <div class="progress-stat-label">Learned</div>
                    </div>
                    <div class="progress-stat">
                        <div class="progress-stat-value" id="totalCount">0</div>
                        <div class="progress-stat-label">Total</div>
                    </div>
                    <div class="progress-stat">
                        <div class="progress-stat-value" id="percentComplete">0%</div>
                        <div class="progress-stat-label">Complete</div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn-submit" onclick="progressTracker.resetProgress()">Reset Progress</button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', progressHTML);
        
        // Add checkboxes to questions
        this.addCheckboxes();
        this.updateDisplay();
    }
    
    addCheckboxes() {
        const items = document.querySelectorAll('.qa-item:not(.custom-qa-item), .mcq-item');
        items.forEach((item, index) => {
            const id = `q-${this.pageKey}-${index}`;
            const h3 = item.querySelector('h3');
            if (!h3) return;
            
            // Create actions container if it doesn't exist
            let actionsContainer = h3.querySelector('.question-actions');
            if (!actionsContainer) {
                actionsContainer = document.createElement('div');
                actionsContainer.className = 'question-actions';
                h3.appendChild(actionsContainer);
            }
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'learned-checkbox';
            checkbox.id = id;
            checkbox.checked = this.learned.has(id);
            checkbox.title = 'Mark as learned (L)';
            
            checkbox.addEventListener('change', () => this.toggleLearned(id, item));
            
            actionsContainer.insertBefore(checkbox, actionsContainer.firstChild);
            
            if (this.learned.has(id)) {
                item.classList.add('learned');
            }
        });
    }
    
    toggleLearned(id, item) {
        if (this.learned.has(id)) {
            this.learned.delete(id);
            item.classList.remove('learned');
        } else {
            this.learned.add(id);
            item.classList.add('learned');
        }
        
        AppState.progress[this.pageKey] = Array.from(this.learned);
        AppState.saveProgress();
        this.updateDisplay();
    }
    
    updateDisplay() {
        const total = document.querySelectorAll('.qa-item:not(.custom-qa-item), .mcq-item').length;
        const learned = this.learned.size;
        const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
        
        document.getElementById('learnedCount').textContent = learned;
        document.getElementById('totalCount').textContent = total;
        document.getElementById('percentComplete').textContent = percent + '%';
        
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = percent + '%';
        progressBar.textContent = percent + '%';
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset your progress on this page?')) {
            this.learned.clear();
            AppState.progress[this.pageKey] = [];
            AppState.saveProgress();
            
            document.querySelectorAll('.learned-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.learned').forEach(item => item.classList.remove('learned'));
            
            this.updateDisplay();
        }
    }
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
class KeyboardShortcuts {
    constructor() {
        this.hintsVisible = false;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.init();
    }
    
    init() {
        this.questions = Array.from(document.querySelectorAll('.qa-item, .mcq-item'));
        
        // Create hints panel
        const hintsHTML = `
            <div class="keyboard-hints" id="keyboardHints">
                <strong>⌨️ Keyboard Shortcuts</strong><br>
                <kbd>J</kbd> / <kbd>K</kbd> - Next/Previous question<br>
                <kbd>Enter</kbd> - Expand/collapse answer<br>
                <kbd>B</kbd> - Bookmark position<br>
                <kbd>S</kbd> - Focus search<br>
                <kbd>D</kbd> - Toggle dark mode<br>
                <kbd>L</kbd> - Mark as learned<br>
                <kbd>?</kbd> - Show this help<br>
                <kbd>Ctrl+↑</kbd> - Back to top
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', hintsHTML);
        this.hintsPanel = document.getElementById('keyboardHints');
        
        // Listen for shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        // Skip if typing in input
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case 'j':
                e.preventDefault();
                this.navigateQuestion(1);
                break;
            case 'k':
                e.preventDefault();
                this.navigateQuestion(-1);
                break;
            case 'enter':
                e.preventDefault();
                this.toggleCurrentAnswer();
                break;
            case 'b':
                e.preventDefault();
                if (typeof addBookmark === 'function') addBookmark();
                break;
            case 's':
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
                break;
            case 'l':
                e.preventDefault();
                this.toggleCurrentLearned();
                break;
            case '?':
                e.preventDefault();
                this.toggleHints();
                break;
        }
    }
    
    navigateQuestion(direction) {
        this.currentQuestionIndex += direction;
        if (this.currentQuestionIndex < 0) this.currentQuestionIndex = this.questions.length - 1;
        if (this.currentQuestionIndex >= this.questions.length) this.currentQuestionIndex = 0;
        
        const question = this.questions[this.currentQuestionIndex];
        if (question && !question.classList.contains('hidden')) {
            question.scrollIntoView({ behavior: 'smooth', block: 'center' });
            question.style.outline = '3px solid #3b82f6';
            setTimeout(() => question.style.outline = '', 2000);
        }
    }
    
    toggleCurrentAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        const button = question.querySelector('.view-answer-btn');
        if (button) button.click();
    }
    
    toggleCurrentLearned() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        const checkbox = question.querySelector('.learned-checkbox');
        if (checkbox) checkbox.click();
    }
    
    toggleHints() {
        this.hintsVisible = !this.hintsVisible;
        this.hintsPanel.classList.toggle('show', this.hintsVisible);
        
        if (this.hintsVisible) {
            setTimeout(() => {
                this.hintsVisible = false;
                this.hintsPanel.classList.remove('show');
            }, 5000);
        }
    }
}

// ============================================================
// STUDY TIMER (Pomodoro)
// ============================================================
class StudyTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.isRunning = false;
        this.interval = null;
    }
    
    init(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const timerHTML = `
            <div class="timer-container">
                <h3>⏱️ Study Timer (Pomodoro)</h3>
                <div class="timer-display" id="timerDisplay">25:00</div>
                <div class="timer-controls">
                    <button class="timer-btn start" onclick="studyTimer.start()">▶️ Start</button>
                    <button class="timer-btn pause" onclick="studyTimer.pause()">⏸️ Pause</button>
                    <button class="timer-btn reset" onclick="studyTimer.reset()">🔄 Reset</button>
                </div>
                <div style="margin-top: 15px;">
                    <select onchange="studyTimer.setDuration(this.value)" style="padding: 8px; border-radius: 6px;">
                        <option value="25">25 minutes (Focus)</option>
                        <option value="5">5 minutes (Break)</option>
                        <option value="15">15 minutes (Long Break)</option>
                        <option value="50">50 minutes (Deep Work)</option>
                    </select>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', timerHTML);
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    reset() {
        this.pause();
        this.timeLeft = 25 * 60;
        this.updateDisplay();
    }
    
    setDuration(minutes) {
        this.pause();
        this.timeLeft = minutes * 60;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    complete() {
        this.pause();
        alert('⏰ Time\'s up! Take a break! 🎉');
        this.reset();
    }
}

// ============================================================
// EXPORT/IMPORT CUSTOM QUESTIONS
// ============================================================
class QuestionExporter {
    static exportQuestions(storageKey) {
        const questions = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const dataStr = JSON.stringify(questions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${storageKey}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('✅ Questions exported successfully!');
    }
    
    static importQuestions(storageKey, file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format');
                }
                
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const merged = [...existing, ...imported];
                
                localStorage.setItem(storageKey, JSON.stringify(merged));
                alert(`✅ Imported ${imported.length} questions!`);
                window.location.reload();
            } catch (error) {
                alert('❌ Error importing questions. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// ============================================================
// CODE COPY BUTTONS
// ============================================================
class CodeCopyManager {
    static init() {
        document.querySelectorAll('pre').forEach(pre => {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.textContent = 'Copy';
            button.onclick = () => this.copyCode(pre, button);
            wrapper.appendChild(button);
        });
    }
    
    static copyCode(pre, button) {
        const code = pre.textContent;
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = '✓ Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        });
    }
}

// ============================================================
// PRINT FUNCTION
// ============================================================
function printPage() {
    // Show all answers before printing
    document.querySelectorAll('.answer, .mcq-answer, .answer-box').forEach(el => {
        el.style.display = 'block';
    });
    
    window.print();
}

// ============================================================
// GLOBAL INSTANCES
// ============================================================
let searchManager;
let progressTracker;
let studyTimer;
let keyboardShortcuts;
let backToTopButton;
let darkModeToggle;

// ============================================================
// INITIALIZATION
// ============================================================
function initializeFeatures() {
    // Initialize all features
    backToTopButton = new BackToTopButton();
    darkModeToggle = new DarkModeToggle();
    searchManager = new SearchManager();
    progressTracker = new ProgressTracker();
    studyTimer = new StudyTimer();
    keyboardShortcuts = new KeyboardShortcuts();
    
    // Initialize for Q&A pages
    if (document.querySelector('.qa-container')) {
        searchManager.init('.qa-container');
        progressTracker.init('.qa-container');
        studyTimer.init('.qa-container');
    }
    
    // Initialize for quiz pages
    if (document.querySelector('.quiz-container')) {
        searchManager.init('.quiz-container');
    }
    
    // Initialize code copy buttons
    CodeCopyManager.init();
    
    // Show keyboard hints on first visit
    const firstVisit = !localStorage.getItem('visited');
    if (firstVisit) {
        localStorage.setItem('visited', 'true');
        setTimeout(() => {
            keyboardShortcuts.toggleHints();
        }, 2000);
    }
}

// ============================================================
// DIFFICULTY LEVELS & FILTERING
// ============================================================
class DifficultyManager {
    constructor() {
        this.difficulties = ['easy', 'medium', 'hard'];
        this.currentFilter = 'all';
    }
    
    init() {
        this.addDifficultyBadges();
        this.createFilterUI();
    }
    
    addDifficultyBadges() {
        const questions = document.querySelectorAll('.qa-item, .mcq-item');
        questions.forEach((question, index) => {
            const difficulty = this.assignDifficulty(question, index);
            const badge = document.createElement('span');
            badge.className = `difficulty-badge ${difficulty}`;
            badge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            badge.dataset.difficulty = difficulty;
            
            const header = question.querySelector('h3');
            if (header) {
                header.insertBefore(badge, header.firstChild);
            }
        });
    }
    
    assignDifficulty(question, index) {
        // Smart difficulty assignment based on content
        const text = question.textContent.toLowerCase();
        const hasCode = question.querySelector('pre, code');
        const answerLength = question.querySelector('.answer, .mcq-answer')?.textContent.length || 0;
        
        let score = 0;
        if (hasCode) score += 2;
        if (answerLength > 500) score += 2;
        if (text.includes('advanced') || text.includes('complex')) score += 2;
        if (text.includes('basic') || text.includes('simple')) score -= 2;
        
        if (score >= 4) return 'hard';
        if (score >= 1) return 'medium';
        return 'easy';
    }
    
    createFilterUI() {
        const container = document.querySelector('.search-container') || document.querySelector('.qa-container');
        if (!container) return;
        
        const filterHTML = `
            <div class="difficulty-filter">
                <label>Filter by Difficulty:</label>
                <button class="filter-btn active" onclick="difficultyManager.filter('all')">All</button>
                <button class="filter-btn easy" onclick="difficultyManager.filter('easy')">Easy</button>
                <button class="filter-btn medium" onclick="difficultyManager.filter('medium')">Medium</button>
                <button class="filter-btn hard" onclick="difficultyManager.filter('hard')">Hard</button>
            </div>
        `;
        
        const filterDiv = document.createElement('div');
        filterDiv.innerHTML = filterHTML;
        container.insertAdjacentElement('afterend', filterDiv.firstElementChild);
    }
    
    filter(difficulty) {
        this.currentFilter = difficulty;
        const questions = document.querySelectorAll('.qa-item, .mcq-item, .quiz-item');
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        questions.forEach(question => {
            const badge = question.querySelector('.difficulty-badge');
            if (difficulty === 'all' || badge?.dataset.difficulty === difficulty) {
                question.style.display = '';
            } else {
                question.style.display = 'none';
            }
        });
        
        progressTracker?.updateProgress();
    }
}

// ============================================================
// QUIZ MODE
// ============================================================
class QuizMode {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.timeLimit = 0;
        this.timer = null;
        this.active = false;
    }
    
    init() {
        this.createQuizButton();
    }
    
    createQuizButton() {
        const container = document.querySelector('.progress-container') || document.querySelector('.qa-container');
        if (!container) return;
        
        const btn = document.createElement('button');
        btn.className = 'quiz-mode-btn';
        btn.innerHTML = '🎯 Start Quiz Mode';
        btn.onclick = () => this.showQuizSetup();
        
        container.insertAdjacentElement('afterend', btn);
    }
    
    showQuizSetup() {
        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-modal-content">
                <h2>🎯 Quiz Mode Setup</h2>
                <div class="quiz-setup">
                    <label>Number of Questions:
                        <input type="number" id="quizCount" value="10" min="5" max="50">
                    </label>
                    <label>Time Limit (minutes):
                        <input type="number" id="quizTime" value="15" min="5" max="60">
                    </label>
                    <label>Difficulty:
                        <select id="quizDifficulty">
                            <option value="all">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    <label>Question Type:
                        <select id="quizType">
                            <option value="all">All Types</option>
                            <option value="mcq">MCQ Only</option>
                            <option value="qa">Q&A Only</option>
                        </select>
                    </label>
                </div>
                <div class="quiz-buttons">
                    <button onclick="quizMode.start()">Start Quiz</button>
                    <button onclick="quizMode.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    start() {
        const count = parseInt(document.getElementById('quizCount').value);
        this.timeLimit = parseInt(document.getElementById('quizTime').value) * 60;
        
        // Get random questions
        const allQuestions = Array.from(document.querySelectorAll('.qa-item, .mcq-item, .quiz-item'));
        this.questions = this.shuffleArray(allQuestions).slice(0, count);
        
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.active = true;
        
        this.closeModal();
        this.renderQuizInterface();
        this.startTimer();
    }
    
    renderQuizInterface() {
        const quizContainer = document.createElement('div');
        quizContainer.id = 'quiz-interface';
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">Question ${this.currentQuestion + 1} of ${this.questions.length}</div>
                <div class="quiz-timer" id="quizTimer">15:00</div>
                <div class="quiz-score">Score: ${this.score}/${this.questions.length}</div>
            </div>
            <div class="quiz-content" id="quizContent"></div>
            <div class="quiz-controls">
                <button onclick="quizMode.previousQuestion()">← Previous</button>
                <button onclick="quizMode.nextQuestion()">Next →</button>
                <button onclick="quizMode.submitQuiz()" class="submit-btn">Submit Quiz</button>
            </div>
        `;
        
        document.querySelector('.qa-container, .quiz-container, .container').style.display = 'none';
        document.body.appendChild(quizContainer);
        
        this.showQuestion();
    }
    
    showQuestion() {
        const content = document.getElementById('quizContent');
        const question = this.questions[this.currentQuestion].cloneNode(true);
        content.innerHTML = '';
        content.appendChild(question);
    }
    
    startTimer() {
        let remaining = this.timeLimit;
        this.timer = setInterval(() => {
            remaining--;
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            document.getElementById('quizTimer').textContent = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (remaining <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
            document.querySelector('.quiz-progress').textContent = 
                `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion();
            document.querySelector('.quiz-progress').textContent = 
                `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        }
    }
    
    submitQuiz() {
        clearInterval(this.timer);
        this.active = false;
        this.showResults();
    }
    
    showResults() {
        const quizInterface = document.getElementById('quiz-interface');
        quizInterface.innerHTML = `
            <div class="quiz-results">
                <h2>🎉 Quiz Complete!</h2>
                <div class="results-summary">
                    <div class="result-stat">
                        <div class="result-value">${this.score}</div>
                        <div class="result-label">Correct</div>
                    </div>
                    <div class="result-stat">
                        <div class="result-value">${this.questions.length - this.score}</div>
                        <div class="result-label">Incorrect</div>
                    </div>
                    <div class="result-stat">
                        <div class="result-value">${Math.round((this.score / this.questions.length) * 100)}%</div>
                        <div class="result-label">Score</div>
                    </div>
                </div>
                <button onclick="quizMode.restart()">Take Another Quiz</button>
                <button onclick="quizMode.exitQuiz()">Back to Learning</button>
            </div>
        `;
    }
    
    exitQuiz() {
        document.getElementById('quiz-interface')?.remove();
        document.querySelector('.qa-container, .quiz-container, .container').style.display = '';
    }
    
    closeModal() {
        document.querySelector('.quiz-modal')?.remove();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    restart() {
        this.exitQuiz();
        this.showQuizSetup();
    }
}

// ============================================================
// FLASHCARD MODE
// ============================================================
class FlashcardMode {
    constructor() {
        this.active = false;
    }
    
    init() {
        this.createToggleButton();
    }
    
    createToggleButton() {
        const container = document.querySelector('.progress-container');
        if (!container) return;
        
        const btn = document.createElement('button');
        btn.className = 'flashcard-toggle-btn';
        btn.innerHTML = '🎴 Flashcard Mode';
        btn.onclick = () => this.toggle();
        
        container.appendChild(btn);
    }
    
    toggle() {
        this.active = !this.active;
        document.body.classList.toggle('flashcard-mode', this.active);
        
        const answers = document.querySelectorAll('.answer, .mcq-answer, .answer-box');
        answers.forEach(answer => {
            if (this.active) {
                answer.classList.add('flashcard-hidden');
                answer.classList.remove('show');
            } else {
                answer.classList.remove('flashcard-hidden');
            }
        });
        
        if (this.active) {
            this.setupFlashcardInteraction();
        }
        
        event.target.textContent = this.active ? '📖 Normal Mode' : '🎴 Flashcard Mode';
    }
    
    setupFlashcardInteraction() {
        document.querySelectorAll('.qa-item, .mcq-item, .quiz-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.onclick = () => {
                const answer = item.querySelector('.answer, .mcq-answer, .answer-box');
                if (answer) {
                    answer.classList.toggle('flashcard-revealed');
                }
            };
        });
    }
}

// ============================================================
// STUDY NOTES
// ============================================================
class StudyNotes {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('studyNotes') || '{}');
    }
    
    init() {
        this.addNoteButtons();
    }
    
    addNoteButtons() {
        document.querySelectorAll('.qa-item, .mcq-item').forEach((item, index) => {
            const noteBtn = document.createElement('button');
            noteBtn.className = 'note-btn';
            noteBtn.innerHTML = '📝 Note';
            noteBtn.onclick = () => this.openNoteEditor(index);
            
            const header = item.querySelector('h3');
            if (header) {
                // Create actions container if it doesn't exist
                let actionsContainer = header.querySelector('.question-actions');
                if (!actionsContainer) {
                    actionsContainer = document.createElement('div');
                    actionsContainer.className = 'question-actions';
                    header.appendChild(actionsContainer);
                }
                actionsContainer.appendChild(noteBtn);
            }
            
            if (this.notes[index]) {
                this.displayNote(item, index);
            }
        });
    }
    
    openNoteEditor(questionIndex) {
        const modal = document.createElement('div');
        modal.className = 'note-modal';
        modal.innerHTML = `
            <div class="note-modal-content">
                <h3>📝 Study Note</h3>
                <textarea id="noteText" placeholder="Write your notes here...">${this.notes[questionIndex] || ''}</textarea>
                <div class="note-buttons">
                    <button onclick="studyNotes.saveNote(${questionIndex})">Save</button>
                    <button onclick="studyNotes.deleteNote(${questionIndex})">Delete</button>
                    <button onclick="studyNotes.closeNoteModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    saveNote(questionIndex) {
        const text = document.getElementById('noteText').value;
        if (text.trim()) {
            this.notes[questionIndex] = text;
            localStorage.setItem('studyNotes', JSON.stringify(this.notes));
            
            const question = document.querySelectorAll('.qa-item, .mcq-item')[questionIndex];
            this.displayNote(question, questionIndex);
        }
        this.closeNoteModal();
    }
    
    deleteNote(questionIndex) {
        delete this.notes[questionIndex];
        localStorage.setItem('studyNotes', JSON.stringify(this.notes));
        
        const question = document.querySelectorAll('.qa-item, .mcq-item')[questionIndex];
        question.querySelector('.study-note')?.remove();
        
        this.closeNoteModal();
    }
    
    displayNote(question, index) {
        const existing = question.querySelector('.study-note');
        if (existing) existing.remove();
        
        const noteDiv = document.createElement('div');
        noteDiv.className = 'study-note';
        noteDiv.innerHTML = `<strong>📝 My Note:</strong> ${this.notes[index]}`;
        
        question.querySelector('.answer, .mcq-answer')?.insertAdjacentElement('afterend', noteDiv);
    }
    
    closeNoteModal() {
        document.querySelector('.note-modal')?.remove();
    }
}

// ============================================================
// STATISTICS DASHBOARD
// ============================================================
class StatisticsDashboard {
    constructor() {
        this.stats = JSON.parse(localStorage.getItem('stats') || '{}');
    }
    
    init() {
        this.createDashboardButton();
        this.trackActivity();
    }
    
    createDashboardButton() {
        const nav = document.querySelector('.navbar, .page-navigation');
        if (!nav) return;
        
        const btn = document.createElement('a');
        btn.href = '#';
        btn.textContent = '📊 Stats';
        btn.onclick = (e) => {
            e.preventDefault();
            this.showDashboard();
        };
        
        nav.appendChild(btn);
    }
    
    trackActivity() {
        // Track page visits
        const page = AppState.currentPage;
        this.stats[page] = this.stats[page] || { visits: 0, timeSpent: 0, questionsViewed: 0 };
        this.stats[page].visits++;
        this.stats[page].lastVisit = new Date().toISOString();
        
        // Track time spent
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            this.stats[page].timeSpent += timeSpent;
            localStorage.setItem('stats', JSON.stringify(this.stats));
        });
    }
    
    showDashboard() {
        const modal = document.createElement('div');
        modal.className = 'stats-modal';
        modal.innerHTML = `
            <div class="stats-modal-content">
                <button class="close-btn" onclick="this.closest('.stats-modal').remove()">×</button>
                <h2>📊 Your Statistics</h2>
                <div class="stats-grid">
                    ${this.generateStatsHTML()}
                </div>
                <div class="stats-charts">
                    <canvas id="progressChart"></canvas>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.renderCharts();
    }
    
    generateStatsHTML() {
        const totalTime = Object.values(this.stats).reduce((sum, s) => sum + (s.timeSpent || 0), 0);
        const totalVisits = Object.values(this.stats).reduce((sum, s) => sum + (s.visits || 0), 0);
        
        return `
            <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value">${Math.floor(totalTime / 60)} min</div>
                <div class="stat-label">Total Study Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-value">${totalVisits}</div>
                <div class="stat-label">Total Visits</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${Object.keys(AppState.progress).length}</div>
                <div class="stat-label">Questions Learned</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-value">${this.getStreak()}</div>
                <div class="stat-label">Day Streak</div>
            </div>
        `;
    }
    
    getStreak() {
        // Calculate consecutive days of study
        const visits = Object.values(this.stats)
            .map(s => s.lastVisit)
            .filter(Boolean)
            .sort()
            .reverse();
        
        if (visits.length === 0) return 0;
        
        let streak = 1;
        for (let i = 0; i < visits.length - 1; i++) {
            const date1 = new Date(visits[i]).setHours(0, 0, 0, 0);
            const date2 = new Date(visits[i + 1]).setHours(0, 0, 0, 0);
            const diff = (date1 - date2) / (1000 * 60 * 60 * 24);
            
            if (diff === 1) streak++;
            else break;
        }
        
        return streak;
    }
    
    renderCharts() {
        // Simple text-based chart (can be enhanced with Chart.js later)
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#3b82f6';
        ctx.font = '14px Inter';
        ctx.fillText('Progress over time', 10, 20);
    }
}

// ============================================================
// ANIMATIONS & MICRO-INTERACTIONS
// ============================================================
class AnimationManager {
    init() {
        this.addConfettiOnCorrect();
        this.addSmoothScrolling();
        this.addHoverEffects();
        this.addProgressRings();
    }
    
    addConfettiOnCorrect() {
        // Listen for correct MCQ answers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('selected-correct')) {
                this.showConfetti(e.target);
            }
        });
    }
    
    showConfetti(element) {
        const rect = element.getBoundingClientRect();
        const confetti = document.createElement('div');
        confetti.className = 'confetti-container';
        confetti.style.position = 'fixed';
        confetti.style.left = rect.left + 'px';
        confetti.style.top = rect.top + 'px';
        
        for (let i = 0; i < 30; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = (Math.random() * 100) + '%';
            piece.style.animationDelay = (Math.random() * 0.5) + 's';
            confetti.appendChild(piece);
        }
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
    
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    addHoverEffects() {
        document.querySelectorAll('.qa-item, .mcq-item, .quiz-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    addProgressRings() {
        // Add circular progress indicators
        const progressContainers = document.querySelectorAll('.progress-stat-value');
        progressContainers.forEach(container => {
            container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
}

// ============================================================
// RANDOM QUESTION FEATURE
// ============================================================
class RandomQuestion {
    init() {
        this.createButton();
    }
    
    createButton() {
        const container = document.querySelector('.progress-container');
        if (!container) return;
        
        const btn = document.createElement('button');
        btn.className = 'random-question-btn';
        btn.innerHTML = '🎲 Surprise Me!';
        btn.onclick = () => this.showRandom();
        
        container.appendChild(btn);
    }
    
    showRandom() {
        const questions = Array.from(document.querySelectorAll('.qa-item, .mcq-item, .quiz-item'));
        if (questions.length === 0) return;
        
        const random = questions[Math.floor(Math.random() * questions.length)];
        random.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Flash highlight
        random.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            random.style.animation = '';
        }, 1000);
    }
}

// ============================================================
// TOPIC FILTERING
// ============================================================
class TopicFilter {
    constructor() {
        this.activeTopics = new Set();
    }
    
    init() {
        this.createFilterUI();
    }
    
    createFilterUI() {
        const topics = this.extractTopics();
        if (topics.length === 0) return;
        
        const container = document.querySelector('.search-container');
        if (!container) return;
        
        const filterHTML = `
            <div class="topic-filter">
                <label>Filter by Topic:</label>
                <div class="topic-chips">
                    ${topics.map(topic => `
                        <button class="topic-chip" onclick="topicFilter.toggle('${topic}')">${topic}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterend', filterHTML);
    }
    
    extractTopics() {
        const headers = document.querySelectorAll('.category-header');
        return Array.from(headers).map(h => h.textContent.trim());
    }
    
    toggle(topic) {
        if (this.activeTopics.has(topic)) {
            this.activeTopics.delete(topic);
        } else {
            this.activeTopics.add(topic);
        }
        
        this.applyFilter();
    }
    
    applyFilter() {
        if (this.activeTopics.size === 0) {
            document.querySelectorAll('.qa-item, .mcq-item').forEach(q => q.style.display = '');
            return;
        }
        
        // Implementation depends on page structure
        // This is a simplified version
    }
}

// ============================================================
// GLOBAL INSTANCES
// ============================================================
let difficultyManager;
let quizMode;
let flashcardMode;
let studyNotes;
let statisticsDashboard;
let animationManager;
let randomQuestion;
let topicFilter;

// ============================================================
// ENHANCED INITIALIZATION
// ============================================================
function initializeEnhancedFeatures() {
    // Initialize new features
    difficultyManager = new DifficultyManager();
    difficultyManager.init();
    
    quizMode = new QuizMode();
    quizMode.init();
    
    flashcardMode = new FlashcardMode();
    flashcardMode.init();
    
    studyNotes = new StudyNotes();
    studyNotes.init();
    
    statisticsDashboard = new StatisticsDashboard();
    statisticsDashboard.init();
    
    animationManager = new AnimationManager();
    animationManager.init();
    
    randomQuestion = new RandomQuestion();
    randomQuestion.init();
    
    topicFilter = new TopicFilter();
    topicFilter.init();
    
    console.log('✅ All enhanced features initialized!');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFeatures();
        initializeEnhancedFeatures();
    });
} else {
    initializeFeatures();
    initializeEnhancedFeatures();
}
