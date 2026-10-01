import {
    salvarMusica,
    buscarMusicas,
    editarMusica,
    excluirMusica
} from "./crud.js";


const form = document.getElementById("form-musica");

const titulo = document.getElementById("titulo");
const artista = document.getElementById("artista");
const estilo = document.getElementById("estilo");

const capa = document.getElementById("capa");
const audio = document.getElementById("audio");

const listaMusicas = document.getElementById("lista-musicas");


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


function mostrarMusicas(musicas) {

    listaMusicas.innerHTML = "";


    musicas.forEach((musica) => {

        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>
                <img
                    src="${musica.capa}"
                    alt="${musica.titulo}"
                >
            </td>

            <td>${musica.titulo}</td>

            <td>${musica.artista}</td>

            <td>${musica.estilo}</td>

            <td>${musica.duracao}</td>

            <td>

                <button
                    class="btn-editar"
                    data-id="${musica.id}"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    data-id="${musica.id}"
                >
                    Excluir
                </button>

            </td>

        `;


        const botaoEditar =
            linha.querySelector(".btn-editar");

        const botaoExcluir =
            linha.querySelector(".btn-excluir");


        botaoEditar.addEventListener("click", () => {

            editar(musica);

        });


        botaoExcluir.addEventListener("click", () => {

            excluir(musica);

        });


        listaMusicas.appendChild(linha);

    });

}


async function editar(musica) {

    const novoTitulo = prompt(
        "Digite o novo título:",
        musica.titulo
    );


    if (novoTitulo === null) {
        return;
    }


    const novoEstilo = prompt(
        "Digite o novo estilo:",
        musica.estilo
    );


    if (novoEstilo === null) {
        return;
    }


    try {

        await editarMusica(
            musica.id,
            novoTitulo.trim(),
            novoEstilo.trim()
        );

        alert("Música editada com sucesso!");

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível editar a música.");

    }

}


async function excluir(musica) {

    const confirmar = confirm(
        `Deseja excluir "${musica.titulo}"?`
    );


    if (!confirmar) {
        return;
    }


    try {

        await excluirMusica(musica.id);

        alert("Música excluída com sucesso!");

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível excluir a música.");

    }

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


buscarMusicas((musicas) => {

    mostrarMusicas(musicas);

});