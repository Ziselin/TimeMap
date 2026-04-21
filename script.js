const SVG_NS = "http://www.w3.org/2000/svg";
const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";

const svg = document.getElementById("zahlenstrahl");
const ui = {
  appFrame: document.querySelector(".app-frame"),
  timelineView: document.getElementById("timelineView"),
  detailsView: document.getElementById("detailsView"),
  eventTitle: document.getElementById("eventTitle"),
  eventYear: document.getElementById("eventYear"),
  eventDescription: document.getElementById("eventDescription"),
  eventList: document.getElementById("eventList"),
  eventBrowserInfo: document.getElementById("eventBrowserInfo"),
  resetViewButton: document.getElementById("resetViewButton"),
  zoomInButton: document.getElementById("zoomInButton"),
  zoomOutButton: document.getElementById("zoomOutButton"),
  focusNowButton: document.getElementById("focusNowButton"),
  openWorkspaceButton: document.getElementById("openWorkspaceButton"),
  editorEmptyState: document.getElementById("editorEmptyState"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  searchStatus: document.getElementById("searchStatus"),
  searchResults: document.getElementById("searchResults"),
};

const timelineEvents = [
  {
    id: "formation-earth",
    source: "seed",
    sourceId: null,
    startYear: -4540000000,
    endYear: -4540000000,
    title: "Entstehung der Erde",
    description: "Die Erde bildet sich aus Material der protoplanetaren Scheibe.",
    category: "Geologie",
    enabled: true,
  },
  {
    id: "first-life",
    source: "seed",
    sourceId: null,
    startYear: -3700000000,
    endYear: -3700000000,
    title: "Frueheste Hinweise auf Leben",
    description: "Geochemische und sedimentologische Spuren deuten auf sehr fruehe Lebensformen hin.",
    category: "Biologie",
    enabled: true,
  },
  {
    id: "cambrian",
    source: "seed",
    sourceId: null,
    startYear: -541000000,
    endYear: -485400000,
    title: "Kambrium",
    description: "Das Kambrium wird hier als Zeitraum dargestellt, in dem die Vielfalt komplexer Organismen stark zunimmt.",
    category: "Biologie",
    enabled: true,
  },
  {
    id: "agriculture",
    source: "seed",
    sourceId: null,
    startYear: -10000,
    endYear: -3500,
    title: "Neolithische Revolution",
    description: "Sesshafte Landwirtschaft entwickelt sich ueber mehrere Jahrtausende in verschiedenen Regionen der Welt.",
    category: "Kultur",
    enabled: true,
  },
  {
    id: "rome-fall",
    source: "seed",
    sourceId: null,
    startYear: 395,
    endYear: 476,
    title: "Westroemisches Reich",
    description: "Die spaete Phase des Westroemischen Reiches bis zu seinem oft genannten Endpunkt 476.",
    category: "Politik",
    enabled: true,
  },
  {
    id: "today",
    source: "seed",
    sourceId: null,
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    title: "Gegenwart",
    description: "Der aktuelle Jahreswert dient als Referenzpunkt fuer die Startansicht.",
    category: "Referenz",
    enabled: true,
  },
];

const scaleSteps = [
  1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
  100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000,
  50000000, 100000000, 200000000, 500000000, 1000000000,
];

const state = {
  centerYear: new Date().getFullYear(),
  stepIndex: 0,
  selectedEventId: null,
  openEditorIds: new Set(),
  width: 0,
  height: 0,
  tickCount: 0,
  anchorDetailsOnScrollBack: false,
  snappingBackToTimeline: false,
  resizeFrame: 0,
  searchResults: [],
  pendingAdds: new Set(),
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });
  return element;
}

function getStep() {
  return scaleSteps[state.stepIndex];
}

function getTickCount(width) {
  return Math.max(5, Math.floor(width / 110) | 1);
}

function toHistoricalYear(astronomicalYear) {
  return astronomicalYear <= 0 ? astronomicalYear - 1 : astronomicalYear;
}

function toAstronomicalYear(historicalYear) {
  return historicalYear < 1 ? historicalYear + 1 : historicalYear;
}

