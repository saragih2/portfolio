// ============================================================
//  Auth guard — gerbang halaman terlindungi (proyek & CV)
//  Wajib login (Google / email+password), tanpa allowlist.
//  Session valid -> boleh masuk. Kalau tidak -> lempar ke login.
//  Catatan: ini gate sisi-klien (UX). Data sensitif tetap wajib
//  dijaga Supabase RLS, bukan redirect ini.
// ============================================================
(async function () {
  // Base path: halaman di /projects/ butuh "../" untuk balik ke root.
  var base = location.pathname.indexOf("/projects/") !== -1 ? "../" : "";

  // OAuth gagal: Supabase redirect balik dengan param error -> login.
  if ((location.hash + location.search).indexOf("error") !== -1) {
    localStorage.removeItem("cf_oauth_pending");
    location.replace(base + "login.html"); return;
  }
  try {
    var _c = supabase.createClient(
      "https://whmgibfyrbhfleasstho.supabase.co",
      "sb_publishable_idWV2GBljc8ieek7uslVKQ_J9HWZcO3"
    );
    var r = await _c.auth.getSession();
    if (!r.data.session) { location.replace(base + "login.html"); return; }
  } catch (e) {
    location.replace(base + "login.html"); return;
  }
  var s = document.getElementById("_ag");
  if (s) s.remove();
})();
