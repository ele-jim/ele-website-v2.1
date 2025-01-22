document.getElementById('mc-embedded-subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const emailField = document.getElementById('mce-EMAIL');
    const emailValue = emailField.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMessage = document.getElementById('mce-error-response');
    const successMessage = document.getElementById('mce-success-response');

    if (!emailRegex.test(emailValue)) {
        emailField.classList.add('invalid-email');
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        setTimeout(() => {
            emailField.classList.remove('invalid-email');
            errorMessage.style.display = 'none';
        }, 2000);
    } else {
        emailField.classList.add('valid-email');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'block';
        setTimeout(() => {
            emailField.classList.remove('valid-email');
            successMessage.style.display = 'none';
        }, 2000);
        this.submit();
    }
});
