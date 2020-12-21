const joinForm = document.querySelector(".join-form");
const joinError = document.querySelector("#error-message-join");

joinForm.onsubmit = () => {
  let errorMessage = "";
  joinError.innerHTML = "";

  if (!joinForm.name.value) {
    errorMessage = "이름을 입력해주세요.";
  } else if (!joinForm.username.value) {
    errorMessage = "아이디를 입력해주세요.";
  } else if (!joinForm.password.value) {
    errorMessage = "비밀번호를 입력해주세요.";
  } else if (joinForm.password.value !== joinForm.passwordConfirm.value) {
    errorMessage = "비밀번호가 일치하지 않습니다.";
  } else if (!joinForm.email.value) {
    errorMessage = "이메일주소를 입력해주세요.";
  }

  joinError.innerHTML = errorMessage;

  return !errorMessage;
};
