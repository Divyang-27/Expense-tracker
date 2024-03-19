let user;
const errors = document.getElementById('errors');
async function signUp(e) {
  e.preventDefault();
  user = {
    name: e.target.name.value,
    mail: e.target.mail.value,
    password: e.target.password.value,
  };
  try {
    const userSignUp = await axios.post(
      'http://localhost:3000/user/signup',
      user
    );

    alert(userSignUp.data.message);
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('password').value = '';
    window.location.href = 'http://127.0.0.1:5500/Frontend/login/login.html';
  } catch (error) {
    if (error.response.status === 400) {
      return alert('Enter required details');
    }
    errors.innerHTML += `<li> Error code ${error.response.status}: ${error.response.data.error} </li>`;
  }
}
