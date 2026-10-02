const arquivos = [
    "./",
    "./index.html",
    "./style.css",
    "./main.js",
    "./firebaseConfig.js",
    "./manifest.json",
    "./3.png"
];


self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open("333-fm-v1").then((cache) => {

            return cache.addAll(arquivos);

        })

    );

});


self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request).then((resposta) => {

            return resposta || fetch(event.request);

        })

    );

});