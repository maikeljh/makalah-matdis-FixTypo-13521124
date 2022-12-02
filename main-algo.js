// Fungsi untuk membaca file txt kamus bahasa Indonesia
const syncReadFile = async () => {
  const contents = await fetch("indonesian-words.txt")
    .then((response) => response.text())
    .then((text) => {
      return text;
    });

  const arr = contents.split(/\r?\n/);

  let temp = [];
  for (let item of arr) {
    let found = false;
    for (let char of item) {
      if (char === "-") {
        found = true;
      }
    }
    if (found) {
      continue;
    } else {
      temp.push(item);
    }
  }

  return temp;
};

// Menyimpan kata-kata bahasa Indonesia dalam array
let words = await syncReadFile("./indonesian-words.txt");

// Object untuk inisiasi distance tiap kata
let dictionary = {};
words.forEach((item) => (dictionary[item] = 0));

// Graph temporary untuk layout keyboard QWERTY
let graph_temporary_qwerty = {
  Q: [
    ["Q", "W", 1],
    ["Q", "S", 1],
    ["Q", "A", 1],
  ],
  W: [
    ["W", "Q", 1],
    ["W", "A", 1],
    ["W", "S", 1],
    ["W", "E", 1],
    ["W", "D", 1],
  ],
  E: [
    ["E", "W", 1],
    ["E", "R", 1],
    ["E", "F", 1],
    ["E", "D", 1],
    ["E", "S", 1],
  ],
  R: [
    ["R", "E", 1],
    ["R", "T", 1],
    ["R", "G", 1],
    ["R", "F", 1],
    ["R", "D", 1],
  ],
  T: [
    ["T", "R", 1],
    ["T", "Y", 1],
    ["T", "H", 1],
    ["T", "G", 1],
    ["T", "F", 1],
  ],
  Y: [
    ["Y", "T", 1],
    ["Y", "U", 1],
    ["Y", "J", 1],
    ["Y", "H", 1],
    ["Y", "G", 1],
  ],
  U: [
    ["U", "Y", 1],
    ["U", "I", 1],
    ["U", "K", 1],
    ["U", "J", 1],
    ["U", "H", 1],
  ],
  I: [
    ["I", "U", 1],
    ["I", "O", 1],
    ["I", "L", 1],
    ["I", "K", 1],
    ["I", "J", 1],
  ],
  O: [
    ["O", "I", 1],
    ["O", "P", 1],
    ["O", "L", 1],
    ["O", "K", 1],
  ],
  P: [
    ["P", "O", 1],
    ["P", "L", 1],
  ],
  A: [
    ["A", "S", 1],
    ["A", "X", 1],
    ["A", "Z", 1],
    ["A", "Q", 1],
    ["A", "W", 1],
  ],
  S: [
    ["S", "D", 1],
    ["S", "C", 1],
    ["S", "X", 1],
    ["S", "Z", 1],
    ["S", "A", 1],
    ["S", "Q", 1],
    ["S", "W", 1],
    ["S", "e", 1],
  ],
  D: [
    ["D", "F", 1],
    ["D", "V", 1],
    ["D", "C", 1],
    ["D", "X", 1],
    ["D", "R", 1],
    ["D", "E", 1],
    ["D", "W", 1],
    ["D", "S", 1],
  ],
  F: [
    ["F", "G", 1],
    ["F", "B", 1],
    ["F", "V", 1],
    ["F", "C", 1],
    ["F", "T", 1],
    ["F", "R", 1],
    ["F", "E", 1],
    ["F", "D", 1],
  ],
  G: [
    ["G", "H", 1],
    ["G", "N", 1],
    ["G", "B", 1],
    ["G", "V", 1],
    ["G", "Y", 1],
    ["G", "T", 1],
    ["G", "R", 1],
    ["G", "F", 1],
  ],
  H: [
    ["H", "J", 1],
    ["H", "M", 1],
    ["H", "N", 1],
    ["H", "B", 1],
    ["H", "U", 1],
    ["H", "Y", 1],
    ["H", "T", 1],
    ["H", "G", 1],
  ],
  J: [
    ["J", "K", 1],
    ["J", "M", 1],
    ["J", "N", 1],
    ["J", "I", 1],
    ["J", "U", 1],
    ["J", "Y", 1],
    ["J", "H", 1],
  ],
  K: [
    ["K", "L", 1],
    ["K", "M", 1],
    ["K", "O", 1],
    ["K", "I", 1],
    ["K", "U", 1],
    ["K", "J", 1],
  ],
  L: [
    ["L", "O", 1],
    ["L", "I", 1],
    ["L", "K", 1],
  ],
  Z: [
    ["Z", "X", 1],
    ["Z", "A", 1],
    ["Z", "S", 1],
  ],
  X: [
    ["X", "C", 1],
    ["X", "D", 1],
    ["X", "S", 1],
    ["X", "A", 1],
    ["X", "Z", 1],
  ],
  C: [
    ["C", "V", 1],
    ["C", "F", 1],
    ["C", "D", 1],
    ["C", "S", 1],
    ["C", "X", 1],
  ],
  V: [
    ["V", "B", 1],
    ["V", "G", 1],
    ["V", "F", 1],
    ["V", "D", 1],
    ["V", "C", 1],
  ],
  B: [
    ["B", "N", 1],
    ["B", "H", 1],
    ["B", "G", 1],
    ["B", "F", 1],
    ["B", "V", 1],
  ],
  N: [
    ["N", "M", 1],
    ["N", "J", 1],
    ["N", "H", 1],
    ["N", "G", 1],
    ["N", "B", 1],
  ],
  M: [
    ["M", "K", 1],
    ["M", "J", 1],
    ["M", "N", 1],
  ],
};

