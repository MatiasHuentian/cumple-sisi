# cumple-sisi

Landing one-page de cumpleaños, hecha con HTML + CSS + JavaScript puro y lista para GitHub Pages.

## Personalizar rápido

Edita el objeto `birthdayConfig` al inicio de `script.js` para cambiar:

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

La web ya trae el botón para prender/pausar Candy, control de volumen y efectos de sonido generados con JavaScript, sin backend ni build.

## Publicar en GitHub Pages (con Actions)

Este repo ya incluye el workflow `.github/workflows/deploy-pages.yml` para publicar automáticamente en cada push a `main`.

1. Sube todos los archivos del proyecto al repositorio (rama `main`).
2. Ve a **Settings** → **Pages**.
3. En **Build and deployment**, selecciona **Source: GitHub Actions**.
4. Haz push a `main` (o ejecuta manualmente el workflow desde **Actions**).
5. Espera que termine el job **Deploy static site to GitHub Pages**.
6. Abre la URL: `https://TU-USUARIO.github.io/cumple-sisi/`.

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