function trimNumber(value) {
  if (Number.isInteger(value)) return String(value);
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1).replace(/\.0$/, "");
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function yearToLabel(year) {
  const historicalYear = toHistoricalYear(year);
  const absoluteYear = Math.abs(historicalYear);
  if (absoluteYear >= 1000000000) return `${trimNumber(absoluteYear / 1000000000)} Ga`;
  if (absoluteYear >= 1000000) return `${trimNumber(absoluteYear / 1000000)} Ma`;
  if (absoluteYear >= 10000) return `${trimNumber(absoluteYear / 1000)} ka`;
  return String(historicalYear);
}

function stepToLabel(step) {
  if (step >= 1000000000) return `${trimNumber(step / 1000000000)} Ga`;
  if (step >= 1000000) return `${trimNumber(step / 1000000)} Ma`;
  if (step >= 1000) return `${trimNumber(step / 1000)} ka`;
  return `${trimNumber(step)} a`;
}

function roundCenterYearToStep(centerYear, step) {
  const historicalYear = toHistoricalYear(centerYear);
  let roundedHistoricalYear = Math.round(historicalYear / step) * step;
  if (roundedHistoricalYear === 0) {
    roundedHistoricalYear = historicalYear < 0 ? -step : step;
  }
  return toAstronomicalYear(roundedHistoricalYear);
}

function getEventById(eventId) {
  return timelineEvents.find((eventItem) => eventItem.id === eventId) ?? null;
}

function isRangeEvent(eventItem) {
  return eventItem.startYear !== eventItem.endYear;
}

function getEventAnchorYear(eventItem) {
  return Math.round((eventItem.startYear + eventItem.endYear) / 2);
}

function getEventDateLabel(eventItem) {
  if (eventItem.startYear === eventItem.endYear) {
    return yearToLabel(eventItem.startYear);
  }
  return `${yearToLabel(eventItem.startYear)} bis ${yearToLabel(eventItem.endYear)}`;
}

function getVisibleRange() {
  const halfRange = Math.floor(state.tickCount / 2) * getStep();
  return { start: state.centerYear - halfRange, end: state.centerYear + halfRange };
}

function getTicks() {
  const step = getStep();
  const middle = Math.floor(state.tickCount / 2);
  return Array.from({ length: state.tickCount }, (_, index) => ({
    index,
    year: state.centerYear + (index - middle) * step,
  }));
}

function isMajorTick(year) {
  const step = getStep();
  const divisor = step < 5 ? 5 : step * 5;
  return year % divisor === 0;
}

function getEventX(year) {
  const padding = 80;
  const range = getVisibleRange();
  const usableWidth = state.width - padding * 2;
  const ratio = (year - range.start) / Math.max(1, range.end - range.start);
  return padding + usableWidth * ratio;
}

function getEnabledEvents() {
  return timelineEvents.filter((eventItem) => eventItem.enabled);
}

function getBrowserEvents() {
  return getEnabledEvents().sort((left, right) => left.startYear - right.startYear);
}

function getVisibleEvents() {
  const range = getVisibleRange();
  return getEnabledEvents()
    .filter((eventItem) => eventItem.endYear >= range.start && eventItem.startYear <= range.end)
    .sort((left, right) => left.startYear - right.startYear);
}

function requestRedraw() {
  if (state.resizeFrame) cancelAnimationFrame(state.resizeFrame);
  state.resizeFrame = requestAnimationFrame(() => {
    state.resizeFrame = 0;
    drawTimeline();
  });
}

function updateSelectionPanel() {
  const eventItem = getEventById(state.selectedEventId);
  if (!eventItem) {
    ui.eventTitle.textContent = "Kein Ereignis ausgewaehlt";
    ui.eventYear.textContent = "-";
    ui.eventDescription.textContent = "Klicke auf einen Marker auf dem Zeitstrahl oder fuege rechts ein Wikidata-Element hinzu.";
    return;
  }
  ui.eventTitle.textContent = eventItem.title;
  ui.eventYear.textContent = `${getEventDateLabel(eventItem)} - ${eventItem.category}`;
  ui.eventDescription.textContent = eventItem.description || "Keine Beschreibung vorhanden.";
}

