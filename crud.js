import {
    ref,
    push,
    set
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