import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import { database } from "../firebaseConfig.js";


const listaMusicas = document.getElementById("lista-musicas");
const quantidadeMusicas = document.getElementById("quantidade-musicas");
const campoBusca = document.getElementById("campo-busca");

const audio = document.getElementById("audio");

const capaAtual = document.getElementById("capa-atual");
const nomeAtual = document.getElementById("nome-atual");
const artistaAtual = document.getElementById("artista-atual");

const botaoPlay = document.getElementById("play");
const botaoAnterior = document.getElementById("anterior");
const botaoProxima = document.getElementById("proxima");

const tempoAtual = document.getElementById("tempo-atual");
const duracao = document.getElementById("duracao");
const barraProgresso = document.getElementById("barra-progresso");


let musicas = [];
let musicaAtual = 0;


function carregarMusicas() {

    const musicasRef = ref(database, "musicas");

    onValue(musicasRef, (snapshot) => {

        const dados = snapshot.val();

        if (!dados) {

            musicas = [];

            mostrarMusicas([]);

            quantidadeMusicas.textContent = "0";

            return;

        }


        musicas = Object.entries(dados).map(([id, musica]) => {

            return {
                id: id,
                ...musica
            };

        });


        quantidadeMusicas.textContent = musicas.length;

        mostrarMusicas(musicas);

    });

}


function mostrarMusicas(lista) {

    listaMusicas.innerHTML = "";


    lista.forEach((musica) => {

        const card = document.createElement("div");

        card.classList.add("musica");


        card.innerHTML = `

            <img
                src="${musica.capa}"
                alt="${musica.titulo}"
            >

            <div class="informacoes">

                <h3>${musica.titulo}</h3>

                <p>${musica.artista}</p>

                <span>${musica.estilo}</span>

            </div>

            <button class="btn-play">
                ▶
            </button>

        `;


        const botao = card.querySelector(".btn-play");


        botao.addEventListener("click", () => {

            const indice = musicas.findIndex(
                item => item.id === musica.id
            );

            tocarMusica(indice);

        });


        listaMusicas.appendChild(card);

    });

}


function tocarMusica(indice) {

    if (!musicas[indice]) {
        return;
    }


    musicaAtual = indice;

    const musica = musicas[musicaAtual];


    audio.src = musica.audio;

    capaAtual.src = musica.capa;

    nomeAtual.textContent = musica.titulo;

    artistaAtual.textContent = musica.artista;


    audio.play();


    botaoPlay.textContent = "⏸";

}


function pausarMusica() {

    audio.pause();

    botaoPlay.textContent = "▶";

}


botaoPlay.addEventListener("click", () => {

    if (!audio.src) {
        return;
    }


    if (audio.paused) {

        audio.play();

        botaoPlay.textContent = "⏸";

    } else {

        pausarMusica();

    }

});


botaoAnterior.addEventListener("click", () => {

    if (musicas.length === 0) {
        return;
    }


    musicaAtual--;


    if (musicaAtual < 0) {

        musicaAtual = musicas.length - 1;

    }


    tocarMusica(musicaAtual);

});


botaoProxima.addEventListener("click", () => {

    if (musicas.length === 0) {
        return;
    }


    musicaAtual++;


    if (musicaAtual >= musicas.length) {

        musicaAtual = 0;

    }


    tocarMusica(musicaAtual);

});


audio.addEventListener("loadedmetadata", () => {

    duracao.textContent = formatarTempo(audio.duration);

    barraProgresso.max = audio.duration;

});


audio.addEventListener("timeupdate", () => {

    tempoAtual.textContent =
        formatarTempo(audio.currentTime);

    barraProgresso.value =
        audio.currentTime;

});


audio.addEventListener("ended", () => {

    musicaAtual++;


    if (musicaAtual >= musicas.length) {

        musicaAtual = 0;

    }


    tocarMusica(musicaAtual);

});


barraProgresso.addEventListener("input", () => {

    audio.currentTime = barraProgresso.value;

});


function formatarTempo(segundos) {

    if (isNaN(segundos)) {
        return "0:00";
    }


    const minutos = Math.floor(segundos / 60);

    const segundosRestantes =
        Math.floor(segundos % 60);


    return `${minutos}:${String(segundosRestantes).padStart(2, "0")}`;

}


campoBusca.addEventListener("input", () => {

    const texto = campoBusca.value.toLowerCase().trim();


    const resultado = musicas.filter((musica) => {

        return musica.titulo
            .toLowerCase()
            .includes(texto);

    });


    mostrarMusicas(resultado);

});


carregarMusicas();