// ========================================
// 프로 썸네일 메이커 - 메인 스크립트
// Version: 1.1.0
// Made with ❤️ by Reelscode
// https://reelscode.com
// ========================================

const APP_VERSION = '1.1.0';

// 버전 정보 출력
console.log(`%c🎨 프로 썸네일 메이커 v${APP_VERSION}`, 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cMade with ❤️ by Reelscode', 'color: #999; font-size: 12px;');
console.log('%chttps://reelscode.com', 'color: #6366f1; font-size: 12px;');

// 플랫폼 크기 정의
const PLATFORMS = {
    youtube: { width: 1280, height: 720, name: '유튜브' },
    'youtube-shorts': { width: 1080, height: 1920, name: '유튜브 쇼츠' },
    'instagram-post': { width: 1080, height: 1080, name: '인스타그램' },
    'instagram-story': { width: 1080, height: 1920, name: '스토리' },
    tiktok: { width: 1080, height: 1920, name: '틱톡' }
};

// 템플릿 정의
const TEMPLATES = {
    blank: {
        name: '빈 캔버스',
        bgType: 'color',
        bgColor1: '#ffffff',
        layers: []
    },
    mrbeast: {
        name: 'MrBeast',
        bgType: 'gradient',
        bgColor1: '#ff0000',
        bgColor2: '#ff6b00',
        layers: [
            { type: 'text', content: '충격적인 내용!', x: 0.5, y: 0.5, fontSize: 120, fontFamily: "'Black Han Sans', sans-serif", color: '#ffffff', strokeWidth: 12, strokeColor: '#000000', shadowBlur: 20, shadowColor: '#000000' }
        ]
    },
    modern: {
        name: '모던',
        bgType: 'gradient',
        bgColor1: '#6366f1',
        bgColor2: '#8b5cf6',
        layers: [
            { type: 'text', content: '모던한 디자인', x: 0.5, y: 0.5, fontSize: 90, fontFamily: "'Noto Sans KR', sans-serif", color: '#ffffff', strokeWidth: 0, shadowBlur: 10, shadowColor: '#000000' }
        ]
    },
    vibrant: {
        name: '비브런트',
        bgType: 'gradient',
        bgColor1: '#ec4899',
        bgColor2: '#f59e0b',
        layers: [
            { type: 'text', content: '생동감 넘치는', x: 0.5, y: 0.5, fontSize: 85, fontFamily: "'Do Hyeon', sans-serif", color: '#ffffff', strokeWidth: 8, strokeColor: '#000000' }
        ]
    },
    minimal: {
        name: '미니멀',
        bgType: 'gradient',
        bgColor1: '#f3f4f6',
        bgColor2: '#e5e7eb',
        layers: [
            { type: 'text', content: '미니멀 디자인', x: 0.5, y: 0.5, fontSize: 75, fontFamily: "'Noto Sans KR', sans-serif", color: '#1f2937', strokeWidth: 0 }
        ]
    },
    dark: {
        name: '다크',
        bgType: 'gradient',
        bgColor1: '#1f2937',
        bgColor2: '#374151',
        layers: [
            { type: 'text', content: '다크 모드', x: 0.5, y: 0.5, fontSize: 88, fontFamily: "'Black Han Sans', sans-serif", color: '#ffffff', shadowBlur: 15, shadowColor: '#000000' }
        ]
    },
    neon: {
        name: '네온',
        bgType: 'color',
        bgColor1: '#000000',
        layers: [
            { type: 'text', content: 'NEON STYLE', x: 0.5, y: 0.5, fontSize: 100, fontFamily: "'Bebas Neue', sans-serif", color: '#00ffff', shadowBlur: 30, shadowColor: '#00ffff' }
        ]
    },
    sunset: {
        name: '선셋',
        bgType: 'gradient',
        bgColor1: '#f97316',
        bgColor2: '#dc2626',
        layers: [
            { type: 'text', content: '석양의 감성', x: 0.5, y: 0.5, fontSize: 82, fontFamily: "'Jua', sans-serif", color: '#ffffff', strokeWidth: 6, strokeColor: '#000000' }
        ]
    }
};

// ========================================
// Layer 클래스들
// ========================================

class Layer {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.visible = true;
        this.x = 0.5; // 0-1 사이 비율
        this.y = 0.5;
    }

    clone() {
        return JSON.parse(JSON.stringify(this));
    }
}

class TextLayer extends Layer {
    constructor(id) {
        super(id, 'text');
        this.content = '텍스트';
        this.fontSize = 80;
        this.fontFamily = "'Noto Sans KR', sans-serif";
        this.color = '#ffffff';
        this.strokeWidth = 0;
        this.strokeColor = '#000000';
        this.shadowBlur = 0;
        this.shadowColor = '#000000';
        this.hasBackground = false;
        this.bgColor = '#000000';
        this.bgOpacity = 0.7;
    }
}

