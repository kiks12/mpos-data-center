/* eslint-disable prettier/prettier */

const emailInput = document.getElementById('emailAddress');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login');
const form = document.getElementById('form');

const login = async (e) => {
  e.preventDefault();
  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  }

  const res = await fetch('/login/callback/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const resJSON = await res.json();

  console.log(resJSON);
}

loginButton.addEventListener('submit', login);
form.addEventListener('submit', login);