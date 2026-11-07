# Recall

Recall es una app para aprender JavaScript, practicarlo y recordarlo. Quiz por temas, referencia rápida y retos de código con tests que corren en tu navegador. Todo se guarda solo en este dispositivo: sin cuentas ni servidores.

Demo en vivo: https://recall-one-orcin.vercel.app

## Qué hace

- **Quiz por temas**: 12 áreas de JavaScript (Fundamentos, Control, Bucles, Arrays, Métodos, Funciones, Objetos, Colecciones, Async, DOM, Errores y Algoritmos), con 118 preguntas en tres dificultades: básico, intermedio y prueba técnica. Cada respuesta trae su explicación.
- **Referencia rápida**: 36 conceptos con resumen, qué devuelven, si modifican el original y un ejemplo de código.
- **Retos de código**: 9 retos (3 por dificultad) en un editor dentro de la app. Tu solución se ejecuta en un Web Worker con límite de tiempo y de caracteres, y los tests te dicen qué pasó.
- **Repaso de errores**: las preguntas que fallas se guardan y puedes repasarlas después, sin importar la dificultad activa.
- **Progreso local**: sesiones, respuestas correctas, precisión y racha diaria se guardan en `localStorage` (clave `js_practice_local_v1`). El código de respaldo (`RCL2-...`) permite llevar tu progreso a otro dispositivo.

## Stack

React 19, TypeScript (strict) y Vite. Sin backend, sin router y sin base de datos.

## Cómo correrlo

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview
```

El despliegue usa los valores por defecto de Vite en Vercel.

## Estructura

```
src/
  App.tsx            Marco de teléfono, vistas y quiz
  state.tsx          Estado global y persistencia en localStorage
  domain.ts          Tipos del estado, temas y migración de respaldos
  data/
    questions.ts     Banco de preguntas
    challenges.ts    Retos de código con sus tests
    concepts.ts      Conceptos de la referencia rápida
    types.ts         Tipos de preguntas, retos y conceptos
  screens/           Onboarding, Home, Learn, Practice, Quiz, CodeMode, Profile
  components/        Icon, BottomNav
  services/
    codeRunner.ts    Ejecución de soluciones en Web Worker
    backup.ts        Código de respaldo (RCL2-)
assets/css/styles.css  Estilos de la app
```

## Cómo añadir contenido

- **Preguntas**: agrega un objeto al array `questions` en `src/data/questions.ts`, con `id` único, `difficulty` (`basic`, `intermediate` o `technical`), `topic` (uno de los 12 de `TOPICS` en `src/domain.ts`), `concept` (uno de los de `src/data/concepts.ts`), `type`, `q`, `hint`, `code`, `options` (4), `correct` (índice de la opción correcta) y `explain`. En modo prueba técnica la pista no se muestra, así que el `hint` puede ser "Sin pista en modo prueba técnica."
- **Retos**: agrega un objeto al array `challenges` en `src/data/challenges.ts`, con `id` único, `difficulty`, `title`, `description`, `functionName`, `template` y `tests` (cada test con `args` y `expected`). Comprueba antes que tu solución pase los tests.
- **Conceptos**: agrega un objeto al array `concepts` en `src/data/concepts.ts`, con `name`, `group`, `summary`, `returns`, `mutates` y `example`.

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: comprueba los tipos con `tsc` y construye para producción.
- `npm run preview`: sirve el build local.
- `npm test`: corre los tests de integridad de datos con Vitest.
