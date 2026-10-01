import {
    ref,
    push,
    set,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import { database } from "./firebaseConfig.js";


export async function salvarMusica(
    titulo,
    artista,
    estilo,
    duracao,
    capa,
    audio
) {

    const musicasRef = ref(database, "musicas");

    const novaMusicaRef = push(musicasRef);

    await set(novaMusicaRef, {

        titulo: titulo,
        artista: artista,
        estilo: estilo,
        duracao: duracao,
        capa: capa,
        audio: audio

    });

}


export function buscarMusicas(callback) {

    const musicasRef = ref(database, "musicas");

    onValue(musicasRef, (snapshot) => {

        const dados = snapshot.val();

        if (!dados) {

            callback([]);

            return;

        }

        const musicas = Object.entries(dados).map(([id, musica]) => {

            return {
                id: id,
                ...musica
            };

        });

        callback(musicas);

    });

}


export async function editarMusica(id, titulo, estilo) {

    const musicaRef = ref(database, `musicas/${id}`);

    await update(musicaRef, {

        titulo: titulo,
        estilo: estilo

    });

}


export async function excluirMusica(id) {

    const musicaRef = ref(database, `musicas/${id}`);

    await remove(musicaRef);

}