const myinfoForm = document.querySelector(".myinfo-form");
const myinfoError = document.querySelector("#error-message-myinfo");

myinfoForm.onsubmit = () => {
  let errorMessage = "";
  myinfoError.innerHTML = "";

  if (!myinfoForm.name.value) {
    errorMessage = "이름을 입력해주세요.";
  } else if (!myinfoForm.username.value) {
    errorMessage = "아이디를 입력해주세요.";
  } else if (!myinfoForm.password.value) {
    errorMessage = "비밀번호를 입력해주세요.";
  } else if (myinfoForm.password.value != myinfoForm.passwordConfirm.value) {
    errorMessage = "비밀번호가 일치하지 않습니다.";
  } else if (!myinfoForm.email.value) {
    errorMessage = "이메일주소를 입력해주세요.";
  }

  myinfoError.innerHTML = errorMessage;
  return !errorMessage;
};
