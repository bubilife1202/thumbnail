/**
 * PRO Content Pack
 * High-quality, real-world templates optimized for Smart Resizing
 */

export const templates = {
  'youtube-thumbnail': [
    {
      id: 'yt-aggro-red',
      name: '충격 실화 (Red)',
      category: 'youtube',
      description: '시선을 강탈하는 고대비 뉴스 스타일',
      thumbnail: '🚨',
      data: {
        version: '6.0.2',
        objects: [
          // Background - Stretches
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
            fill: '#7F1D1D', // Dark Red
            selectable: false,
          },
          // Top Stripe - Anchors Top
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1280,
            height: 120,
            fill: '#FCA5A5', // Light Red
            selectable: true,
          },
          // Badge - Anchors Top-Left
          {
            type: 'rect',
            left: 50,
            top: 35,
            width: 200,
            height: 50,
            fill: '#DC2626',
            rx: 10,
            ry: 10,
            selectable: true,
          },
          {
            type: 'textbox',
            left: 90,
            top: 40,
            width: 150,
            text: '긴급속보',
            fontSize: 32,
            fontWeight: 900,
            fill: '#FFFFFF',
            fontFamily: 'Black Han Sans, sans-serif',
          },
          // Main Title - Centers
          {
            type: 'textbox',
            left: 640,
            top: 250,
            width: 1100,
            originX: 'center',
            text: '이게 진짜라고?',
            fontSize: 120,
            fontWeight: 900,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 5,
            textAlign: 'center',
            fontFamily: 'Black Han Sans, sans-serif',
            shadow: { color: 'rgba(0,0,0,0.8)', blur: 20, offsetX: 5, offsetY: 5 }
          },
          // Sub Title - Centers
          {
            type: 'textbox',
            left: 640,
            top: 450,
            width: 900,
            originX: 'center',
            text: '절대 놓치지 마세요',
            fontSize: 60,
            fontWeight: 700,
            fill: '#FEF2F2',
            textAlign: 'center',
            fontFamily: 'Noto Sans KR, sans-serif',
          }
        ]
      }
    },
    {
      id: 'yt-vlog-calm',
      name: '감성 브이로그',
      category: 'vlog',
      description: '차분하고 감성적인 브이로그 스타일',
      thumbnail: '🌿',
      data: {
        version: '6.0.2',
        objects: [
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
            fill: '#F5F5F4', // Warm Grey
            selectable: false,
          },
          // Image Placeholder - Centers
          {
            type: 'rect',
            left: 100,
            top: 100,
            width: 500,
            height: 520,
            fill: '#D6D3D1',
            selectable: true,
          },
          // Vertical Line - Center
          {
            type: 'rect',
            left: 640,
            top: 100,
            width: 2,
            height: 520,
            fill: '#78716C',
            selectable: true,
          },
          // Title - Right side
          {
            type: 'textbox',
            left: 700,
            top: 200,
            width: 500,
            text: 'Daily Vlog',
            fontSize: 80,
            fontWeight: 300,
            fill: '#44403C',
            fontFamily: 'Noto Sans KR, sans-serif',
          },
          {
            type: 'textbox',
            left: 700,
            top: 320,
            width: 500,
            text: '평범한 하루의 기록',
            fontSize: 40,
            fontWeight: 400,
            fill: '#78716C',
            fontFamily: 'Noto Sans KR, sans-serif',
          }
        ]
      }
    }
  ],
  'instagram-post': [
    {
      id: 'ig-quote-simple',
      name: '심플 명언',
      category: 'instagram',
      description: '중앙 정렬 텍스트 카드',
      thumbnail: '💭',
      data: {
        version: '6.0.2',
        objects: [
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1080,
            height: 1080,
            fill: '#18181B', // Zinc 900
            selectable: false,
          },
          {
            type: 'textbox',
            left: 540,
            top: 400,
            originX: 'center',
            width: 800,
            text: '"Just Do It"',
            fontSize: 100,
            fontWeight: 900,
            fill: '#FAFAFA',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          },
          {
            type: 'rect',
            left: 490,
            top: 600,
            width: 100,
            height: 4,
            fill: '#6366F1', // Indigo 500
            selectable: true,
          },
          {
            type: 'textbox',
            left: 540,
            top: 650,
            originX: 'center',
            width: 600,
            text: 'Start today, not tomorrow',
            fontSize: 40,
            fill: '#A1A1AA',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }
        ]
      }
    }
  ],
  'instagram-story': [
    {
      id: 'story-promo',
      name: '세로형 프로모션',
      category: 'story',
      description: '꽉 찬 배경의 홍보물',
      thumbnail: '📱',
      data: {
        version: '6.0.2',
        objects: [
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            fill: '#4F46E5', // Indigo 600
            selectable: false,
          },
          {
            type: 'circle',
            left: 540,
            top: 400,
            originX: 'center',
            radius: 200,
            fill: '#FFFFFF',
            opacity: 0.1,
            selectable: true,
          },
          {
            type: 'textbox',
            left: 540,
            top: 600,
            originX: 'center',
            width: 900,
            text: 'SUMMER\nSALE',
            fontSize: 180,
            fontWeight: 900,
            fill: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Black Han Sans, sans-serif',
            lineHeight: 0.9,
          },
          {
            type: 'rect',
            left: 140,
            top: 1400,
            width: 800,
            height: 150,
            fill: '#FFFFFF',
            rx: 20,
            ry: 20,
            selectable: true,
          },
          {
            type: 'textbox',
            left: 540,
            top: 1445,
            originX: 'center',
            width: 700,
            text: 'Shop Now',
            fontSize: 60,
            fontWeight: 700,
            fill: '#4F46E5',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }
        ]
      }
    }
  ]
}

export const getTemplatesBySize = (canvasSizeId) => {
  // If specific templates exist for this size, use them
  if (templates[canvasSizeId]) return templates[canvasSizeId]

  // Fallback: If no specific templates, maybe use generic ones or return empty
  // For 'custom' or others, we might want to return 'youtube' ones as base but resized?
  // For now, return empty array to prompt user to start blank or choose another size
  return []
}

export const getAllTemplates = () => {
  return Object.values(templates).flat()
}
