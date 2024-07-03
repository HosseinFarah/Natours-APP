/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};
export const showAlert = (type, msg) => {
  hideAlert();
  const el = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('beforebegin', el);
  window.setTimeout(hideAlert, 2500);
};
