const fileDiv = document.getElementById('file');
const filenameText = document.getElementById('filename');
const extensionText = document.getElementById('extension');
const fileInput = document.getElementById('fileInput');
const browseButton = document.getElementById('browseButton');
const removeButton = document.getElementById('removeButton');
const uploadButton = document.getElementById('uploadButton');
const uploadText = document.getElementById('uploadText');
const uploadButtonManual = document.getElementById('uploadButtonManual');
const typeSelect = document.getElementById('type');
const isDefaultBox = document.getElementById('isDefault');

let _file = null;
let _uploadClicked = false;

const UPLOAD_API_ENDPOINT = '/backup/upload';

const removeFile = (e) => {
  e.preventDefault();
  fileDiv.classList.replace('d-flex', 'd-none');
  _file = null;
  hideFileDiv();
  showBrowseButton();
};

const hideFileDiv = () => {
  fileDiv.classList.replace('d-flex', 'd-none');
};

const showBrowseButton = () => {
  browseButton.classList.replace('d-none', 'd-flex');
};

const fileInputChangeCallback = (e) => {
  e.preventDefault();
  if (e.target.files.length === 0) return;

  const file = e.target.files[0];
  const filename = file.name;
  const extension = filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
  );

  fileDiv.classList.remove('d-none');
  fileDiv.classList.add('d-flex');
  filenameText.innerText = filename;
  extensionText.innerText = extension;

  if (extension === 'pdf') extensionText.className = 'text-danger';
  if (extension === 'csv') extensionText.className = 'text-primary';
  if (
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'mp4' ||
    extension === 'mp3' ||
    extension === 'jpg'
  )
    extensionText.className = 'text-warning';

  browseButton.classList.replace('d-flex', 'd-none');
  _file = file;
};

const uploadFile = async (e) => {
  e.preventDefault();
  if (_file === null) return;
  if (_uploadClicked) {
    showBrowseButton();
    hideFileDiv();
    _file = null;
    return;
  }
  const formData = new FormData();
  formData.append('file', _file);
  const type = typeSelect.value;
  const isDefault = isDefaultBox.checked;

  uploadText.textContent = '';
  uploadText.classList.add('spinner-border');
  const res = await fetch(
    `${UPLOAD_API_ENDPOINT}?type=${type}&isDefault=${isDefault}`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer',
      },
      body: formData,
    },
  );
  const json = await res.json();

  if (res.status !== 200) {
    uploadButton.classList.add(
      'border',
      'border-danger',
      'bg-white',
      'text-danger',
    );
    uploadText.classList.add('text-danger');
    _uploadClicked = true;
  } else {
    uploadButton.classList.add(
      'border',
      'border-success',
      'bg-white',
      'text-success',
    );
    uploadText.classList.add('text-success');
    _uploadClicked = true;
  }

  uploadButton.classList.remove('btn-primary');
  uploadText.classList.remove('spinner-border');
  uploadText.textContent = json.msg;
  uploadButtonManual.classList.replace('d-none', 'd-flex');
};

fileInput.addEventListener('change', fileInputChangeCallback);
removeButton.addEventListener('click', removeFile);
uploadButton.addEventListener('click', uploadFile);
