// 플랫폼별 썸네일 크기 정의
const platformSizes = {
    'youtube': { width: 1280, height: 720, name: '유튜브' },
    'youtube-shorts': { width: 1080, height: 1920, name: '유튜브 쇼츠' },
    'instagram-post': { width: 1080, height: 1080, name: '인스타그램 포스트' },
    'instagram-story': { width: 1080, height: 1920, name: '인스타그램 스토리' },
    'tiktok': { width: 1080, height: 1920, name: '틱톡' }
};

// 템플릿 정의
const templates = {
    'blank': {
        bgType: 'color',
        bgColor1: '#ffffff',
        bgColor2: '#ffffff',
        textColor: '#000000',
        fontSize: 80,
        mainText: '나만의 썸네일',
        subText: ''
    },
    'modern': {
        bgType: 'gradient',
        bgColor1: '#6366f1',
        bgColor2: '#8b5cf6',
        textColor: '#ffffff',
        fontSize: 90,
        mainText: '모던한 디자인',
        subText: '세련된 그라데이션'
    },
    'vibrant': {
        bgType: 'gradient',
        bgColor1: '#ec4899',
        bgColor2: '#f59e0b',
        textColor: '#ffffff',
        fontSize: 85,
        mainText: '생동감 넘치는',
        subText: '활기찬 컬러'
    },
    'minimal': {
        bgType: 'gradient',
        bgColor1: '#f3f4f6',
        bgColor2: '#e5e7eb',
        textColor: '#1f2937',
        fontSize: 75,
        mainText: '미니멀 디자인',
        subText: '깔끔하고 단순하게'
    },
    'dark': {
        bgType: 'gradient',
        bgColor1: '#1f2937',
        bgColor2: '#374151',
        textColor: '#ffffff',
        fontSize: 88,
        mainText: '다크 모드',
        subText: '세련된 블랙'
    },
    'sunset': {
        bgType: 'gradient',
        bgColor1: '#f97316',
        bgColor2: '#dc2626',
        textColor: '#ffffff',
        fontSize: 82,
        mainText: '석양의 감성',
        subText: '따뜻한 컬러'
    }
};

// 전역 변수
let currentPlatform = 'youtube';
let currentTemplate = 'blank';
let canvas, ctx;
let bgImageData = null;
let baseImageData = null;
let overlayImageData = [];

// DOM 요소
let platformButtons, templateCards, baseImageInput, clearBaseImageBtn;
let bgTypeSelect, bgColor1Input, bgColor2Input, color2Label, bgImageInput;
let colorControls, imageControls;
let mainTextInput, subTextInput, textColorInput, fontSizeInput, fontSizeValue;
let overlayImageInput, overlaySizeInput, overlaySizeValue, overlayPositionSelect, clearOverlayBtn;
let addBorderCheckbox, downloadBtn, currentSizeSpan;