class ImageLayer extends Layer {
    constructor(id, imageData) {
        super(id, 'image');
        this.imageData = imageData;
        this.size = 200;
        this.rotation = 0;
        this.opacity = 1;
    }
}

class EmojiLayer extends Layer {
    constructor(id, emoji) {
        super(id, 'emoji');
        this.emoji = emoji;
        this.size = 120;
    }
}

class ShapeLayer extends Layer {
    constructor(id, shape) {
        super(id, 'shape');
        this.shape = shape; // rectangle, circle, triangle, arrow
        this.fillColor = '#ff0000';
        this.strokeColor = '#000000';
        this.strokeWidth = 0;
        this.size = 200;
        this.rotation = 0;
    }
}

// ========================================
// History 클래스 (Undo/Redo)
// ========================================

class History {
    constructor() {
        this.states = [];
        this.currentIndex = -1;
        this.maxStates = 50;
    }

    push(state) {
        // 현재 인덱스 이후의 상태 제거
        this.states = this.states.slice(0, this.currentIndex + 1);

        // 새 상태 추가
        this.states.push(JSON.parse(JSON.stringify(state)));

        // 최대 상태 수 제한
        if (this.states.length > this.maxStates) {
            this.states.shift();
        } else {
            this.currentIndex++;
        }
    }

    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            return JSON.parse(JSON.stringify(this.states[this.currentIndex]));
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return JSON.parse(JSON.stringify(this.states[this.currentIndex]));
        }
        return null;
    }

    canUndo() {
        return this.currentIndex > 0;
    }

    canRedo() {
        return this.currentIndex < this.states.length - 1;
    }

    clear() {
        this.states = [];
        this.currentIndex = -1;
    }
}

// ========================================
// 메인 앱 클래스
// ========================================

class ThumbnailMaker {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.platform = 'youtube';
        this.layers = [];
        this.selectedLayer = null;
        this.baseImage = null;
        this.nextLayerId = 1;
        this.history = new History();

        // 배경 설정
        this.bgType = 'gradient';
        this.bgColor1 = '#6366f1';
        this.bgColor2 = '#8b5cf6';
        this.showBorder = false;

