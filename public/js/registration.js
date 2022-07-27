/* eslint-disable prettier/prettier */

const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const lastNameInput = document.getElementById('lastName');
const contactNumberInput = document.getElementById('contactNumber');
const emailAddressInput = document.getElementById('emailAddress');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordCheckBox = document.getElementById('passwordCheckBox');
const createButton = document.getElementById('createButton');
const form = document.getElementById('form');
const spinner = document.getElementById('spinner');
const error = document.getElementById('error');
const success = document.getElementById('success');


const submitForm = async (e) => {
  e.preventDefault();

  if (!passwordMatching()) {
    error.innerHTML = 'Passwords not matching!';
    return;
  }

  const data = createData();

  displaySpinner();
  const rawRes =  await fetch('/registration/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const resJSON = await rawRes.json();

  if (rawRes.status === 400) {
    error.innerHTML = resJSON.msg;
    success.innerHTML = '';
  }

  if (rawRes.status === 200) {
    success.innerHTML = resJSON.msg; 
    error.innerHTML = '';
  }

  displayForm();
}


const passwordMatching = () => {
  return passwordInput.value === confirmPasswordInput.value; 
}


const displaySpinner = () => {
  form.style.display = 'none';
  spinner.style.display = 'flex';
}


const displayForm = () => {
  form.style = null;
  spinner.style.display = 'none';
}


const createData = () => {
  return {
    firstName: firstNameInput.value,
    middleName: middleNameInput.value,
    lastName: lastNameInput.value,
    contactNumber: contactNumberInput.value,
    emailAddress: emailAddressInput.value,
    password: passwordInput.value,
  }
}


passwordCheckBox.addEventListener('change', (e) => {
  if (e.target.checked) {
    passwordInput.type = 'text';
    return;
  }
  passwordInput.type = 'password';
});


createButton.addEventListener('submit', submitForm);
form.addEventListener('submit', submitForm);