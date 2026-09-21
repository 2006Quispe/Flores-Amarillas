import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";


/* =========================================================
   VARIABLES PRINCIPALES
========================================================= */

export let scene;
export let camera;
export let renderer;
export let controls;

export let blackHoleGroup;


/* =========================================================
   CONFIGURACIÓN DEL AGUJERO NEGRO
========================================================= */

const BLACK_HOLE_RADIUS = 3;

/*
La foto está ligeramente por delante de la esfera,
pero visualmente queda encerrada por el borde negro.
*/
const PHOTO_DISTANCE = 3.04;

const PHOTO_SIZE = 5.25;


/* =========================================================
   OBJETOS DEL PORTAL
========================================================= */

let photoSprite = null;
let portalBorder = null;
let portalGlow = null;


/* =========================================================
   CREAR UNIVERSO
========================================================= */

export function createGalaxy() {

    const container =
        document.getElementById(
            "three-container"
        );


    /* =====================================================
       ESCENA
    ===================================================== */

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x000000
        );


    /* =====================================================
       CÁMARA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(

            55,

            window.innerWidth /
            window.innerHeight,

            0.1,

            2000
        );


    camera.position.set(
        0,
        7,
        24
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: false

        });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )

    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.35;


    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       CONTROLES
    ===================================================== */

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.045;


    controls.enablePan =
        false;


    /*
    Zoom mínimo/máximo.
    */

    controls.minDistance =
        9;


    controls.maxDistance =
        55;


    /*
    Permite mirar prácticamente
    desde arriba, abajo y costados.
    */

    controls.minPolarAngle =
        0.05;


    controls.maxPolarAngle =
        Math.PI - 0.05;


    controls.target.set(
        0,
        0,
        0
    );


    /*
    Rotación automática suave.
    */

    controls.autoRotate =
        true;


    controls.autoRotateSpeed =
        0.08;


    /* =====================================================
       CREAR UNIVERSO
    ===================================================== */

    createStars();

    createBlackHole();


    /* =====================================================
       RESPONSIVE
    ===================================================== */

    window.addEventListener(
        "resize",
        resizeGalaxy
    );


    return {

        THREE,

        scene,

        camera,

        renderer,

        controls

    };
}


/* =========================================================
   ESTRELLAS
========================================================= */

function createStars() {

    const totalStars =
        2600;


    const positions =
        new Float32Array(
            totalStars * 3
        );


    for (
        let i = 0;
        i < totalStars;
        i++
    ) {

        const radius =
            80 +
            Math.random() * 300;


        const theta =
            Math.random()
            * Math.PI
            * 2;


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        positions[
            i * 3
        ] =

            radius *

            Math.sin(phi) *

            Math.cos(theta);


        positions[
            i * 3 + 1
        ] =

            radius *

            Math.cos(phi);


        positions[
            i * 3 + 2
        ] =

            radius *

            Math.sin(phi) *

            Math.sin(theta);

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )

    );


    const material =
        new THREE.PointsMaterial({

            color:
                0xffffff,

            size:
                0.16,

            transparent:
                true,

            opacity:
                0.85,

            sizeAttenuation:
                true

        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        stars
    );
}


/* =========================================================
   CREAR AGUJERO NEGRO
========================================================= */

function createBlackHole() {

    blackHoleGroup =
        new THREE.Group();


    scene.add(
        blackHoleGroup
    );


    /*
    Orden visual:

    1. Resplandor exterior
    2. Disco de acreción
    3. Esfera negra
    4. Fotografía
    5. Borde del portal
    */

    createOuterGlow();

    createAccretionDisk();

    createEventHorizon();

    createPhotoInsideBlackHole();

}


/* =========================================================
   HORIZONTE DE EVENTOS
========================================================= */