// Membuat graph dari layout keyboard QWERTY
const graph = {};
Object.keys(graph_temporary_qwerty).forEach((item) => (graph[item] = {}));

for (let item of Object.keys(graph_temporary_qwerty)) {
  for (let edge of graph_temporary_qwerty[item]) {
    graph[edge[0]][edge[1]] = edge[2];
  }
}

// Mencari node dengan bobot terendah yang belum diproses
const minimumCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

const djikstra = (graph, A, B) => {
  let temp_graph = { ...graph };
  delete temp_graph[B];
  temp_graph[B] = {};

  // Inisiasi Object Cost Minimum Ke Setiap Node
  const costs = Object.assign({ [`${B}`]: Infinity }, temp_graph[`${A}`]);

  // Inisiasi Track
  const parents = { [`${B}`]: null };
  for (let child in temp_graph[`${A}`]) {
    parents[child] = A;
  }

  // Inisiasi Array Untuk Node Yang Sudah Diproses
  // Sudah diproses artinya kita sudah pernah menghitung bobot untuk menjangkaunya dari starting node
  const processed = [];

  // Menentukan node dengan bobot terendah yang belum diproses
  let node = minimumCostNode(costs, processed);

  // Looping untuk terus mencari node dengan bobot terendah
  while (node) {
    // Menyimpan bobot node sekarang
    let cost = costs[node];

    // Menyimpan node tetangga dari node sekarang
    let children = temp_graph[node];

    // Looping untuk setiap node tetangga dan menghitung bobot baru untuk menjangkau node tetangga tersebut
    for (let child in children) {
      let newCost = cost + children[child];
      if (!costs[child]) {
        costs[child] = newCost;
        parents[child] = node;
      }

      // Jika bobot baru lebih kecil dari bobot semula
      if (newCost < costs[child]) {
        costs[child] = newCost;
        parents[child] = node;
      }
    }

    // Memasukkan node ke list node yang sudah diproses
    processed.push(node);

    // Mencari kembali node dengan bobot terendah yang belum diproses
    node = minimumCostNode(costs, processed);
  }

  // Mengembalikan bobot node tujuan
  return costs[`${B}`];
};

export { dictionary, words, graph, djikstra };
