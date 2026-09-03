import type { Concept } from "./types";

export const concepts: Concept[] = [
  {
    name: "let y const",
    group: "Fundamentos",
    summary:
      "Crean variables: const evita reasignar la variable; let permite darle otro valor después.",
    returns: "No devuelven un valor",
    mutates: "let puede reasignarse",
    example: "const nombre='Ana';\nlet puntos=0;\npuntos=1;",
  },
  {
    name: "Tipos de datos",
    group: "Fundamentos",
    summary:
      "JavaScript distingue strings, números, booleanos, undefined, null, objetos y otros tipos.",
    returns: "typeof indica el tipo",
    mutates: "No aplica",
    example:
      "typeof 'hola' → 'string'\ntypeof 42 → 'number'\ntypeof true → 'boolean'",
  },
  {
    name: "Truthy y falsy",
    group: "Fundamentos",
    summary:
      "En una condición, algunos valores se comportan como false. Los más comunes son false, 0, cadena vacía, null, undefined y NaN.",
    returns: "Se convierten a boolean",
    mutates: "No modifica nada",
    example: "Boolean(0) → false\nBoolean('hola') → true",
  },
  {
    name: "Operadores lógicos",
    group: "Fundamentos",
    summary:
      "&& exige que ambas condiciones se cumplan; || acepta que se cumpla al menos una; ! invierte el resultado.",
    returns: "Un valor según la operación",
    mutates: "No modifica nada",
    example: "true && false → false\ntrue || false → true\n!true → false",
  },
  {
    name: "===",
    group: "Fundamentos",
    summary: "Compara valor y tipo sin convertir automáticamente.",
    returns: "Devuelve boolean",
    mutates: "No modifica nada",
    example: "5 === '5' → false\n5 === 5 → true",
  },
  {
    name: "if / else",
    group: "Control",
    summary: "Ejecuta bloques distintos según una condición.",
    returns: "No devuelve por sí mismo",
    mutates: "Depende del bloque",
    example:
      "if (edad >= 18) {\n  console.log('adulto');\n} else {\n  console.log('menor');\n}",
  },
  {
    name: "for",
    group: "Bucles",
    summary: "Repite código controlando normalmente un contador.",
    returns: "No devuelve por sí mismo",
    mutates: "Depende del bloque",
    example: "for (let i=0; i<3; i++) {\n  console.log(i);\n}",
  },
  {
    name: "while",
    group: "Bucles",
    summary: "Repite un bloque mientras la condición sea verdadera.",
    returns: "No devuelve por sí mismo",
    mutates: "Depende del bloque",
    example: "let i=0;\nwhile(i<3){ i++; }",
  },
  {
    name: "for...of",
    group: "Bucles",
    summary: "Recorre directamente los valores de un iterable.",
    returns: "No devuelve por sí mismo",
    mutates: "No necesariamente",
    example: "for (const item of items) {\n  console.log(item);\n}",
  },
  {
    name: "slice()",
    group: "Arrays",
    summary: "Copia una sección de un array desde inicio hasta antes de fin.",
    returns: "Devuelve array nuevo",
    mutates: "No modifica original",
    example: "[10,20,30,40].slice(1,3)\n→ [20,30]",
  },
  {
    name: "splice()",
    group: "Arrays",
    summary: "Elimina, agrega o reemplaza elementos dentro del mismo array.",
    returns: "Devuelve eliminados",
    mutates: "Sí modifica original",
    example: "const a=[1,2,3];\na.splice(1,1);\n→ a = [1,3]",
  },
  {
    name: "push(), pop() e includes()",
    group: "Arrays",
    summary:
      "push agrega al final, pop quita el último elemento e includes comprueba si un valor existe.",
    returns: "Cantidad, elemento o boolean",
    mutates: "push y pop sí modifican",
    example: "const a=[1,2];\na.push(3); // [1,2,3]\na.includes(2); // true",
  },
  {
    name: "sort()",
    group: "Arrays",
    summary:
      "Ordena el array original. Para números necesita un comparador, porque sin él compara los valores como texto.",
    returns: "El mismo array ordenado",
    mutates: "Sí modifica original",
    example: "[10,2,30].sort((a,b)=>a-b)\n→ [2,10,30]",
  },
  {
    name: "map()",
    group: "Metodos",
    summary: "Transforma cada elemento y crea un array nuevo.",
    returns: "Devuelve array nuevo",
    mutates: "No modifica original",
    example: "[1,2,3].map(n=>n*2)\n→ [2,4,6]",
  },
  {
    name: "filter()",
    group: "Metodos",
    summary: "Conserva todos los elementos que cumplen una condición.",
    returns: "Devuelve array nuevo",
    mutates: "No modifica original",
    example: "[1,2,3,4].filter(n=>n>2)\n→ [3,4]",
  },
  {
    name: "find()",
    group: "Metodos",
    summary: "Devuelve la primera coincidencia; si no existe, undefined.",
    returns: "Elemento o undefined",
    mutates: "No modifica original",
    example: "[3,7,12].find(n=>n>10)\n→ 12",
  },
  {
    name: "reduce()",
    group: "Metodos",
    summary: "Combina los elementos en un único valor usando un acumulador.",
    returns: "Valor acumulado",
    mutates: "No modifica original",
    example: "[1,2,3].reduce((a,n)=>a+n,0)\n→ 6",
  },
  {
    name: "Object.keys()",
    group: "Objetos",
    summary: "Devuelve las claves enumerables propias de un objeto.",
    returns: "Array de claves",
    mutates: "No modifica objeto",
    example: "Object.keys({name:'Ana',age:20})\n→ ['name','age']",
  },
  {
    name: "Propiedades de objetos",
    group: "Objetos",
    summary:
      "Puedes leer una propiedad con punto o corchetes. Los corchetes sirven cuando el nombre está guardado en una variable.",
    returns: "El valor de la propiedad",
    mutates: "Asignar sí modifica",
    example:
      "const user={name:'Ana'};\nuser.name → 'Ana'\nuser['name'] → 'Ana'",
  },
  {
    name: "Scope",
    group: "Funciones",
    summary:
      "Una variable creada dentro de una función o bloque solo existe allí. El código de fuera no puede verla.",
    returns: "No aplica",
    mutates: "Depende del código",
    example:
      "function demo(){\n  const secreto=42;\n}\n// secreto no existe aquí",
  },
  {
    name: "Funciones",
    group: "Funciones",
    summary:
      "Una función agrupa instrucciones. Recibe datos mediante parámetros y entrega un resultado con return.",
    returns: "Lo indicado por return",
    mutates: "Depende del código",
    example: "function suma(a,b){\n  return a+b;\n}\nsuma(2,3) → 5",
  },
  {
    name: "Set",
    group: "Colecciones",
    summary: "Guarda valores únicos. Es útil para eliminar duplicados.",
    returns: "Estructura Set",
    mutates: "add/delete modifican Set",
    example: "[...new Set([1,1,2,3])]\n→ [1,2,3]",
  },
  {
    name: "Map",
    group: "Colecciones",
    summary: "Guarda pares clave/valor con claves de cualquier tipo.",
    returns: "Estructura Map",
    mutates: "set/delete modifican Map",
    example: "const m=new Map();\nm.set('name','Ana');\nm.get('name');",
  },
  {
    name: "async / await",
    group: "Async",
    summary: "Permite trabajar con Promises usando una sintaxis secuencial.",
    returns: "async devuelve Promise",
    mutates: "No por sí mismo",
    example:
      "async function load(){\n  const data=await fetchData();\n  return data;\n}",
  },
  {
    name: "Promise",
    group: "Async",
    summary:
      "Representa un resultado que llegará después: puede resolverse correctamente o rechazarse con un error.",
    returns: "Valor futuro",
    mutates: "No por sí misma",
    example:
      "fetch('/api')\n  .then(r=>r.json())\n  .catch(error=>console.error(error));",
  },
  {
    name: "try / catch",
    group: "Errores",
    summary:
      "try ejecuta código que podría fallar; catch recibe el error para que la aplicación pueda responder sin detenerse.",
    returns: "Depende del bloque",
    mutates: "Depende del código",
    example:
      "try {\n  JSON.parse('mal');\n} catch (error) {\n  console.log('Dato inválido');\n}",
  },
  {
    name: "DOM y eventos",
    group: "DOM",
    summary:
      "El DOM representa el HTML. querySelector busca un elemento y addEventListener responde a acciones como un clic.",
    returns: "Elemento o null",
    mutates: "Puede cambiar la página",
    example:
      "const boton=document.querySelector('#guardar');\nboton.addEventListener('click',()=>{\n  console.log('clic');\n});",
  },
  {
    name: "switch",
    group: "Control",
    summary:
      "Compara un valor contra varios casos. break evita que la ejecución continúe al siguiente caso.",
    returns: "No devuelve por sí mismo",
    mutates: "Depende del bloque",
    example:
      "switch(rol){\n  case 'admin': acceso=true; break;\n  default: acceso=false;\n}",
  },
  {
    name: "break y continue",
    group: "Bucles",
    summary:
      "break termina el bucle; continue salta únicamente la iteración actual.",
    returns: "Controlan el recorrido",
    mutates: "No por sí mismos",
    example:
      "for(const n of nums){\n  if(n<0) continue;\n  if(n===10) break;\n}",
  },
  {
    name: "forEach(), some() y every()",
    group: "Metodos",
    summary:
      "forEach ejecuta una acción por elemento; some comprueba si alguno cumple y every si todos cumplen.",
    returns: "undefined o boolean",
    mutates: "No modifican por sí mismos",
    example: "[1,2,3].some(n=>n>2) // true\n[1,2,3].every(n=>n>0) // true",
  },
  {
    name: "Métodos de string",
    group: "Fundamentos",
    summary:
      "trim limpia espacios externos; split divide texto y join vuelve a unir un array como texto.",
    returns: "String o array nuevo",
    mutates: "No modifica el string original",
    example:
      "' hola '.trim() // 'hola'\n'hola'.split('').reverse().join('') // 'aloh'",
  },
  {
    name: "Spread y rest",
    group: "Funciones",
    summary:
      "... expande valores cuando se usa como spread y agrupa argumentos cuando se usa como rest.",
    returns: "Depende de la expresión",
    mutates: "Permite crear copias superficiales",
    example:
      "const copia=[...original];\nfunction suma(...nums){ return nums.reduce((a,n)=>a+n,0); }",
  },
  {
    name: "Valor y referencia",
    group: "Objetos",
    summary:
      "Los primitivos se copian por valor; objetos y arrays comparten la misma referencia salvo que hagas una copia.",
    returns: "Depende de la operación",
    mutates: "Una referencia compartida sí puede cambiar el original",
    example:
      "const a={puntos:1};\nconst b=a; b.puntos=2;\n// a.puntos también vale 2",
  },
  {
    name: "Recursión y caso base",
    group: "Algoritmos",
    summary:
      "Una función recursiva se llama a sí misma y necesita un caso base que detenga las llamadas.",
    returns: "El resultado acumulado",
    mutates: "Depende de la función",
    example:
      "function factorial(n){\n  if(n<=1) return 1;\n  return n*factorial(n-1);\n}",
  },
  {
    name: "Búsqueda binaria",
    group: "Algoritmos",
    summary:
      "Busca en un array ordenado descartando la mitad restante en cada paso.",
    returns: "Índice o -1",
    mutates: "No modifica el array",
    example:
      "while(inicio<=fin){\n  const medio=Math.floor((inicio+fin)/2);\n  // descarta una mitad\n}",
  },
  {
    name: "Complejidad Big O",
    group: "Algoritmos",
    summary:
      "Big O describe cómo crece el trabajo: O(1) es constante, O(n) es lineal y O(n²) suele aparecer con dos recorridos anidados.",
    returns: "Concepto Big O",
    mutates: "No aplica",
    example: "items[0] // O(1)\nitems.find(x=>x===target) // O(n)",
  },
];
