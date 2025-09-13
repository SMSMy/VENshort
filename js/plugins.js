// js/plugins.js

document.addEventListener("DOMContentLoaded", () => {
  if (!window.VenShortData) {
    console.error("Data file (data.js) is not loaded or has an error.");
    document.body.innerHTML =
      "<h1>Error: Failed to load page data. Please ensure data.js is present and correct.</h1>";
    return;
  }
  initPluginsPage();
});

function initPluginsPage() {
  renderThemes(window.VenShortData.THEMES);
  renderPlugins(
    window.VenShortData.PLUGINS_DATA,
    window.VenShortData.CATEGORIES
  );
  renderNavPane(window.VenShortData.CATEGORIES);

  const apiSection = document.querySelector(
    '.category-section[data-category="api"]'
  );
  if (apiSection) apiSection.style.display = "none";

  const allPluginCheckboxes = document.querySelectorAll(".plugin-checkbox");
  const searchInput = document.getElementById("searchInput");

  setupSelectionButtons(allPluginCheckboxes);
  setupConfigGeneration();
  initHelpSystem();
  setupNavPaneScrollSpy();

  searchInput.addEventListener("input", () =>
    filterPlugins(searchInput.value.toLowerCase().trim())
  );

  document
    .querySelectorAll(
      ".plugin-checkbox, .plugin-settings input, .plugin-settings select, .theme-radio"
    )
    .forEach((el) => el.addEventListener("change", updateConfig));

  updateConfig();
}

// ===== RENDERING FUNCTIONS =====

function renderThemes(themesData) {
  const themeGrid = document.getElementById("themeGrid");
  if (!themeGrid) return;
  themeGrid.innerHTML = themesData
    .map(
      (theme) => `
    <div class="theme-card-detailed">
      <div class="theme-header">
        <div class="theme-name">${theme.name}</div>
        <div class="theme-author">by ${theme.author}</div>
      </div>
      <p class="theme-feature">${theme.description}</p>
      <div class="theme-actions">
        <a href="${theme.previewUrl}" target="_blank" class="btn-preview">معاينة</a>
        <label class="theme-select-label">
          <input type="radio" name="theme-selection" class="theme-radio" data-download-url="${theme.downloadUrl}">
          <span>اختر</span>
        </label>
      </div>
    </div>
  `
    )
    .join("");
}

function renderPlugins(pluginsData, categoriesData) {
  const container = document.getElementById("pluginsContainer");
  const groupedPlugins = pluginsData.reduce((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});

  // Define the desired order of categories
  const categoryOrder = [
    "core",
    "appearance",
    "privacy",
    "fun",
    "qualityOfLife",
    "chat",
    "user",
    "integrations",
    "developer",
    "misc",
    "api",
  ];

  container.innerHTML = categoryOrder
    .map((catKey) => {
      if (!groupedPlugins[catKey] || groupedPlugins[catKey].length === 0)
        return "";
      const catInfo = categoriesData[catKey];
      const cardsHTML = groupedPlugins[catKey]
        .map((p) => createPluginCardHTML(p))
        .join("");
      // Add an ID to each section for the nav pane to link to
      return `<div class="category-section" id="category-${catKey}" data-category="${catKey}"><h2 class="category-header">${catInfo.name}</h2><p class="category-description">${catInfo.description}</p>[...]
    })
    .join("");
}

function renderNavPane(categoriesData) {
  const navPane = document.getElementById("navPane");
  if (!navPane) return;

  const renderedCategoryKeys = Array.from(
    document.querySelectorAll(".category-section")
  ).map((el) => el.dataset.category);

  // Filter out categories that are not rendered (like 'api' which is hidden)
  const visibleCategories = Object.entries(categoriesData).filter(
    ([key]) =>
      renderedCategoryKeys.includes(key) && key !== "api" && key !== "core"
  );

  navPane.innerHTML = visibleCategories
    .map(
      ([key, cat]) =>
        `<a href="#category-${key}" class="nav-pane-link" data-nav-for="${key}">${cat.name}</a>`
    )
    .join("");
}

function createPluginCardHTML(plugin) {
  const isRequired = plugin.required;
  const isSuggested = window.VenShortData.SUGGESTED_PLUGINS.includes(plugin.id);
  const settingsHTML =
    plugin.settings?.length > 0
      ? `<div class="plugin-settings">${plugin.settings
          .map((s) => createSettingHTML(s, plugin.id))
          .join("")}</div>`
      : "";

  return `
        <div class="plugin-card ${isRequired ? "required" : ""} ${
    isSuggested ? "suggested" : ""
  }" data-plugin-id="${plugin.id}">
            <div class="plugin-header">
                <div class="plugin-info">
                    <h3 class="plugin-name">${plugin.name}</h3>
                    <p class="plugin-author">by ${plugin.author}</p>
                </div>
                <input type="checkbox" class="plugin-checkbox" data-plugin-id="${
                  plugin.id
                }" ${isRequired ? "checked disabled" : ""}>
            </div>
            <p class="plugin-description">${plugin.description}</p>
            ${settingsHTML}
        </div>`;
}

function createSettingHTML(setting, pluginId) {
  const baseAttrs = `data-plugin-id="${pluginId}" data-setting-id="${setting.id}"`;
  switch (setting.type) {
    case "checkbox":
      return `<div class="setting-group"><label class="setting-label"><input type="checkbox" class="setting-checkbox" ${baseAttrs} ${
        setting.default ? "checked" : ""
      }> ${setting.label}</label></div>`;
    case "select":
      return `<div class="setting-group"><label class="setting-label">${
        setting.label
      }</label><select class="setting-input" ${baseAttrs}>${setting.options
        .map(
          (o) =>
            `<option value="${o.value}" ${
              o.value === setting.default ? "selected" : ""
            }>${o.label}</option>`
        )
        .join("")}</select></div>`;
    default:
      return `<div class="setting-group"><label class="setting-label">${
        setting.label
      }</label><input type="${
        setting.type
      }" class="setting-input" ${baseAttrs} value="${
        setting.default || ""
      }"></div>`;
  }
}

