const feedData = {"ai":[{"type":"AI","title":"多模态生成进入生产工具链","summary":"从单点生成走向图文视频联动，设计团队需要重新定义素材生产和审核流程。","time":"06.18 09:30","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Tool","title":"秒创：批量生成多版本传播图","summary":"个性化用户设计，活动主图、资源位、传播图，适配司乘两端。","time":"06.17 18:20","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Method","title":"AI 设计产物的可用性检查清单","summary":"重点关注品牌一致性、文字准确性、合规边界和跨端展示质量。","time":"06.15 11:00","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Model","title":"视频生成工具开始进入设计评审流程","summary":"动态脚本、节奏预览和多版本对比正在成为活动物料前期探索的一部分。","time":"06.14 16:40","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"}],"finance":[{"type":"Finance","title":"金融产品体验的信任感正在前置","summary":"解释成本、风险提示和状态反馈正在从交易末端前移到决策入口。","time":"06.18 08:45","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Case","title":"复杂金融信息的轻量化表达","summary":"通过层级、摘要和可展开详情，把高密度信息变成可扫描的决策界面。","time":"06.16 14:10","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Research","title":"面向低频高风险任务的确认体验","summary":"对转账、授信、保险等场景，确认页需要承担解释、纠错和留痕职责。","time":"06.13 10:15","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Signal","title":"财富、信贷、保险场景里的信息密度控制","summary":"把摘要、风险、下一步动作拆成不同阅读层级，降低用户决策负担。","time":"06.12 19:05","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"}],"design":[{"type":"Design","title":"深色阅读界面规范草案","summary":"用克制的黑色背景和浅灰内容容器，兼顾品牌调性与长时间阅读舒适度。","time":"06.18 12:00","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Tool","title":"影创：自动化视频创作","summary":"把合规审查约束写入创意流程，在缝隙中找到营销爆点的突破口。","time":"06.17 20:30","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Event","title":"季度工具分享会预告位","summary":"后续可以放内部 workshop、外部分享或团队研究发布活动。","time":"06.11 15:00","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"},{"type":"Craft","title":"产品工具页的展示素材应该先讲结果","summary":"让用户先看到可交付的图和视频，再解释生成流程与工具能力。","time":"06.10 13:25","href":"https://yehloolau-afk.github.io/designer-tool/ai-station.html"}]};
const feedSources = {"ai":"https://yehloolau-afk.github.io/designer-tool/data/featured.json","finance":"https://yehloolau-afk.github.io/designer-tool/data/daily.json","design":"https://yehloolau-afk.github.io/designer-tool/data/design.json"};
const products = [{"name":"秒创","title":"AI 自动生图工具","summary":"个性化用户设计，活动主图、资源位、传播图、批量生成多版本，适配司乘两端。","keywords":["秒","创"],"image":"assets/product-miaochuang.jpg","href":"http://miao.intra.xiaojukeji.com/"},{"name":"影创","title":"AI 自动化视频创作","summary":"有好的想法，合规审查约束条件已写入，在这些缝隙中找到创意和营销爆点的突破口。","keywords":["影","创"],"image":"assets/product-yingchuang.jpg","href":"http://ying.intra.xiaojukeji.com/"}];
const feedList = document.querySelector(".feed-list");
const tabButtons = Array.from(document.querySelectorAll(".feed-tab"));
const feedDate = document.querySelector("[data-feed-date]");
const refreshButton = document.querySelector(".feed-refresh");
const slides = Array.from(document.querySelectorAll(".product-slide"));
const dots = Array.from(document.querySelectorAll(".product-dot"));
const productName = document.querySelector("[data-product-name]");
const productTitle = document.querySelector("[data-product-title]");
const productSummary = document.querySelector("[data-product-summary]");
const productLink = document.querySelector("[data-product-link]");
const fluidCanvas = document.querySelector(".fluid-grid-canvas");
let productIndex = 0;
let activeFeedTab = "ai";

function hydrateImageAssets() {
  document.querySelectorAll('[data-b64-src]').forEach(async (img) => {
    try {
      const response = await fetch(img.dataset.b64Src, { cache: 'force-cache' });
      if (!response.ok) return;
      const content = (await response.text()).trim();
      img.src = 'data:' + img.dataset.mime + ';base64,' + content;
    } catch (error) {}
  });
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return pad(date.getMonth() + 1) + "." + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
}

function formatUpdated(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Live Feed";
  const pad = (num) => String(num).padStart(2, "0");
  return date.getFullYear() + "." + pad(date.getMonth() + 1) + "." + pad(date.getDate());
}

function formatTabDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return pad(date.getMonth() + 1) + "." + pad(date.getDate());
}

function normalizeFeedItems(items) {
  return items.slice(0, 18).map((item) => ({
    type: item.source || item.author || "Feed",
    title: stripHtml(item.title || "Untitled"),
    summary: stripHtml(item.description || item.content || item.contentSnippet || "").slice(0, 96),
    time: formatDate(item.pubDate || item.isoDate || item.published || item.date),
    href: item.link || item.guid || "https://yehloolau-afk.github.io/designer-tool/ai-station.html",
  }));
}

