const currentLanguage = localStorage.getItem("language") ? localStorage.getItem("language") : 'pt';
const langSelector = document.getElementById("langSelector");
  
function updateContent() {
    const elements = document.getElementsByClassName("i18nelement");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const k = element.getAttribute("data-i18n");
      element.innerHTML = i18next.t(k);
    }
  }
  
async function i18Loader() {
  const langs = ["pt", "en", "de", "iw"];
  const jsons = await Promise.all(
    langs.map((l) => fetch(`../i18n/${l}.json`).then((r) => r.json()))
  );
  const res = langs.reduce((acc, l, idx) => {
    acc[l] = { translation: jsons[idx] };
    return acc;
  }, {});
  await i18next.init({
    lng: currentLanguage,
    debug: true,
    resources: res
  });
  updateContent();
  i18next.on("languageChanged", () => {
    updateContent();
  });
  langSelector.addEventListener("change", (e) => {
    const selectedLanguage = e.target.value;
    i18next.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  });
}

i18Loader();

window.addEventListener('load', function() {
  var selectedOptionValue = currentLanguage;
  langSelector.value = selectedOptionValue;
});