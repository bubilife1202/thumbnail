export const canvasSizes = {
  'youtube-thumbnail': {
    id: 'youtube-thumbnail',
    platform: 'YouTube',
    name: '썸네일',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    icon: '📺',
    description: 'YouTube 동영상 썸네일',
    popular: true
  },
  'youtube-banner': {
    id: 'youtube-banner',
    platform: 'YouTube',
    name: '채널 배너',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    icon: '📺',
    description: 'YouTube 채널 아트',
    popular: false
  },
  'instagram-post': {
    id: 'instagram-post',
    platform: 'Instagram',
    name: '피드 게시물',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    icon: '📷',
    description: 'Instagram 정사각형 게시물',
    popular: true
  },
  'instagram-story': {
    id: 'instagram-story',
    platform: 'Instagram',
    name: '스토리',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    icon: '📷',
    description: 'Instagram Story',
    popular: true
  },
  'instagram-reel': {
    id: 'instagram-reel',
    platform: 'Instagram',
    name: '릴스',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    icon: '🎬',
    description: 'Instagram Reels',
    popular: true
  },
  'facebook-post': {
    id: 'facebook-post',
    platform: 'Facebook',
    name: '게시물',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    icon: '👥',
    description: 'Facebook 링크 미리보기',
    popular: false
  },
  'facebook-cover': {
    id: 'facebook-cover',
    platform: 'Facebook',
    name: '커버 이미지',
    width: 820,
    height: 312,
    aspectRatio: '2.63:1',
    icon: '👥',
    description: 'Facebook 페이지 커버',
    popular: false
  },
  'twitter-post': {
    id: 'twitter-post',
    platform: 'Twitter',
    name: '게시물',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    icon: '🐦',
    description: 'Twitter 이미지 게시물',
    popular: false
  },
  'twitter-header': {
    id: 'twitter-header',
    platform: 'Twitter',
    name: '헤더',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    icon: '🐦',
    description: 'Twitter 프로필 헤더',
    popular: false
  },
  'linkedin-post': {
    id: 'linkedin-post',
    platform: 'LinkedIn',
    name: '게시물',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    icon: '💼',
    description: 'LinkedIn 게시물 이미지',
    popular: false
  },
  'pinterest-pin': {
    id: 'pinterest-pin',
    platform: 'Pinterest',
    name: '핀',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    icon: '📌',
    description: 'Pinterest Pin',
    popular: false
  },
  'shorts-tiktok': {
    id: 'shorts-tiktok',
    platform: 'Shorts/TikTok',
    name: '숏폼',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    icon: '📱',
    description: 'YouTube Shorts / TikTok',
    popular: true
  },
  'blog-thumbnail': {
    id: 'blog-thumbnail',
    platform: 'Blog',
    name: '블로그',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    icon: '✍️',
    description: '블로그 포스트 썸네일',
    popular: false
  },
  'custom': {
    id: 'custom',
    platform: 'Custom',
    name: '사용자 지정',
    width: 1280,
    height: 720,
    aspectRatio: 'Custom',
    icon: '⚙️',
    description: '사용자 지정 크기',
    popular: false
  }
}

// 인기 플랫폼 목록 (빠른 접근)
export const popularSizes = Object.values(canvasSizes).filter(size => size.popular)

// 기본 캔버스 크기
export const DEFAULT_CANVAS_SIZE = 'youtube-thumbnail'
