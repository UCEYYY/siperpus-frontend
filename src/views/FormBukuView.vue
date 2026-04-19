<!-- src/views/FormBukuView.vue -->
<!--
  Halaman Form Tambah/Edit Buku — Bab 2
  Mendemonstrasikan seluruh variasi v-model dan modifier-nya:
  - v-model           → text input, sinkron tiap keystroke
  - v-model.trim      → hapus spasi awal/akhir otomatis
  - v-model.lazy      → sinkron saat blur, bukan tiap ketik
  - v-model.number    → konversi string ke number otomatis
  - v-model textarea  → textarea sinopsis
  - v-model select    → dropdown kategori + v-for opsi
  - v-model checkbox  → single (boolean) dan multiple (array)
  - v-model radio     → kondisi buku
-->
<template>
  <div class="form-page">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <RouterLink to="/katalog" class="back-link">← Kembali ke Katalog</RouterLink>
      <h1>{{ isEditMode ? 'Edit Buku' : 'Tambah Buku Baru' }}</h1>
      <p>Isi formulir di bawah ini. Kolom bertanda * wajib diisi.</p>
    </div>

    <div class="form-layout">

      <!-- ═══════════════════════════════════════
           FORM UTAMA
      ═══════════════════════════════════════ -->
      <form @submit.prevent="simpanBuku" class="form-buku" novalidate>

        <!-- ── Judul Buku ─────────────────────────── -->
        <div class="field" :class="{ 'field--error': errors.judul }">
          <label for="judul">Judul Buku *</label>
          <!-- v-model biasa: sinkron setiap keystroke -->
          <input
            id="judul"
            v-model="form.judul"
            type="text"
            placeholder="Masukkan judul buku lengkap"
            maxlength="200"
            @blur="validateField('judul')"
          />
          <div class="field-footer">
            <span class="error-msg" v-if="errors.judul">{{ errors.judul }}</span>
            <span v-else></span>
            <span class="counter" :class="{ 'counter--limit': form.judul.length > 180 }">
              {{ form.judul.length }}/200
            </span>
          </div>
        </div>

        <!-- ── Penulis ────────────────────────────── -->
        <div class="field" :class="{ 'field--error': errors.penulis }">
          <label for="penulis">Penulis *</label>
          <!-- v-model.trim: hapus spasi di awal dan akhir otomatis -->
          <input
            id="penulis"
            v-model.trim="form.penulis"
            type="text"
            placeholder="Nama penulis (pisahkan koma jika lebih dari satu)"
            @blur="validateField('penulis')"
          />
          <span class="error-msg" v-if="errors.penulis">{{ errors.penulis }}</span>
        </div>

        <!-- ── Penerbit ───────────────────────────── -->
        <div class="field">
          <label for="penerbit">Penerbit</label>
          <input
            id="penerbit"
            v-model.trim="form.penerbit"
            type="text"
            placeholder="Nama penerbit"
          />
        </div>

        <!-- ── ISBN ──────────────────────────────── -->
        <div class="field" :class="{ 'field--error': errors.isbn }">
          <label for="isbn">ISBN</label>
          <!--
            v-model.lazy: data Vue baru diperbarui saat blur (pindah fokus),
            bukan setiap ketukan. Lebih hemat untuk validasi format yang berat.
          -->
          <input
            id="isbn"
            v-model.lazy="form.isbn"
            type="text"
            placeholder="Contoh: 978-0-13-235088-4"
            @blur="validateField('isbn')"
          />
          <small class="field-hint">v-model.lazy — sinkron saat pindah fokus, bukan setiap ketik.</small>
          <span class="error-msg" v-if="errors.isbn">{{ errors.isbn }}</span>
        </div>

        <!-- ── Tahun + Stok (2 kolom) ─────────────── -->
        <div class="field-row">
          <div class="field" :class="{ 'field--error': errors.tahun }">
            <label for="tahun">Tahun Terbit *</label>
            <!--
              v-model.number: konversi otomatis dari string ke number.
              Input HTML selalu mengembalikan string — modifier ini
              memastikan form.tahun bertipe number, bukan string "2024".
            -->
            <input
              id="tahun"
              v-model.number="form.tahun"
              type="number"
              :min="1800"
              :max="tahunSekarang"
              @blur="validateField('tahun')"
            />
            <small class="field-hint">v-model.number — hasil bertipe number, bukan string.</small>
            <span class="error-msg" v-if="errors.tahun">{{ errors.tahun }}</span>
          </div>

          <div class="field">
            <label for="stok">Jumlah Stok</label>
            <input
              id="stok"
              v-model.number="form.stok"
              type="number"
              min="0"
              max="999"
            />
          </div>
        </div>

        <!-- ── Kategori (SELECT + v-for) ─────────── -->
        <div class="field" :class="{ 'field--error': errors.kategori }">
          <label for="kategori">Kategori *</label>
          <!-- SELECT dengan v-model + v-for untuk generate opsi dinamis -->
          <select
            id="kategori"
            v-model="form.kategori"
            @change="validateField('kategori')"
          >
            <option value="">-- Pilih Kategori --</option>
            <option
              v-for="kat in daftarKategori"
              :key="kat"
              :value="kat"
            >
              {{ kat }}
            </option>
          </select>
          <span class="error-msg" v-if="errors.kategori">{{ errors.kategori }}</span>
        </div>

        <!-- ── Kondisi Buku (RADIO BUTTON) ────────── -->
        <div class="field">
          <label>Kondisi Buku *</label>
          <!--
            Radio button: semua input berbagi v-model="form.kondisi".
            Hanya satu nilai yang aktif. Saat dipilih, form.kondisi = value radio.
          -->
          <div class="radio-group">
            <label
              v-for="k in daftarKondisi"
              :key="k.value"
              class="radio-label"
              :class="{ 'radio-label--active': form.kondisi === k.value }"
            >
              <input type="radio" v-model="form.kondisi" :value="k.value" />
              <span>{{ k.ikon }}</span>
              {{ k.label }}
            </label>
          </div>
        </div>

        <!-- ── Tag/Label (CHECKBOX MULTIPLE → array) -->
        <div class="field">
          <label>Tag / Label</label>
          <!--
            Checkbox multiple: v-model mengikat ke array form.tags.
            Mencentang → value ditambah ke array.
            Melepas centang → value dihapus dari array.
          -->
          <div class="checkbox-group">
            <label
              v-for="tag in daftarTag"
              :key="tag"
              class="chip-label"
              :class="{ 'chip-label--active': form.tags.includes(tag) }"
            >
              <input type="checkbox" v-model="form.tags" :value="tag" />
              {{ tag }}
            </label>
          </div>
          <small class="field-hint">
            Dipilih: {{ form.tags.length > 0 ? form.tags.join(', ') : 'Belum ada' }}
          </small>
        </div>

        <!-- ── Tersedia (CHECKBOX SINGLE → boolean) ─ -->
        <div class="field">
          <!--
            Checkbox single: v-model mengikat ke boolean form.tersedia.
            true = dicentang, false = tidak dicentang.
          -->
          <label class="toggle-wrapper">
            <input type="checkbox" v-model="form.tersedia" class="toggle-input" />
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
            <span class="toggle-text">
              Buku tersedia untuk dipinjam
              <small>{{ form.tersedia ? '✅ Aktif — bisa dipinjam' : '🔒 Nonaktif — tidak bisa dipinjam' }}</small>
            </span>
          </label>
        </div>

        <!-- ── Sinopsis (TEXTAREA + v-model.trim) ─── -->
        <div class="field">
          <label for="sinopsis">Sinopsis</label>
          <!-- v-model.trim pada textarea: hapus spasi di awal/akhir -->
          <textarea
            id="sinopsis"
            v-model.trim="form.sinopsis"
            rows="5"
            placeholder="Tuliskan sinopsis atau deskripsi singkat buku ini..."
            maxlength="2000"
          ></textarea>
          <div class="field-footer">
            <span></span>
            <span class="counter" :class="{ 'counter--limit': form.sinopsis.length > 1800 }">
              {{ form.sinopsis.length }}/2000
            </span>
          </div>
        </div>

        <!-- ── Tombol Aksi ─────────────────────────── -->
        <div class="form-actions">
          <button type="button" class="btn-reset" @click="resetForm">Reset</button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="!isFormValid || isSaving"
          >
            <span v-if="isSaving">⏳ Menyimpan...</span>
            <span v-else>{{ isEditMode ? '💾 Simpan Perubahan' : '➕ Tambah Buku' }}</span>
          </button>
        </div>
      </form>

      <!-- ═══════════════════════════════════════
           PANEL PREVIEW (kanan)
      ═══════════════════════════════════════ -->
      <aside class="preview-panel">
        <h3>Preview Kartu Buku</h3>
        <p class="preview-hint">Berubah reaktif saat Anda mengetik.</p>

        <!-- Kartu preview -->
        <div class="preview-card" v-if="form.judul || form.penulis">
          <div class="preview-cover">📚</div>
          <div class="preview-info">
            <strong>{{ form.judul || '—' }}</strong>
            <span>{{ form.penulis || '—' }}</span>
            <div class="preview-badges">
              <span class="badge badge--blue" v-if="form.kategori">{{ form.kategori }}</span>
              <span class="badge" :class="form.tersedia ? 'badge--green' : 'badge--red'">
                {{ form.tersedia ? 'Tersedia' : 'Tidak Tersedia' }}
              </span>
            </div>
            <span class="preview-meta">
              {{ [form.penerbit, form.tahun].filter(Boolean).join(' · ') }}
            </span>
            <span class="preview-tags" v-if="form.tags.length">
              🏷️ {{ form.tags.join(', ') }}
            </span>
          </div>
        </div>
        <div class="preview-empty" v-else>
          Mulai isi form untuk melihat preview
        </div>

        <!-- Status validasi -->
        <div class="validation-box">
          <h4>Status Validasi</h4>
          <div
            v-for="(ok, label) in validationStatus"
            :key="label"
            class="validation-row"
          >
            <span>{{ ok ? '✅' : '○' }}</span>
            <span :style="{ color: ok ? '#059669' : '#94A3B8' }">{{ label }}</span>
          </div>
        </div>

        <!-- Debug: raw reactive state -->
        <details class="debug-box">
          <summary>🔍 Raw State (reactive)</summary>
          <pre>{{ JSON.stringify(form, null, 2) }}</pre>
        </details>
      </aside>
    </div>

    <!-- TOAST NOTIFIKASI -->
    <div v-if="toast" class="toast" :class="'toast--' + toast.type">
      <span>{{ toast.msg }}</span>
      <button @click="toast = null">✕</button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'

