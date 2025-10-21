// 플랫폼별 썸네일 크기 정의
const platformSizes = {
    'youtube': { width: 1280, height: 720, name: '유튜브' },
    'youtube-shorts': { width: 1080, height: 1920, name: '유튜브 쇼츠' },
    'instagram-post': { width: 1080, height: 1080, name: '인스타그램 포스트' },
    'instagram-story': { width: 1080, height: 1920, name: '인스타그램 스토리' },
    'tiktok': { width: 1080, height: 1920, name: '틱톡' }
};

// 전역 변수
let currentPlatform = 'youtube';
let canvas, ctx;
let bgImageData = null;
let logoImageData = null;

// DOM 요소
const platformButtons = document.querySelectorAll('.platform-btn');
const bgTypeSelect = document.getElementById('bgType');
const bgColor1Input = document.getElementById('bgColor1');
const bgColor2Input = document.getElementById('bgColor2');
const color2Label = document.getElementById('color2Label');
const bgImageInput = document.getElementById('bgImage');
const colorControls = document.getElementById('colorControls');
const imageControls = document.getElementById('imageControls');
const mainTextInput = document.getElementById('mainText');
const subTextInput = document.getElementById('subText');
const textColorInput = document.getElementById('textColor');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const logoImageInput = document.getElementById('logoImage');
const addBorderCheckbox = document.getElementById('addBorder');
const downloadBtn = document.getElementById('downloadBtn');
const currentSizeSpan = document.getElementById('currentSize');

// 초기화
function init() {
    canvas = document.getElementById('thumbnailCanvas');
    ctx = canvas.getContext('2d');

    // 이벤트 리스너 설정
    platformButtons.forEach(btn => {
        btn.addEventListener('click', changePlatform);
    });

    bgTypeSelect.addEventListener('change', handleBgTypeChange);
    bgColor1Input.addEventListener('input', drawThumbnail);
    bgColor2Input.addEventListener('input', drawThumbnail);
    bgImageInput.addEventListener('change', handleBgImageUpload);
    mainTextInput.addEventListener('input', drawThumbnail);
    subTextInput.addEventListener('input', drawThumbnail);
    textColorInput.addEventListener('input', drawThumbnail);
    fontSizeInput.addEventListener('input', handleFontSizeChange);
    logoImageInput.addEventListener('change', handleLogoImageUpload);
    addBorderCheckbox.addEventListener('change', drawThumbnail);
    downloadBtn.addEventListener('click', downloadThumbnail);

    // 초기 썸네일 그리기
    setCanvasSize();
    drawThumbnail();
}

// 플랫폼 변경
function changePlatform(e) {
    platformButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentPlatform = e.target.dataset.platform;

    setCanvasSize();
    drawThumbnail();
}

// 캔버스 크기 설정
function setCanvasSize() {
    const size = platformSizes[currentPlatform];
    canvas.width = size.width;
    canvas.height = size.height;
    currentSizeSpan.textContent = `${size.width} x ${size.height} px`;
}

// 배경 타입 변경
function handleBgTypeChange() {
    const bgType = bgTypeSelect.value;

    if (bgType === 'color') {
        colorControls.style.display = 'block';
        imageControls.style.display = 'none';
        bgColor2Input.style.display = 'none';
        color2Label.style.display = 'none';
    } else if (bgType === 'gradient') {
        colorControls.style.display = 'block';
        imageControls.style.display = 'none';
        bgColor2Input.style.display = 'block';
        color2Label.style.display = 'block';
    } else if (bgType === 'image') {
        colorControls.style.display = 'none';
        imageControls.style.display = 'block';
    }

    drawThumbnail();
}

// 배경 이미지 업로드
function handleBgImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                bgImageData = img;
                drawThumbnail();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 로고 이미지 업로드
function handleLogoImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                logoImageData = img;
                drawThumbnail();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 폰트 크기 변경
function handleFontSizeChange() {
    fontSizeValue.textContent = fontSizeInput.value + 'px';
    drawThumbnail();
}

// 썸네일 그리기
function drawThumbnail() {
    // 배경 그리기
    drawBackground();

    // 로고 그리기
    if (logoImageData) {
        drawLogo();
    }

    // 텍스트 그리기
    drawText();

    // 테두리 그리기
    if (addBorderCheckbox.checked) {
        drawBorder();
    }
}

// 배경 그리기
function drawBackground() {
    const bgType = bgTypeSelect.value;

    if (bgType === 'color') {
        ctx.fillStyle = bgColor1Input.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor1Input.value);
        gradient.addColorStop(1, bgColor2Input.value);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'image' && bgImageData) {
        // 이미지를 캔버스에 맞게 조정
        const scale = Math.max(canvas.width / bgImageData.width, canvas.height / bgImageData.height);
        const x = (canvas.width - bgImageData.width * scale) / 2;
        const y = (canvas.height - bgImageData.height * scale) / 2;
        ctx.drawImage(bgImageData, x, y, bgImageData.width * scale, bgImageData.height * scale);
    } else {
        // 기본 배경
        ctx.fillStyle = bgColor1Input.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// 로고 그리기
function drawLogo() {
    const logoSize = Math.min(canvas.width, canvas.height) * 0.15;
    const x = canvas.width - logoSize - 30;
    const y = 30;

    // 로고 비율 유지
    const scale = Math.min(logoSize / logoImageData.width, logoSize / logoImageData.height);
    const logoWidth = logoImageData.width * scale;
    const logoHeight = logoImageData.height * scale;

    ctx.drawImage(logoImageData, x, y, logoWidth, logoHeight);
}

// 텍스트 그리기
function drawText() {
    const mainText = mainTextInput.value;
    const subText = subTextInput.value;
    const textColor = textColorInput.value;
    const fontSize = parseInt(fontSizeInput.value);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 메인 텍스트
    if (mainText) {
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText(mainText, canvas.width / 2 + 3, canvas.height / 2 + 3);

        ctx.fillStyle = textColor;
        ctx.fillText(mainText, canvas.width / 2, canvas.height / 2);
    }

    // 서브 텍스트
    if (subText) {
        const subFontSize = fontSize * 0.4;
        ctx.font = `${subFontSize}px Arial, sans-serif`;
        const yOffset = mainText ? fontSize * 0.7 : 0;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText(subText, canvas.width / 2 + 2, canvas.height / 2 + yOffset + 2);

        ctx.fillStyle = textColor;
        ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + yOffset);
    }
}

// 테두리 그리기
function drawBorder() {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}

// 다운로드
function downloadThumbnail() {
    const size = platformSizes[currentPlatform];
    const fileName = `thumbnail_${size.name}_${size.width}x${size.height}.png`;

    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
