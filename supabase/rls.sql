-- ============================================================
--  RLS (Row Level Security) — portfolio Supabase
--  Cara pakai: Supabase Dashboard -> SQL Editor -> tempel -> Run.
--  Aman dijalankan ulang (idempotent).
-- ============================================================

-- ------------------------------------------------------------
-- 1. login_logs — audit log tiap login.
--    Aturan:
--      * Hanya user yang SUDAH login (authenticated) boleh INSERT.
--      * User cuma boleh mencatat email DIRINYA SENDIRI
--        (tidak bisa palsukan email orang lain).
--      * Tidak ada policy SELECT/UPDATE/DELETE -> otomatis DITOLAK
--        untuk semua client. Pemilik baca lewat Dashboard
--        (service_role bypass RLS).
-- ------------------------------------------------------------

alter table public.login_logs enable row level security;

-- buang policy lama biar bisa dijalankan ulang tanpa error
drop policy if exists "login_logs insert own" on public.login_logs;

create policy "login_logs insert own"
  on public.login_logs
  for insert
  to authenticated
  with check ( lower(email) = lower(auth.jwt() ->> 'email') );

-- (sengaja TIDAK ada policy select/update/delete -> default deny)


-- ------------------------------------------------------------
-- 2. allowed_emails — sudah tidak dipakai (allowlist dibuang).
--    Hapus tabelnya biar tidak jadi permukaan serang.
-- ------------------------------------------------------------

drop table if exists public.allowed_emails;


-- ============================================================
--  VERIFIKASI (jalankan setelah di atas, cek hasilnya)
-- ============================================================

-- RLS aktif? relrowsecurity harus 't'
-- select relname, relrowsecurity from pg_class where relname = 'login_logs';

-- Daftar policy di login_logs (harus cuma "login_logs insert own", cmd=INSERT)
-- select policyname, cmd, roles from pg_policies where tablename = 'login_logs';

-- allowed_emails harus sudah hilang (query ini harus error / 0 baris)
-- select * from public.allowed_emails limit 1;