// ── Constants ──────────────────────────────────────────────────
const tahunSekarang = new Date().getFullYear()

const daftarKategori = [
  'Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi',
  'Sejarah', 'Bisnis', 'Seni', 'Agama', 'Filsafat', 'Psikologi'
]
const daftarKondisi = [
  { value: 'baru',  label: 'Baru',  ikon: '🌟' },
  { value: 'baik',  label: 'Baik',  ikon: '👍' },
  { value: 'rusak', label: 'Rusak', ikon: '⚠️' },
]
const daftarTag = ['Rekomendasi', 'Buku Baru', 'Populer', 'Langka', 'Referensi', 'Terbatas']

// ── State ──────────────────────────────────────────────────────
// reactive() untuk objek form — semua properti form dalam satu tempat
const form = reactive({
  judul:    '',
  penulis:  '',
  penerbit: '',
  isbn:     '',
  tahun:    tahunSekarang,   // v-model.number → tetap number
  stok:     1,
  kategori: '',
  kondisi:  'baru',
  tags:     [],              // checkbox multiple → array
  tersedia: true,            // checkbox single → boolean
  sinopsis: '',
})

// Error messages per field
const errors = reactive({
  judul: '', penulis: '', isbn: '', tahun: '', kategori: ''
})

const isEditMode = ref(false)
const isSaving   = ref(false)
const toast      = ref(null)
let   toastTimer = null

