import * as THREE from "three";


const phrases = [

    "Gracias por quedarte siempre",

    "Contigo el día pesa menos",

    "Tu cariño no pasa de moda",

    "Aquí siempre tienes un lugar",

    "Miras lo bueno, como el girasol",

    "Tu amistad, mi lugar favorito",

    "Contigo hasta lo simple brilla",

    "Tu risa le hace bien a mis días",

    "Hoy celebro tenerte cerca",

    "Un girasol porque quiero verte feliz",

    "Que esta flor te alcance hoy",

    "Gracias por sumar luz a mis días",

    "Esta flor guarda un abrazo para ti",

    "Feliz día, pienso en ti con cariño",

    "Contigo todo lugar es bonito",

    "Como el girasol, miro hacia ti",

    "Gracias por estar aquí",

    "Hoy el amarillo lleva tu nombre",

    "Tu forma de estar también florece",

    "Que nunca te falten motivos para sonreír",

    "Una flor para recordarte cuánto importas",

    "Qué bonito coincidir contigo",

    "Tu compañía hace bonito el camino"

];


let orbitalObjects = [];


/* =====================================
   CREAR SISTEMA
===================================== */

export function createOrbitalSystem(
    scene
) {

    orbitalObjects = [];


    /*
    Muchas frases para conseguir
    el efecto de la referencia.
    */

    const textAmount = 85;

    const flowerAmount = 35;


    for (
        let i = 0;
        i < textAmount;
        i++
    ) {

        createTextObject(
            scene,
            i
        );

    }


    for (
        let i = 0;
        i < flowerAmount;
        i++
    ) {

        createFlowerObject(
            scene,
            i
        );

    }

}


/* =====================================
   TEXTO COMO SPRITE
===================================== */

function createTextObject(
    scene,
    index
) {

    const phrase =
        phrases[
            index %
            phrases.length
        ];


    const sprite =
        createTextSprite(
            phrase
        );


    const orbit =
        generateOrbit(
            index,
            85
        );


    sprite.position.copy(
        orbit.position
    );


    scene.add(sprite);


    orbitalObjects.push({

        object: sprite,

        angle:
            orbit.angle,

        radius:
            orbit.radius,

        verticalRadius:
            orbit.verticalRadius,

        depthRadius:
            orbit.depthRadius,

        speed:
            orbit.speed,

        offset:
            orbit.offset,

        type: "text"

    });

}


/* =====================================
   CREAR SPRITE DE TEXTO
===================================== */

function createTextSprite(
    text
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    const context =
        canvas.getContext("2d");


    canvas.width = 1024;
    canvas.height = 128;


    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    context.font =
        "36px Comic Sans MS";


    /*
    Glow
    */

    context.shadowColor =
        "#ffc400";


    context.shadowBlur =
        18;


    context.fillStyle =
        "#fffbd2";


    context.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );


    /*
    Segundo pase más nítido.
    */

    context.shadowBlur = 5;


    context.fillStyle =
        "#fffde8";


    context.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.colorSpace =
        THREE.SRGBColorSpace;


    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthWrite: false

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.scale.set(
        8,
        1,
        1
    );


    return sprite;

}


/* =====================================
   FLORES
===================================== */

function createFlowerObject(
    scene,
    index
) {

    const sprite =
        createFlowerSprite();


    const orbit =
        generateOrbit(
            index + 300,
            35
        );


    sprite.position.copy(
        orbit.position
    );


    scene.add(sprite);


    orbitalObjects.push({

        object: sprite,

        angle:
            orbit.angle,

        radius:
            orbit.radius,

        verticalRadius:
            orbit.verticalRadius,

        depthRadius:
            orbit.depthRadius,

        speed:
            orbit.speed,

        offset:
            orbit.offset,

        type: "flower"

    });

}


/* =====================================
   GIRASOL DIBUJADO
===================================== */

