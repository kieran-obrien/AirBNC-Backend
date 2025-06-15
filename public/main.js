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
