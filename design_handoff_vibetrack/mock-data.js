// Mock data for VibeTrack
// Shape mirrors a realistic API response:
//   { id, title, artist, spotify_url, album_image_url, reason,
//     popularity? (optional), preview_url? (optional) }
// We add no extra fields locally — the UI degrades gracefully when
// popularity / preview_url are missing.
window.VIBE_MOCKS = {
  songs: [
    { id:"1iDQ0rKPkk09OzBhXOltmg", title:"遺憾", artist:"Mavis Hee",
      spotify_url:"https://open.spotify.com/track/1iDQ0rKPkk09OzBhXOltmg",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b273e382add0102fa15d52c96a75",
      reason:"許美靜的經典抒情歌曲，以細膩嗓音唱出失戀後的遺憾與不捨，最能觸動失戀者的心弦" },
    { id:"3mkZwD5EM5M3Koft1YXn2j", title:"牽掛", artist:"Wu Bai",
      spotify_url:"https://open.spotify.com/track/3mkZwD5EM5M3Koft1YXn2j",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b273a3a2b2ca69f6090b8ea46965",
      reason:"伍佰深情演繹的「牽掛」，將分手後仍放不下的思念情緒完美呈現，是台灣搖滾抒情的代表作" },
    { id:"1M07r7zZdZE8xyS2lwqGUT", title:"傷心酒店", artist:"Jody Chiang",
      spotify_url:"https://open.spotify.com/track/1M07r7zZdZE8xyS2lwqGUT",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b273e3ff712cbf827c16f03df44c",
      reason:"江蕙的台語經典「傷心酒店」，以悲傷旋律訴說失戀心碎，是台灣本土最具共鳴的療傷歌曲" },
    { id:"7cPRLkrEU6ijwE0pJDuIKx", title:"心碎好几遍 （Million Heartbreaks)", artist:"寒冰Ice",
      spotify_url:"https://open.spotify.com/track/7cPRLkrEU6ijwE0pJDuIKx",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b27308c1aa323645cc356aa77344",
      reason:"寒冰Ice的「心碎好几遍」直接點出失戀的痛苦循環，華語流行曲風適合沉浸在悲傷情緒中" },
    { id:"7wuSjqgIub4ac5hus2haIA", title:"心碎", artist:"Chih Siou",
      spotify_url:"https://open.spotify.com/track/7wuSjqgIub4ac5hus2haIA",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b273dba80e8ed818b9739a591ce4",
      reason:"志秀的「心碎」簡單直白地描繪心碎感受，溫柔的編曲能陪伴你度過失戀的低潮時刻" },
    { id:"41UXUheIFaqFtC4mhaA24o", title:"心碎復健中", artist:"艾薇 Ivy",
      spotify_url:"https://open.spotify.com/track/41UXUheIFaqFtC4mhaA24o",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b2730c91704919ddcd53229744b9",
      reason:"艾薇的「心碎復健中」傳達療傷的過程，鼓勵失戀者慢慢走出傷痛，是充滿希望的抒情作品" },
    { id:"3Zcs5flpb0P0AoKS1N2sTV", title:"最後一次心碎", artist:"Patrick Brasca",
      spotify_url:"https://open.spotify.com/track/3Zcs5flpb0P0AoKS1N2sTV",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b2730383a5ce8a07ecb5f118ed0a",
      reason:"Patrick Brasca的「最後一次心碎」承諾不再為愛受傷，適合想要重新振作的失戀者聆聽" },
    { id:"3Q92tnYqeCmKLjW9s0AjNo", title:"Melancholy - Piano Version", artist:"Piano Skin",
      spotify_url:"https://open.spotify.com/track/3Q92tnYqeCmKLjW9s0AjNo",
      album_image_url:"https://i.scdn.co/image/ab67616d0000b273b707d4a1712a8d986fe5373e",
      reason:"鋼琴純音樂版本的「Melancholy」，憂鬱琴聲不帶歌詞卻能深刻撫慰受傷的心靈" },
  ],

  // resolved below
  moodPresets: {
    melancholic: {
      label: "Heartbreak Reverie",
      sub: "Bittersweet · Late-night · 失戀後的療傷",
      tags: [
        { name: "Heartbroken", primary: true },
        { name: "Reflective" },
        { name: "Bittersweet" },
        { name: "想念" },
        { name: "Cathartic" },
      ],
      gradA: "#7a5cff",
      gradB: "#ff3cac",
    },
    energetic: {
      label: "Solar Drive",
      sub: "Optimistic · Movement · Open road",
      tags: [
        { name: "Uplifting", primary: true },
        { name: "Driving" },
        { name: "Open" },
        { name: "興奮" },
      ],
      gradA: "#b8ff3c",
      gradB: "#ffb547",
    },
    calm: {
      label: "Glass Morning",
      sub: "Calm · Centered · 平靜",
      tags: [
        { name: "Calm", primary: true },
        { name: "Soft" },
        { name: "平靜" },
      ],
      gradA: "#00e5ff",
      gradB: "#7a5cff",
    }
  },
  // Seed history for the dashboard
  seedHistory: [
    {
      id: "h001",
      ts: Date.now() - 1000*60*12,
      type: "text",
      input: "和他分手後第三天，整理東西的時候看到我們以前一起拍的照片，眼淚突然就掉下來了。",
      market: "TW",
      moodKey: "melancholic",
      songIds: ["1iDQ0rKPkk09OzBhXOltmg","3mkZwD5EM5M3Koft1YXn2j","1M07r7zZdZE8xyS2lwqGUT","7cPRLkrEU6ijwE0pJDuIKx","7wuSjqgIub4ac5hus2haIA","41UXUheIFaqFtC4mhaA24o","3Zcs5flpb0P0AoKS1N2sTV","3Q92tnYqeCmKLjW9s0AjNo"],
    },
    {
      id: "h002",
      ts: Date.now() - 1000*60*60*2,
      type: "image",
      input: "sunset-beach.jpg · 1840×1024",
      market: "TW",
      moodKey: "calm",
      songIds: ["3Q92tnYqeCmKLjW9s0AjNo","7wuSjqgIub4ac5hus2haIA","41UXUheIFaqFtC4mhaA24o","3mkZwD5EM5M3Koft1YXn2j","1iDQ0rKPkk09OzBhXOltmg","7cPRLkrEU6ijwE0pJDuIKx","1M07r7zZdZE8xyS2lwqGUT","3Zcs5flpb0P0AoKS1N2sTV"],
    },
    {
      id: "h003",
      ts: Date.now() - 1000*60*60*5,
      type: "text",
      input: "Just finished a 10K and the morning feels electric — I want music that matches this energy.",
      market: "US",
      moodKey: "energetic",
      songIds: ["7cPRLkrEU6ijwE0pJDuIKx","3Zcs5flpb0P0AoKS1N2sTV","1iDQ0rKPkk09OzBhXOltmg","3mkZwD5EM5M3Koft1YXn2j","41UXUheIFaqFtC4mhaA24o","1M07r7zZdZE8xyS2lwqGUT","7wuSjqgIub4ac5hus2haIA","3Q92tnYqeCmKLjW9s0AjNo"],
    },
    {
      id: "h004",
      ts: Date.now() - 1000*60*60*26,
      type: "text",
      input: "下班的捷運上，戴著耳機看著窗外的城市光點不斷劃過。",
      market: "TW",
      moodKey: "melancholic",
      songIds: ["3mkZwD5EM5M3Koft1YXn2j","1iDQ0rKPkk09OzBhXOltmg","41UXUheIFaqFtC4mhaA24o","7wuSjqgIub4ac5hus2haIA","3Q92tnYqeCmKLjW9s0AjNo","7cPRLkrEU6ijwE0pJDuIKx","1M07r7zZdZE8xyS2lwqGUT","3Zcs5flpb0P0AoKS1N2sTV"],
    },
  ],
};

// When bundled as a standalone file, album cover images are inlined via
// <meta name="ext-resource-dependency"> tags and exposed on window.__resources
// keyed by `alb_<trackId>`. Swap them in if present; otherwise keep the live CDN URL.
(function resolveAlbumArt() {
  try {
    var res = window.__resources;
    if (!res) return;
    window.VIBE_MOCKS.songs.forEach(function (s) {
      var blob = res["alb_" + s.id];
      if (blob) s.album_image_url = blob;
    });
  } catch (e) {}
})();

