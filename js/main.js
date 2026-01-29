import { register, registerMain, signInCard, signUpCard } from './users.js';


document.addEventListener('DOMContentLoaded', () => {
    const authStatus = localStorage.getItem('isLoggedIn');

    if (authStatus === "true") {
        registerMain.style.display = "none";
        console.log("Добро пожаловать обратно!");
    } else {
        if (authStatus === null) {
            localStorage.setItem('isLoggedIn', "false");
        }
        
        register();
        console.log("Нужно зарегистрироваться");
    }
});

document.getElementById('register').addEventListener('click', register);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        signInCard.style.display = "none";
        signUpCard.style.display = "none";
        registerMain.style.display = "none";
    }
});