function selectEvent(eventId, openEditor = false) {
  const match = getEventById(eventId);
  if (!match) return;
  state.selectedEventId = eventId;
  if (openEditor) state.openEditorIds.add(eventId);
  updateSelectionPanel();
  renderEventList();
  drawTimeline();
}

function clearSelectedEvent() {
  state.selectedEventId = null;
  updateSelectionPanel();
  renderEventList();
  drawTimeline();
}

function syncViewMetrics() {
  state.width = Math.max(1, Math.round(svg.clientWidth));
  state.height = Math.max(1, Math.round(svg.clientHeight));
  state.tickCount = getTickCount(state.width);
  svg.setAttribute("viewBox", `0 0 ${state.width} ${state.height}`);
}

function scrollToDetails() {
  state.anchorDetailsOnScrollBack = true;
  ui.detailsView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindEventSelection(target, eventItem) {
  target.addEventListener("click", () => {
    selectEvent(eventItem.id);
    scrollToDetails();
  });
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectEvent(eventItem.id);
      scrollToDetails();
    }
  });
}

function drawTimeline() {
  syncViewMetrics();
  svg.replaceChildren();

  const paddingX = 80;
  const lineY = state.height * 0.56;
  const footerY = state.height - 38;
  const ticks = getTicks();
  const visibleEvents = getVisibleEvents();

  svg.appendChild(createSvgElement("line", {
    x1: paddingX, y1: lineY, x2: state.width - paddingX, y2: lineY,
    stroke: "#9ed3df", "stroke-width": 2,
  }));

  ticks.forEach((tick) => {
    const x = getEventX(tick.year);
    const majorTick = isMajorTick(tick.year);
    svg.appendChild(createSvgElement("circle", {
      cx: x, cy: lineY, r: majorTick ? 4.8 : 3.2, fill: majorTick ? "#ffb347" : "#9ed3df",
    }));
    const tickText = createSvgElement("text", {
      x, y: lineY + 42, fill: majorTick ? "#eef3f6" : "#a4b0b8",
      "font-size": tick.index === Math.floor(state.tickCount / 2) ? 15 : 13,
      "font-family": "Segoe UI, Arial, sans-serif",
      "font-weight": tick.index === Math.floor(state.tickCount / 2) ? 600 : 400,
      "text-anchor": "middle",
    });
    tickText.textContent = yearToLabel(tick.year);
    svg.appendChild(tickText);
  });

  svg.appendChild(createSvgElement("line", {
    x1: state.width / 2, y1: 24, x2: state.width / 2, y2: footerY,
    stroke: "rgba(255, 255, 255, 0.12)", "stroke-width": 1, "stroke-dasharray": "5 7",
  }));

  visibleEvents.forEach((eventItem, index) => {
    const startX = getEventX(eventItem.startYear);
    const endX = getEventX(eventItem.endYear);
    const anchorX = getEventX(getEventAnchorYear(eventItem));
    const markerY = lineY - 78 - (index % 3) * 42;
    const selected = eventItem.id === state.selectedEventId;
    const accent = selected ? "#ff8f5a" : "#9ed3df";

    svg.appendChild(createSvgElement("line", {
      x1: anchorX, y1: markerY + 14, x2: anchorX, y2: lineY,
      stroke: selected ? "#ff8f5a" : "rgba(158, 211, 223, 0.4)",
      "stroke-width": selected ? 2 : 1.4,
    }));

    if (isRangeEvent(eventItem)) {
      const rangeLine = createSvgElement("line", {
        x1: startX, y1: markerY, x2: endX, y2: markerY,
        stroke: accent, "stroke-width": selected ? 6 : 4, "stroke-linecap": "round",
        tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
      });
      bindEventSelection(rangeLine, eventItem);
      svg.appendChild(rangeLine);

      [startX, endX].forEach((x) => {
        const endpoint = createSvgElement("circle", {
          cx: x, cy: markerY, r: selected ? 6 : 4.5,
          fill: selected ? "#ffb347" : "#d7edf2", stroke: "#22272b", "stroke-width": 2,
          tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
        });
        bindEventSelection(endpoint, eventItem);
        svg.appendChild(endpoint);
      });
    } else {
      const marker = createSvgElement("circle", {
        cx: anchorX, cy: markerY, r: selected ? 8 : 6,
        fill: accent, stroke: "#22272b", "stroke-width": 2,
        tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
      });
      bindEventSelection(marker, eventItem);
      svg.appendChild(marker);
    }

    const label = createSvgElement("text", {
      x: anchorX, y: markerY - 14, fill: selected ? "#eef3f6" : "#a4b0b8",
      "font-size": 13, "font-family": "Segoe UI, Arial, sans-serif",
      "font-weight": selected ? 600 : 400, "text-anchor": "middle",
    });
    label.textContent = eventItem.title;
    svg.appendChild(label);
  });

  const scaleLabel = createSvgElement("text", {
    x: state.width - paddingX, y: 42, fill: "#ffb347", "font-size": 18,
    "font-family": "Segoe UI, Arial, sans-serif", "font-weight": 600, "text-anchor": "end",
  });
  scaleLabel.textContent = stepToLabel(getStep());
  svg.appendChild(scaleLabel);
}

