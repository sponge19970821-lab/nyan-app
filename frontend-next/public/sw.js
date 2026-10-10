// 新しいサービスワーカーをすぐに利用可能にする
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 有効化後、開いているページをこのサービスワーカーの管理下に置く
self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// 通信はキャッシュせず、通常どおりネットワークへ任せる
self.addEventListener('fetch', (event) => {
});
