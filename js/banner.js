// Global array of your banners
const bannerAds = [];
const totalBanners = 24;

for (let i = 1; i <= totalBanners; i++) {
  bannerAds.push({
    gif: `/recursos/banners/gif${i}.gif`,
    url: `#fake-destination-${i}`
  });
}

// The core function that swaps out the ad content
function spawnNewBanner() {
  const randomIndex = Math.floor(Math.random() * bannerAds.length);
  const chosenAd = bannerAds[randomIndex];

  const imgElement = document.getElementById("banner-img");
  const linkElement = document.getElementById("banner-link");

  if (imgElement && linkElement && chosenAd) {
    imgElement.src = chosenAd.gif;
    linkElement.href = chosenAd.url;
  }
}

// Automatically trigger once right away when the script loads at the bottom of the page
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", spawnNewBanner);
} else {
  spawnNewBanner(); // If the page is somehow already loaded, fire it immediately
}