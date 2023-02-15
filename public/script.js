const apiUrl = localStorage.getItem("apiUrl");
const fetchData = async () => {
  if (apiUrl) {
    const respone = await fetch(`${apiUrl}/users`);
    const data = await respone.json();
    console.log(data);
  } else {
    window.location.href = "/api";
  }
};
fetchData();

//showUser-start
const userDiv = document.querySelector(".userDiv");

const showUserInFrontEnd = (data) => {
  userDiv.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const user = document.createElement("div");
    user.classList.add("user");
    user.innerHTML = `<img src="${data[i].url}" alt="" />
                      <h3>${data[i].name}</h3>`;

    userDiv.append(user);
  }
};
//showUser-end

// getData-start
const getData = async () => {
  const respone = await fetch(`${apiUrl}/upload`);
  const data = await respone.json();
  showUserInFrontEnd(data);
};
// getData-end

// formdata upload start

const formTag = document.querySelector("form");
const inputFile = document.querySelector("#inputFile");
const inputName = document.querySelector("#inputName");
const formData = new FormData();

formTag.addEventListener("submit", async (e) => {
  e.preventDefault();
  const files = [...inputFile.files];
  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("name", inputName.value);
  const respone = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    body: formData,
  });
  getData();
});
getData();

// formData upload end