function createEventHorizon() {

    const geometry =
        new THREE.SphereGeometry(

            BLACK_HOLE_RADIUS,

            96,

            96
        );


    /*
    MeshBasicMaterial evita que necesitemos
    luces para mantenerlo completamente negro.
    */

    const material =
        new THREE.MeshBasicMaterial({

            color:
                0x000000

        });


    const sphere =
        new THREE.Mesh(
            geometry,
            material
        );


    /*
    La esfera sí escribe profundidad.

    Esto es importante porque permite
    ocultar las partes del disco que
    están realmente detrás.
    */

    sphere.material.depthTest =
        true;


    sphere.material.depthWrite =
        true;


    sphere.renderOrder =
        5;


    blackHoleGroup.add(
        sphere
    );
}


/* =========================================================
   FOTO DENTRO DEL PORTAL
========================================================= */

function createPhotoInsideBlackHole() {

    const loader =
        new THREE.TextureLoader();


    loader.load(

        "assets/images/Myfavory.png",


        /* =================================================
           FOTO CARGADA
        ================================================= */

        (texture) => {

            const image =
                texture.image;


            /*
            Canvas cuadrado para crear
            nuestra textura circular.
            */

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                1024;


            canvas.height =
                1024;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            /*
            Fondo transparente.
            */

            ctx.clearRect(
                0,
                0,
                1024,
                1024
            );


            /* =================================================
               RECORTE CIRCULAR
            ================================================= */

            ctx.save();


            ctx.beginPath();


            ctx.arc(

                512,

                512,

                470,

                0,

                Math.PI * 2

            );


            ctx.closePath();


            ctx.clip();


            /* =================================================
               RECORTE TIPO COVER
            ================================================= */

            const imageWidth =
                image.width;


            const imageHeight =
                image.height;


            let sourceSize;

            let sx;

            let sy;


            if (
                imageWidth >
                imageHeight
            ) {

                sourceSize =
                    imageHeight;


                sx =
                    (
                        imageWidth -
                        sourceSize
                    )
                    / 2;


                sy =
                    0;

            }

            else {

                sourceSize =
                    imageWidth;


                sx =
                    0;


                /*
                La foto es vertical.

                0.23 hace que el recorte
                se desplace ligeramente
                hacia arriba.
                */

                sy =
                    (
                        imageHeight -
                        sourceSize
                    )
                    * 0.23;

            }


            ctx.drawImage(

                image,

                sx,
                sy,

                sourceSize,
                sourceSize,

                0,
                0,

                1024,
                1024

            );


            /* =================================================
               VIÑETA NEGRA
            ================================================= */

            const vignette =
                ctx.createRadialGradient(

                    512,
                    512,
                    270,

                    512,
                    512,
                    500

                );


            vignette.addColorStop(

                0,

                "rgba(0,0,0,0)"

            );


            vignette.addColorStop(

                0.55,

                "rgba(0,0,0,0)"

            );


            vignette.addColorStop(

                0.72,

                "rgba(0,0,0,0.08)"

            );


            vignette.addColorStop(

                0.84,

                "rgba(0,0,0,0.30)"

            );


            vignette.addColorStop(

                0.94,

                "rgba(0,0,0,0.75)"

            );


            vignette.addColorStop(

                1,

                "rgba(0,0,0,1)"

            );


            ctx.fillStyle =
                vignette;


            ctx.fillRect(

                0,
                0,

                1024,
                1024

            );


            /* =================================================
               PEQUEÑO TONO DORADO
            ================================================= */

            const gold =
                ctx.createRadialGradient(

                    512,
                    512,
                    300,

                    512,
                    512,
                    500

                );


            gold.addColorStop(

                0,

                "rgba(255,200,40,0)"

            );


            gold.addColorStop(

                0.72,

                "rgba(255,200,40,0)"

            );


            gold.addColorStop(

                0.88,

                "rgba(255,175,0,0.10)"

            );


            gold.addColorStop(

                1,

                "rgba(255,130,0,0)"

            );


            ctx.fillStyle =
                gold;


            ctx.fillRect(

                0,
                0,

                1024,
                1024

            );


            ctx.restore();


            /* =================================================
               TEXTURA FINAL
            ================================================= */

            const photoTexture =
                new THREE.CanvasTexture(
                    canvas
                );


            photoTexture.colorSpace =
                THREE.SRGBColorSpace;


            photoTexture.needsUpdate =
                true;


            /* =================================================
               MATERIAL DE LA FOTO
            ================================================= */

            const photoMaterial =
                new THREE.SpriteMaterial({

                    map:
                        photoTexture,

                    transparent:
                        true,

                    /*
                    Queremos que otros objetos
                    puedan ser ocultados correctamente.
                    */

                    depthTest:
                        true,

                    depthWrite:
                        false,

                    toneMapped:
                        false

                });


            photoSprite =
                new THREE.Sprite(
                    photoMaterial
                );


            photoSprite.scale.set(

                PHOTO_SIZE,

                PHOTO_SIZE,

                1

            );


            photoSprite.position.set(

                0,

                0,

                PHOTO_DISTANCE

            );


            /*
            Se dibuja después del horizonte.
            */

            photoSprite.renderOrder =
                20;


            blackHoleGroup.add(
                photoSprite
            );


            /*
            Ahora construimos los bordes
            del portal alrededor de la foto.
            */

            createPortalBorder();

            createPortalGlow();

        },


        undefined,


        (error) => {

            console.error(

                "No se pudo cargar Myfavory.png:",

                error

            );

        }

    );
}


