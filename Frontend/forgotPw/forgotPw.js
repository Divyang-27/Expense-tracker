const submitBtn = document.getElementById('submitf');
const forgotPw = async (e) => {
  e.preventDefault();
  const email = e.target.mail.value;
  const mail = {
    mail: email,
  };
  const resetPassword = await axios.post(
    `http://localhost:3000/password/forgotpassword`,
    mail
  );

  alert('Check your email to reset your password');
};