// ── Computed ───────────────────────────────────────────────────
const isFormValid = computed(() =>
  form.judul.trim().length >= 3 &&
  form.penulis.trim().length >= 3 &&
  form.kategori !== '' &&
  !errors.judul && !errors.penulis && !errors.isbn && !errors.tahun
)

const validationStatus = computed(() => ({
  'Judul (min. 3 karakter)':   form.judul.trim().length >= 3,
  'Penulis (min. 3 karakter)': form.penulis.trim().length >= 3,
  'Kategori dipilih':          form.kategori !== '',
  'Tahun valid':               form.tahun >= 1800 && form.tahun <= tahunSekarang,
}))

// ── Watch ──────────────────────────────────────────────────────
// Saat stok diubah ke 0, nonaktifkan buku secara otomatis
watch(() => form.stok, (baru) => {
  if (baru === 0 && form.tersedia) {
    form.tersedia = false
    showToast('warning', '⚠️ Stok 0 — buku dinonaktifkan otomatis.')
  } else if (baru > 0 && !form.tersedia) {
    form.tersedia = true
  }
})

// v-model.lazy pada ISBN → watch berjalan setelah blur
watch(() => form.isbn, (baru) => {
  if (baru) validateField('isbn')
})

// ── Validation ─────────────────────────────────────────────────
function validateField(field) {
  switch (field) {
    case 'judul':
      errors.judul = form.judul.trim().length < 3 ? 'Judul minimal 3 karakter.' : ''
      break
    case 'penulis':
      errors.penulis = form.penulis.trim().length < 3 ? 'Nama penulis minimal 3 karakter.' : ''
      break
    case 'isbn': {
      if (!form.isbn) { errors.isbn = ''; break }
      const clean = form.isbn.replace(/[-\s]/g, '')
      errors.isbn = (clean.length !== 10 && clean.length !== 13)
        ? 'ISBN harus 10 atau 13 digit (tanda hubung diabaikan).'
        : ''
      break
    }
    case 'tahun':
      errors.tahun = (form.tahun < 1800 || form.tahun > tahunSekarang)
        ? `Tahun harus antara 1800 dan ${tahunSekarang}.`
        : ''
      break
    case 'kategori':
      errors.kategori = form.kategori === '' ? 'Pilih kategori buku.' : ''
      break
  }
}

