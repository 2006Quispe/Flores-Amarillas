import {
    createGalaxy,
    scene,
    camera,
    renderer,
    controls,
    updateBlackHolePhoto
}
from "./galaxy.js";


import {
    createOrbitalSystem,
    updateOrbitalSystem
}
from "./flowers.js";


/* =====================================
   INICIAR UNIVERSO
===================================== */

createGalaxy();


createOrbitalSystem(
    scene
);


/* =====================================
   RELOJ
===================================== */

let previousTime =
    performance.now();


/* =====================================
   ROTACIÓN AUTOMÁTICA
===================================== */

let autoRotateTimeout;


/*
Cuando el usuario comienza
a mover el universo,
paramos la rotación automática.
*/

renderer.domElement.addEventListener(

    "pointerdown",

    () => {

        controls.autoRotate =
            false;


        clearTimeout(
            autoRotateTimeout
        );

    }

);


/*
Después de 2.5 segundos sin tocarlo,
la rotación automática vuelve.
*/

window.addEventListener(

    "pointerup",

    () => {

        clearTimeout(
            autoRotateTimeout
        );


        autoRotateTimeout =
            setTimeout(

                () => {

                    controls.autoRotate =
                        true;

                },

                2500

            );

    }

);


/* =====================================
   MÚSICA
===================================== */

const music =
    document.getElementById(
        "background-music"
    );


const musicButton =
    document.getElementById(
        "music-button"
    );


const musicMessage =
    document.getElementById(
        "music-message"
    );


/*
Volumen final.

Puedes cambiarlo:

0.20 = bajito
0.35 = recomendado
0.50 = medio
1.00 = máximo
*/

const TARGET_VOLUME =
    0.35;


/*
Estado de la música.
*/

let musicStarted =
    false;


let musicMuted =
    false;


let fadeInterval =
    null;


/* =====================================
   FADE IN
===================================== */

function fadeInMusic() {

    clearInterval(
        fadeInterval
    );


    /*
    Empezamos prácticamente
    desde silencio.
    */

    music.volume =
        0;


    const fadeDuration =
        2500;


    const steps =
        50;


    const intervalTime =
        fadeDuration /
        steps;


    const volumeStep =
        TARGET_VOLUME /
        steps;


    fadeInterval =
        setInterval(

            () => {

                /*
                Si el usuario silenció
                durante el fade,
                detenemos el proceso.
                */

                if (
                    musicMuted
                ) {

                    clearInterval(
                        fadeInterval
                    );

                    return;

                }


                const newVolume =
                    Math.min(

                        music.volume +
                        volumeStep,

                        TARGET_VOLUME

                    );


                music.volume =
                    newVolume;


                if (
                    newVolume >=
                    TARGET_VOLUME
                ) {

                    clearInterval(
                        fadeInterval
                    );

                }

            },

            intervalTime

        );
}


/* =====================================
   INICIAR MÚSICA
===================================== */

async function startMusic() {

    /*
    Evitamos iniciarla dos veces.
    */

    if (
        musicStarted
    ) {

        return;

    }


    try {

        music.volume =
            0;


        await music.play();


        musicStarted =
            true;


        musicMuted =
            false;


        /*
        Fade-in suave.
        */

        fadeInMusic();


        /*
        Actualizamos botón.
        */

        musicButton.textContent =
            "♫";


        musicButton.classList.add(
            "playing"
        );


        musicButton.classList.remove(
            "muted"
        );


        /*
        Ocultamos el mensaje.
        */

        musicMessage.classList.add(
            "hidden"
        );


        /*
        Después de la animación,
        lo quitamos del DOM.
        */

        setTimeout(

            () => {

                musicMessage.style.display =
                    "none";

            },

            1200

        );

    }

    catch (error) {

        /*
        No es un error grave.

        Algunos navegadores pueden
        bloquear el audio hasta una
        interacción válida.
        */

        console.log(
            "Esperando interacción para iniciar música."
        );

    }

}


/* =====================================
   PRIMERA INTERACCIÓN
===================================== */

/*
Chrome y otros navegadores no permiten
autoplay con sonido normalmente.

Por eso esperamos el primer clic/touch.
*/

function firstInteraction() {

    startMusic();


    /*
    Una vez intentado el inicio,
    ya no necesitamos estos listeners.
    */

    window.removeEventListener(
        "pointerdown",
        firstInteraction
    );


    window.removeEventListener(
        "keydown",
        firstInteraction
    );

}


window.addEventListener(

    "pointerdown",

    firstInteraction

);


window.addEventListener(

    "keydown",

    firstInteraction

);


/* =====================================
   BOTÓN MÚSICA
===================================== */

musicButton.addEventListener(

    "click",

    async (event) => {

        /*
        Evitamos que el clic del botón
        afecte otras interacciones.
        */

        event.stopPropagation();


        /*
        Si todavía no ha comenzado,
        el botón también puede iniciarla.
        */

        if (
            !musicStarted
        ) {

            await startMusic();

            return;

        }


        /* =================================
           SILENCIAR
        ================================= */

        if (
            !musicMuted
        ) {

            clearInterval(
                fadeInterval
            );


            musicMuted =
                true;


            music.muted =
                true;


            musicButton.textContent =
                "♪";


            musicButton.classList.remove(
                "playing"
            );


            musicButton.classList.add(
                "muted"
            );

        }


        /* =================================
           ACTIVAR
        ================================= */

        else {

            musicMuted =
                false;


            music.muted =
                false;


            /*
            Restauramos volumen.
            */

            music.volume =
                TARGET_VOLUME;


            /*
            Si por alguna razón estaba
            pausada, vuelve a reproducirse.
            */

            if (
                music.paused
            ) {

                try {

                    await music.play();

                }

                catch (error) {

                    console.log(
                        "No se pudo reanudar la música."
                    );

                }

            }


            musicButton.textContent =
                "♫";


            musicButton.classList.remove(
                "muted"
            );


            musicButton.classList.add(
                "playing"
            );

        }

    }

);


/* =====================================
   LOOP THREE.JS
===================================== */

function animate(
    currentTime
) {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(

            currentTime -
            previousTime,

            40

        );


    previousTime =
        currentTime;


    /*
    Movimiento de flores y frases.
    */

    updateOrbitalSystem(
        delta
    );


    /*
    Actualizamos OrbitControls primero.
    */

    controls.update();


    /*
    Después posicionamos correctamente
    la fotografía/portal respecto
    a la cámara.
    */

    updateBlackHolePhoto();


    /*
    Render final.
    */

    renderer.render(
        scene,
        camera
    );
}


/* =====================================
   INICIAR LOOP
===================================== */

requestAnimationFrame(
    animate
);