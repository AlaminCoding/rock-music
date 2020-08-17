const mainSec = document.getElementById("search-section");
const searchBtn = document.getElementById("search-btn");
const lyricsElement = document.getElementById("song-lyrics");
const artistHeading = document.getElementById("artist-heading");
const songHeading = document.getElementById("song-heading");
const errorText = document.getElementById("error");
//Search Input and Button
const artistTitle = searchBtn.addEventListener("click", function () {
  let inputSong = document.getElementById("input-song");
  let singleResult = document.querySelectorAll(".single-result");
  if (inputSong.value) {
    emptyElements();
    if (singleResult.length) {
      singleResult.forEach((element) => {
        element.remove();
      });
    }
    getSong(inputSong.value);
    inputSong.value = "";
  }
});
//Get Song List
function getSong(input) {
  fetch(`https://api.lyrics.ovh/suggest/${input}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.data.length == 0) {
        errorText.innerHTML = "Song Not Found 😥";
      } else {
        errorText.innerHTML = "";
      }
      const songs = data.data
        .slice(0, 10)
        .map((element) => {
          let artistName = element.artist.name;
          let songTitle = element.title;
          return `<div class="single-result row align-items-center justify-content-between my-3 p-3">
            <div class="col-md-9 album d-flex">
              <img src=${element.album.cover_medium} alt="album image" />
              <div class="album-details ml-3">
              <h3 class="lyrics-name">${element.title}</h3>
              <p class="author lead">
                Artist: <span class="artist-name">${element.artist.name}</span>
              </p>
              <p class="author album">
                Album by <span class="album-name">
                ${element.album.title.slice(0, 40)}</span>
              </p>
            </div>
          </div>
          <div class="col-md-3 text-md-right text-center">
            <button class="lyrics-btn btn btn-success" onClick='getLyrics(
              "${artistName}", "${songTitle}"
            )'>Get Lyrics</button>
          </div>
          </div>`;
        })
        .join("");
      mainSec.insertAdjacentHTML("afterbegin", songs);
      return songs;
    });
}
//Get Lyrics
const getLyrics = (artistName, songTitle) => {
  fetch(`https://api.lyrics.ovh/v1/${artistName}/${songTitle}`)
    .then((response) => {
      if (!response.ok) {
        throw ((errorText.innerHTML = "Lyrics Not Found 😥"), emptyElements());
      } else {
        errorText.innerHTML = "";
        return response.json();
      }
    })
    .then((data) => {
      lyricsElement.innerHTML = data.lyrics;
      artistHeading.innerHTML = artistName + " - ";
      songHeading.innerHTML = songTitle;
      console.log("trigger");
    });
};

//Empty Elements
const emptyElements = () => {
  lyricsElement.innerHTML = "";
  artistHeading.innerHTML = "";
  songHeading.innerHTML = "";
};

fetch("https://api.lyrics.ovh/suggest/hello")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data);
  });
