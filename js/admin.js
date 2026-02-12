const sidebar = document.querySelector('.sidebar');
const modal = document.querySelector('.modal');
const header = document.querySelector('.header h1');
const sections = document.querySelectorAll('.content');
const navItems = document.querySelectorAll('.nav li');

document.querySelectorAll('[data-toggle="sidebar"]').forEach(btn => {
    btn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});

document.querySelectorAll('[data-close="sidebar"]').forEach(btn => {
    btn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

document.querySelectorAll('[data-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.toggle('active');
    });
});

document.querySelectorAll('[data-close="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        header.textContent = item.querySelector('span').textContent;

        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
        modal.classList.remove('active');
    }
});