const updateProfileButton = document.getElementById('updateProfileBtn');
const clearFilesButton = document.getElementById('clearFilesBtn');
const deleteAccountButton = document.getElementById('deleteAccountBtn');
const changePasswordButton = document.getElementById('changePasswordBtn');

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

const UPDATE_PROFILE_API_ENDPOINT = '/settings/update-profile';
const CLEAR_FILES_API_ENDPOINT = '/settings/clear-files';
const DELETE_ACCOUNT_API_ENDPOINT = '/settings/delete';

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
  await showSpinner(updateProfileButton);
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
  await hideSpinner(updateProfileButton, newText, newStyle);
  const json = await res.json();
  updateProfileMessage.textContent = json.msg;
};

const showSpinner = async (element) => {
  element.textContent = '';
  element.classList.add('spinner-border');
  return Promise.resolve('');
};

const hideSpinner = async (element, text, classes) => {
  element.classList.remove('spinner-border');
  element.textContent = text;
  element.classList.add(...classes);
};

const clearFiles = async (e) => {
  e.preventDefault();
  await showSpinner(confirmModalContinueButton);
  const res = await fetch(CLEAR_FILES_API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  hideSpinner(confirmModalContinueButton, newText, newStyle);
  const json = await res.json();
  confirmMessage.textContent = json.msg;
};

const deleteAccount = async (e) => {
  e.preventDefault();
  await showSpinner(confirmModalContinueButton);
  const res = await fetch(DELETE_ACCOUNT_API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + uuid.textContent.trim(),
    },
  });
  const newText = res.status === 200 ? 'Success (Redirecting...)' : 'Error';
  const newStyle = res.status === 200 ? ['btn-success'] : ['btn-danger'];
  hideSpinner(confirmModalContinueButton, newText, newStyle);
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
  confirmModalContinueButton.textContent = 'Continue';
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