function createInlineEditor(eventItem) {
  const editor = document.createElement("div");
  editor.className = "event-inline-editor";

  const createField = (labelText, inputElement) => {
    const label = document.createElement("label");
    label.className = "field";
    const span = document.createElement("span");
    span.textContent = labelText;
    label.append(span, inputElement);
    return label;
  };

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = eventItem.title;
  titleInput.addEventListener("input", () => {
    eventItem.title = titleInput.value.trim() || eventItem.title;
    if (state.selectedEventId === eventItem.id) updateSelectionPanel();
    renderEventList();
    drawTimeline();
  });

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.value = eventItem.category;
  categoryInput.addEventListener("input", () => {
    eventItem.category = categoryInput.value.trim() || "Unkategorisiert";
    if (state.selectedEventId === eventItem.id) updateSelectionPanel();
    renderEventList();
    drawTimeline();
  });

  const rangeCheckbox = document.createElement("input");
  rangeCheckbox.type = "checkbox";
  rangeCheckbox.checked = isRangeEvent(eventItem);

  const startInput = document.createElement("input");
  startInput.type = "number";
  startInput.step = "1";
  startInput.value = String(eventItem.startYear);

  const endInput = document.createElement("input");
  endInput.type = "number";
  endInput.step = "1";
  endInput.value = String(eventItem.endYear);

  const applyYearChanges = () => {
    const startYear = Number(startInput.value);
    const rawEndYear = Number(endInput.value);
    if (!Number.isFinite(startYear) || !Number.isFinite(rawEndYear)) return;
    const endYear = rangeCheckbox.checked ? rawEndYear : startYear;
    eventItem.startYear = Math.min(startYear, endYear);
    eventItem.endYear = Math.max(startYear, endYear);
    endInput.disabled = !rangeCheckbox.checked;
    endInput.value = String(eventItem.endYear);
    if (state.selectedEventId === eventItem.id) updateSelectionPanel();
    renderEventList();
    drawTimeline();
  };

  rangeCheckbox.addEventListener("change", applyYearChanges);
  startInput.addEventListener("input", applyYearChanges);
  endInput.addEventListener("input", applyYearChanges);
  endInput.disabled = !rangeCheckbox.checked;

  const descriptionArea = document.createElement("textarea");
  descriptionArea.rows = 5;
  descriptionArea.value = eventItem.description;
  descriptionArea.addEventListener("input", () => {
    eventItem.description = descriptionArea.value.trim();
    if (state.selectedEventId === eventItem.id) updateSelectionPanel();
  });

  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "field checkbox-field";
  const checkboxText = document.createElement("span");
  checkboxText.textContent = "Zeitraum statt Punkt";
  checkboxLabel.append(rangeCheckbox, checkboxText);

  const yearRow = document.createElement("div");
  yearRow.className = "field-row year-fields";
  yearRow.append(
    createField("Von", startInput),
    createField("Bis", endInput),
  );

  const sourceInfo = document.createElement("div");
  sourceInfo.className = "editor-meta";
  sourceInfo.textContent = eventItem.source === "wikidata"
    ? `Quelle: Wikidata (${eventItem.sourceId ?? "unbekannt"})`
    : "Quelle: lokal";

  editor.append(
    createField("Titel", titleInput),
    createField("Kategorie", categoryInput),
    checkboxLabel,
    yearRow,
    createField("Beschreibung", descriptionArea),
    sourceInfo,
  );
  return editor;
}

