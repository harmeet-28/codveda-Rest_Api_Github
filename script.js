const usernameInput = document.getElementById('username-input');
const statusMessage = document.getElementById('status-message');
const profileCard = document.getElementById('profile-card');

async function fetchGitHubUser(username) {
    if (!username.trim()) {
        resetUI();
        return;
    }

    showLoading();

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User not found. Try another handle.");
            } else if (response.status === 403) {
                throw new Error("API rate limit exceeded. Please try again later.");
            } else {
                throw new Error(`Server error status: ${response.status}`);
            }
        }

        const data = await response.json();
        
        renderProfileCard(data);

    } catch (error) {
        showError(error.message);
    }
}

function showLoading() {
    profileCard.classList.add('hidden');
    statusMessage.className = "status-box active loading";
    statusMessage.innerText = "fetching payload from server...";
}

function showError(message) {
    profileCard.classList.add('hidden');
    statusMessage.className = "status-box active error";
    statusMessage.innerText = `ERR: ${message}`;
}

function resetUI() {
    profileCard.classList.add('hidden');
    statusMessage.className = "status-box";
    statusMessage.innerText = "";
}

function renderProfileCard(user) {
    statusMessage.className = "status-box";
    
    profileCard.innerHTML = `
        <div class="profile-meta-row">
            <img class="avatar" src="${user.avatar_url}" alt="${user.login}">
            <div class="meta-text">
                <h2 class="name">${user.name || user.login}</h2>
                <span class="username">@${user.login}</span>
            </div>
        </div>
        
        <p class="bio">${user.bio || "No description provided by user node."}</p>
        
        <div class="stats-grid">
            <div class="stat-cell">
                <div class="stat-value">${user.public_repos}</div>
                <div class="stat-label">Repos</div>
            </div>
            <div class="stat-cell">
                <div class="stat-value">${user.followers}</div>
                <div class="stat-label">Followers</div>
            </div>
            <div class="stat-cell">
                <div class="stat-value">${user.following}</div>
                <div class="stat-label">Following</div>
            </div>
        </div>

        <a href="${user.html_url}" target="_blank" class="action-link">LAUNCH NODE LINK ↗</a>
    `;
    
    profileCard.classList.remove('hidden');
}

function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
const optimizedSearch = debounce((event) => {
    fetchGitHubUser(event.target.value);
}, 500);

usernameInput.addEventListener('input', optimizedSearch);