function validateAll() {
  ['judul', 'penulis', 'isbn', 'tahun', 'kategori'].forEach(validateField)
  return !Object.values(errors).some(Boolean)
}

// ── Methods ────────────────────────────────────────────────────
async function simpanBuku() {
  if (!validateAll()) {
    showToast('error', '❌ Periksa kembali isian form.')
    return
  }
  isSaving.value = true
  try {
    // Simulasi API call — Bab 5 akan diganti dengan axios.post('/api/buku', form)
    await new Promise(r => setTimeout(r, 800))
    console.log('Data buku:', JSON.parse(JSON.stringify(form)))
    showToast('success', `✅ Buku "${form.judul}" berhasil ditambahkan!`)
    // Bab 4: router.push({ name: 'katalog' })
  } catch {
    showToast('error', '❌ Gagal menyimpan. Coba lagi.')
  } finally {
    isSaving.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    judul: '', penulis: '', penerbit: '', isbn: '',
    tahun: tahunSekarang, stok: 1, kategori: '',
    kondisi: 'baru', tags: [], tersedia: true, sinopsis: ''
  })
  Object.keys(errors).forEach(k => errors[k] = '')
  showToast('info', 'Form telah direset.')
}

function showToast(type, msg) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { type, msg }
  toastTimer = setTimeout(() => { toast.value = null }, 4000)
}
</script>

<style scoped>
.form-page { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }

