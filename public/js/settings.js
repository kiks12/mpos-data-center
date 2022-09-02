const updateProfileButton = document.getElementById('updateProfileBtn');
const clearFilesButton = document.getElementById('clearFilesBtn');
const deleteAccountButton = document.getElementById('deleteAccountBtn');

const UPDATE_PROFILE_API_ENDPOINT = '/settings/updateProfile';

const updateProfile = async (e) => {
  e.preventDefault();
  const res = await fetch(UPDATE_PROFILE_API_ENDPOINT, {
    method: 'PATCH',
    body: '',
  });
  const json = res.json();
  //
};

updateProfileButton.addEventListener('click', updateProfile);