// 초기화
function init() {
    canvas = document.getElementById('thumbnailCanvas');
    ctx = canvas.getContext('2d');

    // DOM 요소 가져오기
    platformButtons = document.querySelectorAll('.platform-btn');
    templateCards = document.querySelectorAll('.template-card');
    baseImageInput = document.getElementById('baseImage');
    clearBaseImageBtn = document.getElementById('clearBaseImage');
    bgTypeSelect = document.getElementById('bgType');
    bgColor1Input = document.getElementById('bgColor1');
    bgColor2Input = document.getElementById('bgColor2');
    color2Label = document.getElementById('color2Label');
    bgImageInput = document.getElementById('bgImage');
    colorControls = document.getElementById('colorControls');
    imageControls = document.getElementById('imageControls');
    mainTextInput = document.getElementById('mainText');
    subTextInput = document.getElementById('subText');
    textColorInput = document.getElementById('textColor');
    fontSizeInput = document.getElementById('fontSize');
    fontSizeValue = document.getElementById('fontSizeValue');
    overlayImageInput = document.getElementById('overlayImage');
    overlaySizeInput = document.getElementById('overlaySize');
    overlaySizeValue = document.getElementById('overlaySizeValue');
    overlayPositionSelect = document.getElementById('overlayPosition');
    clearOverlayBtn = document.getElementById('clearOverlay');
    addBorderCheckbox = document.getElementById('addBorder');
    downloadBtn = document.getElementById('downloadBtn');
    currentSizeSpan = document.getElementById('currentSize');

    // 이벤트 리스너 설정
    platformButtons.forEach(btn => {
        btn.addEventListener('click', changePlatform);
    });

    templateCards.forEach(card => {
        card.addEventListener('click', selectTemplate);
    });

    baseImageInput.addEventListener('change', handleBaseImageUpload);
    clearBaseImageBtn.addEventListener('click', clearBaseImage);

    bgTypeSelect.addEventListener('change', handleBgTypeChange);
    bgColor1Input.addEventListener('input', drawThumbnail);
    bgColor2Input.addEventListener('input', drawThumbnail);
    bgImageInput.addEventListener('change', handleBgImageUpload);

    mainTextInput.addEventListener('input', drawThumbnail);
    subTextInput.addEventListener('input', drawThumbnail);
    textColorInput.addEventListener('input', drawThumbnail);
    fontSizeInput.addEventListener('input', handleFontSizeChange);

    overlayImageInput.addEventListener('change', handleOverlayImageUpload);
    overlaySizeInput.addEventListener('input', handleOverlaySizeChange);
    overlayPositionSelect.addEventListener('change', drawThumbnail);
    clearOverlayBtn.addEventListener('click', clearOverlay);

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

// 템플릿 선택
function selectTemplate(e) {
    const card = e.currentTarget;
    const templateName = card.dataset.template;

    templateCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    currentTemplate = templateName;
    const template = templates[templateName];

    // 템플릿 적용
    bgTypeSelect.value = template.bgType;
    bgColor1Input.value = template.bgColor1;
    bgColor2Input.value = template.bgColor2;
    textColorInput.value = template.textColor;
    fontSizeInput.value = template.fontSize;
    fontSizeValue.textContent = template.fontSize + 'px';
    mainTextInput.value = template.mainText;
    subTextInput.value = template.subText;

    // 배경 타입 변경 처리
    handleBgTypeChange();
    drawThumbnail();
}

// 베이스 이미지 업로드
function handleBaseImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                baseImageData = img;
                drawThumbnail();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 베이스 이미지 제거
function clearBaseImage() {
    baseImageData = null;
    baseImageInput.value = '';
    drawThumbnail();
}

// 오버레이 이미지 업로드
function handleOverlayImageUpload(e) {
    const files = e.target.files;
    if (files.length > 0) {
        overlayImageData = [];
        let loadedCount = 0;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    overlayImageData.push(img);
                    loadedCount++;
                    if (loadedCount === files.length) {
                        drawThumbnail();
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(files[i]);
        }
    }
}

// 오버레이 크기 변경
function handleOverlaySizeChange() {
    overlaySizeValue.textContent = overlaySizeInput.value + 'px';
    drawThumbnail();
}

// 오버레이 제거
function clearOverlay() {
    overlayImageData = [];
    overlayImageInput.value = '';
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
    // 1. 배경 또는 베이스 이미지 그리기
    if (baseImageData) {
        drawBaseImage();
    } else {
        drawBackground();
    }

    // 2. 오버레이 이미지 그리기
    if (overlayImageData.length > 0) {
        drawOverlay();
    }

    // 3. 텍스트 그리기
    drawText();

    // 4. 테두리 그리기
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

// 베이스 이미지 그리기
function drawBaseImage() {
    // 이미지를 캔버스에 맞게 조정 (cover 방식)
    const scale = Math.max(canvas.width / baseImageData.width, canvas.height / baseImageData.height);
    const x = (canvas.width - baseImageData.width * scale) / 2;
    const y = (canvas.height - baseImageData.height * scale) / 2;
    ctx.drawImage(baseImageData, x, y, baseImageData.width * scale, baseImageData.height * scale);
}

// 오버레이 이미지 그리기
function drawOverlay() {
    const overlaySize = parseInt(overlaySizeInput.value);
    const position = overlayPositionSelect.value;

    overlayImageData.forEach((img, index) => {
        // 이미지 비율 유지
        const scale = Math.min(overlaySize / img.width, overlaySize / img.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        let x, y;

        // 위치 계산
        switch (position) {
            case 'top-right':
                x = canvas.width - imgWidth - 30 - (index * 20);
                y = 30 + (index * 20);
                break;
            case 'top-left':
                x = 30 + (index * 20);
                y = 30 + (index * 20);
                break;
            case 'bottom-right':
                x = canvas.width - imgWidth - 30 - (index * 20);
                y = canvas.height - imgHeight - 30 - (index * 20);
                break;
            case 'bottom-left':
                x = 30 + (index * 20);
                y = canvas.height - imgHeight - 30 - (index * 20);
                break;
            case 'center':
                x = (canvas.width - imgWidth) / 2;
                y = (canvas.height - imgHeight) / 2 - 150 - (index * 50);
                break;
        }

        ctx.drawImage(img, x, y, imgWidth, imgHeight);
    });
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
