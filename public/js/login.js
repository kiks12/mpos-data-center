/* eslint-disable prettier/prettier */

const emailInput = document.getElementById('emailAddress');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login');
const form = document.getElementById('form');
const error = document.getElementById('error');
const spinner = document.getElementById('spinner');
const passwordCheckBox = document.getElementById('passwordCheckBox');

const generateData = () => {
  return {
    email: emailInput.value,
    password: passwordInput.value,
  }
}

const showSpinner = () => {
  form.style.display = 'none';
  spinner.style.display = 'flex';
}

const showForm = () => {
  form.style = null;
  spinner.style.display = 'none';
}

const login = async (e) => {
  e.preventDefault();
  const data = generateData();

  showSpinner();
  const res = await fetch('/login/callback/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const resJSON = await res.json();

  if (res.status === 400) {
    error.innerText = resJSON.msg;
    showForm();
    return;
  } 

  window.location.replace('/');

}

passwordCheckBox.addEventListener('change', (e) => {
  if (e.target.checked) {
    passwordInput.type = 'text';
    return;
  }
  passwordInput.type = 'password';
});

loginButton.addEventListener('submit', login);
form.addEventListener('submit', login);