/* Header */
.page-header { margin-bottom: 32px; }
.back-link { display: inline-block; color: #2563EB; text-decoration: none; font-size: .9rem; margin-bottom: 12px; }
.back-link:hover { text-decoration: underline; }
.page-header h1 { font-size: 2rem; color: #1A3C5E; }
.page-header p  { color: #64748B; margin-top: 6px; }

/* Layout: 2 kolom */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  align-items: start;
}
@media (max-width: 860px) { .form-layout { grid-template-columns: 1fr; } }

/* ── FORM ── */
.form-buku {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-weight: 600; color: #374151; font-size: .9rem; }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Inputs */
.form-buku input[type="text"],
.form-buku input[type="number"],
.form-buku select,
.form-buku textarea {
  padding: 10px 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  background: #FAFAFA;
  color: #1E293B;
  transition: border-color .2s, box-shadow .2s;
}
.form-buku input:focus,
.form-buku select:focus,
.form-buku textarea:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px #BFDBFE;
  background: white;
}
.form-buku textarea { resize: vertical; min-height: 100px; }

/* Error state */
.field--error input,
.field--error select { border-color: #EF4444; }
.field--error input:focus,
.field--error select:focus { box-shadow: 0 0 0 3px #FEE2E2; }

.field-footer { display: flex; justify-content: space-between; align-items: center; }
.field-hint   { color: #94A3B8; font-size: .75rem; }
.error-msg    { color: #DC2626; font-size: .8rem; }
.counter      { font-size: .75rem; color: #94A3B8; }
.counter--limit { color: #EF4444; font-weight: 600; }

/* Radio */
.radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
.radio-label {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; border: 1.5px solid #CBD5E1;
  border-radius: 8px; cursor: pointer; font-size: .9rem;
  background: white; transition: .2s;
  user-select: none;
}
.radio-label input { display: none; }
.radio-label--active { border-color: #2563EB; background: #EFF6FF; color: #1D4ED8; font-weight: 600; }
.radio-label:hover { border-color: #93C5FD; }

/* Chip checkbox */
.checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
.chip-label {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border: 1.5px solid #CBD5E1;
  border-radius: 20px; cursor: pointer; font-size: .85rem;
  background: white; transition: .2s; user-select: none;
}
.chip-label input { display: none; }
.chip-label--active { border-color: #2563EB; background: #EFF6FF; color: #1D4ED8; font-weight: 600; }
.chip-label:hover { border-color: #93C5FD; }

/* Toggle switch */
.toggle-wrapper {
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; user-select: none;
}
.toggle-input { display: none; }
.toggle-track {
  position: relative; width: 44px; height: 24px;
  background: #CBD5E1; border-radius: 12px;
  transition: background .2s; flex-shrink: 0;
}
.toggle-input:checked ~ .toggle-track { background: #2563EB; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: white; border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
  transition: transform .2s;
}
.toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }
.toggle-text { font-weight: 600; color: #374151; font-size: .95rem; }
.toggle-text small { display: block; font-weight: 400; color: #64748B; font-size: .8rem; margin-top: 2px; }

/* Tombol aksi */
.form-actions {
  display: flex; gap: 12px; justify-content: flex-end;
  padding-top: 8px; border-top: 1px solid #F1F5F9;
}
.btn-submit {
  background: #2563EB; color: white; border: none;
  padding: 12px 28px; border-radius: 8px;
  font-size: 1rem; font-weight: 600; cursor: pointer;
  transition: .2s; min-width: 160px;
}
.btn-submit:hover:not(:disabled) { background: #1D4ED8; }
.btn-submit:disabled { opacity: .5; cursor: not-allowed; }
.btn-reset {
  background: transparent; color: #475569;
  border: 1.5px solid #CBD5E1; padding: 12px 24px;
  border-radius: 8px; font-size: 1rem; cursor: pointer; transition: .2s;
}
.btn-reset:hover { background: #F8FAFC; }

/* ── PREVIEW PANEL ── */
.preview-panel {
  position: sticky; top: 80px;
  background: white; border-radius: 16px;
  padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,.07);
  display: flex; flex-direction: column; gap: 16px;
}
.preview-panel h3 { font-size: 1rem; color: #1A3C5E; font-weight: 700; }
.preview-hint { font-size: .8rem; color: #94A3B8; margin-top: -8px; }

.preview-card {
  display: flex; gap: 10px; padding: 12px;
  background: #F8FAFC; border-radius: 10px;
  border: 1px solid #E2E8F0;
}
.preview-cover {
  width: 52px; height: 68px; flex-shrink: 0;
  background: linear-gradient(135deg, #2563EB, #7C3AED);
  border-radius: 6px; display: flex;
  align-items: center; justify-content: center; font-size: 1.4rem;
}
.preview-info { display: flex; flex-direction: column; gap: 4px; }
.preview-info strong { font-size: .9rem; color: #1A3C5E; line-height: 1.3; }
.preview-info span   { font-size: .8rem; color: #64748B; }
.preview-badges { display: flex; flex-wrap: wrap; gap: 4px; }
.badge {
  font-size: .7rem; padding: 2px 8px; border-radius: 10px;
}
.badge--blue  { background: #EFF6FF; color: #1D4ED8; }
.badge--green { background: #F0FDF4; color: #15803D; }
.badge--red   { background: #FEF2F2; color: #DC2626; }
.preview-meta { font-size: .75rem; color: #94A3B8; }
.preview-tags { font-size: .75rem; color: #7C3AED; }

.preview-empty {
  text-align: center; padding: 24px; color: #94A3B8;
  font-size: .85rem; background: #F8FAFC;
  border-radius: 10px; border: 1px dashed #CBD5E1;
}

/* Validasi */
.validation-box { background: #F8FAFC; border-radius: 10px; padding: 14px; }
.validation-box h4 { font-size: .85rem; font-weight: 700; color: #374151; margin-bottom: 8px; }
.validation-row {
  display: flex; align-items: center; gap: 8px;
  font-size: .8rem; padding: 3px 0;
}

/* Debug */
.debug-box { background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; }
.debug-box summary { padding: 8px 12px; cursor: pointer; font-size: .8rem; color: #64748B; font-weight: 600; }
.debug-box pre {
  padding: 12px; font-size: .7rem; color: #334155;
  margin: 0; background: #F1F5F9; border-top: 1px solid #E2E8F0;
  max-height: 220px; overflow-y: auto;
}

/* Toast */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  max-width: 380px; padding: 14px 18px;
  border-radius: 10px; display: flex; gap: 12px;
  align-items: center; justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0,0,0,.15); z-index: 999;
  animation: slideIn .3s ease;
}
.toast button { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: .6; }
.toast--info    { background: #EFF6FF; border-left: 4px solid #2563EB; color: #1E3A5F; }
.toast--success { background: #F0FDF4; border-left: 4px solid #059669; color: #14532D; }
.toast--warning { background: #FFFBEB; border-left: 4px solid #D97706; color: #7C4A00; }
.toast--error   { background: #FEF2F2; border-left: 4px solid #DC2626; color: #7F1D1D; }

@keyframes slideIn {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
</style>