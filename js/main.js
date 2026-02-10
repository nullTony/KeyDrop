
import { register, registerMain, signInCard, signUpCard } from './users.js';

export const hotBth = document.querySelector(".hot_cart");
export const headerReg = document.getElementById("headerReg");
export const headerJoin = document.getElementById("headerJoin");

export const favorite = document.getElementById("favorite");
export const userLogo = document.getElementById("user_logo");
export const basketBtn = document.getElementById("basketBtn");

userLogo.addEventListener("click", async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return logout();

    try {
        const response = await fetch(`https://697b7dc30e6ff62c3c5c3d92.mockapi.io/users?token=${token}`);
        const users = await response.json();

        if (users.length > 0) {
            const currentUser = users[0];
            
            const profileElement = createProfileUI(currentUser);
            
            const container = document.getElementById("profile_container");
            container.innerHTML = "";
            container.appendChild(profileElement);
            container.style.display = "flex";

        } else {
            logout();
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

function createProfileUI(user) {
    const container = document.getElementById("profile_container");
    const main = document.createElement('main');
    main.className = 'profule_controle';

    // Кнопка закрытия
    const closeBtn = document.createElement('span');
    closeBtn.className = 'closeProfile';
    closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-x">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
    </svg>
    `;
    closeBtn.onclick = () => container.remove();

    const content = document.createElement('div');
    content.innerHTML = `
        <h3>Профиль</h3>
        <p>Имя: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Статус: <b>${user.userStatus === 'active' ? 'Админ' : 'Пользователь'}</b></p>
    `;

    if (user.userStatus === 'active') {
        const adminBtn = document.createElement('button');
        adminBtn.textContent = 'Админ-панель';
        adminBtn.onclick = () => location.href = '/admin';
        content.appendChild(adminBtn);
    }

    main.appendChild(closeBtn);
    main.appendChild(content);

    return main;
}

function renderUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const profileContainer = document.querySelector(".profile_container");
    profileContainer.innerHTML = '';
    profileContainer.appendChild(main);

    if (currentUser) {
        document.getElementById("profileName").textContent = currentUser.name;
        document.getElementById("profileEmail").textContent = currentUser.email;
        document.querySelector(".profile_container").style.display = "block";
    } else {
        logout();
    }

}
function renderAdminProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        document.getElementById("profileName").textContent = `${currentUser.name} (Admin)`;
        document.getElementById("profileEmail").textContent = currentUser.email;
        document.querySelector(".profile_container").style.display = "block";
    } else {
        logout();
    }
}

// document.querySelector(".closeProfile").addEventListener("click", () => {
//     document.querySelector(".profile_container").style.display = "none"
// })

export function renderAuthButtons() {
    const authStatus = localStorage.getItem('isLoggedIn');

    if (authStatus === "true") {
        hotBth.classList.add('is-logged-in');
        hotBth.classList.remove('is-logged-out');
    } else {
        hotBth.classList.add('is-logged-out');
        hotBth.classList.remove('is-logged-in');
    }
}

function applyUserRole(status) {
    if (status === "active") {
        console.log("Доступ разрешен: Панель администратора включена");
        hotBth.classList.add('is-admin');
    } else {
        hotBth.classList.remove('is-admin');
    }
}

async function checkAuth() {
    const token = localStorage.getItem('userToken');

    if (!token) {
        localStorage.setItem('isLoggedIn', "false");
        renderAuthButtons();
        return;
    }

    try {
        const response = await fetch(`https://697b7dc30e6ff62c3c5c3d92.mockapi.io/users?token=${token}`);
        const users = await response.json();

        if (users.length > 0) {
            const currentUser = users[0];

            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            registerMain.style.display = "none";

            applyUserRole(currentUser.userStatus);

            console.log(`Вы вошли как: ${currentUser.name}. Статус: ${currentUser.userStatus}`);
        } else {
            logout();
        }
    } catch (error) {
        console.error("Ошибка авторизации:", error);
    }

    renderAuthButtons();
}

function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', "false");
    renderAuthButtons();
    location.reload();
}

document.addEventListener('DOMContentLoaded', checkAuth);

window.addEventListener('resize', renderAuthButtons);


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        signInCard.style.display = "none";
        signUpCard.style.display = "none";
        registerMain.style.display = "none";
    }
});