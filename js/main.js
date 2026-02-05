import { register, registerMain, signInCard, signUpCard } from './users.js';

export const hotBth = document.querySelector(".hot_cart");
export const btnJoin = document.createElement("button");
export const btnAdd = document.createElement("button");

export const favorite = document.getElementById("favorite");
export const userLogo = document.getElementById("user_logo");
export const basketBtn = document.getElementById("basketBtn");

function renderAuthButtons() {
    const authStatus = localStorage.getItem('isLoggedIn');

    if (authStatus === "true") {
        favorite.style.display = "flex";
        userLogo.style.display = "flex";
        basketBtn.style.display = "flex";
        
        btnJoin.remove();
        btnAdd.remove();
    } else {
        favorite.style.display = "none";
        userLogo.style.display = "none";
        basketBtn.style.display = "none";

        btnJoin.innerHTML = "Sign In";
        btnJoin.classList.add("basket_word");
        hotBth.appendChild(btnJoin);

        if (window.innerWidth >= 600) {
            btnAdd.innerHTML = "Sign Up";
            btnAdd.classList.add("basket_word");
            hotBth.appendChild(btnAdd);
        } else {
            btnAdd.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === null) {
        localStorage.setItem('isLoggedIn', "false");
    }
    if (authStatus === "false") {
        localStorage.setItem('isLoggedIn', "false");
        register();
    }
    renderAuthButtons();
    
});

window.addEventListener('resize', renderAuthButtons);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        signInCard.style.display = "none";
        signUpCard.style.display = "none";
        registerMain.style.display = "none";
    }
});