# cumple-sisi

Landing one-page de cumpleaños, hecha con HTML + CSS + JavaScript puro y lista para GitHub Pages.

## Personalizar rápido

Edita el objeto `birthdayConfig` al inicio de `/home/runner/work/cumple-sisi/cumple-sisi/MatiasHuentian/cumple-sisi/script.js` para cambiar:

- `name`: nombre principal
- `mainMessage`: mensaje grande
- `subtitle`: bajada principal
- `photos`: rutas de las 3 fotos reales
- `audio`: ruta del mp3 local
- `colors`: paleta neon
- `clickPhrases` y `randomPhrases`: frases chilenas y efectos de texto

## Fotos

Sube exactamente estas 3 fotos dentro de `assets/photos/`:

- `foto1.jpg`
- `foto2.jpg`
- `foto3.jpg`

La página usa solo esas 3 fotos y no muestra placeholders vacíos si todavía no están subidas.

## Música

Pon tu canción local en:

- `assets/audio/candy.mp3`

La web ya trae el botón para prender/pausar Candy, control de volumen y efectos de sonido generados con JavaScript.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todos los archivos del proyecto.
3. Ve a **Settings**.
4. Entra a **Pages**.
5. En **Branch**, selecciona `main`.
6. En la carpeta, selecciona `/root`.
7. Guarda los cambios.
8. Abre la URL que te entregue GitHub Pages.

## Estructura

```txt
/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── audio/
    └── photos/
```
