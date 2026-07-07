(() => {
  "use strict";

  const SESSION_KEY = "kumar-admin-password";
  const passwordInput = document.getElementById("adminPassword");

  const savedPassword = sessionStorage.getItem(SESSION_KEY);
  if (savedPassword) passwordInput.value = savedPassword;
  passwordInput.addEventListener("input", () => {
    sessionStorage.setItem(SESSION_KEY, passwordInput.value);
  });
  function getPassword() {
    return passwordInput.value || "";
  }

  /* ---------------- add project form ---------------- */
  const form = document.getElementById("projectForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("admin-status-error", !!isError);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const title = document.getElementById("fTitle").value.trim();
    const imagesInput = document.getElementById("fImages");

    if (!title) { setStatus("Title is required.", true); return; }
    if (!imagesInput.files.length) { setStatus("Add at least one image.", true); return; }
    if (!getPassword()) { setStatus("Enter the admin password above.", true); return; }

    const fd = new FormData();
    fd.append("password", getPassword());
    fd.append("title", title);
    fd.append("tagLabel", document.getElementById("fTagLabel").value.trim());
    fd.append("description", document.getElementById("fDescription").value.trim());
    fd.append("featured", document.getElementById("fFeatured").checked ? "1" : "0");
    Array.from(imagesInput.files).forEach(file => fd.append("images[]", file));

    submitBtn.disabled = true;
    submitBtn.textContent = "Adding…";
    setStatus("", false);

    try {
      const res = await fetch("api/save-project.php", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.message || "Something went wrong.", true);
      } else {
        setStatus("Project added ✓", false);
        form.reset();
        loadManageList();
      }
    } catch (err) {
      setStatus("Network error — is the server running?", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Add Project";
    }
  });

  /* ---------------- manage / delete list ---------------- */
  const manageList = document.getElementById("manageList");

  function setManageMessage(message) {
    manageList.innerHTML = "";
    const p = document.createElement("p");
    p.className = "projects-status";
    p.textContent = message;
    manageList.appendChild(p);
  }

  function buildRow(project) {
    const row = document.createElement("div");
    row.className = "manage-row";

    const thumb = document.createElement("img");
    thumb.className = "manage-thumb";
    thumb.src = (project.images && project.images[0]) || "";
    thumb.alt = "";
    row.appendChild(thumb);

    const info = document.createElement("div");
    info.className = "manage-info";
    const titleEl = document.createElement("strong");
    titleEl.textContent = project.title || project.id;
    const meta = document.createElement("span");
    const count = (project.images || []).length;
    meta.textContent = count + " image" + (count === 1 ? "" : "s") + (project.featured ? " · featured" : "");
    info.appendChild(titleEl);
    info.appendChild(meta);
    row.appendChild(info);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-ghost manage-delete";
    del.textContent = "Delete";
    del.addEventListener("click", async () => {
      if (!getPassword()) { alert("Enter the admin password above first."); return; }
      if (!confirm('Delete "' + project.title + '"? This can\'t be undone.')) return;

      del.disabled = true;
      del.textContent = "Deleting…";
      try {
        const fd = new FormData();
        fd.append("password", getPassword());
        fd.append("id", project.id);
        const res = await fetch("api/delete-project.php", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          alert(data.message || "Could not delete project.");
          del.disabled = false;
          del.textContent = "Delete";
          return;
        }
        loadManageList();
      } catch (err) {
        alert("Network error — is the server running?");
        del.disabled = false;
        del.textContent = "Delete";
      }
    });
    row.appendChild(del);

    return row;
  }

  async function loadManageList() {
    setManageMessage("Loading…");
    try {
      const res = await fetch("data/projects.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load projects.json");
      const projects = await res.json();

      if (!Array.isArray(projects) || !projects.length) {
        setManageMessage("No projects yet.");
        return;
      }
      manageList.innerHTML = "";
      projects.forEach(project => manageList.appendChild(buildRow(project)));
    } catch (err) {
      setManageMessage("Couldn't load project list.");
    }
  }

  loadManageList();
})();