function renderEventList() {
  ui.eventList.replaceChildren();
  const browserEvents = getBrowserEvents();
  ui.eventBrowserInfo.textContent = `${browserEvents.length} aktive Ereignisse im Zeitstrahl`;

  if (browserEvents.length === 0) {
    ui.editorEmptyState.hidden = false;
    const emptyState = document.createElement("p");
    emptyState.className = "event-description";
    emptyState.textContent = "Noch keine aktiven Ereignisse im Zeitstrahl vorhanden.";
    ui.eventList.appendChild(emptyState);
    return;
  }

  ui.editorEmptyState.hidden = true;
  browserEvents.forEach((eventItem) => {
    const item = document.createElement("div");
    item.className = "event-browser-item";
    if (state.openEditorIds.has(eventItem.id)) item.classList.add("is-open");

    const row = document.createElement("div");
    row.className = "event-row";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "event-row-toggle";
    toggleButton.textContent = state.openEditorIds.has(eventItem.id) ? "-" : "+";
    toggleButton.addEventListener("click", () => {
      if (state.openEditorIds.has(eventItem.id)) {
        state.openEditorIds.delete(eventItem.id);
      } else {
        state.openEditorIds.add(eventItem.id);
        state.selectedEventId = eventItem.id;
        updateSelectionPanel();
      }
      renderEventList();
      drawTimeline();
    });

    const checkWrap = document.createElement("label");
    checkWrap.className = "event-row-check";
    const enabledCheckbox = document.createElement("input");
    enabledCheckbox.type = "checkbox";
    enabledCheckbox.checked = eventItem.enabled;
    enabledCheckbox.addEventListener("change", () => {
      eventItem.enabled = enabledCheckbox.checked;
      if (!eventItem.enabled) {
        state.openEditorIds.delete(eventItem.id);
        if (state.selectedEventId === eventItem.id) {
          clearSelectedEvent();
          return;
        }
      }
      renderEventList();
      drawTimeline();
    });
    checkWrap.appendChild(enabledCheckbox);

    const main = document.createElement("button");
    main.type = "button";
    main.className = "event-row-main";
    main.addEventListener("click", () => {
      selectEvent(eventItem.id);
    });
    const title = document.createElement("strong");
    title.textContent = eventItem.title;
    const meta = document.createElement("span");
    meta.textContent = eventItem.category;
    main.append(title, meta);

    const date = document.createElement("span");
    date.className = "event-row-date";
    date.textContent = getEventDateLabel(eventItem);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "event-row-delete";
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => {
      const index = timelineEvents.findIndex((candidate) => candidate.id === eventItem.id);
      if (index === -1) return;
      timelineEvents.splice(index, 1);
      state.openEditorIds.delete(eventItem.id);
      if (state.selectedEventId === eventItem.id) {
        state.selectedEventId = null;
        updateSelectionPanel();
      }
      renderEventList();
      renderSearchResults();
      drawTimeline();
    });

    row.append(toggleButton, checkWrap, main, date, deleteButton);
    item.appendChild(row);

    if (state.openEditorIds.has(eventItem.id)) {
      item.appendChild(createInlineEditor(eventItem));
    }

    ui.eventList.appendChild(item);
  });
}

function pan(direction) {
  state.centerYear += direction * getStep();
  drawTimeline();
}

function zoom(direction) {
  const nextIndex = clamp(state.stepIndex + direction, 0, scaleSteps.length - 1);
  if (nextIndex === state.stepIndex) return;
  state.stepIndex = nextIndex;
  state.centerYear = roundCenterYearToStep(state.centerYear, getStep());
  drawTimeline();
}

