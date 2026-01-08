

function register() {
    const registerMain = document.querySelector('.regSystem');

    const signInCard = document.querySelector('.signIn');
    const signUpCard = document.querySelector('.signUp');

    const signInClose = document.querySelectorAll('.loginClose')

    const toSignUp = document.querySelector('#toSignUp');
    const toSignIn = document.querySelector('#toSignIn');

    registerMain.style.display = 'block';
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
        signInCard.style.display = "none";
        signUpCard.style.display = "none";
        registerMain.style.display = "none";
    }));
    registerMain.addEventListener('click', () => {
        signInCard.style.display = "none";
        signUpCard.style.display = "none";
        registerMain.style.display = "none";
    })
}