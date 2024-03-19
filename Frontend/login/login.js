let loginDetails;
const errors = document.getElementById('errors');
const forgotPw = document.getElementById('forgotPw');
forgotPw.onclick = () => {
  window.location.href =
    'http://127.0.0.1:5500/Frontend/forgotPw/forgotpw.html';
};
async function login(e) {
  e.preventDefault();
  loginDetails = {
    mail: e.target.mail.value,
    password: e.target.password.value,
  };
  try {
    const login = await axios.post(
      `http://localhost:3000/user/login`,
      loginDetails
    );
    document.getElementById('mail').value = '';
    document.getElementById('password').value = '';
    alert(login.data.message);
    localStorage.setItem('token', login.data.token);
    window.location.href =
      'http://127.0.0.1:5500/Frontend/expense/expense.html';
  } catch (error) {
    errors.innerHTML = `<li> Error code ${error.response.status}: ${error.response.data.error} </li>`;
  }
}
