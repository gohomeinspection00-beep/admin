# Website Company

Laman web statik untuk syarikat.

## Struktur

```
index.html      — halaman utama (hero, perkhidmatan, tentang kami, projek, hubungi)
css/styles.css  — semua styling; tema dikawal melalui CSS variables di bahagian :root
js/main.js      — menu mobile & interaksi ringkas
assets/img/     — logo dan gambar
```

## Tema

Warna, font, dan radius semuanya dalam `:root` di `css/styles.css` — tukar di satu tempat sahaja untuk apply tema baru (rujukan daripada website lama).

## Cara run

Buka `index.html` terus dalam browser, atau:

```
python3 -m http.server 8000
```