// ===== INTERACTIVITY FUNCTIONS =====

function setupSelectionButtons(allCheckboxes) {
  document.getElementById("selectAllBtn").addEventListener("click", () => {
    allCheckboxes.forEach((cb) => {
      if (!cb.disabled) cb.checked = true;
    });
    updateConfig();
  });

  document.getElementById("deselectAllBtn").addEventListener("click", () => {
    allCheckboxes.forEach((cb) => {
      if (!cb.disabled) cb.checked = false;
    });
    updateConfig();
  });

  document
    .getElementById("selectSuggestedBtn")
    .addEventListener("click", () => {
      // 1. تحديد الإضافات المقترحة
      allCheckboxes.forEach((cb) => {
        if (!cb.disabled) {
          cb.checked = window.VenShortData.SUGGESTED_PLUGINS.includes(
            cb.dataset.pluginId
          );
        }
      });

      // 2. تحديد ثيم ClearVision تلقائيًا
      // نبحث عن الراديو الخاص بالثيم الذي يحتوي على رابط تحميل ClearVision
      const clearVisionTheme = document.querySelector(
        'input.theme-radio[data-download-url*="id=23"]'
      );
      if (clearVisionTheme) {
        clearVisionTheme.checked = true;
      }

      // 3. تحديث ملف التكوين
      updateConfig();
    });
}

function filterPlugins(query) {
  const allCards = document.querySelectorAll(".plugin-card");
  const allSections = document.querySelectorAll(".category-section");
  const noResultsEl = document.getElementById("noResults");
  let hasVisibleCards = false;

  allCards.forEach((card) => {
    const pluginId = card.dataset.pluginId;
    const plugin = window.VenShortData.PLUGINS_DATA.find(
      (p) => p.id === pluginId
    );
    const isVisible =
      query === "" ||
      plugin.name.toLowerCase().includes(query) ||
      plugin.description.toLowerCase().includes(query) ||
      plugin.author.toLowerCase().includes(query);
    card.style.display = isVisible ? "" : "none";
    if (isVisible) hasVisibleCards = true;
  });

  allSections.forEach((section) => {
    const hasVisibleInSection = section.querySelector(
      '.plugin-card[style*="display: block"], .plugin-card:not([style*="display: none"])'
    );
    section.style.display = hasVisibleInSection ? "" : "none";
  });

  // Re-hide API section if it became visible due to filtering
  const apiSection = document.querySelector(
    '.category-section[data-category="api"]'
  );
  if (apiSection) apiSection.style.display = "none";

  noResultsEl.classList.toggle("hidden", hasVisibleCards || query === "");
}

function setupConfigGeneration() {
  document
    .getElementById("generateBtn")
    .addEventListener("click", updateConfig);
  document.getElementById("copyBtn").addEventListener("click", copyConfig);
  document
    .getElementById("downloadBtn")
    .addEventListener("click", downloadConfig);
}

