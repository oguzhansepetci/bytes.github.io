
const leftSubList = document.getElementById("leftSubList");
const rightSubList = document.getElementById("rightSubList");

const toggleLeftBtn = document.getElementById("toggleLeft");
const toggleRightBtn = document.getElementById("toggleRight");

toggleLeftBtn.addEventListener("click", () => {
    if (leftSubList.style.display === "none") {
        leftSubList.style.display = "block";
    } else {
        leftSubList.style.display = "none";
    }
});

toggleRightBtn.addEventListener("click", () => {
    if (rightSubList.style.display === "none") {
        rightSubList.style.display = "block";
    } else {
        rightSubList.style.display = "none";
    }
});


document.getElementById('videoFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = url;

  
    event.target.style.display = 'none';

   
    videoPlayer.style.display = 'block';
});









let leftSubtitles = [];
let rightSubtitles = [];
let currentActiveLeftIndex = -1;
let currentActiveRightIndex = -1;

document.getElementById('videoPlayer').addEventListener('timeupdate', function () {
    const currentTime = this.currentTime;

   
    if (leftSubtitles.length > 0) {
        const currentSubtitleLeft = leftSubtitles.find(subtitle => {
            const startTime = convertTimeToSeconds(subtitle.startTime);
            const endTime = convertTimeToSeconds(subtitle.endTime);
            return currentTime >= startTime && currentTime <= endTime;
        });
        const leftSubtitleDiv = document.getElementById('leftSubtitle');
        leftSubtitleDiv.textContent = currentSubtitleLeft ? currentSubtitleLeft.text.trim() : '';

        if (currentSubtitleLeft) {
            leftSubtitleDiv.classList.add('active');
        } else {
            leftSubtitleDiv.classList.remove('active');
        }

       
        const newActiveLeftIndex = currentSubtitleLeft ? leftSubtitles.indexOf(currentSubtitleLeft) : -1;
        if (newActiveLeftIndex !== currentActiveLeftIndex) {
         
            if (currentActiveLeftIndex !== -1) {
                const prevActiveLeft = document.querySelector(`#leftSrtList .subtitleList[data-left-index="${currentActiveLeftIndex}"]`);
                if (prevActiveLeft) {
                    prevActiveLeft.classList.remove('active');
                }
            }
          
            if (newActiveLeftIndex !== -1) {
                const newActiveLeft = document.querySelector(`#leftSrtList .subtitleList[data-left-index="${newActiveLeftIndex}"]`);
                if (newActiveLeft) {
                    newActiveLeft.classList.add('active');
                  
                    newActiveLeft.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            currentActiveLeftIndex = newActiveLeftIndex;
        }
    }

  
    if (rightSubtitles.length > 0) {
        const currentSubtitleRight = rightSubtitles.find(subtitle => {
            const startTime = convertTimeToSeconds(subtitle.startTime);
            const endTime = convertTimeToSeconds(subtitle.endTime);
            return currentTime >= startTime && currentTime <= endTime;
        });
        const rightSubtitleDiv = document.getElementById('rightSubtitle');
        rightSubtitleDiv.textContent = currentSubtitleRight ? currentSubtitleRight.text.trim() : '';

        if (currentSubtitleRight) {
            rightSubtitleDiv.classList.add('active');
        } else {
            rightSubtitleDiv.classList.remove('active');
        }

       
        const newActiveRightIndex = currentSubtitleRight ? rightSubtitles.indexOf(currentSubtitleRight) : -1;
        if (newActiveRightIndex !== currentActiveRightIndex) {
          
            if (currentActiveRightIndex !== -1) {
                const prevActiveRight = document.querySelector(`#rightSrtList .subtitleList[data-right-index="${currentActiveRightIndex}"]`);
                if (prevActiveRight) {
                    prevActiveRight.classList.remove('active');
                }
            }
          
            if (newActiveRightIndex !== -1) {
                const newActiveRight = document.querySelector(`#rightSrtList .subtitleList[data-right-index="${newActiveRightIndex}"]`);
                if (newActiveRight) {
                    newActiveRight.classList.add('active');
                   
                    newActiveRight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            currentActiveRightIndex = newActiveRightIndex;
        }
    }
});















document.getElementById('leftSrtList').addEventListener('click', function (event) {
    if (event.target.classList.contains('subtitleList')) {
        try {
            const subtitleText = event.target.textContent;
            const startTimeMatch = subtitleText.match(/(\d{2}:\d{2}:\d{2}[.,]\d{3})/);
            if (startTimeMatch) {
                const startTime = startTimeMatch[1].replace(',', '.');
                const videoPlayer = document.getElementById('videoPlayer');
                videoPlayer.currentTime = convertTimeToSeconds(startTime);
               
                event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            } else {
                console.error('Zaman formatı bulunamadı:', subtitleText);
            }
        } catch (error) {
            console.error('Altyazıya tıklanırken hata oluştu:', error);
        }
    }
});
document.getElementById('rightSrtList').addEventListener('click', function (event) {
    if (event.target.classList.contains('subtitleList')) {
        try {
            const subtitleText = event.target.textContent;
            const startTimeMatch = subtitleText.match(/(\d{2}:\d{2}:\d{2}[.,]\d{3})/);
            if (startTimeMatch) {
                const startTime = startTimeMatch[1].replace(',', '.'); 
                const videoPlayer = document.getElementById('videoPlayer');
                videoPlayer.currentTime = convertTimeToSeconds(startTime);
                
                event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                console.error('Zaman formatı bulunamadı:', subtitleText);
            }
        } catch (error) {
            console.error('Altyazıya tıklanırken hata oluştu:', error);
        }
    }
});
document.getElementById('leftSrtFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        leftSubtitles = readSrtFile(data);
        displaySubtitles(leftSubtitles, 'leftSrtList');
        event.target.style.display = 'none';
    };
    reader.readAsText(file);
});


document.getElementById('rightSrtFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        rightSubtitles = readSrtFile(data);
        displaySubtitles(rightSubtitles, 'rightSrtList');
        event.target.style.display = 'none';
    };
    reader.readAsText(file);
});