        // 필터
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0
        };

        // 드래그 상태
        this.isDragging = false;
        this.dragLayer = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.render();
        this.saveState();
    }

    setupCanvas() {
        const size = PLATFORMS[this.platform];
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        document.getElementById('canvasSizeInfo').textContent = `${size.width} x ${size.height} px`;
    }

    // ========================================
    // 이벤트 바인딩
    // ========================================

    bindEvents() {
        // 플랫폼 선택
        document.querySelectorAll('.platform-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changePlatform(e.target.dataset.platform));
        });

        // 탭 전환
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 템플릿 선택
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const templateName = e.currentTarget.dataset.template;
                this.applyTemplate(templateName);
            });
        });

        // 베이스 이미지
        document.getElementById('uploadBaseBtn').addEventListener('click', () => {
            document.getElementById('baseImageInput').click();
        });
        document.getElementById('baseImageInput').addEventListener('change', (e) => this.uploadBaseImage(e));
        document.getElementById('clearBaseBtn').addEventListener('click', () => this.clearBaseImage());

        // 텍스트
        document.getElementById('addTextBtn').addEventListener('click', () => this.addTextLayer());
        document.getElementById('textContent').addEventListener('input', (e) => this.updateSelectedText('content', e.target.value));
        document.getElementById('fontFamily').addEventListener('change', (e) => this.updateSelectedText('fontFamily', e.target.value));
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeDisplay').textContent = e.target.value + 'px';
            this.updateSelectedText('fontSize', parseInt(e.target.value));
        });
        document.getElementById('textColor').addEventListener('input', (e) => this.updateSelectedText('color', e.target.value));
        document.getElementById('strokeWidth').addEventListener('input', (e) => {
            document.getElementById('strokeWidthDisplay').textContent = e.target.value + 'px';
            this.updateSelectedText('strokeWidth', parseInt(e.target.value));
        });
        document.getElementById('strokeColor').addEventListener('input', (e) => this.updateSelectedText('strokeColor', e.target.value));
        document.getElementById('shadowBlur').addEventListener('input', (e) => {
            document.getElementById('shadowBlurDisplay').textContent = e.target.value + 'px';
            this.updateSelectedText('shadowBlur', parseInt(e.target.value));
        });
        document.getElementById('shadowColor').addEventListener('input', (e) => this.updateSelectedText('shadowColor', e.target.value));
        document.getElementById('textBackground').addEventListener('change', (e) => this.updateSelectedText('hasBackground', e.target.checked));
        document.getElementById('bgBoxColor').addEventListener('input', (e) => this.updateSelectedText('bgColor', e.target.value));
        document.getElementById('bgBoxOpacity').addEventListener('input', (e) => {
            document.getElementById('bgBoxOpacityDisplay').textContent = e.target.value + '%';
            this.updateSelectedText('bgOpacity', parseInt(e.target.value) / 100);
        });

        // 텍스트 프리셋
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyTextPreset(e.target.dataset.preset));
        });

        // 이미지
        document.getElementById('addImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        document.getElementById('imageInput').addEventListener('change', (e) => this.uploadImages(e));
        document.getElementById('imageSize').addEventListener('input', (e) => {
            document.getElementById('imageSizeDisplay').textContent = e.target.value + 'px';
            this.updateSelectedImage('size', parseInt(e.target.value));
        });
        document.getElementById('imageRotation').addEventListener('input', (e) => {
            document.getElementById('imageRotationDisplay').textContent = e.target.value + '°';
            this.updateSelectedImage('rotation', parseInt(e.target.value));
        });
        document.getElementById('imageOpacity').addEventListener('input', (e) => {
            document.getElementById('imageOpacityDisplay').textContent = e.target.value + '%';
            this.updateSelectedImage('opacity', parseInt(e.target.value) / 100);
        });

        // 스티커
        document.querySelectorAll('.sticker-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const emoji = e.currentTarget.dataset.emoji;
                this.addEmojiLayer(emoji);
            });
        });

        // 도형
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const shape = e.currentTarget.dataset.shape;
                this.addShapeLayer(shape);
            });
        });
        document.getElementById('shapeFillColor').addEventListener('input', (e) => this.updateSelectedShape('fillColor', e.target.value));
        document.getElementById('shapeStrokeColor').addEventListener('input', (e) => this.updateSelectedShape('strokeColor', e.target.value));
        document.getElementById('shapeStrokeWidth').addEventListener('input', (e) => {
            document.getElementById('shapeStrokeWidthDisplay').textContent = e.target.value + 'px';
            this.updateSelectedShape('strokeWidth', parseInt(e.target.value));
        });
        document.getElementById('shapeSize').addEventListener('input', (e) => {
            document.getElementById('shapeSizeDisplay').textContent = e.target.value + 'px';
            this.updateSelectedShape('size', parseInt(e.target.value));
        });
        document.getElementById('shapeRotation').addEventListener('input', (e) => {
            document.getElementById('shapeRotationDisplay').textContent = e.target.value + '°';
            this.updateSelectedShape('rotation', parseInt(e.target.value));
        });

        // 효과
        document.getElementById('brightness').addEventListener('input', (e) => {
            document.getElementById('brightnessDisplay').textContent = e.target.value + '%';
            this.filters.brightness = parseInt(e.target.value);
            this.render();
        });
        document.getElementById('contrast').addEventListener('input', (e) => {
            document.getElementById('contrastDisplay').textContent = e.target.value + '%';
            this.filters.contrast = parseInt(e.target.value);
            this.render();
        });
        document.getElementById('saturation').addEventListener('input', (e) => {
            document.getElementById('saturationDisplay').textContent = e.target.value + '%';
            this.filters.saturation = parseInt(e.target.value);
            this.render();
        });
        document.getElementById('blur').addEventListener('input', (e) => {
            document.getElementById('blurDisplay').textContent = e.target.value + 'px';
            this.filters.blur = parseInt(e.target.value);
            this.render();
        });

        // 필터 프리셋
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyFilterPreset(e.target.dataset.filter));
        });

        // 배경
        document.getElementById('bgType').addEventListener('change', (e) => {
            this.bgType = e.target.value;
            document.getElementById('bgColor2Group').style.display = e.target.value === 'gradient' ? 'block' : 'none';
            this.render();
            this.saveState();
        });
        document.getElementById('bgColor1').addEventListener('input', (e) => {
            this.bgColor1 = e.target.value;
            this.render();
        });
        document.getElementById('bgColor2').addEventListener('input', (e) => {
            this.bgColor2 = e.target.value;
            this.render();
        });
        document.getElementById('borderToggle').addEventListener('change', (e) => {
            this.showBorder = e.target.checked;
            this.render();
            this.saveState();
        });

        // 툴바
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('savePresetBtn').addEventListener('click', () => this.savePreset());
        document.getElementById('loadPresetBtn').addEventListener('click', () => this.loadPreset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());

        // 캔버스 드래그
        this.canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));

        // 키보드 단축키
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    // ========================================
    // 플랫폼 & 템플릿
    // ========================================

    changePlatform(platform) {
        this.platform = platform;
        document.querySelectorAll('.platform-quick-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.platform === platform);
        });
        this.setupCanvas();
        this.render();
        this.saveState();
    }

    applyTemplate(templateName) {
        const template = TEMPLATES[templateName];
        if (!template) return;

        this.layers = [];
        this.selectedLayer = null;
        this.bgType = template.bgType;
        this.bgColor1 = template.bgColor1;
        this.bgColor2 = template.bgColor2 || template.bgColor1;

        // 레이어 추가
        template.layers.forEach(layerData => {
            if (layerData.type === 'text') {
                const layer = new TextLayer(this.nextLayerId++);
                Object.assign(layer, layerData);
                this.layers.push(layer);
            }
        });

        // UI 업데이트
        document.getElementById('bgType').value = this.bgType;
        document.getElementById('bgColor1').value = this.bgColor1;
        document.getElementById('bgColor2').value = this.bgColor2;
        document.getElementById('bgColor2Group').style.display = this.bgType === 'gradient' ? 'block' : 'none';

        this.updateLayerList();
        this.render();
        this.saveState();
    }

    // ========================================
    // 베이스 이미지
    // ========================================

    uploadBaseImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.baseImage = img;
                this.render();
                this.saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    clearBaseImage() {
        this.baseImage = null;
        document.getElementById('baseImageInput').value = '';
        this.render();
        this.saveState();
    }

    // ========================================
    // 텍스트 레이어
    // ========================================

    addTextLayer() {
        const layer = new TextLayer(this.nextLayerId++);
        this.layers.push(layer);
        this.selectLayer(layer.id);
        this.updateLayerList();
        this.render();
        this.saveState();
        this.switchTab('text');
    }

    updateSelectedText(property, value) {
        if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
        this.selectedLayer[property] = value;
        this.updateLayerList();
        this.render();
        this.saveState();
    }

    applyTextPreset(preset) {
        if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;

        const layer = this.selectedLayer;

        switch (preset) {
            case 'none':
                layer.strokeWidth = 0;
                layer.shadowBlur = 0;
                layer.hasBackground = false;
                break;
            case 'outline':
                layer.strokeWidth = 10;
                layer.strokeColor = '#000000';
                layer.shadowBlur = 0;
                layer.hasBackground = false;
                break;
            case 'shadow':
                layer.strokeWidth = 0;
                layer.shadowBlur = 15;
                layer.shadowColor = '#000000';
                layer.hasBackground = false;
                break;
            case 'glow':
                layer.strokeWidth = 0;
                layer.shadowBlur = 30;
                layer.shadowColor = layer.color;
                layer.hasBackground = false;
                break;
            case 'bg':
                layer.strokeWidth = 0;
                layer.shadowBlur = 0;
                layer.hasBackground = true;
                layer.bgColor = '#000000';
                layer.bgOpacity = 0.7;
                break;
        }

        // UI 업데이트
        document.getElementById('strokeWidth').value = layer.strokeWidth;
        document.getElementById('strokeWidthDisplay').textContent = layer.strokeWidth + 'px';
        document.getElementById('strokeColor').value = layer.strokeColor;
        document.getElementById('shadowBlur').value = layer.shadowBlur;
        document.getElementById('shadowBlurDisplay').textContent = layer.shadowBlur + 'px';
        document.getElementById('shadowColor').value = layer.shadowColor;
        document.getElementById('textBackground').checked = layer.hasBackground;
        document.getElementById('bgBoxColor').value = layer.bgColor;
        document.getElementById('bgBoxOpacity').value = layer.bgOpacity * 100;
        document.getElementById('bgBoxOpacityDisplay').textContent = (layer.bgOpacity * 100) + '%';

        this.render();
        this.saveState();
    }

    // ========================================
    // 이미지 레이어
    // ========================================

    uploadImages(e) {
        const files = e.target.files;
        if (!files.length) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const layer = new ImageLayer(this.nextLayerId++, img);
                    this.layers.push(layer);
                    this.selectLayer(layer.id);
                    this.updateLayerList();
                    this.render();
                    this.saveState();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    }

    updateSelectedImage(property, value) {
        if (!this.selectedLayer || this.selectedLayer.type !== 'image') return;
        this.selectedLayer[property] = value;
        this.render();
        this.saveState();
    }

    // ========================================
    // 이모지 레이어
    // ========================================

    addEmojiLayer(emoji) {
        const layer = new EmojiLayer(this.nextLayerId++, emoji);
        this.layers.push(layer);
        this.selectLayer(layer.id);
        this.updateLayerList();
        this.render();
        this.saveState();
    }

    // ========================================
    // 도형 레이어
    // ========================================

    addShapeLayer(shape) {
        const layer = new ShapeLayer(this.nextLayerId++, shape);
        this.layers.push(layer);
        this.selectLayer(layer.id);
        this.updateLayerList();
        this.render();
        this.saveState();
        this.switchTab('shapes');
    }

    updateSelectedShape(property, value) {
        if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
        this.selectedLayer[property] = value;
        this.render();
        this.saveState();
    }

    // ========================================
    // 필터
    // ========================================

    applyFilterPreset(preset) {
        switch (preset) {
            case 'none':
                this.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
                break;
            case 'vintage':
                this.filters = { brightness: 110, contrast: 90, saturation: 70, blur: 0 };
                break;
            case 'bw':
                this.filters = { brightness: 100, contrast: 100, saturation: 0, blur: 0 };
                break;
            case 'warm':
                this.filters = { brightness: 105, contrast: 95, saturation: 120, blur: 0 };
                break;
            case 'cool':
                this.filters = { brightness: 100, contrast: 105, saturation: 90, blur: 0 };
                break;
            case 'high-contrast':
                this.filters = { brightness: 100, contrast: 150, saturation: 110, blur: 0 };
                break;
        }

        // UI 업데이트
        document.getElementById('brightness').value = this.filters.brightness;
        document.getElementById('brightnessDisplay').textContent = this.filters.brightness + '%';
        document.getElementById('contrast').value = this.filters.contrast;
        document.getElementById('contrastDisplay').textContent = this.filters.contrast + '%';
        document.getElementById('saturation').value = this.filters.saturation;
        document.getElementById('saturationDisplay').textContent = this.filters.saturation + '%';
        document.getElementById('blur').value = this.filters.blur;
        document.getElementById('blurDisplay').textContent = this.filters.blur + 'px';

        this.render();
    }

    // ========================================
    // 레이어 관리
    // ========================================

    selectLayer(layerId) {
        const layer = this.layers.find(l => l.id === layerId);
        if (!layer) return;

        this.selectedLayer = layer;
        this.updateLayerList();

        // 선택된 정보 표시
        const info = `선택됨: ${this.getLayerName(layer)}`;
        document.getElementById('selectedInfo').textContent = info;

        // 탭별 컨트롤 표시
        document.getElementById('textControls').style.display = layer.type === 'text' ? 'block' : 'none';
        document.getElementById('imageControls').style.display = layer.type === 'image' ? 'block' : 'none';
        document.getElementById('shapeControls').style.display = layer.type === 'shape' ? 'block' : 'none';

        // 텍스트 레이어 UI 업데이트
        if (layer.type === 'text') {
            document.getElementById('textContent').value = layer.content;
            document.getElementById('fontFamily').value = layer.fontFamily;
            document.getElementById('fontSize').value = layer.fontSize;
            document.getElementById('fontSizeDisplay').textContent = layer.fontSize + 'px';
            document.getElementById('textColor').value = layer.color;
            document.getElementById('strokeWidth').value = layer.strokeWidth;
            document.getElementById('strokeWidthDisplay').textContent = layer.strokeWidth + 'px';
            document.getElementById('strokeColor').value = layer.strokeColor;
            document.getElementById('shadowBlur').value = layer.shadowBlur;
            document.getElementById('shadowBlurDisplay').textContent = layer.shadowBlur + 'px';
            document.getElementById('shadowColor').value = layer.shadowColor;
            document.getElementById('textBackground').checked = layer.hasBackground;
            document.getElementById('bgBoxColor').value = layer.bgColor;
            document.getElementById('bgBoxOpacity').value = layer.bgOpacity * 100;
            document.getElementById('bgBoxOpacityDisplay').textContent = (layer.bgOpacity * 100) + '%';
        }

        // 이미지 레이어 UI 업데이트
        if (layer.type === 'image') {
            document.getElementById('imageSize').value = layer.size;
            document.getElementById('imageSizeDisplay').textContent = layer.size + 'px';
            document.getElementById('imageRotation').value = layer.rotation;
            document.getElementById('imageRotationDisplay').textContent = layer.rotation + '°';
            document.getElementById('imageOpacity').value = layer.opacity * 100;
            document.getElementById('imageOpacityDisplay').textContent = (layer.opacity * 100) + '%';
        }

        // 도형 레이어 UI 업데이트
        if (layer.type === 'shape') {
            document.getElementById('shapeFillColor').value = layer.fillColor;
            document.getElementById('shapeStrokeColor').value = layer.strokeColor;
            document.getElementById('shapeStrokeWidth').value = layer.strokeWidth;
            document.getElementById('shapeStrokeWidthDisplay').textContent = layer.strokeWidth + 'px';
            document.getElementById('shapeSize').value = layer.size;
            document.getElementById('shapeSizeDisplay').textContent = layer.size + 'px';
            document.getElementById('shapeRotation').value = layer.rotation;
            document.getElementById('shapeRotationDisplay').textContent = layer.rotation + '°';
        }
    }

    deleteLayer(layerId) {
        this.layers = this.layers.filter(l => l.id !== layerId);
        if (this.selectedLayer && this.selectedLayer.id === layerId) {
            this.selectedLayer = null;
            document.getElementById('selectedInfo').textContent = '';
        }
        this.updateLayerList();
        this.render();
        this.saveState();
    }

    toggleLayerVisibility(layerId) {
        const layer = this.layers.find(l => l.id === layerId);
        if (!layer) return;
        layer.visible = !layer.visible;
        this.updateLayerList();
        this.render();
        this.saveState();
    }

    moveLayerUp(layerId) {
        const index = this.layers.findIndex(l => l.id === layerId);
        if (index < this.layers.length - 1) {
            [this.layers[index], this.layers[index + 1]] = [this.layers[index + 1], this.layers[index]];
            this.updateLayerList();
            this.render();
            this.saveState();
        }
    }

    moveLayerDown(layerId) {
        const index = this.layers.findIndex(l => l.id === layerId);
        if (index > 0) {
            [this.layers[index], this.layers[index - 1]] = [this.layers[index - 1], this.layers[index]];
            this.updateLayerList();
            this.render();
            this.saveState();
        }
    }

    getLayerName(layer) {
        switch (layer.type) {
            case 'text': return layer.content.substring(0, 15);
            case 'image': return '이미지';
            case 'emoji': return layer.emoji;
            case 'shape': return this.getShapeName(layer.shape);
            default: return '레이어';
        }
    }

    getLayerIcon(layer) {
        switch (layer.type) {
            case 'text': return '📝';
            case 'image': return '🖼️';
            case 'emoji': return layer.emoji;
            case 'shape': return '⬛';
            default: return '📄';
        }
    }

    getShapeName(shape) {
        const names = {
            rectangle: '사각형',
            circle: '원',
            triangle: '삼각형',
            arrow: '화살표'
        };
        return names[shape] || shape;
    }

    updateLayerList() {
        const listEl = document.getElementById('layerList');

        if (this.layers.length === 0) {
            listEl.innerHTML = '<div class="layer-empty">레이어가 없습니다</div>';
            return;
        }

        listEl.innerHTML = '';

        this.layers.forEach(layer => {
            const item = document.createElement('div');
            item.className = 'layer-item';
            if (this.selectedLayer && this.selectedLayer.id === layer.id) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <div class="layer-icon">${this.getLayerIcon(layer)}</div>
                <div class="layer-info">
                    <div class="layer-name">${this.getLayerName(layer)}</div>
                    <div class="layer-type">${layer.type}</div>
                </div>
                <div class="layer-actions">
                    <button class="layer-action-btn" onclick="app.toggleLayerVisibility(${layer.id})" title="표시/숨김">
                        ${layer.visible ? '👁️' : '🚫'}
                    </button>
                    <button class="layer-action-btn delete" onclick="app.deleteLayer(${layer.id})" title="삭제">
                        🗑️
                    </button>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.layer-action-btn')) {
                    this.selectLayer(layer.id);
                }
            });

            listEl.appendChild(item);
        });
    }

    // ========================================
    // 캔버스 드래그
    // ========================================

    onCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // 레이어 선택 (역순으로 탐색)
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            if (!layer.visible) continue;

            const dx = Math.abs(x - layer.x);
            const dy = Math.abs(y - layer.y);

            // 레이어 크기에 따라 클릭 범위 조정
            let threshold = 0.05;
            if (layer.type === 'text') {
                threshold = layer.fontSize / this.canvas.width;
            } else if (layer.type === 'image' || layer.type === 'shape') {
                threshold = layer.size / this.canvas.width;
            } else if (layer.type === 'emoji') {
                threshold = layer.size / this.canvas.width;
            }

            if (dx < threshold && dy < threshold) {
                this.isDragging = true;
                this.dragLayer = layer;
                this.dragOffsetX = x - layer.x;
                this.dragOffsetY = y - layer.y;
                this.selectLayer(layer.id);
                break;
            }
        }
    }

    onCanvasMouseMove(e) {
        if (!this.isDragging || !this.dragLayer) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        this.dragLayer.x = Math.max(0, Math.min(1, x - this.dragOffsetX));
        this.dragLayer.y = Math.max(0, Math.min(1, y - this.dragOffsetY));

        this.render();
    }

    onCanvasMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragLayer = null;
            this.saveState();
        }
    }

    // ========================================
    // 키보드 단축키
    // ========================================

    onKeyDown(e) {
        // Ctrl/Cmd + Z: Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.undo();
        }

        // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            this.redo();
        }

        // Delete: 레이어 삭제
        if (e.key === 'Delete' && this.selectedLayer) {
            this.deleteLayer(this.selectedLayer.id);
        }

        // Ctrl/Cmd + S: 다운로드
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.download();
        }
    }

    // ========================================
    // History (Undo/Redo)
    // ========================================

    saveState() {
        const state = {
            layers: JSON.parse(JSON.stringify(this.layers)),
            bgType: this.bgType,
            bgColor1: this.bgColor1,
            bgColor2: this.bgColor2,
            showBorder: this.showBorder,
            filters: { ...this.filters }
        };
        this.history.push(state);
        this.updateHistoryButtons();
    }

    undo() {
        const state = this.history.undo();
        if (state) {
            this.restoreState(state);
        }
    }

    redo() {
        const state = this.history.redo();
        if (state) {
            this.restoreState(state);
        }
    }

    restoreState(state) {
        this.layers = state.layers.map(layerData => {
            let layer;
            switch (layerData.type) {
                case 'text':
                    layer = new TextLayer(layerData.id);
                    break;
                case 'image':
                    layer = new ImageLayer(layerData.id, layerData.imageData);
                    break;
                case 'emoji':
                    layer = new EmojiLayer(layerData.id, layerData.emoji);
                    break;
                case 'shape':
                    layer = new ShapeLayer(layerData.id, layerData.shape);
                    break;
            }
            Object.assign(layer, layerData);
            return layer;
        });

        this.bgType = state.bgType;
        this.bgColor1 = state.bgColor1;
        this.bgColor2 = state.bgColor2;
        this.showBorder = state.showBorder;
        this.filters = { ...state.filters };

        this.updateLayerList();
        this.render();
        this.updateHistoryButtons();
    }

    updateHistoryButtons() {
        document.getElementById('undoBtn').disabled = !this.history.canUndo();
        document.getElementById('redoBtn').disabled = !this.history.canRedo();
    }

    // ========================================
    // 프리셋 저장/불러오기
    // ========================================

    savePreset() {
        const name = prompt('프리셋 이름을 입력하세요:');
        if (!name) return;

        const preset = {
            layers: JSON.parse(JSON.stringify(this.layers)),
            bgType: this.bgType,
            bgColor1: this.bgColor1,
            bgColor2: this.bgColor2,
            showBorder: this.showBorder
        };

        localStorage.setItem(`preset_${name}`, JSON.stringify(preset));
        alert('프리셋이 저장되었습니다!');
    }

    loadPreset() {
        const name = prompt('불러올 프리셋 이름을 입력하세요:');
        if (!name) return;

        const data = localStorage.getItem(`preset_${name}`);
        if (!data) {
            alert('프리셋을 찾을 수 없습니다.');
            return;
        }

        const preset = JSON.parse(data);
        this.restoreState(preset);
        alert('프리셋이 로드되었습니다!');
    }

    // ========================================
    // 렌더링
    // ========================================

    render() {
        this.ctx.save();

        // 필터 적용
        this.ctx.filter = `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) saturate(${this.filters.saturation}%) blur(${this.filters.blur}px)`;

        // 배경 그리기
        if (this.baseImage) {
            this.drawBaseImage();
        } else {
            this.drawBackground();
        }

        this.ctx.filter = 'none';

        // 레이어 그리기
        this.layers.forEach(layer => {
            if (!layer.visible) return;

            switch (layer.type) {
                case 'text':
                    this.drawTextLayer(layer);
                    break;
                case 'image':
                    this.drawImageLayer(layer);
                    break;
                case 'emoji':
                    this.drawEmojiLayer(layer);
                    break;
                case 'shape':
                    this.drawShapeLayer(layer);
                    break;
            }
        });

        // 테두리
        if (this.showBorder) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 20;
            this.ctx.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        }

        this.ctx.restore();
    }

    drawBackground() {
        if (this.bgType === 'gradient') {
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, this.bgColor1);
            gradient.addColorStop(1, this.bgColor2);
            this.ctx.fillStyle = gradient;
        } else {
            this.ctx.fillStyle = this.bgColor1;
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBaseImage() {
        const scale = Math.max(
            this.canvas.width / this.baseImage.width,
            this.canvas.height / this.baseImage.height
        );
        const x = (this.canvas.width - this.baseImage.width * scale) / 2;
        const y = (this.canvas.height - this.baseImage.height * scale) / 2;
        this.ctx.drawImage(this.baseImage, x, y, this.baseImage.width * scale, this.baseImage.height * scale);
    }

    drawTextLayer(layer) {
        this.ctx.save();

        const x = layer.x * this.canvas.width;
        const y = layer.y * this.canvas.height;

        this.ctx.font = `900 ${layer.fontSize}px ${layer.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // 배경 박스
        if (layer.hasBackground) {
            const metrics = this.ctx.measureText(layer.content);
            const width = metrics.width + 40;
            const height = layer.fontSize + 20;

            this.ctx.globalAlpha = layer.bgOpacity;
            this.ctx.fillStyle = layer.bgColor;
            this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
            this.ctx.globalAlpha = 1;
        }

        // 그림자 설정
        if (layer.shadowBlur > 0) {
            this.ctx.shadowColor = layer.shadowColor;
            this.ctx.shadowBlur = layer.shadowBlur;
            this.ctx.shadowOffsetX = 3;
            this.ctx.shadowOffsetY = 3;
        }

        // 테두리
        if (layer.strokeWidth > 0) {
            this.ctx.strokeStyle = layer.strokeColor;
            this.ctx.lineWidth = layer.strokeWidth;
            this.ctx.lineJoin = 'round';
            this.ctx.miterLimit = 2;
            this.ctx.strokeText(layer.content, x, y);
        }

        // 텍스트
        this.ctx.fillStyle = layer.color;
        this.ctx.fillText(layer.content, x, y);

        this.ctx.restore();
    }

    drawImageLayer(layer) {
        const x = layer.x * this.canvas.width;
        const y = layer.y * this.canvas.height;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((layer.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = layer.opacity;

        const scale = layer.size / layer.imageData.width;
        const w = layer.imageData.width * scale;
        const h = layer.imageData.height * scale;

        this.ctx.drawImage(layer.imageData, -w / 2, -h / 2, w, h);

        this.ctx.restore();
    }

    drawEmojiLayer(layer) {
        this.ctx.save();

        const x = layer.x * this.canvas.width;
        const y = layer.y * this.canvas.height;

        this.ctx.font = `${layer.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(layer.emoji, x, y);

        this.ctx.restore();
    }

    drawShapeLayer(layer) {
        const x = layer.x * this.canvas.width;
        const y = layer.y * this.canvas.height;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((layer.rotation * Math.PI) / 180);

        this.ctx.fillStyle = layer.fillColor;
        this.ctx.strokeStyle = layer.strokeColor;
        this.ctx.lineWidth = layer.strokeWidth;

        switch (layer.shape) {
            case 'rectangle':
                if (layer.strokeWidth > 0) {
                    this.ctx.strokeRect(-layer.size / 2, -layer.size / 2, layer.size, layer.size);
                }
                this.ctx.fillRect(-layer.size / 2, -layer.size / 2, layer.size, layer.size);
                break;

            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, layer.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                if (layer.strokeWidth > 0) {
                    this.ctx.stroke();
                }
                break;

            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -layer.size / 2);
                this.ctx.lineTo(layer.size / 2, layer.size / 2);
                this.ctx.lineTo(-layer.size / 2, layer.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                if (layer.strokeWidth > 0) {
                    this.ctx.stroke();
                }
                break;

            case 'arrow':
                const w = layer.size;
                const h = layer.size * 0.6;
                this.ctx.beginPath();
                this.ctx.moveTo(-w / 2, -h / 4);
                this.ctx.lineTo(w / 4, -h / 4);
                this.ctx.lineTo(w / 4, -h / 2);
                this.ctx.lineTo(w / 2, 0);
                this.ctx.lineTo(w / 4, h / 2);
                this.ctx.lineTo(w / 4, h / 4);
                this.ctx.lineTo(-w / 2, h / 4);
                this.ctx.closePath();
                this.ctx.fill();
                if (layer.strokeWidth > 0) {
                    this.ctx.stroke();
                }
                break;
        }

        this.ctx.restore();
    }

    // ========================================
    // 다운로드
    // ========================================

    download() {
        const platform = PLATFORMS[this.platform];
        const filename = `thumbnail_${platform.name}_${Date.now()}.png`;

        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // ========================================
    // 탭 전환
    // ========================================

    switchTab(tabName) {
        // 탭 버튼 활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // 탭 패널 표시
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.dataset.pane === tabName);
        });
    }
}

// ========================================
// 앱 초기화
// ========================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new ThumbnailMaker();
    console.log('프로 썸네일 메이커가 시작되었습니다!');
});
