// JavaScript to control the audio player

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])

        }
    }
    return songs


}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    //audio.play()
    currentSong.src = "/songs/" + track
    if (!pause) {

        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00 / 00.00"


}

async function main() {
    let songs = await getsongs()
    console.log(songs)
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src=" music.svg" alt="" class="src">

                            <div class="info">
                                <div>  ${song.replaceAll("%20", " ")} </div>
                                <div> Prathmesh </div>
                            </div>
                            <div class="playnow"> 
                                <span> Play Now </span>
                                <img class="invert" src="play.svg"" class="src">
                            </div>

        
        </li>`;

    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach an Event lIstner to play and nest and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"

        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }

    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left ="-110%" 
    } )

    previous .addEventListener("click" , ()=>{
        console.log ("previous clicked")
        console .log (currentSong)
        let index= songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if ((index-1) >= 0){
            playMusic(songs[index -1])
        }


    })

    next.addEventListener("click" , ()=>{
        currentSong.pause()
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1 ) <songs. length-1){
            playMusic(songs[index+1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log ("setting volume to " , e.target.value, "/100")
        currentSong.volume =parseInt(e.target.value)/100
    })
    

}

main()