function resetView() {
  state.centerYear = new Date().getFullYear();
  state.stepIndex = 0;
  clearSelectedEvent();
}

function handleWheel(event) {
  event.preventDefault();
  const direction = event.deltaY > 0 ? 1 : -1;
  if (event.shiftKey) {
    zoom(direction);
    return;
  }
  pan(direction);
}

function handleScrollAnchor() {
  if (!state.anchorDetailsOnScrollBack || state.snappingBackToTimeline) return;
  const scrollTop = ui.appFrame.scrollTop;
  const threshold = Math.max(120, window.innerHeight * 0.35);
  if (scrollTop < threshold) {
    state.snappingBackToTimeline = true;
    state.anchorDetailsOnScrollBack = false;
    clearSelectedEvent();
    ui.timelineView.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      state.snappingBackToTimeline = false;
    }, 450);
  }
}

function createSearchResultItem(result) {
  const wrapper = document.createElement("label");
  wrapper.className = "search-result";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = timelineEvents.some((eventItem) => eventItem.sourceId === result.id);
  checkbox.disabled = checkbox.checked || state.pendingAdds.has(result.id);
  checkbox.addEventListener("change", async () => {
    if (!checkbox.checked) return;
    state.pendingAdds.add(result.id);
    checkbox.disabled = true;
    ui.searchStatus.textContent = `Lade ${result.label} aus Wikidata ...`;
    const eventItem = await addWikidataResult(result);
    state.pendingAdds.delete(result.id);
      if (eventItem) {
        ui.searchStatus.textContent = `${eventItem.title} wurde hinzugefuegt und kann jetzt links bearbeitet werden.`;
        state.openEditorIds.add(eventItem.id);
        selectEvent(eventItem.id, true);
        renderEventList();
        scrollToDetails();
      } else {
      checkbox.checked = false;
      checkbox.disabled = false;
      ui.searchStatus.textContent = `Zu ${result.label} konnten keine brauchbaren Jahresdaten geladen werden.`;
    }
    renderSearchResults();
  });

  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = `${result.label} (${result.id})`;
  const description = document.createElement("span");
  description.textContent = result.description || "Keine Beschreibung vorhanden.";
  const meta = document.createElement("small");
  meta.textContent = checkbox.checked ? "Bereits hinzugefuegt" : "Haken setzen zum Hinzufuegen";
  content.append(title, description, meta);

  wrapper.append(checkbox, content);
  return wrapper;
}

function renderSearchResults() {
  ui.searchResults.replaceChildren();
  if (state.searchResults.length === 0) {
    const hint = document.createElement("p");
    hint.className = "event-description";
    hint.textContent = "Noch keine Treffer. Starte oben eine Suche in Wikidata.";
    ui.searchResults.appendChild(hint);
    return;
  }
  state.searchResults.forEach((result) => {
    ui.searchResults.appendChild(createSearchResultItem(result));
  });
}

function normalizeSearchResults(payload) {
  return (payload.search ?? []).map((entry) => ({
    id: entry.id,
    label: entry.label || entry.display?.label?.value || entry.id,
    description: entry.description || entry.display?.description?.value || "",
  }));
}