function readSrtFile(data) {
    const lines = data.split(/\r?\n/); 
    const subtitles = [];
    let currentSubtitle = {};
    let mode = 0; 
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (mode === 0) {
            if (line === '') {
                continue; 
            }
            const id = parseInt(line, 10);
            if (isNaN(id)) {
                console.warn(`Beklenen altyazı ID'si değil: "${line}" (Satır ${i + 1})`);
                continue;
            }
            currentSubtitle = { id, startTime: '', endTime: '', text: '' };
            mode = 1;
        } else if (mode === 1) {
           
            const match = line.match(/^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[.,]\d{3})$/);
            if (match) {
                currentSubtitle.startTime = match[1].replace(',', '.'); 
                currentSubtitle.endTime = match[2].replace(',', '.');
                mode = 2;
            } else {
                console.warn(`Beklenen zaman formatı değil: "${line}" (Satır ${i + 1})`);
                mode = 0; 
            }
        } else if (mode === 2) {
            if (line === '') {
              
                subtitles.push(currentSubtitle);
                mode = 0;
            } else {
              
                currentSubtitle.text += (currentSubtitle.text ? '\n' : '') + line;
            }
        }
    }

    if (mode === 2 && currentSubtitle.text) {
        subtitles.push(currentSubtitle);
    }

    return subtitles;
}


function displaySubtitles(subtitles, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    subtitles.forEach(function (subtitle, index) {
        const subtitleElement = document.createElement('div');
        subtitleElement.className = 'subtitleList';
        let text = subtitle.text.trim();
        subtitleElement.textContent = `${subtitle.startTime} --> ${subtitle.endTime}\n${text}`;
        
     
        if (containerId === 'leftSrtList') {
            subtitleElement.setAttribute('data-left-index', index);
        } else if (containerId === 'rightSrtList') {
            subtitleElement.setAttribute('data-right-index', index);
        }
        
        container.appendChild(subtitleElement);
    });
}

function convertTimeToSeconds(time) {
    const parts = time.split(/[:.,]/);
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const milliseconds = parseInt(parts[3], 10);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}


