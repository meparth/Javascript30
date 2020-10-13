const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            // video.src = window.URL.createObjectURL(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.log(err);
        });
}

function paintToCanvus(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
        pixels = rgbShift(pixels);
        ctx.globalAlpha = 0.1;
        ctx.putImageData(pixels, 0, 0);

    }, 100);
}

function takePhoto(){
    snap.currentTime = 0;
    snap.play();


    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'pom');
    // link.textContent = 'download';
    link.innerHTML = `<img src="${data}"/>`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i=0 ; i<pixels.data.length ; i+=4){
        pixels.data[i] -= 100;
        pixels.data[i+1] -= 50;
        pixels.data[i+2] *= 2;
    }
    return pixels;
}

function rgbShift(pixels){
    for(let i=0 ; i<pixels.data.length ; i+=4){
        pixels.data[i-150] = pixels.data[i];
        pixels.data[i+500] = pixels.data[i+1];
        pixels.data[i-550] = pixels.data[i+2];
    }
    return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvus);