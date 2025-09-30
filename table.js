const tabelModalTetap = $("#tabel-modal-tetap");
const tabelModalKerja = $("#tabel-modal-kerja");
const tabelGaji = $("#tabel-gaji");

let tabel = {
  barangModalTetap: [],
  barangModalKerja: [],
  barangGaji: [],
  laba: 0,
  jumlahProduk: 0,
  biayaPenyusutan: function () {
    return this.totalTetap() * ($("#persentase-penyusutan").value / 100);
  },
  totalTetap: function () {
    let container = 0;
    this.barangModalTetap.forEach(item => {
      container += item.total();
    });
    return container;
  },
  totalKerja: function () {
    let container = 0;
    this.barangModalKerja.forEach(item => {
      container += item.total();
    });
    return container;
  },
  totalGaji: function () {
    let container = 0;
    this.barangGaji.forEach(item => {
      container += item.total();
    });
    return container;
  },
  biayaPenyusutanTahunan: function () {
    return Math.ceil(this.biayaPenyusutan() / 12)
  },
  biayaPenyusutanBulanan: function () {
    return Math.ceil(this.biayaPenyusutan() / 365)
  },
  totalFC: function () {
    return (Math.ceil(tabel.biayaPenyusutanTahunan() / 100) * 100) + this.totalGaji();
  },
  biayaKeseluruhan: function () {
    return (Math.ceil(this.totalFC() / 100) * 100) + this.totalKerja();
  },
  hargaJualPokok: function () {
    return (this.biayaKeseluruhan()/Number(this.jumlahProduk)) + (this.biayaKeseluruhan()/Number(this.jumlahProduk)*(Number(this.laba) / 100));
  },
  labaBruto: function () {
    return (Math.ceil(tabel.hargaJualPokok()/ 100) * 100) * this.jumlahProduk;
  },
  labaNetto: function () {
    return this.labaBruto() - this.biayaKeseluruhan();
  }
}

const tambahBarang = function (index, target, data, type) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<tr>
      <td class="text-center">${index + 1}</td>
      <td colspan="4"><input placeholder="Nama" id="nama-${type}" value="${data[index].namaBarang}"
          class="border-b-2 border-transparent w-full btn bg-transparent hover:border-gray-300 pl-2 focus:border-gray-500" type="text"></td>
      <td colspan="3"><input placeholder="Harga" id="harga-${type}" value="${data[index].hargaBarang}"
          class="border-b-2 border-transparent w-full btn text-center bg-transparent hover:border-gray-300 focus:border-gray-500" type="number"></td>
      <td colspan="3"><input placeholder="Jumlah " id="frekuensi-${type}" value="${data[index].frekuensi ? data[index].frekuensi : 1 }"
          class="border-b-2 border-transparent w-full btn text-center bg-transparent hover:border-gray-300 focus:border-gray-500" type="number"></td>
      <td colspan="3" id="total-baris-${type}">Rp ${data[index].total()},00</td>
      <td class="flex">
        <button id="hapus-${type}" class="mx-auto inline-block btn hover:text-red-600">
          <i class="flaticon-garbage"></i>
        </button>
      </td>
    </tr>`
  target.appendChild(tr);
}

const renderModal = function(target, data){
  target.innerHTML = "";
  let type = ""
  if (data == tabel.barangModalTetap) { type = "tetap" }
  if (data == tabel.barangModalKerja) { type = "kerja" }
  if (data == tabel.barangGaji) { type = "gaji" }
  data.forEach((barang, index) => {
    tambahBarang(index, target, data, type);
  });
  if (target == tabelModalTetap) {
    updateAttacher("tetap", tabel.barangModalTetap, target);
  } 
  if (target == tabelModalKerja) {
    updateAttacher("kerja", tabel.barangModalKerja, target);
  } 
  if (target == tabelGaji) {
    updateAttacher("gaji", tabel.barangGaji, target);
  }
}

const pushBarang = function(data) {
  data.push({
    namaBarang: '',
    hargaBarang: '',
    frekuensi: '',
    total: function () {
      return Number(this.hargaBarang) * Number(this.frekuensi);
    }
  })
  if (data == tabel.barangModalTetap) { renderModal(tabelModalTetap, data); }
  if (data == tabel.barangModalKerja) { renderModal(tabelModalKerja, data) }
  if (data == tabel.barangGaji) { renderModal(tabelGaji, data) }
}

$("#tambah-barang-tetap").addEventListener('click', () => {
  pushBarang(tabel.barangModalTetap);
  $$("#nama-tetap")[ $$("#nama-tetap").length - 1].focus();
});
$("#tambah-barang-kerja").addEventListener('click', () => {
  pushBarang(tabel.barangModalKerja);
  $$("#nama-kerja")[ $$("#nama-kerja").length - 1].focus();
});
$("#tambah-gaji").addEventListener('click', () => {
  pushBarang(tabel.barangGaji);
  $$("#nama-gaji")[$$("#nama-gaji").length - 1].focus();
});

const updateBaris = function (index, data, target) {
  data[index].namaBarang = $$(`#nama-${target}`)[index].value;
  data[index].hargaBarang = $$(`#harga-${target}`)[index].value;
  data[index].frekuensi = $$(`#frekuensi-${target}`)[index].value;
  $$(`#total-baris-${target}`)[index].innerHTML = `Rp ${data[index].total()},00`;
  $(`#total-${target}`).innerHTML = `Total Biaya: Rp ${data == tabel.barangModalTetap ? tabel.totalTetap() : (data == tabel.barangGaji ? tabel.totalGaji() : tabel.totalKerja())},00`;
  updatePenyusutan();
  uptdateCost();
  updateKeseluruhan();
  updatePerencanaan();
  updateLaba();
}

const updateAttacher = function (target, data, table) {
  $$(`#nama-${target}`).forEach((item, index) => {
    item.addEventListener('input', () => updateBaris(index, data, target));
    $$(`#harga-${target}`)[index].addEventListener('input', () => updateBaris(index, data, target));
    $$(`#frekuensi-${target}`)[index].addEventListener('input', () => updateBaris(index, data, target));

    item.addEventListener('keyup', (e) => addByEnter(e, data, target));
    $$(`#harga-${target}`)[index].addEventListener('keyup', (e) => addByEnter(e, data, target));
    $$(`#frekuensi-${target}`)[index].addEventListener('keyup', (e) => addByEnter(e, data, target));
    
    $$(`#hapus-${target}`)[index].addEventListener('click', () => {
      hapusBaris(index, data);
      renderModal(table, data);
      $(`#total-${target}`).innerHTML = `Total Biaya: Rp ${tabel.totalTetap()},00`;
    })
  })
}

const updatePenyusutan = function () {
  $("#modal-penyusutan").innerHTML = tabel.totalTetap();
  $("#penyusutan").innerHTML = tabel.biayaPenyusutan();
  $("#penyusutan-bulan").innerHTML = Math.ceil(tabel.biayaPenyusutanBulanan() / 100) * 100;
}

const uptdateCost = function () {
  $("#penyusutan-tahun").innerHTML = Math.ceil(tabel.biayaPenyusutanTahunan() / 100) * 100;
  $("#total-gaji-keseluruhan").innerHTML = tabel.totalGaji();
  $("#total-fc").innerHTML = tabel.totalFC();
}

const updateKeseluruhan = function () {
  $("#jumlah-fc").innerHTML = tabel.totalFC();
  $("#kerja-keseluruhan").innerHTML = tabel.totalKerja();
  $("#biaya-keseluruhan").innerHTML = tabel.biayaKeseluruhan();
}

const updatePerencanaan = function () {
  $("#harga-produk").value = `Rp ${tabel.biayaKeseluruhan()},00`;
  tabel.laba = $("#laba").value;
  tabel.jumlahProduk = $("#jumlah-produk").value;
  $("#harga-jual-pokok").value = `Rp ${tabel.hargaJualPokok()},00`;
  $("#pembulatan-harga").value = `Rp ${Math.ceil(tabel.hargaJualPokok()/ 100) * 100},00`;
}

const updateLaba = function () {
  $("#laba-bruto").innerHTML = tabel.labaBruto();
  $("#bruto-pokok").innerHTML = Math.ceil(tabel.hargaJualPokok()/ 100) * 100;
  $("#jumlah-produk-bruto").innerHTML = tabel.jumlahProduk;
  $("#laba-netto").innerHTML = tabel.labaNetto();
  $("#bruto-netto").innerHTML = tabel.labaBruto();
  $("#netto-seluruh").innerHTML = tabel.biayaKeseluruhan();
}

$("#jumlah-produk").addEventListener('input', () => {
  updatePerencanaan();
  updateLaba();
});
$("#laba").addEventListener('input', () => {
  updatePerencanaan();
  updateLaba();
});

const hapusBaris = function (index, data) {
  data.splice(index, 1);
}

const addByEnter = function (event, data, target) {
  if (event.key === 'Enter') {
    pushBarang(data);
    $$(`#nama-${target}`)[$$(`#nama-${target}`).length - 1].focus();
  }
}

const projectChart = function () {
  data.fixedCost = Math.ceil(tabel.totalFC() / 100) * 100;
  data.variableCost = tabel.totalKerja() / tabel.jumlahProduk;
  data.price = Math.ceil(tabel.hargaJualPokok()/ 100) * 100;
  data.productionCapacity = tabel.jumlahProduk;
  $("#fixed-cost").value = Math.ceil(tabel.totalFC() / 100) * 100;
  $("#variable-cost").value = tabel.totalKerja() / tabel.jumlahProduk;
  $("#product-price").value = Math.ceil(tabel.hargaJualPokok()/ 100) * 100;
  $("#production-capacity").value = tabel.jumlahProduk;
  bepUpdate();
}

$("#project").addEventListener('click', () => {
  projectChart();
  deadactivateTabs();
  activateTab(0);
})

