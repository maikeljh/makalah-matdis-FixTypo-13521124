import { dictionary, words, dijkstra, graph } from "./main-algo.js";

// Mendapatkan element button
var clickMe = document.getElementById("click-me");

// Add event onclick untuk button click-me
clickMe.onclick = function () {
  let newArrayWords = []; // Kumpulan kata yang sudah diperbaiki
  let change = false; // Jika terjadi perubahan

  let input = document.getElementById("input").value; // Mendapatkan input dari value
  let array_of_string = input.split(" "); // Memisahkan tiap kata

  // Looping untuk proses tiap kata
  for (let val of array_of_string) {
    let minim = 10; // Definisi variabel bebas untuk batas distance typo
    let ans; // Kata baru

    let found = false; // Jika terjadi perubahan
    val = val.toLowerCase(); // Mengubah semua huruf menjadi lowercase

    if (words.includes(val)) {
      // Jika kata tersebut terdapat pada kamus bahasa Indonesia dari txt
      ans = "Tidak Ada Yang Typo";
    } else {
      // Menjadikan kata jadi uppercase
      val = val.toUpperCase();

      // Inisiasi distance tiap kata dalam kamus
      for (let string of words) {
        let distance = 0;
        dictionary[string] = distance;
      }

      // Menghitung distance dari setiap kata
      for (let item of Object.keys(dictionary)) {
        let dist = 0;
        let idx = 0;
        item = item.toUpperCase(); // Menjadikan kata jadi uppercase
        if (item.length == val.length) {
          // Typo adalah ketika panjang kata sama namun terdapat perbedaan huruf
          for (let char of item) {
            if (char === val[idx]) {
              dist += 0;
            } else {
              dist += dijkstra(graph, char, val[idx]);
            }
            idx++;
          }

          // Jika ditemukan kata yang mirip dan distance lebih kecil
          if (dist < minim && dist != 0) {
            minim = dist;
            ans = item;
            found = true;
          }
        }
      }
    }

    if (found) {
      // Jika ditemukan perubahan
      ans = ans.toLowerCase();
      newArrayWords.push(ans); // Memasukkan kata baru ke list kalimat baru
      change = true;
    } else {
      // Jika tidak ditemukan perubahan
      newArrayWords.push(val); // Memasukkan kata awal ke list kalimat baru
    }
  }

  // Jika terdapat perubahan di antara kata yang ada dalam kalimat
  if (change) {
    let newString = newArrayWords.join(" ");
    document.getElementById("checkQuery").innerHTML =
      "Apakah " + input.toLowerCase() + " typo menjadi " + newString + " ? ";
  } else {
    // Jika tidak ada yang typo
    document.getElementById("checkQuery").innerHTML = "Tidak ada yang typo";
  }
};
