/* eslint-disable prettier/prettier */
const deleteButton = document.getElementById('deleteBtn');
const setDefaultButton = document.getElementById('setAsDefaultBtn');
const type = document.getElementById('type');
const path = document.getElementById('path');
// const filename = document.getElementById('filename');
const modalContainer = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');
const closeModalButton = document.getElementById('closeModalBtn');
const message = document.getElementById('message');

const SET_DEFAULT_FILE_API_ENDPOINT = '/backup/set-default/';
const DELETE_FILE_API_ENDPOINT = '/backup/delete/';

let isDelete = false;

const setDefaultFile = async (e) => {
  e.preventDefault();
  const data = {
    path: path.innerHTML.substring(6, path.innerHTML.length),
    type: type.innerHTML.split(' ')[0],
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

  modalContainer.style.display = 'flex';
  message.innerText = json.msg;
  isDelete = false;
};

const deleteFile = async (e) => {
  e.preventDefault();
  const data = {
    path: path.innerHTML.substring(6, path.innerHTML.length),
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

const closeModal = () => {
  if (isDelete) window.location.replace('/');
  modalContainer.style.display = 'none';
}

const modalContainerClickHandler = (e) => {
  e.preventDefault();
  if (modalCard.contains(e.target)) return;
  closeModal();
}

setDefaultButton.addEventListener('click', setDefaultFile);
closeModalButton.addEventListener('click', closeModal);
modalContainer.addEventListener('click', modalContainerClickHandler);
deleteButton.addEventListener('click', deleteFile);