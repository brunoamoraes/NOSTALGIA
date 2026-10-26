/* Preenche mídias públicas geradas pelo workflow, sem credenciais no navegador. */
window.BRUNOVERSE_MEDIA = {};
window.BRUNOVERSE_MEDIA_READY = fetch((document.querySelector('script[src$="media.js"]')?.src || '').replace(/js\/media\.js(?:\?.*)?$/, 'assets/data/media.json'), {cache:'no-cache'})
  .then(r => r.ok ? r.json() : {})
  .then(data => {window.BRUNOVERSE_MEDIA = data && typeof data==='object' ? data : {};document.dispatchEvent(new Event('brunoverse-media-ready'));})
  .catch(() => {document.dispatchEvent(new Event('brunoverse-media-ready'));});