function updateConfig() {
  const config = {
    settings: {
      autoUpdate: true,
      autoUpdateNotification: true,
      useQuickCss: true,
      themeLinks: [],
      enabledThemes: [],
      plugins: {},
    },
    notifications: {
      timeout: 5000,
      position: "bottom-right",
      useNative: "not-focused",
      logLimit: 50,
    },
    cloud: {
      authenticated: false,
      url: "https://api.vencord.dev/",
      settingsSync: false,
      settingsSyncVersion: Date.now(),
    },
    eagerPatches: false,
    quickCss: "",
  };

  const checkedTheme = document.querySelector(".theme-radio:checked");
  if (checkedTheme) {
    config.settings.themeLinks.push(checkedTheme.dataset.downloadUrl);
  }

  window.VenShortData.PLUGINS_DATA.forEach((plugin) => {
    const checkbox = document.querySelector(
      `.plugin-checkbox[data-plugin-id="${plugin.id}"]`
    );
    const isEnabled = checkbox ? checkbox.checked : plugin.required;
    const pluginConfig = { enabled: isEnabled };

    if (plugin.settings?.length > 0) {
      plugin.settings.forEach((setting) => {
        const input = document.querySelector(
          `[data-plugin-id="${plugin.id}"][data-setting-id="${setting.id}"]`
        );
        pluginConfig[setting.id] = input
          ? input.type === "checkbox"
            ? input.checked
            : input.value
          : setting.default;
      });
    }
    config.settings.plugins[plugin.name] = pluginConfig;
  });

  const configOutput = document.getElementById("configOutput");
  configOutput.value = JSON.stringify(config, null, 2);

  const hasContent = configOutput.value.length > 0;
  document.getElementById("copyBtn").disabled = !hasContent;
  document.getElementById("downloadBtn").disabled = !hasContent;
  updateConfigButtonCount();
}

function updateConfigButtonCount() {
  const checked = Array.from(
    document.querySelectorAll(".plugin-checkbox:checked")
  );
  const nonRequiredCount = checked.filter((cb) => !cb.disabled).length;
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.querySelector(
      "span:last-child"
    ).textContent = `إنشاء التكوين (${nonRequiredCount} إضافة اختيارية)`;
  }
}

function setupNavPaneScrollSpy() {
  const sections = Array.from(document.querySelectorAll(".category-section"));
  const navLinks = Array.from(document.querySelectorAll(".nav-pane-link"));

  const onScroll = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        // 150px offset
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", onScroll);
}

// ===== UTILITY AND HELP FUNCTIONS =====
function copyConfig() {
  const configOutput = document.getElementById("configOutput");
  if (configOutput.value) {
    navigator.clipboard
      .writeText(configOutput.value)
      .then(() => showNotification("تم نسخ التكوين بنجاح!", "success"));
  }
}
function downloadConfig() {
  const configOutput = document.getElementById("configOutput");
  if (configOutput.value) {
    const blob = new Blob([configOutput.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vencord-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
function initHelpSystem() {
  document.getElementById("helpBtn")?.addEventListener("click", showHelpModal);
}
function showHelpModal() {
  showModal(
    "كيفية تطبيق التكوين؟",
    `
    <div style="direction: rtl; text-align: right; font-family: 'Noto Sans Arabic', sans-serif;">
  <h3 style="color:#c4961c;">الطريقة الأولى (موصى بها):</h3>
      <ol style="padding-right: 30px;">
        <li>من داخل Discord، توجه إلى <strong>إعدادات المستخدم > Vencord</strong>.</li>
        <li>انتقل إلى قسم <strong>الإضافات</strong> في الأعلى.</li>
        <li>انقر على زر <strong>Import Settings</strong>.</li>
        <li>اختر ملف <strong>vencord-settings.json</strong> الذي قمت بتنزيله.</li>
        <li>بعد نجاح الاستيراد، أعد تشغيل Discord (Ctrl+R) لتطبيق الإعدادات.</li>
      </ol>

  <h3 style="color:#c4961c;">الطريقة الثانية (يدوية):</h3>
      <ol style="padding-right: 30px;">
        <li>اضغط على زر <strong>نسخ التكوين</strong>.</li>
        <li>توجه إلى <strong>إعدادات المستخدم > Vencord > الإضافات</strong>.</li>
        <li>اضغط على زر <strong>Open Settings File</strong>. سيفتح ملف نصي.</li>
        <li>احذف كل المحتوى الموجود في الملف والصق التكوين الذي نسخته.</li>
        <li>احفظ الملف وأغلقه، ثم أعد تشغيل Discord (Ctrl+R).</li>
      </ol>
  <p>للحصول على شرح مرئي، شاهد <a href="https://youtu.be/_GjGLfaqWa0" target="_blank" style="color:#fbbf24;font-weight:bold;text-decoration:underline;">مقطع الفيديو ا�[...]

  `
  );
}
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
function showModal(title, content) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `<div class="modal-content"><h2>${title}</h2><div>${content}</div><button class="modal-close">إغلاق</button></div>`;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("modal-overlay") ||
      e.target.classList.contains("modal-close")
    ) {
      modal.remove();
    }
  });
}
