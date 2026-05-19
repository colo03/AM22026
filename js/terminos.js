document.addEventListener('DOMContentLoaded', () => {
  const acceptCheckbox = document.getElementById('acceptTerms');
  const continueButton = document.getElementById('continueButton');

  if (!acceptCheckbox || !continueButton) {
    return;
  }

  acceptCheckbox.addEventListener('change', () => {
    const accepted = acceptCheckbox.checked;
    continueButton.disabled = !accepted;
    continueButton.classList.toggle('enabled', accepted);
  });

  continueButton.addEventListener('click', () => {
    if (acceptCheckbox.checked) {
      localStorage.setItem('termsAccepted', 'true');
      window.location.href = 'index.html';
    }
  });
});