async function searchWikidata(query) {
  const url = new URL(WIKIDATA_API_URL);
  url.search = new URLSearchParams({
    action: "wbsearchentities",
    format: "json",
    origin: "*",
    language: "de",
    uselang: "de",
    type: "item",
    limit: "10",
    search: query,
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Wikidata-Suche fehlgeschlagen");
  return normalizeSearchResults(await response.json());
}

function extractYearFromTimeValue(timeValue) {
  if (!timeValue?.time) return null;
  const match = /^([+-]\d+)/.exec(timeValue.time);
  if (!match) return null;
  return Number(match[1]);
}

function getClaimYear(entity, propertyId) {
  const claims = entity.claims?.[propertyId];
  const timeValue = claims?.[0]?.mainsnak?.datavalue?.value;
  return extractYearFromTimeValue(timeValue);
}

function getWikidataYears(entity) {
  const pointCandidates = ["P585", "P571", "P577", "P569", "P580"];
  const rangeStart = getClaimYear(entity, "P580") ?? getClaimYear(entity, "P571");
  const rangeEnd = getClaimYear(entity, "P582") ?? getClaimYear(entity, "P576");
  if (Number.isFinite(rangeStart) && Number.isFinite(rangeEnd)) {
    return { startYear: Math.min(rangeStart, rangeEnd), endYear: Math.max(rangeStart, rangeEnd) };
  }

  for (const propertyId of pointCandidates) {
    const pointYear = getClaimYear(entity, propertyId);
    if (Number.isFinite(pointYear)) {
      return { startYear: pointYear, endYear: pointYear };
    }
  }
  return null;
}

async function fetchWikidataEntity(entityId) {
  const url = new URL(WIKIDATA_API_URL);
  url.search = new URLSearchParams({
    action: "wbgetentities",
    format: "json",
    origin: "*",
    ids: entityId,
    languages: "de|en",
    languagefallback: "1",
    props: "labels|descriptions|claims",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Wikidata-Details konnten nicht geladen werden");
  const payload = await response.json();
  return payload.entities?.[entityId] ?? null;
}

function buildEventFromWikidata(entityId, entity, searchFallback) {
  const years = getWikidataYears(entity);
  if (!years) return null;

  const label = entity.labels?.de?.value || entity.labels?.en?.value || searchFallback.label || entityId;
  const description = entity.descriptions?.de?.value || entity.descriptions?.en?.value || searchFallback.description || "";
  return {
    id: `wikidata-${entityId}`,
    source: "wikidata",
    sourceId: entityId,
    startYear: years.startYear,
    endYear: years.endYear,
    title: label,
    description,
    category: "Wikidata",
    enabled: true,
  };
}

async function addWikidataResult(result) {
  const existing = timelineEvents.find((eventItem) => eventItem.sourceId === result.id);
  if (existing) {
    existing.enabled = true;
    return existing;
  }

  try {
    const entity = await fetchWikidataEntity(result.id);
    if (!entity) return null;
    const newEvent = buildEventFromWikidata(result.id, entity, result);
    if (!newEvent) return null;
    timelineEvents.push(newEvent);
    return newEvent;
  } catch {
    return null;
  }
}

async function handleSearchSubmit(event) {
  event.preventDefault();
  const query = ui.searchInput.value.trim();
  if (!query) {
    ui.searchStatus.textContent = "Bitte gib zuerst einen Suchbegriff ein.";
    return;
  }

  ui.searchStatus.textContent = `Suche nach "${query}" in Wikidata ...`;
  try {
    state.searchResults = await searchWikidata(query);
    ui.searchStatus.textContent = state.searchResults.length > 0
      ? `${state.searchResults.length} Treffer gefunden.`
      : "Keine Treffer gefunden.";
  } catch {
    state.searchResults = [];
    ui.searchStatus.textContent = "Die Wikidata-Suche konnte nicht geladen werden. Bitte spaeter erneut versuchen.";
  }
  renderSearchResults();
}

function bindEvents() {
  svg.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", requestRedraw);
  ui.appFrame.addEventListener("scroll", handleScrollAnchor, { passive: true });
  ui.searchForm.addEventListener("submit", handleSearchSubmit);
  ui.openWorkspaceButton.addEventListener("click", () => {
    scrollToDetails();
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", requestRedraw);
  }

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      requestRedraw();
    });
    resizeObserver.observe(svg);
    resizeObserver.observe(ui.timelineView);
  }

  ui.resetViewButton.addEventListener("click", resetView);
  ui.zoomInButton.addEventListener("click", () => zoom(-1));
  ui.zoomOutButton.addEventListener("click", () => zoom(1));
  ui.focusNowButton.addEventListener("click", () => {
    state.centerYear = new Date().getFullYear();
    clearSelectedEvent();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") pan(-1);
    if (event.key === "ArrowRight") pan(1);
    if (event.key === "+" || event.key === "=") zoom(-1);
    if (event.key === "-") zoom(1);
  });
}

function init() {
  bindEvents();
  updateSelectionPanel();
  renderEventList();
  renderSearchResults();
  drawTimeline();
}

init();
