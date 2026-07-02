// ============================================================
//  Auth guard — gerbang halaman terlindungi (proyek & CV)
//  Cek session Supabase + allowlist. Kalau gagal -> lempar ke login.
//  Catatan: ini gate sisi-klien (UX). Data sensitif tetap wajib
//  dijaga Supabase RLS, bukan redirect ini.
// ============================================================
(async function () {
  // Base path: halaman di /projects/ butuh "../" untuk balik ke root.
  var base = location.pathname.indexOf("/projects/") !== -1 ? "../" : "";

  // OAuth gagal/ditolak: Supabase redirect balik dengan param error -> login.
  if ((location.hash + location.search).indexOf("error") !== -1) {
    localStorage.removeItem("cf_oauth_pending");
    location.replace(base + "login.html?denied=1"); return;
  }
  try {
    var _c = supabase.createClient(
      "https://whmgibfyrbhfleasstho.supabase.co",
      "sb_publishable_idWV2GBljc8ieek7uslVKQ_J9HWZcO3"
    );
    var r = await _c.auth.getSession();
    if (!r.data.session) { location.replace(base + "login.html"); return; }
    // Allowlist: email harus terdaftar di tabel allowed_emails, kalau tidak -> tendang.
    var _em = (r.data.session.user.email || "").toLowerCase();
    var _al = await _c.from("allowed_emails").select("email").eq("email", _em).maybeSingle();
    if (_al.error || !_al.data) {
      await _c.auth.signOut();
      localStorage.removeItem("cf_oauth_pending");
      location.replace(base + "login.html?denied=1"); return;
    }
  } catch (e) {
    location.replace(base + "login.html"); return;
  }
  var s = document.getElementById("_ag");
  if (s) s.remove();
})();
