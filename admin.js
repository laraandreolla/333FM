import { salvarMusica } from "./crud.js";


const form = document.getElementById("form-musica");

const titulo = document.getElementById("titulo");
const artista = document.getElementById("artista");
const estilo = document.getElementById("estilo");

const capa = document.getElementById("capa");
const audio = document.getElementById("audio");


function converterParaBase64(arquivo) {

    return new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = () => {

            resolve(leitor.result);

        };

        leitor.onerror = () => {

            reject("Não foi possível ler o arquivo.");

        };

        leitor.readAsDataURL(arquivo);

    });

}


function descobrirDuracao(arquivo) {

    return new Promise((resolve, reject) => {

        const audioElement = document.createElement("audio");

        const url = URL.createObjectURL(arquivo);

        audioElement.src = url;

        audioElement.addEventListener("loadedmetadata", () => {

            const minutos = Math.floor(audioElement.duration / 60);

            const segundos = Math.floor(audioElement.duration % 60);

            const segundosFormatados =
                String(segundos).padStart(2, "0");

            const duracao =
                `${minutos}:${segundosFormatados}`;

            URL.revokeObjectURL(url);

            resolve(duracao);

        });

        audioElement.addEventListener("error", () => {

            URL.revokeObjectURL(url);

            reject("Não foi possível carregar o áudio.");

        });

    });

}


form.addEventListener("submit", async (event) => {

    event.preventDefault();
    const tituloValor = titulo.value.trim();
    const artistaValor = artista.value.trim();
    const estiloValor = estilo.value.trim();
    const capaArquivo = capa.files[0];
    const audioArquivo = audio.files[0];


    if (!capaArquivo || !audioArquivo) {
        alert("Selecione a capa e o arquivo MP3.");
        return;
    }


    try {
        const capaBase64 =
            await converterParaBase64(capaArquivo);
        const audioBase64 =
            await converterParaBase64(audioArquivo);
        const duracao =
            await descobrirDuracao(audioArquivo);


        await salvarMusica(
            tituloValor,
            artistaValor,
            estiloValor,
            duracao,
            capaBase64,
            audioBase64
        );


        alert("Música adicionada com sucesso!");


        form.reset();

        artista.value = "Matuê";


    } catch (erro) {

        console.error(erro);

        alert("Não foi possível adicionar a música.");

    }

});