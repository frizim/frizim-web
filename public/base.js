const scheme = localStorage.getItem('colorScheme');
if(scheme) {
    document.body.querySelector('.toggle-switch-chk').checked = scheme === 'light';
}

document.querySelector('.toggle-switch-chk').addEventListener('click', (e) => {
    localStorage.setItem('colorScheme', e.target.checked ? 'light' : 'dark');
});