function renderFeed(tab) {
  feedList.innerHTML = feedData[tab].map((item) => {
    return '<a class="feed-item" href="' + item.href + '" target="_blank" rel="noreferrer">' +
      '<div class="feed-item-meta"><span>' + item.type + '</span><time>' + item.time + '</time></div>' +
      '<h3>' + item.title + '</h3>' +
      '<p>' + item.summary + '</p>' +
      '<span class="feed-more">查看原文</span>' +
    '</a>';
  }).join("");
}

async function loadFeed(tab, options = {}) {
  activeFeedTab = tab;
  const source = feedSources[tab];
  if (!source) {
    renderFeed(tab);
    return;
  }

  if (options.manual) refreshButton.textContent = "刷新中";
  try {
    const response = await fetch(source + (options.manual ? "?t=" + Date.now() : ""), { cache: options.manual ? "no-store" : "default" });
    if (!response.ok) throw new Error("Feed HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error("Feed items missing");
    feedData[tab] = normalizeFeedItems(data.items);
    feedDate.textContent = formatUpdated(data.updated);
    const tabTime = document.querySelector('.feed-tab[data-tab="' + tab + '"] time');
    if (tabTime) tabTime.textContent = formatTabDate(data.updated) || tabTime.textContent;
    renderFeed(tab);
  } catch (error) {
    feedDate.textContent = "Fallback";
    renderFeed(tab);
  } finally {
    refreshButton.textContent = "刷新";
  }
}

function setProduct(index) {
  productIndex = index;
  const product = products[index];
  slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  productName.textContent = product.name;
  productTitle.textContent = product.title;
  productSummary.textContent = product.summary;
  productLink.href = product.href;
  productLink.setAttribute("aria-label", "打开" + product.name);
}

function startFluidGrid() {
  if (!fluidCanvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = fluidCanvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  const pointer = { x: 0.36, y: 0.46, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    fluidCanvas.width = Math.floor(width * dpr);
    fluidCanvas.height = Math.floor(height * dpr);
    fluidCanvas.style.width = width + "px";
    fluidCanvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function warp(x, y, time) {
    const cx = pointer.x * width;
    const cy = pointer.y * height;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - distance / Math.max(width, height) * 1.85);
    const wave =
      Math.sin(x * 0.008 + time) * 7 +
      Math.cos(y * 0.011 - time * 0.8) * 5 +
      Math.sin((x + y) * 0.004 + time * 0.55) * 6;
    const swirl = pointer.active ? pull * 14 : pull * 7;
    return {
      x: x + Math.sin(y * 0.009 + time * 0.8) * 6 + (dy / (distance + 80)) * swirl,
      y: y + wave + Math.cos(x * 0.007 - time) * 5 - (dx / (distance + 80)) * swirl,
    };
  }

  function drawLine(points, time) {
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      const point = warp(x, y, time);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function draw(timeStamp) {
    frame = window.requestAnimationFrame(draw);
    const time = timeStamp * 0.00022;
    ctx.clearRect(0, 0, width, height);

    const spacing = width < 760 ? 54 : 64;
    const step = 30;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.035)";

    for (let y = -spacing; y <= height + spacing; y += spacing) {
      const points = [];
      for (let x = -spacing; x <= width + spacing; x += step) points.push([x, y]);
      drawLine(points, time);
    }

    for (let x = -spacing; x <= width + spacing; x += spacing) {
      const points = [];
      for (let y = -spacing; y <= height + spacing; y += step) points.push([x, y]);
      drawLine(points, time + 0.7);
    }

    const gradient = ctx.createRadialGradient(pointer.x * width, pointer.y * height, 0, pointer.x * width, pointer.y * height, Math.min(width, height) * 0.46);
    gradient.addColorStop(0, pointer.active ? "rgba(255,213,0,0.11)" : "rgba(255,213,0,0.055)");
    gradient.addColorStop(0.36, "rgba(255,213,0,0.026)");
    gradient.addColorStop(1, "rgba(255,213,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,213,0,0.095)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i += 1) {
      const y = height * (0.34 + i * 0.14) + Math.sin(time * 2 + i) * 26;
      const points = [];
      for (let x = width * 0.12; x <= width * 0.72; x += step) points.push([x, y]);
      drawLine(points, time + i * 0.9);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / Math.max(1, width);
    pointer.y = event.clientY / Math.max(1, height);
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resize();
  frame = window.requestAnimationFrame(draw);
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });
    loadFeed(button.dataset.tab);
  });
});

refreshButton.addEventListener("click", () => {
  loadFeed(activeFeedTab, { manual: true });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => setProduct(Number(dot.dataset.productDot)));
});

window.setInterval(() => {
  setProduct((productIndex + 1) % products.length);
}, 10000);

hydrateImageAssets();
setProduct(0);
loadFeed("ai");
startFluidGrid();