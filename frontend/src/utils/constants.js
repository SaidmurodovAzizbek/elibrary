/* ═══════════════════════════════════════════════════════
   eLibrary — Utility Constants & Helpers
   ═══════════════════════════════════════════════════════ */

export const BOOK_CATEGORIES = [
  { id: 1, name: 'Dasturlash', slug: 'programming', icon: '💻', color: '#6C63FF', count: 245 },
  { id: 2, name: 'Sun\'iy Intellekt', slug: 'ai', icon: '🤖', color: '#00D9FF', count: 128 },
  { id: 3, name: 'Dizayn', slug: 'design', icon: '🎨', color: '#FF6B9D', count: 89 },
  { id: 4, name: 'Biznes', slug: 'business', icon: '📊', color: '#00E676', count: 176 },
  { id: 5, name: 'Fan', slug: 'science', icon: '🔬', color: '#FFD740', count: 134 },
  { id: 6, name: 'Adabiyot', slug: 'literature', icon: '📖', color: '#FF5252', count: 312 },
  { id: 7, name: 'Tarix', slug: 'history', icon: '🏛️', color: '#B388FF', count: 98 },
  { id: 8, name: 'Falsafa', slug: 'philosophy', icon: '🧠', color: '#84FFFF', count: 67 },
];

export const FEATURED_BOOKS = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Dasturlash',
    rating: 4.8,
    reviews: 2340,
    pages: 464,
    description: 'Dasturiy ta\'minotni yozishda toza va professional kodni yozish san\'ati. Har bir dasturchi uchun zarur bo\'lgan qo\'llanma.',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    year: 2008,
    language: 'English',
  },
  {
    id: 2,
    title: 'Design Patterns',
    author: 'Gang of Four',
    category: 'Dasturlash',
    rating: 4.7,
    reviews: 1890,
    pages: 395,
    description: 'Ob\'yektga yo\'naltirilgan dasturlashda qayta foydalaniladigan dizayn naqshlari. Klassik asar.',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    year: 1994,
    language: 'English',
  },
  {
    id: 3,
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    category: 'Sun\'iy Intellekt',
    rating: 4.9,
    reviews: 3210,
    pages: 800,
    description: 'Chuqur o\'rganish texnologiyalari haqida eng to\'liq qo\'llanma. Neural tarmoqlardan transformerlargacha.',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop',
    year: 2016,
    language: 'English',
  },
  {
    id: 4,
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    category: 'Dasturlash',
    rating: 4.8,
    reviews: 2780,
    pages: 352,
    description: 'Amaliy dasturlash mahoratini oshirish uchun eng yaxshi maslahatlar va yondashuvlar to\'plami.',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
    year: 2019,
    language: 'English',
  },
  {
    id: 5,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Falsafa',
    rating: 4.6,
    reviews: 4120,
    pages: 499,
    description: 'Inson tafakkuri haqida inqilobiy kashfiyotlar. Nobel mukofoti sovrindori asari.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    year: 2011,
    language: 'English',
  },
  {
    id: 6,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Biznes',
    rating: 4.9,
    reviews: 5670,
    pages: 320,
    description: 'Kichik odatlar, katta natijalar. Hayotingizni o\'zgartiruvchi odat tizimlarini qurishni o\'rganing.',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    year: 2018,
    language: 'English',
  },
];

export const STATS = [
  { label: 'Kitoblar', value: '12,000+', icon: '📚' },
  { label: 'Foydalanuvchilar', value: '50,000+', icon: '👥' },
  { label: 'Kategoriyalar', value: '25+', icon: '📂' },
  { label: 'Yuklab olishlar', value: '1M+', icon: '⬇️' },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aziz Karimov',
    role: 'Software Engineer',
    avatar: '👨‍💻',
    text: 'eLibrary orqali o\'z bilimlarimni oshirdim. Bu platforma menga kerakli barcha kitoblarni topishda yordam berdi.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Nodira Toshmatova',
    role: 'Data Scientist',
    avatar: '👩‍🔬',
    text: 'Sun\'iy intellekt bo\'yicha eng zo\'r kitoblar shu yerda. Interfeys ham juda chiroyli va qulay.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sardor Bektemirov',
    role: 'UI/UX Designer',
    avatar: '👨‍🎨',
    text: 'Dizayn kitoblarining katta to\'plami. Loyiha uchun ilhom olish uchun ajoyib manba.',
    rating: 4,
  },
];

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Generate star rating display
 */
export function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}
