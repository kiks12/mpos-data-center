const updateProfileButton = document.getElementById('updateProfileBtn');

const UPDATE_PROFILE_API_ENDPOINT = '/settings/updateProfile';

const updateProfile = async (e) => {
  e.preventDefault();
  await fetch(UPDATE_PROFILE_API_ENDPOINT, {
    method: 'PATCH',
  });
  //
};

updateProfileButton.addEventListener('click', updateProfile);