function createFlowerSprite() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 256;
    canvas.height = 256;


    const ctx =
        canvas.getContext("2d");


    ctx.translate(
        128,
        128
    );


    /*
    Glow
    */

    ctx.shadowColor =
        "#ffd400";

    ctx.shadowBlur =
        15;


    /*
    Pétalos
    */

    const petals = 16;


    for (
        let i = 0;
        i < petals;
        i++
    ) {

        ctx.save();


        ctx.rotate(
            (
                Math.PI * 2 /
                petals
            ) * i
        );


        const gradient =
            ctx.createLinearGradient(
                0,
                -95,
                0,
                -25
            );


        gradient.addColorStop(
            0,
            "#fff16b"
        );


        gradient.addColorStop(
            .45,
            "#ffd51c"
        );


        gradient.addColorStop(
            1,
            "#e89a00"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.ellipse(
            0,
            -67,
            15,
            39,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();

    }


    /*
    Centro
    */

    const centerGradient =
        ctx.createRadialGradient(
            -8,
            -8,
            3,

            0,
            0,
            39
        );


    centerGradient.addColorStop(
        0,
        "#c89432"
    );


    centerGradient.addColorStop(
        .5,
        "#6f4016"
    );


    centerGradient.addColorStop(
        1,
        "#261004"
    );


    ctx.fillStyle =
        centerGradient;


    ctx.beginPath();


    ctx.arc(
        0,
        0,
        37,
        0,
        Math.PI * 2
    );


    ctx.fill();


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.colorSpace =
        THREE.SRGBColorSpace;


    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthWrite: false

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    const size =
        1.1 +
        Math.random() * 1.5;


    sprite.scale.set(
        size,
        size,
        1
    );


    return sprite;

}


/* =====================================
   GENERAR ÓRBITA 3D
===================================== */

function generateOrbit(
    index,
    total
) {

    /*
    Distancias diferentes para que
    no parezca un único anillo.
    */

    const radius =
        9 +
        Math.random() * 24;


    const verticalRadius =
        3 +
        Math.random() * 13;


    const depthRadius =
        radius *
        (
            .45 +
            Math.random() * .55
        );


    const angle =
        (
            index /
            total
        )
        * Math.PI
        * 2
        +
        Math.random() * .6;


    const offset =
        Math.random()
        * Math.PI
        * 2;


    const speed =
        (
            0.000015 +
            Math.random()* 0.000025
            * .00065
        )
        *
        (
            Math.random() > 0.5
                ? 1
                : -1
        );


    const position =
        new THREE.Vector3(

            Math.cos(angle)
            * radius,

            Math.sin(
                angle * .75
                + offset
            )
            * verticalRadius,

            Math.sin(angle)
            * depthRadius

        );


    return {

        position,

        radius,

        verticalRadius,

        depthRadius,

        angle,

        offset,

        speed

    };

}


/* =====================================
   ACTUALIZAR ÓRBITAS
===================================== */

export function updateOrbitalSystem(
    delta
) {

    orbitalObjects.forEach(
        data => {

            /*
            Delta hace que la velocidad
            sea similar en PCs diferentes.
            */

            data.angle +=
                data.speed
                * delta
                * 10;


            const angle =
                data.angle;


            data.object.position.x =
                Math.cos(angle)
                * data.radius;


            data.object.position.z =
                Math.sin(angle)
                * data.depthRadius;


            data.object.position.y =
                Math.sin(
                    angle * .75
                    + data.offset
                )
                * data.verticalRadius;


            /*
            Ligero movimiento secundario.
            */

            if (
                data.type ===
                "flower"
            ) {

                const pulse =
                    1 +
                    Math.sin(
                        angle * 2
                    ) * .06;


                data.object.scale.x *=
                    1;

                /*
                Sprite ya mira automáticamente
                hacia la cámara.
                */

                data.object.material.opacity =
                    .75 +
                    Math.sin(angle)
                    * .20;

            }
            else {

                data.object.material.opacity =
                    .52 +
                    (
                        Math.sin(angle)
                        + 1
                    )
                    * .20;

            }

        }
    );

}