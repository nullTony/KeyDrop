export const registerMain = document.querySelector('.regSystem');
export const signInCard = document.querySelector('.signIn');
export const signUpCard = document.querySelector('.signUp');

const signInClose = document.querySelectorAll('.loginClose');
const toSignUp = document.querySelector('#toSignUp');
const toSignIn = document.querySelector('#toSignIn');

export function register() {
    registerMain.style.display = 'flex';
    signInCard.style.display = 'block';
    signUpCard.style.display = 'none';

    toSignUp.addEventListener('click', () => {
        signInCard.style.display = 'none';
        signUpCard.style.display = 'block';
    });

    toSignIn.addEventListener('click', () => {
        signInCard.style.display = 'block';
        signUpCard.style.display = 'none';
    });

    signInClose.forEach(closeBtn =>
        closeBtn.addEventListener('click', () => {
            registerMain.style.display = "none";
            document.getElementById("profile_container").style.display = "none";
        }));
}

const eyeContainers = document.querySelectorAll("#eyeShow");

eyeContainers.forEach(container => {
    const eyeOff = container.querySelector("#eyeOff");
    const eyeOn = container.querySelector("#eyeOn");

    const input = container.previousElementSibling;

    if (eyeOn) eyeOn.style.display = "none";

    container.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            eyeOff.style.display = "none";
            eyeOn.style.display = "block";
        } else {
            input.type = "password";
            eyeOff.style.display = "block";
            eyeOn.style.display = "none";
        }
    });
});

import { hotBth, headerJoin, headerReg, favorite, userLogo, basketBtn, renderAuthButtons } from './main.js'

if (headerJoin) {
    headerJoin.addEventListener("click", () => {
        register();
    });
}

if (headerReg) {
    headerReg.addEventListener("click", () => {
        register();
        signInCard.style.display = 'none';
        signUpCard.style.display = 'block';
    });
}

const signInBtn = document.getElementById("joinAcc");

const emailJoinErr = document.getElementById("emailJoinErr");
const passJoinErr = document.getElementById("passJoinErr");

signInBtn.addEventListener("click", async () => {
    emailJoinErr.innerHTML = "";
    passJoinErr.innerHTML = "";

    const passwordJoin = document.getElementById("passwordJoin").value;
    const emailJoin = document.getElementById("emailJoin").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (emailJoin === "") {
        emailJoinErr.innerHTML = "Email field cannot be empty";
        return;
    }

    if (!emailPattern.test(emailJoin)) {
        emailJoinErr.innerHTML = "Please enter a valid email address (e.g., name@icloud.com)";
        return;
    }

    if (passwordJoin === "") {
        passJoinErr.innerHTML = "Password field cannot be empty";
        return;
    }


    if (passwordJoin.length < 8) {
        passJoinErr.innerHTML = "Password must be at least 8 characters long";
        return;
    }



    const hashedInputPassword = await hashPassword(passwordJoin);

    fetch("https://697b7dc30e6ff62c3c5c3d92.mockapi.io/users")
        .then(res => res.json())
        .then(users => {
            const foundUser = users.find(u =>
                u.email === emailJoin && u.password === hashedInputPassword
            );

            if (foundUser) {
                localStorage.setItem("userToken", foundUser.token);
                localStorage.setItem("isLoggedIn", "true");

                const { password, ...userData } = foundUser;
                localStorage.setItem("currentUser", JSON.stringify(userData));

                signInCard.style.display = "none";
                signUpCard.style.display = "none";
                registerMain.style.display = "none";

                renderAuthButtons();

                console.log("Вход выполнен успешно!");
            } else {
                emailJoinErr.innerHTML = "Invalid email or password";
            }
        })
        .catch(err => console.error("Ошибка при входе:", err));
});

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken() {
    return crypto.randomUUID();
}

const signUpBtn = document.getElementById("addAcc");

signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("passwordSign").value;
    const confirmPass = document.getElementById("reg-confirm-password").value;
    const terms = document.getElementById("terms").checked;

    const errEmail = document.getElementById("errRagEmail");
    const errUser = document.getElementById("errRagUsname");
    const errPass = document.getElementById("errPass");
    const errConf = document.getElementById("errConfPass");

    document.getElementById("termsT").classList.remove("errnot");

    [errEmail, errUser, errPass, errConf].forEach(el => el.innerHTML = "");

    let isValid = true;

    if (username === "") {
        errUser.innerHTML = "Please enter your username";
        isValid = false;
    } else if (username.length < 3) {
        errUser.innerHTML = "Username too short";
        isValid = false;
    }

    if (email === "") {
        errEmail.innerHTML = "Please enter your email";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errEmail.innerHTML = "Invalid email format";
        isValid = false;
    }

    if (password === "") {
        errPass.innerHTML = "Please enter your password";
        isValid = false;
    } else if (password.length < 8) {
        errPass.innerHTML = "Min 8 characters required";
        isValid = false;
    }

    if (confirmPass === "") {
        errConf.innerHTML = "Please confirm your password";
        isValid = false;
    } else if (password !== confirmPass) {
        errConf.innerHTML = "Passwords do not match";
        isValid = false;
    }

    if (!terms) {
        isValid = false;
        document.getElementById("termsT").classList.add("errnot")
    }

    if (isValid) {

        const encryptedPassword = await hashPassword(password);

        const userToken = generateToken();

        const newUser = {
            name: username,
            email: email,
            password: encryptedPassword,
            token: userToken,
            userStatus: "banned"
        };


        fetch("https://697b7dc30e6ff62c3c5c3d92.mockapi.io/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Ошибка сервера (${res.status}): ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Успешно сохранено:", data);


                localStorage.setItem('userToken', data.token);
                localStorage.setItem('isLoggedIn', "true");

                signInCard.style.display = "none";
                signUpCard.style.display = "none";
                registerMain.style.display = "none";

                renderAuthButtons();

                alert(`Аккаунт создан успешно!`);
            })
            .catch(err => {
                console.error("Детали ошибки:", err.message);
            });
    }
});