const { test, expect } = require('@playwright/test');

// Semua halaman ini harus bisa dibuka siapa pun, tanpa login.
const halaman = [
  { url: '/',                               judul: /Portofolio/ },
  { url: '/cv.html',                        judul: /CV/ },
  { url: '/projects/todo-react.html',       judul: /To-Do List/ },
  { url: '/projects/smart-home.html',       judul: /Smart Home/ },
  { url: '/projects/smart-saving-box.html', judul: /Smart Saving Box/ },
  { url: '/projects/sewa-kampus.html',      judul: /Sewa Kampus/ },
];

for (const { url, judul } of halaman) {
  test(`${url} dapat diakses tanpa login`, async ({ page }) => {
    await page.goto(url);

    // Tidak boleh dilempar ke halaman login.
    await expect(page).not.toHaveURL(/login/);

    // Halaman yang terbuka memang halaman yang dimaksud.
    await expect(page).toHaveTitle(judul);

    // Menangkap sisa <style id="_ag">body{visibility:hidden}</style>.
    await expect(page.locator('body')).toBeVisible();
  });
}

test('navbar tidak lagi menampilkan tombol Keluar', async ({ page }) => {
  await page.goto('/');

  // Untuk ketiadaan elemen, pakai toHaveCount(0).
  await expect(page.locator('#logout')).toHaveCount(0);

  // Menu lain harus tetap ada — memastikan navbar tidak ikut rusak.
  await expect(page.getByRole('link', { name: 'Kontak' })).toBeVisible();
});

test('tidak ada error di console', async ({ page }) => {
  const errors = [];

  // Penyadap dipasang SEBELUM halaman dibuka.
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(errors).toEqual([]);
});
