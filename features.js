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
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'learned-checkbox';
            checkbox.id = id;
            checkbox.checked = this.learned.has(id);
            checkbox.title = 'Mark as learned (L)';
            
            checkbox.addEventListener('change', () => this.toggleLearned(id, item));
            
            h3.appendChild(checkbox);
            
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}
