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


const TARGET_VOLUME =
    0.35;


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

    music.volume =
        0;

    const fadeDuration =
        2000;

    const steps =
        40;

    const intervalTime =
        fadeDuration / steps;

    const volumeStep =
        TARGET_VOLUME / steps;


    fadeInterval =
        setInterval(
            () => {

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
   INTERFAZ: MÚSICA ENCENDIDA
===================================== */

function showMusicPlaying() {

    musicButton.textContent =
        "♫";

    musicButton.classList.add(
        "playing"
    );

    musicButton.classList.remove(
        "muted"
    );


    musicMessage.classList.add(
        "hidden"
    );


    setTimeout(
        () => {

            musicMessage.style.display =
                "none";

        },
        1000
    );

}


/* =====================================
   INICIAR MÚSICA
===================================== */

function startMusic() {

    /*
    Si ya está reproduciéndose,
    no hacemos nada.
    */

    if (
        musicStarted &&
        !music.paused
    ) {

        return;
    }


    /*
    IMPORTANTE:

    play() se ejecuta directamente
    desde el toque/click del usuario.

    Esto es importante para Android.
    */

    music.muted =
        false;

    music.volume =
        0;


    const playPromise =
        music.play();


    if (
        playPromise !== undefined
    ) {

        playPromise
            .then(
                () => {

                    musicStarted =
                        true;

                    musicMuted =
                        false;


                    fadeInMusic();

                    showMusicPlaying();

                }
            )

            .catch(
                (error) => {

                    console.error(
                        "El navegador bloqueó la música:",
                        error
                    );


                    /*
                    Si Android la bloquea,
                    mantenemos el botón visible
                    para que pueda intentarlo
                    nuevamente.
                    */

                    musicStarted =
                        false;

                    musicMessage.style.display =
                        "block";

                    musicMessage.classList.remove(
                        "hidden"
                    );

                    musicMessage.textContent =
                        "♫ Toca aquí para escuchar la música";

                }
            );

    }

}


/* =====================================
   MENSAJE DE MÚSICA
===================================== */

/*
Ahora el mensaje inferior es un botón
real para iniciar la canción.

Funciona tanto con mouse como con
pantalla táctil.
*/

musicMessage.addEventListener(
    "click",
    (event) => {

        event.preventDefault();
        event.stopPropagation();

        startMusic();

    }
);


/*
pointerup mejora la respuesta
en dispositivos táctiles.
*/

musicMessage.addEventListener(
    "pointerup",
    (event) => {

        event.preventDefault();
        event.stopPropagation();

        startMusic();

    }
);


/* =====================================
   BOTÓN DE MÚSICA
===================================== */

musicButton.addEventListener(
    "click",
    (event) => {

        event.preventDefault();
        event.stopPropagation();


        /* ---------------------------------
           TODAVÍA NO HA COMENZADO
        --------------------------------- */

        if (
            !musicStarted
        ) {

            startMusic();

            return;
        }


        /* ---------------------------------
           SILENCIAR
        --------------------------------- */

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


        /* ---------------------------------
           VOLVER A ACTIVAR
        --------------------------------- */

        else {

            musicMuted =
                false;

            music.muted =
                false;

            music.volume =
                TARGET_VOLUME;


            /*
            Si Android pausó el audio,
            intentamos reproducirlo otra vez
            directamente desde el click.
            */

            if (
                music.paused
            ) {

                music.play()
                    .catch(
                        (error) => {

                            console.error(
                                "No se pudo reanudar la música:",
                                error
                            );

                        }
                    );

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
   TECLADO - PC
===================================== */

/*
En PC también permitimos iniciar
la música presionando una tecla.
*/

window.addEventListener(
    "keydown",
    () => {

        if (
            !musicStarted
        ) {

            startMusic();

        }

    },
    {
        once: true
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
    Actualizamos OrbitControls.
    */

    controls.update();


    /*
    Posicionamos correctamente
    la fotografía/portal.
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