document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const settingsForm = document.getElementById('settings-form');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserEmail = document.getElementById('sidebar-user-email');
    const logoutBtn = document.getElementById('logout-btn');

    // New: Modal element references
    const logoutModalOverlay = document.getElementById('logout-modal-overlay');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');

    // ... other element references ...
    const notifReminders = document.getElementById('notif-reminders');
    const notifStreak = document.getElementById('notif-streak');
    const themeSelector = document.getElementById('theme-selector');
    const textSizeSelector = document.getElementById('text-size-selector');

    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    // --- Main Functions ---
    const loadSettings = () => {
        if (!loggedInUserEmail) {
            window.location.href = 'login.html';
            return;
        }
        // ... rest of loadSettings function is the same ...
        const settings = JSON.parse(localStorage.getItem(`userSettings_${loggedInUserEmail}`)) || {};
        userNameInput.value = settings.userName || '';
        userEmailInput.value = loggedInUserEmail;
        sidebarUserName.textContent = settings.userName || 'Guest';
        sidebarUserEmail.textContent = loggedInUserEmail;
        notifReminders.checked = settings.notifications?.reminders ?? true;
        notifStreak.checked = settings.notifications?.streak ?? true;
        const theme = localStorage.getItem('theme') || 'system';
        themeSelector.querySelector('.active')?.classList.remove('active');
        themeSelector.querySelector(`[data-value="${theme}"]`).classList.add('active');
        const textSize = localStorage.getItem('textSize') || 'normal';
        textSizeSelector.querySelector('.active')?.classList.remove('active');
        textSizeSelector.querySelector(`[data-value="${textSize}"]`).classList.add('active');
    };

    const saveSettings = (e) => {
        e.preventDefault();
        // ... saveSettings function is the same ...
        const newSettings = {
            userName: userNameInput.value,
            userEmail: loggedInUserEmail, 
            notifications: {
                reminders: notifReminders.checked,
                streak: notifStreak.checked,
            }
        };
        localStorage.setItem(`userSettings_${loggedInUserEmail}`, JSON.stringify(newSettings));
        sidebarUserName.textContent = userNameInput.value || 'Guest';
        const saveButton = settingsForm.querySelector('.submit-btn');
        saveButton.textContent = 'Saved!';
        saveButton.style.backgroundColor = 'var(--secondary-color)';
        setTimeout(() => {
            saveButton.textContent = 'Save Changes';
            saveButton.style.backgroundColor = 'var(--primary-color)';
        }, 2000);
    };

    // --- New Modal Logic ---
    const openLogoutModal = () => {
        logoutModalOverlay.classList.remove('hidden');
    };

    const closeLogoutModal = () => {
        logoutModalOverlay.classList.add('hidden');
    };

    const performLogout = () => {
        localStorage.removeItem('loggedInUserEmail');
        window.location.href = 'login.html';
    };
    
    // --- Event Listeners ---
    settingsForm.addEventListener('submit', saveSettings);
    
    if (logoutBtn) {
        // The main logout button now just opens the modal
        logoutBtn.addEventListener('click', openLogoutModal);
    }

    // New: Listen for clicks on the modal buttons
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', closeLogoutModal);
    }
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', performLogout);
    }

    // New: Close modal by clicking on the overlay or pressing Escape
    if (logoutModalOverlay) {
        logoutModalOverlay.addEventListener('click', (event) => {
            if (event.target === logoutModalOverlay) {
                closeLogoutModal();
            }
        });
    }
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !logoutModalOverlay.classList.contains('hidden')) {
            closeLogoutModal();
        }
    });

    // ... other event listeners are the same ...
    themeSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const theme = e.target.dataset.value;
            localStorage.setItem('theme', theme);
            themeSelector.querySelector('.active')?.classList.remove('active');
            e.target.classList.add('active');
            applyTheme(theme);
        }
    });

    textSizeSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const size = e.target.dataset.value;
            localStorage.setItem('textSize', size);
            document.documentElement.setAttribute('data-text-size', size);
            textSizeSelector.querySelector('.active')?.classList.remove('active');
            e.target.classList.add('active');
        }
    });
    
    loadSettings();
});

function applyTheme(theme) {
    if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}