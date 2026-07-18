const CACHE_NOME = 'controle-oleo-moto-v2';
const ARQUIVOS_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Instalar e salvar todos os arquivos no cache
self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NOME)
            .then(cache => {
                console.log('Cache aberto com sucesso');
                return cache.addAll(ARQUIVOS_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys().then(nomesCache => {
            return Promise.all(
                nomesCache.filter(nome => nome !== CACHE_NOME)
                    .map(nome => caches.delete(nome))
            );
        }).then(() => self.clients.claim())
    );
});

// Carregar do cache quando não tiver internet
self.addEventListener('fetch', (evento) => {
    evento.respondWith(
        caches.match(evento.request)
            .then(respostaCache => {
                // Usa cache se existir, senão busca na web
                return respostaCache || fetch(evento.request)
                    .then(respostaWeb => {
                        // Salva nova resposta no cache
                        return caches.open(CACHE_NOME)
                            .then(cache => {
                                cache.put(evento.request, respostaWeb.clone());
                                return respostaWeb;
                            });
                    });
            })
    );
});
