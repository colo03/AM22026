document.addEventListener('DOMContentLoaded', () => {
  const accepted = localStorage.getItem('termsAccepted') === 'true';
  const onTermsPage = window.location.href.includes('terminos.html');

  if (!accepted && !onTermsPage) {
    window.location.href = 'terminos.html';
  }
});
