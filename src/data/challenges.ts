import type { Challenge } from "./types";

export const challenges: Challenge[] = [
  {
    id: "remove-duplicates",
    difficulty: "basic",
    title: "Elimina duplicados",
    description:
      "Completa removeDuplicates(nums) para devolver un array con valores únicos manteniendo el orden de primera aparición.",
    functionName: "removeDuplicates",
    template: "function removeDuplicates(nums) {\n  return [];\n}",
    tests: [
      {
        args: [[1, 1, 2, 3, 3]],
        expected: [1, 2, 3],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[4, 4, 4]],
        expected: [4],
      },
      {
        args: [[3, 1, 3, 2, 1]],
        expected: [3, 1, 2],
      },
    ],
  },
  {
    id: "count-occurrences",
    difficulty: "intermediate",
    title: "Cuenta frecuencias",
    description:
      "Completa countOccurrences(items) para devolver un objeto con cuántas veces aparece cada valor.",
    functionName: "countOccurrences",
    template: "function countOccurrences(items) {\n  return {};\n}",
    tests: [
      {
        args: [["a", "b", "a"]],
        expected: {
          a: 2,
          b: 1,
        },
      },
      {
        args: [[]],
        expected: {},
      },
      {
        args: [[1, 1, 2]],
        expected: {
          "1": 2,
          "2": 1,
        },
      },
    ],
  },
  {
    id: "palindrome",
    difficulty: "intermediate",
    title: "Palíndromo",
    description:
      "Completa isPalindrome(text). Ignora espacios y mayúsculas/minúsculas.",
    functionName: "isPalindrome",
    template: "function isPalindrome(text) {\n  return false;\n}",
    tests: [
      {
        args: ["Anita lava la tina"],
        expected: true,
      },
      {
        args: ["JavaScript"],
        expected: false,
      },
      {
        args: ["Reconocer"],
        expected: true,
      },
      {
        args: [""],
        expected: true,
      },
    ],
  },
  {
    id: "two-sum",
    difficulty: "technical",
    title: "Two Sum",
    description:
      "Devuelve los índices de dos números cuya suma sea target. Busca una solución O(n).",
    functionName: "twoSum",
    template: "function twoSum(nums, target) {\n  return [];\n}",
    tests: [
      {
        args: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        args: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        args: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        args: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
      },
    ],
  },
  {
    id: "find-maximum",
    difficulty: "basic",
    title: "Encuentra el mayor",
    description:
      "Completa findMax(nums) para devolver el número mayor. Si el array está vacío, devuelve null.",
    functionName: "findMax",
    template: "function findMax(nums) {\n  return null;\n}",
    tests: [
      { args: [[3, 1, 8, 2]], expected: 8 },
      { args: [[-5, -2, -9]], expected: -2 },
      { args: [[4]], expected: 4 },
      { args: [[]], expected: null },
    ],
  },
  {
    id: "binary-search",
    difficulty: "technical",
    title: "Búsqueda binaria",
    description:
      "Completa binarySearch(nums, target) para devolver su índice en un array ordenado, o -1 si no existe.",
    functionName: "binarySearch",
    template: "function binarySearch(nums, target) {\n  return -1;\n}",
    tests: [
      { args: [[1, 3, 5, 7, 9], 7], expected: 3 },
      { args: [[1, 3, 5, 7, 9], 2], expected: -1 },
      { args: [[], 4], expected: -1 },
      { args: [[-4, -1, 0, 8], -4], expected: 0 },
    ],
  },
];
