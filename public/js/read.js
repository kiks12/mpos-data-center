/* eslint-disable prettier/prettier */
const deleteButton = document.getElementById('deleteBtn');
const setDefaultButton = document.getElementById('setAsDefaultBtn');
const downloadButton = document.getElementById('downloadBtn');

const renameModal = document.getElementById('renameModal');
const renameModalCard = document.getElementById('renameModalCard');
const renameCloseModalButton = document.getElementById('renameCloseModalBtn');
const renameForm = document.getElementById('renameForm');
const renameInput = document.getElementById('renameInput');
const extension = document.getElementById('extension');
const renameMessage = document.getElementById('renameMessage');
const renameButton = document.getElementById('renameButton');

const renameModalButton = document.getElementById('renameModalBtn');

const type = document.getElementById('type');
const id = document.getElementById('id');
const filename = document.getElementById('filename');
const modalContainer = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');
const closeModalButton = document.getElementById('closeModalBtn');
const message = document.getElementById('message');

const SET_DEFAULT_FILE_API_ENDPOINT = '/backup/set-default/';
const DELETE_FILE_API_ENDPOINT = '/backup/delete/';
const DOWNLOAD_FILE_API_ENDPOINT = '/backup/download/';
const RENAME_FILE_API_ENDPOINT = '/backup/rename/';

let isDelete = false;

const getFileID = () => Number.parseInt(id.innerHTML.split(' ')[1]);
const getFileType = () => type.innerText.split(' ')[0];
const getFileName = () => filename.innerHTML.substring(11, filename.innerHTML.length);
const getFileExtension = () => extension.innerHTML.split('.')[1].trim();

const showModal = (modal) => {
  modal.style.display = 'flex';
}

const setModalMessage = (messageElement, msg) => {
  messageElement.innerText = msg;
}

const setDefaultFile = async (e) => {
  e.preventDefault();
  const data = {
    id: getFileID(),
    type: getFileType(),
  }

  const res = await fetch(SET_DEFAULT_FILE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();

  showModal(modalContainer);
  setModalMessage(message, json.msg);
  isDelete = false;
};

const deleteFile = async (e) => {
  e.preventDefault();
  const data = {
    id: getFileID(),
  };

  const res = await fetch(DELETE_FILE_API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();

  modalContainer.style.display = 'flex';
  message.innerText = json.msg;
  isDelete = true;
}

const downloadFile = async (e) => {
  e.preventDefault();
  const res = await fetch(
    `${DOWNLOAD_FILE_API_ENDPOINT}?id=${getFileID()}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '
      },
    }
  );
  const blob = await res.blob();

  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = getFileName();
  a.click();
}

const closeModal = (modalContainer) => {
  if (isDelete) window.location.replace('/');
  modalContainer.style.display = 'none';
}

const modalContainerClickHandler = (e, modalCard) => {
  e.preventDefault();
  if (modalCard.contains(e.target)) return;
  closeModal(e.target);
}

const renameFile = async (e) => {
  e.preventDefault();

  const body = {
    id: getFileID(),
    name: renameInput.value.trim() + extension.innerText.trim(),
  }

  const res = await fetch(RENAME_FILE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();

  renameMessage.innerHTML = json.msg;
  filename.innerText = 'File Name: ' + json.renamedFile.filename;
  const newUrl = `/read?id=${getFileID()}&filename=${getFileName()}&extension=${getFileExtension()}&type=${getFileType()}`;
  window.history.pushState('HTML', document.title, newUrl);
}

setDefaultButton.addEventListener('click', setDefaultFile);
closeModalButton.addEventListener('click', () => closeModal(modalContainer));
modalContainer.addEventListener('click', (e) => modalContainerClickHandler(e, modalCard));
deleteButton.addEventListener('click', deleteFile);
downloadButton.addEventListener('click', downloadFile);

renameModalButton.addEventListener('click', () => showModal(renameModal));
renameCloseModalButton.addEventListener('click', () => closeModal(renameModal));
renameModal.addEventListener('click', (e) => modalContainerClickHandler(e, renameModalCard));

renameButton.addEventListener('click', renameFile);
renameForm.addEventListener('submit', renameFile);