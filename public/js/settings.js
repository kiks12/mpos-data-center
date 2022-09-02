const updateProfileButton = document.getElementById('updateProfileBtn');
const updateProfileText = document.getElementById('updateProfileText');
const clearFilesButton = document.getElementById('clearFilesBtn');
const deleteAccountButton = document.getElementById('deleteAccountBtn');

const changePasswordButton = document.getElementById('changePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordModalCard = document.getElementById(
  'changePasswordModalCard',
);
const closeChangePasswordModalButton = document.getElementById(
  'closeChangePasswordModalBtn',
);
// const changePasswordForm = document.getElementById('changePasswordForm');
const passwordInput = document.getElementById('password');
const showPasswordInput = document.getElementById('showPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const changePasswordMessage = document.getElementById('changePasswordMessage');
const changePasswordModalCancelButton = document.getElementById(
  'changePasswordModalCancelBtn',
);
const changePasswordContinueButton = document.getElementById(
  'changePasswordModalContinueBtn',
);
const changePasswordContinueText = document.getElementById(
  'changePasswordModalContinueText',
);

const settingsForm = document.getElementById('settingsForm');
const uuid = document.getElementById('uuid');
const lastNameInput = document.getElementById('lastName');
const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const contactNumberInput = document.getElementById('contactNumber');
const emailAddress = document.getElementById('emailAddress');
const updateProfileMessage = document.getElementById('updateProfileMessage');

const confirmModal = document.getElementById('confirmModal');
const confirmModalCard = document.getElementById('confirmModalCard');
const closeConfirmModalButton = document.getElementById('closeConfirmModalBtn');
const confirmMessage = document.getElementById('confirmMessage');
const confirmModalCancelButton = document.getElementById(
  'confirmModalCancelBtn',
);
const confirmModalContinueButton = document.getElementById(
  'confirmModalContinueBtn',
);
const confirmModalContinueText = document.getElementById(
  'confirmModalContinueText',
);

const UPDATE_PROFILE_API_ENDPOINT = '/settings/update-profile';
const CLEAR_FILES_API_ENDPOINT = '/settings/clear-files';
const DELETE_ACCOUNT_API_ENDPOINT = '/settings/delete';
const CHANGE_PASSWORD_API_ENDPOINT = '/settings/change-password';

let _type = '';

const updateProfile = async (e) => {
  e.preventDefault();
  const data = {
    lastName: lastNameInput.value,
    firstName: firstNameInput.value,
    middleName: middleNameInput.value,
    contactNumber: contactNumberInput.value,
    emailAddress: emailAddress.value,
  };
  await showSpinner(updateProfileText);
  const res = await fetch(UPDATE_PROFILE_API_ENDPOINT, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line prettier/prettier
      'Authorization': 'Bearer ' + uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  await hideSpinner(updateProfileButton, updateProfileText, newText, newStyle);
  const json = await res.json();
  updateProfileMessage.textContent = json.msg;
};

const showSpinner = async (element) => {
  element.textContent = '';
  element.classList.add('spinner-border');
  return Promise.resolve();
};

const hideSpinner = async (element, textElement, text, classes) => {
  textElement.classList.remove('spinner-border');
  textElement.textContent = text;
  element.classList.add(...classes);
};

const clearFiles = async (e) => {
  e.preventDefault();
  await showSpinner(confirmModalContinueText);
  const res = await fetch(CLEAR_FILES_API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  hideSpinner(
    confirmModalContinueButton,
    confirmModalContinueText,
    newText,
    newStyle,
  );
  const json = await res.json();
  confirmMessage.textContent = json.msg;
};

const deleteAccount = async (e) => {
  e.preventDefault();
  await showSpinner(confirmModalContinueText);
  const res = await fetch(DELETE_ACCOUNT_API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success (Redirecting...)' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  hideSpinner(
    confirmModalContinueButton,
    confirmModalContinueText,
    newText,
    newStyle,
  );
  const json = await res.json();
  confirmMessage.textContent = json.msg;

  if (res.status === 200) {
    setTimeout(() => {
      window.location.replace('/login/logout');
    }, 2000);
  }
};

const showConfirmModal = async (e, type) => {
  e.preventDefault();
  confirmModal.style.display = 'flex';
  if (type === 'CLEAR_FILES') {
    _type = type;
    confirmMessage.textContent =
      'Are you sure you want to Delete all your files?';
  }

  if (type === 'DELETE_ACCOUNT') {
    _type = type;
    confirmMessage.textContent =
      'Are you sure you want to Delete your Account? All your files will be deleted as well.';
  }
};

const resetUI = () => {
  confirmModalContinueButton.classList.replace('btn-success', 'btn-primary');
  confirmModalContinueButton.classList.replace('btn-danger', 'btn-primary');
  confirmModalContinueText.textContent = 'Continue';
  confirmMessage.textContent = '';

  changePasswordContinueButton.classList.replace('btn-success', 'btn-primary');
  changePasswordContinueButton.classList.replace('btn-danger', 'btn-primary');
  changePasswordContinueText.textContent = 'Continue';
  changePasswordMessage.textContent = '';
};

const hideModal = (e, modalContainer) => {
  e.preventDefault();
  modalContainer.style.display = 'none';
  resetUI();
};

const modalContainerClickCallback = (e, modalCard) => {
  e.preventDefault();
  if (modalCard.contains(e.target)) return;
  hideModal(e, e.target);
};

const confirmButtonClickCallback = (e) => {
  e.preventDefault();
  if (_type === 'CLEAR_FILES') return clearFiles(e);
  if (_type === 'DELETE_ACCOUNT') return deleteAccount(e);
};

const showChangePasswordModal = (e) => {
  e.preventDefault();
  changePasswordModal.style.display = 'flex';
};

const validateChangePasswordForm = async () => {
  if (passwordInput.value !== confirmPasswordInput.value) {
    changePasswordMessage.textContent = 'Passwords not matching!';
    changePasswordMessage.classList.add('text-danger');
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
};

const changePassword = async (e) => {
  e.preventDefault();
  const validated = await validateChangePasswordForm();
  if (!validated) return;
  await showSpinner(changePasswordContinueText);
  const res = await fetch(CHANGE_PASSWORD_API_ENDPOINT, {
    method: 'PATCH',
    body: JSON.stringify({ password: passwordInput.value }),
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line prettier/prettier
      'Authorization': 'Bearer '+uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  const newColor =
    res.status === 200
      ? ['text-success', 'text-danger']
      : ['text-danger', 'text-success'];
  await hideSpinner(
    changePasswordContinueButton,
    changePasswordContinueText,
    newText,
    newStyle,
  );
  const json = await res.json();
  changePasswordMessage.textContent = json.msg;
  changePasswordMessage.classList.remove(newColor[1]);
  changePasswordMessage.classList.add(newColor[0]);
  passwordInput.value = '';
  confirmPasswordInput.value = '';
};

const togglePassword = (e) => {
  if (e.target.checked) {
    passwordInput.type = 'text';
    return;
  }
  passwordInput.type = 'password';
};

settingsForm.addEventListener('submit', updateProfile);
updateProfileButton.addEventListener('click', updateProfile);
clearFilesButton.addEventListener('click', (e) =>
  showConfirmModal(e, 'CLEAR_FILES'),
);
deleteAccountButton.addEventListener('click', (e) =>
  showConfirmModal(e, 'DELETE_ACCOUNT'),
);
closeConfirmModalButton.addEventListener('click', (e) =>
  hideModal(e, confirmModal),
);
confirmModalCancelButton.addEventListener('click', (e) =>
  hideModal(e, confirmModal),
);
confirmModal.addEventListener('click', (e) =>
  modalContainerClickCallback(e, confirmModalCard),
);
confirmModalContinueButton.addEventListener('click', (e) =>
  confirmButtonClickCallback(e),
);
changePasswordButton.addEventListener('click', showChangePasswordModal);
closeChangePasswordModalButton.addEventListener('click', (e) =>
  hideModal(e, changePasswordModal),
);
changePasswordModalCancelButton.addEventListener('click', (e) =>
  hideModal(e, changePasswordModal),
);
changePasswordModal.addEventListener('click', (e) =>
  modalContainerClickCallback(e, changePasswordModalCard),
);
// changePasswordForm.addEventListener('submit', changePassword);
changePasswordContinueButton.addEventListener('click', changePassword);
showPasswordInput.addEventListener('change', (e) => {
  togglePassword(e);
  console.log('toggle');
});