/* =========================================================
   BORDE NEGRO DEL PORTAL
========================================================= */

function createPortalBorder() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        512;


    canvas.height =
        512;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        512,
        512
    );


    /*
    Creamos un aro.

    Centro = transparente.
    Medio = negro.
    Exterior = vuelve a desaparecer.
    */

    const gradient =
        ctx.createRadialGradient(

            256,
            256,
            150,

            256,
            256,
            256

        );


    gradient.addColorStop(

        0,

        "rgba(0,0,0,0)"

    );


    gradient.addColorStop(

        0.60,

        "rgba(0,0,0,0)"

    );


    gradient.addColorStop(

        0.70,

        "rgba(0,0,0,0.30)"

    );


    gradient.addColorStop(

        0.78,

        "rgba(0,0,0,0.85)"

    );


    gradient.addColorStop(

        0.88,

        "rgba(0,0,0,1)"

    );


    gradient.addColorStop(

        0.96,

        "rgba(0,0,0,0.80)"

    );


    gradient.addColorStop(

        1,

        "rgba(0,0,0,0)"

    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        0,
        0,

        512,
        512

    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            depthTest:
                true,

            depthWrite:
                false,

            toneMapped:
                false

        });


    portalBorder =
        new THREE.Sprite(
            material
        );


    /*
    IMPORTANTE:

    PortalBorder NO será hijo de la foto.

    Ambos estarán directamente dentro
    de blackHoleGroup para poder controlar
    sus tamaños independientemente.
    */

    portalBorder.scale.set(

        6.25,

        6.25,

        1

    );


    portalBorder.position.set(

        0,

        0,

        PHOTO_DISTANCE + 0.015

    );


    portalBorder.renderOrder =
        21;


    blackHoleGroup.add(
        portalBorder
    );
}


/* =========================================================
   RESPLANDOR DEL PORTAL
========================================================= */

