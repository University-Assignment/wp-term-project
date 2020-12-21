const form = document.querySelector("form");
const errorMessageElement = document.querySelector("#error-message");

form.onsubmit = () => {
  let errorMessage = "";
  errorMessageElement.innerHTML = "";

  if (!form.name.value) {
    errorMessage = "이름을 입력해주세요.";
  } else if (!form.username.value) {
    errorMessage = "아이디를 입력해주세요.";
  } else if (!form.password.value) {
    errorMessage = "비밀번호를 입력해주세요.";
  } else if (form.password.value !== form.passwordConfirm.value) {
    errorMessage = "비밀번호가 일치하지 않습니다.";
  } else if (!form.email.value) {
    errorMessage = "이메일주소를 입력해주세요.";
  }

  errorMessageElement.innerHTML = errorMessage;

  return !errorMessage;
};
