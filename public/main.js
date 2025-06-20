let isLightMode = true;

const toggleLightMode = () => {
  if (isLightMode) {
    isLightMode = false;
    document.documentElement.setAttribute("data-theme", "dark");
    modeButton.classList.remove("ri-moon-fill");
    modeButton.classList.add("ri-sun-fill");
  } else {
    isLightMode = true;
    document.documentElement.setAttribute("data-theme", "light");
    modeButton.classList.remove("ri-sun-fill");
    modeButton.classList.add("ri-moon-fill");
  }
};

const modeButton = document.getElementById("mode-button");
modeButton.addEventListener("click", toggleLightMode);

const menuItems = document.querySelectorAll(".menu-option");

const toggleBackgroundColour = (event) => {
  menuItems.forEach((item) => {
    item.classList.remove("bg-blue-400", "font-bold");
  });
  event.target.classList.add("bg-blue-400", "font-bold");
};

menuItems.forEach((item) => {
  item.addEventListener("click", toggleBackgroundColour);
});

const getEndpointTester = async (e) => {
  e.preventDefault();
  resultTextArea.innerText = "";
  const endpoint = "http://localhost:8888/api/" + testerInput.value;
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    console.log(data);
    resultTextArea.value = JSON.stringify(data, null, 2);
  } catch (err) {
    console.log(err);
  }
};

const testerButton = document.getElementById("tester-button");
const testerInput = document.getElementById("tester-input");
const testerForm = document.getElementById("get-tester");
const resultTextArea = document.getElementById("endpoint-result");
testerButton.addEventListener("click", getEndpointTester);
testerForm.addEventListener("submit", getEndpointTester);