function createPortalGlow() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        512;


    canvas.height =
        512;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const gradient =
        ctx.createRadialGradient(

            256,
            256,
            165,

            256,
            256,
            255

        );


    /*
    Centro completamente transparente.
    */

    gradient.addColorStop(

        0,

        "rgba(255,190,0,0)"

    );


    gradient.addColorStop(

        0.62,

        "rgba(255,190,0,0)"

    );


    gradient.addColorStop(

        0.76,

        "rgba(255,195,30,0.09)"

    );


    gradient.addColorStop(

        0.86,

        "rgba(255,175,0,0.15)"

    );


    gradient.addColorStop(

        1,

        "rgba(255,140,0,0)"

    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        0,
        0,

        512,
        512

    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            blending:
                THREE.AdditiveBlending,

            depthTest:
                true,

            depthWrite:
                false,

            toneMapped:
                false

        });


    portalGlow =
        new THREE.Sprite(
            material
        );


    portalGlow.scale.set(

        6.7,

        6.7,

        1

    );


    portalGlow.position.set(

        0,

        0,

        PHOTO_DISTANCE + 0.02

    );


    portalGlow.renderOrder =
        22;


    blackHoleGroup.add(
        portalGlow
    );
}


/* =========================================================
   ACTUALIZAR PORTAL SEGÚN LA CÁMARA
========================================================= */

export function updateBlackHolePhoto() {

    if (
        !photoSprite ||
        !portalBorder ||
        !portalGlow ||
        !camera ||
        !blackHoleGroup
    ) {

        return;

    }


    /*
    Transformamos la posición de la cámara
    al espacio local del agujero negro.
    */

    const cameraLocal =
        blackHoleGroup.worldToLocal(
            camera.position.clone()
        );


    /*
    Vector desde el centro hacia la cámara.
    */

    const direction =
        cameraLocal
            .clone()
            .normalize();


    /*
    La fotografía siempre se coloca en
    la superficie que mira hacia nosotros.
    */

    const photoPosition =
        direction
            .clone()
            .multiplyScalar(
                PHOTO_DISTANCE
            );


    photoSprite.position.copy(
        photoPosition
    );


    /*
    Borde ligeramente más cerca
    de la cámara.
    */

    portalBorder.position.copy(

        direction
            .clone()
            .multiplyScalar(
                PHOTO_DISTANCE + 0.015
            )

    );


    /*
    Glow todavía un poquito más adelante.
    */

    portalGlow.position.copy(

        direction
            .clone()
            .multiplyScalar(
                PHOTO_DISTANCE + 0.025
            )

    );


    /*
    Los tres son Sprite,
    así que Three.js automáticamente
    los mantiene mirando hacia la cámara.
    */


    /* =====================================================
       ESCALA SEGÚN DISTANCIA
    ===================================================== */

    const distance =
        camera.position.distanceTo(
            blackHoleGroup.position
        );


    const scaleFactor =
        THREE.MathUtils.clamp(

            distance / 24,

            0.94,

            1.06

        );


    photoSprite.scale.set(

        PHOTO_SIZE * scaleFactor,

        PHOTO_SIZE * scaleFactor,

        1

    );


    portalBorder.scale.set(

        6.25 * scaleFactor,

        6.25 * scaleFactor,

        1

    );


    portalGlow.scale.set(

        6.7 * scaleFactor,

        6.7 * scaleFactor,

        1

    );

}


/* =========================================================
   DISCO DE ACRECIÓN 3D
========================================================= */

