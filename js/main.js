let dim = {
    w: 300,
    h: 300
};
let canvasEl = null;
let ctx = null;
let eyeDropperEl = null;
let bnw1Btn = null;
let bnw2Btn = null;
let sep1Btn = null;
let oriBtn = null;

let oriImgData = null;

const init = () => {
    canvasEl = document.querySelector('canvas');
    eyeDropperEl = document.querySelector('#eye-dropper');
    bnw1Btn = document.querySelector('#bnw-1');
    bnw2Btn = document.querySelector('#bnw-2');
    oriBtn = document.querySelector('#ori');
    sep1Btn = document.querySelector('#sepia-1');

    canvasEl.width = dim.w;
    canvasEl.height = dim.h;
    ctx = canvasEl.getContext('2d');
    

    const img = new Image(); //  <img />
    img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, dim.w, dim.h);
        oriImgData = ctx.getImageData(0, 0, dim.w, dim.h);
        oriBtn.innerHTML = `<img src="${canvasEl.toDataURL()}" /><p>Normal</p>`;
        makeBnw1(oriImgData);
        bnw1Btn.innerHTML = `<img src="${canvasEl.toDataURL()}" /><p>B & W 1</p>`;
        makeBnw2(oriImgData);
        bnw2Btn.innerHTML = `<img src="${canvasEl.toDataURL()}" /><p>B & W 2</p>`;
        makeSepia1(makeBnw2(oriImgData));
        sep1Btn.innerHTML = `<img src="${canvasEl.toDataURL()}" /><p>Sepia 1</p>`;
        ctx.drawImage(img, 0, 0, dim.w, dim.h);
        // console.log(oriImgData);
    });
    img.src = 'img/img1.jpg'; // <img src="img/img1.jpg" />

    canvasEl.addEventListener('mousemove', ({ layerX, layerY }) => {
        // console.log(layerX, layerY);
        updateEyeDropper(layerX, layerY);
    });

    bnw1Btn.addEventListener('click', () => {
        makeBnw1(oriImgData);
    });
    bnw2Btn.addEventListener('click', () => {
        makeBnw2(oriImgData);
    });
    sep1Btn.addEventListener('click', () => {
        const iDataBnw = makeBnw2(oriImgData);
        makeSepia1(iDataBnw);
    });
    ori.addEventListener('click', () => {
        ctx.putImageData(oriImgData, 0, 0);
    });
};

const makeBnw1 = (iData) => {
    // const imgData = oriImgData;
    const imgData = new ImageData(
        new Uint8ClampedArray(iData.data),
        iData.width,
        iData.height
    );
    const data = imgData.data;

    for(let index = 0; index < data.length; index += 4) {
        // (R + G + B) / 3
        const avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
        data[index] = avg;
        data[index + 1] = avg;
        data[index + 2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);
    return imgData;
};

const makeBnw2 = (iData) => {
    // const imgData = oriImgData;
    const imgData = new ImageData(
        new Uint8ClampedArray(iData.data),
        iData.width,
        iData.height
    );
    const data = imgData.data;

    for(let index = 0; index < data.length; index += 4) {
        // 0.21 R + 0.72 G + 0.07 B
        // 2x => x = 4 => 2 * 4
        const avg = 
            0.21 * data[index] + 
            0.72 * data[index + 1] + 
            0.07 * data[index + 2];
        data[index] = avg;
        data[index + 1] = avg;
        data[index + 2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);
    return imgData;
};

const makeSepia1 = (iData) => {
    // const imgData = oriImgData;
    const imgData = new ImageData(
        new Uint8ClampedArray(iData.data),
        iData.width,
        iData.height
    );
    const data = imgData.data;

    for(let index = 0; index < data.length; index += 4) {
        // - R * 1.07;
        // - G * .74;
        // - B * .43;
        data[index] = data[index] * 1.07;
        data[index + 1] = data[index + 1] * .74;
        data[index + 2] = data[index + 2] * .43;
    }
    ctx.putImageData(imgData, 0, 0);
    return imgData;
};

const updateEyeDropper = (x, y) => {
    const imgData = ctx.getImageData(x, y, 1, 1);
    // console.log(imgData);
    const [r, g, b] = imgData.data;
    eyeDropperEl.style.backgroundColor = 
        `rgb(${r}, ${g}, ${b})`;

};


window.onload = init;