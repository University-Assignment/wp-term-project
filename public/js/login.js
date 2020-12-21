const loginForm = document.querySelector(".login-form");
const loginError = document.querySelector("#error-message-login");

loginForm.onsubmit = () => {
  let errorMessage = "";
  loginError.innerHTML = "";

  if (!loginForm.username.value) {
    errorMessage = "아이디를 입력해주세요.";
  } else if (!loginForm.password.value) {
    errorMessage = "비밀번호를 입력해주세요.";
  }

  loginError.innerHTML = errorMessage;

  return !errorMessage;
};