function createAccretionDisk() {

    /*
    Usamos varios anillos.

    PERO ahora respetan correctamente
    el depth buffer.

    Esto permite que la esfera negra
    tape las partes del disco que pasan
    por detrás.
    */

    const ringCount =
        42;


    for (
        let i = 0;
        i < ringCount;
        i++
    ) {

        const progress =
            i /
            (
                ringCount - 1
            );


        const innerRadius =
            3.45 +
            progress * 6.8;


        const thickness =
            0.10 +
            Math.random() * 0.12;


        const geometry =
            new THREE.RingGeometry(

                innerRadius,

                innerRadius +
                thickness,

                192

            );


        /* =================================================
           COLOR
        ================================================= */

        const color =
            new THREE.Color();


        if (
            progress < 0.20
        ) {

            /*
            Cerca del agujero:
            casi blanco.
            */

            color.setRGB(

                1,

                0.96,

                0.62

            );

        }

        else if (
            progress < 0.50
        ) {

            /*
            Amarillo.
            */

            color.setRGB(

                1,

                0.78,

                0.08

            );

        }

        else if (
            progress < 0.78
        ) {

            /*
            Amarillo-naranja.
            */

            color.setRGB(

                1,

                0.52,

                0.02

            );

        }

        else {

            /*
            Exterior naranja.
            */

            color.setRGB(

                0.92,

                0.26,

                0.005

            );

        }


        /* =================================================
           MATERIAL
        ================================================= */

        const material =
            new THREE.MeshBasicMaterial({

                color,

                transparent:
                    true,

                opacity:
                    0.94 -
                    progress * 0.52,

                side:
                    THREE.DoubleSide,

                /*
                Glow del disco.
                */

                blending:
                    THREE.AdditiveBlending,

                /*
                MUY IMPORTANTE:

                depthTest activado:
                comprueba qué está delante.

                depthWrite activado:
                el disco participa correctamente
                en la profundidad.
                */

                depthTest:
                    true,

                depthWrite:
                    true

            });


        const ring =
            new THREE.Mesh(

                geometry,

                material

            );


        /*
        RingGeometry originalmente
        está orientado sobre XY.

        Lo acostamos sobre XZ.
        */

        ring.rotation.x =
            Math.PI / 2;


        /*
        Irregularidad extremadamente pequeña
        para que no parezca una figura perfecta.
        */

        ring.rotation.z =
            (
                Math.random() - 0.5
            )
            * 0.035;


        /*
        Pequeñísimo desplazamiento vertical
        para dar volumen al disco.
        */

        ring.position.y =
            (
                Math.random() - 0.5
            )
            * 0.055;


        /*
        Los anillos se renderizan antes
        que el portal.
        */

        ring.renderOrder =
            3;


        blackHoleGroup.add(
            ring
        );

    }


    /*
    Añadimos una zona interior brillante
    alrededor del horizonte de eventos.
    */

    createInnerAccretionGlow();
}


/* =========================================================
   RESPLANDOR INTERIOR DEL DISCO
========================================================= */

function createInnerAccretionGlow() {

    const geometry =
        new THREE.RingGeometry(

            3.25,

            4.15,

            192

        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xffe766,

            transparent:
                true,

            opacity:
                0.60,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthTest:
                true,

            depthWrite:
                false

        });


    const glow =
        new THREE.Mesh(

            geometry,

            material

        );


    glow.rotation.x =
        Math.PI / 2;


    glow.renderOrder =
        4;


    blackHoleGroup.add(
        glow
    );
}


/* =========================================================
   RESPLANDOR EXTERIOR
========================================================= */

function createOuterGlow() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        512;


    canvas.height =
        512;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const gradient =
        ctx.createRadialGradient(

            256,
            256,
            20,

            256,
            256,
            256

        );


    gradient.addColorStop(

        0,

        "rgba(255,245,150,.50)"

    );


    gradient.addColorStop(

        0.18,

        "rgba(255,205,30,.30)"

    );


    gradient.addColorStop(

        0.45,

        "rgba(255,135,0,.11)"

    );


    gradient.addColorStop(

        1,

        "rgba(255,100,0,0)"

    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        0,
        0,

        512,
        512

    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            depthTest:
                true

        });


    const glow =
        new THREE.Sprite(
            material
        );


    glow.scale.set(

        23,

        23,

        1

    );


    /*
    Este glow debe quedar visualmente
    detrás de todo.
    */

    glow.renderOrder =
        0;


    blackHoleGroup.add(
        glow
    );
}


/* =========================================================
   RESPONSIVE
========================================================= */

function resizeGalaxy() {

    camera.aspect =

        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


    renderer.setPixelRatio(

        Math.min(

            window.devicePixelRatio,

            2

        )

    );
}