const SVG_NS = "http://www.w3.org/2000/svg";
const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";

const svg = document.getElementById("zahlenstrahl");
const ui = {
  appFrame: document.querySelector(".app-frame"),
  timelineView: document.getElementById("timelineView"),
  detailsView: document.getElementById("detailsView"),
  eventTooltip: document.getElementById("eventTooltip"),
  eventTitle: document.getElementById("eventTitle"),
  eventYear: document.getElementById("eventYear"),
  eventDescription: document.getElementById("eventDescription"),
  eventList: document.getElementById("eventList"),
  eventBrowserInfo: document.getElementById("eventBrowserInfo"),
  addCustomEventButton: document.getElementById("addCustomEventButton"),
  addFolderButton: document.getElementById("addFolderButton"),
  addEpochGroupButton: document.getElementById("addEpochGroupButton"),
  importFolderButton: document.getElementById("importFolderButton"),
  importFolderInput: document.getElementById("importFolderInput"),
  epochMenu: document.getElementById("epochMenu"),
  resetViewButton: document.getElementById("resetViewButton"),
  zoomInButton: document.getElementById("zoomInButton"),
  zoomOutButton: document.getElementById("zoomOutButton"),
  focusNowButton: document.getElementById("focusNowButton"),
  openWorkspaceStrip: document.getElementById("openWorkspaceStrip"),
  fullscreenButton: document.getElementById("fullscreenButton"),
  editorEmptyState: document.getElementById("editorEmptyState"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  searchStatus: document.getElementById("searchStatus"),
  searchResults: document.getElementById("searchResults"),
  timelineMenuButton: document.getElementById("timelineMenuButton"),
  timelineMenuOverlay: document.getElementById("timelineMenuOverlay"),
  timelineSideMenu: document.getElementById("timelineSideMenu"),
  timelineMenuCloseButton: document.getElementById("timelineMenuCloseButton"),
  timelineMenuLabel: document.getElementById("timelineMenuLabel"),
  timelineMenuTitle: document.getElementById("timelineMenuTitle"),
  languageSelect: document.getElementById("languageSelect"),
  menuLanguageTitle: document.getElementById("menuLanguageTitle"),
  menuLanguageLabel: document.getElementById("menuLanguageLabel"),
  menuLanguageDescription: document.getElementById("menuLanguageDescription"),
  menuHelpTitle: document.getElementById("menuHelpTitle"),
  menuHelpDescription: document.getElementById("menuHelpDescription"),
  menuAppsTitle: document.getElementById("menuAppsTitle"),
  menuAppsDescription: document.getElementById("menuAppsDescription"),
  menuVisualToolsTitle: document.getElementById("menuVisualToolsTitle"),
  menuVisualToolsDescription: document.getElementById("menuVisualToolsDescription"),
  workspaceStripLabel: document.getElementById("workspaceStripLabel"),
  editorPanelLabel: document.getElementById("editorPanelLabel"),
  editorPanelTitle: document.getElementById("editorPanelTitle"),
  eventLibraryLabel: document.getElementById("eventLibraryLabel"),
  searchPanelLabel: document.getElementById("searchPanelLabel"),
  searchPanelTitle: document.getElementById("searchPanelTitle"),
  searchSubmitButton: document.getElementById("searchSubmitButton"),
};

const timelineEvents = [];
const eventGroups = [];
const DAYS_PER_YEAR = 365.2425;
const SAFE_DATE_YEAR_LIMIT = 275000;
const MONTH_LABELS = {
  de: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const BAR_DEFAULT_COLOR = "#6f8f52";
const TIMELINE_PADDING_X = 80;
const TIMEMAP_FOLDER_EXPORT_VERSION = 1;
const POSITIVE_LANES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const NEGATIVE_LANES = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12];
const LANGUAGE_STORAGE_KEY = "timemap-language";
const LANGUAGE_OPTIONS = [
  { code: "de", label: "Deutsch", supported: true },
  { code: "en", label: "English", supported: true },
  { code: "bg", label: "Bulgarian", supported: false },
  { code: "cs", label: "Czech", supported: false },
  { code: "da", label: "Danish", supported: false },
  { code: "el", label: "Greek", supported: false },
  { code: "es", label: "Spanish", supported: false },
  { code: "et", label: "Estonian", supported: false },
  { code: "fi", label: "Finnish", supported: false },
  { code: "fr", label: "French", supported: false },
  { code: "ga", label: "Irish", supported: false },
  { code: "hr", label: "Croatian", supported: false },
  { code: "hu", label: "Hungarian", supported: false },
  { code: "it", label: "Italian", supported: false },
  { code: "lt", label: "Lithuanian", supported: false },
  { code: "lv", label: "Latvian", supported: false },
  { code: "mt", label: "Maltese", supported: false },
  { code: "nl", label: "Dutch", supported: false },
  { code: "pl", label: "Polish", supported: false },
  { code: "pt", label: "Portuguese", supported: false },
  { code: "ro", label: "Romanian", supported: false },
  { code: "sk", label: "Slovak", supported: false },
  { code: "sl", label: "Slovenian", supported: false },
  { code: "sv", label: "Swedish", supported: false },
  { code: "uk", label: "Ukrainian", supported: false },
];
const I18N = {
  de: {
    timeline_menu_open: "Menue oeffnen",
    timeline_menu_close: "Menue schliessen",
    timeline_menu: "Menue",
    timeline_menu_title: "Zeitstrahl-Menue",
    menu_language_title: "1. Sprachauswahl",
    menu_language_label: "Sprache",
    menu_language_description: "Deutsch und Englisch sind bereits funktional. Weitere EU-Sprachen plus Ukrainisch sind vorbereitet.",
    menu_help_title: "2. Hilfe zur Funktionsweise der App",
    menu_help_description: "Platz fuer eine kurze Einfuehrung, Bedienhinweise und erklaerende Beispiele.",
    menu_apps_title: "3. Wechsel zu anderen Applikationen",
    menu_apps_description: "Vorbereitung fuer weitere Werkzeuge wie GenMap zur Anzeige genealogischer GEDCOM-Dateien.",
    menu_visual_tools_title: "4. Weitere Data-Visualisation Tools",
    menu_visual_tools_description: "Bereich fuer kuenftige Module und alternative Visualisierungsansichten.",
    reset_view: "Startansicht",
    zoom_in: "Zoomen +",
    zoom_out: "Zoomen -",
    today: "Heute",
    timeline_aria: "Interaktiver historischer Zahlenstrahl",
    workspace_strip: "Ereignisbibliothek",
    fullscreen_toggle: "Vollbild umschalten",
    editor_panel_label: "Bearbeitung",
    editor_panel_title: "Ereignisbibliothek",
    editor_empty: "Fuege ueber die Suche rechts ein Wikidata-Ereignis hinzu oder waehle einen vorhandenen Eintrag aus dem Zeitstrahl.",
    event_library_label: "Ereignisbrowser",
    add_event: "Ereignis",
    add_folder: "Ordner",
    add_more: "Hinzufuegen",
    import: "Importieren",
    search_panel_label: "Wikidata-Suche",
    search_panel_title: "Eintraege finden und hinzufuegen",
    search_placeholder: "Wikidata durchsuchen",
    search_button: "Suchen",
    search_default: "Suche nach historischen Ereignissen, Personen, Epochen oder Bauwerken.",
    no_description: "Keine Beschreibung vorhanden.",
    no_event_selected: "Kein Ereignis ausgewaehlt",
    click_marker_hint: "Klicke auf einen Marker auf dem Zeitstrahl oder fuege rechts ein Wikidata-Element hinzu.",
    no_folder_assigned: "keinem Ordner zugeordnet",
    from: "Von",
    year: "Jahr",
    until: "Bis",
    range_instead_of_point: "Zeitraum statt Punkt",
    visible_from: "Sichtbar von",
    relation_none: "keine Zuordnung",
    line_none: "keine",
    line_solid: "durchgezogen",
    line_dotted: "gepunktet",
    arrow_down_right: "Pfeil nach unten / rechts",
    arrow_up_left: "Pfeil nach oben / links",
    arrow_both: "beidseitig",
    arrow_none: "ohne Pfeil",
    line: "Linie",
    arrows: "Pfeile",
    relation: "Zuordnung",
    display_line: "Strecke",
    display_bar: "Balken",
    display: "Darstellung",
    title: "Titel",
    category: "Kategorie",
    folder_or_epoch: "Ordner / Epoche",
    description: "Beschreibung",
    folder_name: "Ordnername",
    standard_visible_from: "Standard sichtbar von",
    inherit_folder: "vom Ordner erben",
    example_start: "z. B. 1789 oder -66 Ma",
    example_end: "z. B. 1799, -65 Ma oder heute",
    example_color: "vom Ordner erben oder z. B. #6f8f52",
    example_group_color: "z. B. #6f8f52",
    soon_suffix: "bald",
    no_year_data: "Jahresdaten fehlen",
    axis_point: "Achsenpunkt",
    color_pick_aria: "auswaehlen",
    no_limit: "keine Einschraenkung",
    automatic: "Automatisch",
    bar_upper_zero: "+0 fuer Balken",
    bar_lower_zero: "-0 unterhalb",
    above_suffix: "oberhalb",
    below_suffix: "unterhalb",
    uncategorized: "Unkategorisiert",
    no_default: "keine Vorgabe",
    color_value: "Farbwert",
    folder_color_value: "Standard-Farbwert",
    display_height: "Darstellungshoehe",
    folder_display_height: "Standard-Darstellungshoehe",
    contains_earth_history: "enthaelt Aeon, Aera, Periode und Epoche aus der lokalen Referenz",
    already_created: "bereits angelegt",
    loading_ranges_for: "Lade Zeitraeume fuer {title} aus Wikidata ...",
    loading_ranges_failed: "Zeitraeume fuer {title} konnten nicht automatisch geladen werden.",
    show_child_events: "Untergeordnete Ereignisse anzeigen",
    warning_missing_year_data: "Warnung: Jahresdaten fehlen",
    event_count_summary_zero: "Ordner ist leer",
    event_count_summary: "{events} Ereignisse, {folders} Unterordner",
    local_group: "lokale Gruppe",
    add_subfolder: "+ Unterordner",
    folder_properties: "Ordnereigenschaften",
    export_label: "Export",
    no_events_in_epoch: "Noch keine Ereignisse in dieser Epoche.",
    browser_info: "{events} Ereignisse, {folders} Ordner",
    browser_empty: "Noch keine Ereignisse oder Epochen vorhanden.",
    search_add_hint: "Haken setzen zum Hinzufuegen",
    search_added: "Bereits hinzugefuegt",
    import_failed: "Import fehlgeschlagen. Bitte eine gueltige TimeMap-JSON waehlen.",
    search_empty: "Noch keine Treffer. Starte oben eine Suche in Wikidata.",
    search_enter_query: "Bitte gib zuerst einen Suchbegriff ein.",
    search_loading: "Suche nach \"{query}\" in Wikidata ...",
    search_results_found: "{count} Treffer gefunden.",
    search_no_results: "Keine Treffer gefunden.",
    search_failed: "Die Wikidata-Suche konnte nicht geladen werden. Bitte spaeter erneut versuchen.",
    loading_result: "Lade {title} aus Wikidata ...",
    result_added: "{title} wurde hinzugefuegt und kann jetzt links bearbeitet werden.",
    result_no_years: "Zu {title} konnten keine brauchbaren Zeitdaten geladen werden.",
    folder_exported: "Ordner {title} wurde als JSON exportiert.",
    folder_imported: "Ordner {title} wurde importiert.",
    folder_imported_generic: "Ordner wurde importiert.",
    today_keyword: "heute",
    until_connector: "bis",
    new_event: "Neues Ereignis",
    new_folder: "Neuer Ordner",
  },
  en: {
    timeline_menu_open: "Open menu",
    timeline_menu_close: "Close menu",
    timeline_menu: "Menu",
    timeline_menu_title: "Timeline Menu",
    menu_language_title: "1. Language Selection",
    menu_language_label: "Language",
    menu_language_description: "German and English already work. Additional EU languages plus Ukrainian are prepared.",
    menu_help_title: "2. How the App Works",
    menu_help_description: "Space for a short introduction, usage notes, and explanatory examples.",
    menu_apps_title: "3. Switch to Other Applications",
    menu_apps_description: "Preparation for additional tools such as GenMap for displaying genealogical GEDCOM files.",
    menu_visual_tools_title: "4. Additional Data Visualization Tools",
    menu_visual_tools_description: "Area for future modules and alternative visualization views.",
    reset_view: "Reset View",
    zoom_in: "Zoom +",
    zoom_out: "Zoom -",
    today: "Today",
    timeline_aria: "Interactive historical timeline",
    workspace_strip: "Event Library",
    fullscreen_toggle: "Toggle fullscreen",
    editor_panel_label: "Editing",
    editor_panel_title: "Event Library",
    editor_empty: "Use the search on the right to add a Wikidata event or choose an existing item from the timeline.",
    event_library_label: "Event Browser",
    add_event: "Event",
    add_folder: "Folder",
    add_more: "Add",
    import: "Import",
    search_panel_label: "Wikidata Search",
    search_panel_title: "Find and add entries",
    search_placeholder: "Search Wikidata",
    search_button: "Search",
    search_default: "Search for historical events, people, epochs, or buildings.",
    no_description: "No description available.",
    no_event_selected: "No event selected",
    click_marker_hint: "Click a marker on the timeline or add a Wikidata item on the right.",
    no_folder_assigned: "no folder assigned",
    from: "From",
    year: "Year",
    until: "To",
    range_instead_of_point: "Range instead of point",
    visible_from: "Visible from",
    relation_none: "no assignment",
    line_none: "none",
    line_solid: "solid",
    line_dotted: "dotted",
    arrow_down_right: "arrow down / right",
    arrow_up_left: "arrow up / left",
    arrow_both: "both directions",
    arrow_none: "no arrow",
    line: "Line",
    arrows: "Arrows",
    relation: "Assignment",
    display_line: "Line",
    display_bar: "Bar",
    display: "Display",
    title: "Title",
    category: "Category",
    folder_or_epoch: "Folder / Epoch",
    description: "Description",
    folder_name: "Folder name",
    standard_visible_from: "Standard visible from",
    inherit_folder: "inherit from folder",
    example_start: "e.g. 1789 or -66 Ma",
    example_end: "e.g. 1799, -65 Ma or today",
    example_color: "inherit from folder or e.g. #6f8f52",
    example_group_color: "e.g. #6f8f52",
    soon_suffix: "soon",
    no_year_data: "Year data missing",
    axis_point: "Axis point",
    color_pick_aria: "pick",
    no_limit: "no limit",
    automatic: "Automatic",
    bar_upper_zero: "+0 for bars",
    bar_lower_zero: "-0 below",
    above_suffix: "above",
    below_suffix: "below",
    uncategorized: "Uncategorized",
    no_default: "no default",
    color_value: "Color",
    folder_color_value: "Default color",
    display_height: "Display height",
    folder_display_height: "Default display height",
    contains_earth_history: "contains aeon, era, period, and epoch from the local reference",
    already_created: "already created",
    loading_ranges_for: "Loading date ranges for {title} from Wikidata ...",
    loading_ranges_failed: "Date ranges for {title} could not be loaded automatically.",
    show_child_events: "Show subordinate events",
    warning_missing_year_data: "Warning: year data missing",
    event_count_summary_zero: "Folder is empty",
    event_count_summary: "{events} events, {folders} subfolders",
    local_group: "local group",
    add_subfolder: "+ Subfolder",
    folder_properties: "Folder properties",
    export_label: "Export",
    no_events_in_epoch: "No events in this epoch yet.",
    browser_info: "{events} events, {folders} folders",
    browser_empty: "No events or epochs yet.",
    search_add_hint: "Tick to add",
    search_added: "Already added",
    import_failed: "Import failed. Please choose a valid TimeMap JSON file.",
    search_empty: "No results yet. Start a Wikidata search above.",
    search_enter_query: "Please enter a search term first.",
    search_loading: "Searching Wikidata for \"{query}\" ...",
    search_results_found: "{count} results found.",
    search_no_results: "No results found.",
    search_failed: "Wikidata search could not be loaded. Please try again later.",
    loading_result: "Loading {title} from Wikidata ...",
    result_added: "{title} was added and can now be edited on the left.",
    result_no_years: "No usable date data could be loaded for {title}.",
    folder_exported: "Folder {title} was exported as JSON.",
    folder_imported: "Folder {title} was imported.",
    folder_imported_generic: "Folder imported.",
    today_keyword: "today",
    until_connector: "to",
    new_event: "New event",
    new_folder: "New folder",
  },
};
const EARTH_HISTORY_PRESET = {
  id: "earth-history",
  title: "Erdzeitalter",
  sourceId: "Q43521",
  description: "Hierarchische Erdzeitalter-Struktur auf Basis einer lokalen Wikidata-Referenz.",
  typeLabels: {
    eon: "Aeon",
    era: "Aera",
    period: "Periode",
    epoch: "Epoche",
  },
  typeQids: {
    eon: "Q186588",
    era: "Q6428674",
    period: "Q713623",
    epoch: "Q200950",
  },
  defaultZoomByType: {
    epoch: { min: 1000000, max: 5000000 },
    period: { min: 10000000, max: 50000000 },
    era: { min: 100000000, max: 200000000 },
    eon: { min: 500000000, max: 1000000000 },
  },
  itemsByType: {
    eon: [
      { qid: "Q104168", name: "Archean" },
      { qid: "Q104460", name: "Hadean" },
      { qid: "Q101313", name: "Phanerozoic" },
      { qid: "Q104162", name: "Proterozoic" },
    ],
    era: [
      { qid: "Q102416", name: "Cenozoic" },
      { qid: "Q731470", name: "Eoarchean" },
      { qid: "Q607992", name: "Mesoarchean" },
      { qid: "Q210611", name: "Mesoproterozoic" },
      { qid: "Q83222", name: "Mesozoic" },
      { qid: "Q645135", name: "Neoarchean" },
      { qid: "Q191935", name: "Neoproterozoic" },
      { qid: "Q738167", name: "Paleoarchean" },
      { qid: "Q193738", name: "Paleoproterozoic" },
      { qid: "Q75507", name: "Paleozoic" },
    ],
    period: [
      { qid: "Q876805", name: "Calymmian" },
      { qid: "Q79064", name: "Cambrian" },
      { qid: "Q133738", name: "Carboniferous" },
      { qid: "Q44626", name: "Cretaceous" },
      { qid: "Q507402", name: "Cryogenian" },
      { qid: "Q65955", name: "Devonian" },
      { qid: "Q367597", name: "Ectasian" },
      { qid: "Q188654", name: "Ediacaran" },
      { qid: "Q45805", name: "Jurassic" },
      { qid: "Q103924", name: "Neogene" },
      { qid: "Q62100", name: "Ordovician" },
      { qid: "Q597383", name: "Orosirian" },
      { qid: "Q55810", name: "Paleogene" },
      { qid: "Q76402", name: "Permian" },
      { qid: "Q26185", name: "Quaternary" },
      { qid: "Q870511", name: "Rhyacian" },
      { qid: "Q870498", name: "Siderian" },
      { qid: "Q62412", name: "Silurian" },
      { qid: "Q684942", name: "Statherian" },
      { qid: "Q776333", name: "Stenian" },
      { qid: "Q743343", name: "Tonian" },
      { qid: "Q47158", name: "Triassic" },
    ],
    epoch: [
      { qid: "Q5025303", name: "Cambrian Series 2" },
      { qid: "Q642169", name: "Cisuralian" },
      { qid: "Q752187", name: "Early Cretaceous" },
      { qid: "Q731293", name: "Early Devonian" },
      { qid: "Q284787", name: "Early Jurassic" },
      { qid: "Q131586993", name: "Early Mississippian" },
      { qid: "Q10739169", name: "Early Ordovician" },
      { qid: "Q131599313", name: "Early Pennsylvanian" },
      { qid: "Q1075885", name: "Early Triassic" },
      { qid: "Q76274", name: "Eocene" },
      { qid: "Q1269670", name: "Furongian" },
      { qid: "Q1077376", name: "Guadalupian" },
      { qid: "Q25445", name: "Holocene" },
      { qid: "Q338199", name: "Late Cretaceous" },
      { qid: "Q10265844", name: "Late Devonian" },
      { qid: "Q499312", name: "Late Jurassic" },
      { qid: "Q131589534", name: "Late Mississippian" },
      { qid: "Q13389115", name: "Late Ordovician" },
      { qid: "Q19355626", name: "Late Pennsylvanian" },
      { qid: "Q917293", name: "Late Triassic" },
      { qid: "Q1187992", name: "Llandovery" },
      { qid: "Q1077390", name: "Lopingian" },
      { qid: "Q1065155", name: "Ludlow" },
      { qid: "Q5025304", name: "Miaolingian" },
      { qid: "Q731313", name: "Middle Devonian" },
      { qid: "Q500054", name: "Middle Jurassic" },
      { qid: "Q17303775", name: "Middle Mississippian" },
      { qid: "Q13389102", name: "Middle Ordovician" },
      { qid: "Q131596837", name: "Middle Pennsylvanian" },
      { qid: "Q929395", name: "Middle Triassic" },
      { qid: "Q76267", name: "Miocene" },
      { qid: "Q101873", name: "Oligocene" },
      { qid: "Q76252", name: "Paleocene" },
      { qid: "Q25546", name: "Pleistocene" },
      { qid: "Q76259", name: "Pliocene" },
      { qid: "Q1062563", name: "Pridoli" },
      { qid: "Q515287", name: "Terreneuvian" },
      { qid: "Q1064996", name: "Wenlock" },
    ],
  },
};

const scaleSteps = [
  { id: "1d", unit: "day", amount: 1, years: 1 / DAYS_PER_YEAR },
  { id: "1m", unit: "month", amount: 1, years: 1 / 12 },
  { id: "1a", unit: "year", amount: 1, years: 1 },
  { id: "2a", unit: "year", amount: 2, years: 2 },
  { id: "5a", unit: "year", amount: 5, years: 5 },
  { id: "10a", unit: "year", amount: 10, years: 10 },
  { id: "20a", unit: "year", amount: 20, years: 20 },
  { id: "50a", unit: "year", amount: 50, years: 50 },
  { id: "100a", unit: "year", amount: 100, years: 100 },
  { id: "200a", unit: "year", amount: 200, years: 200 },
  { id: "500a", unit: "year", amount: 500, years: 500 },
  { id: "1ka", unit: "year", amount: 1000, years: 1000 },
  { id: "2ka", unit: "year", amount: 2000, years: 2000 },
  { id: "5ka", unit: "year", amount: 5000, years: 5000 },
  { id: "10ka", unit: "year", amount: 10000, years: 10000 },
  { id: "20ka", unit: "year", amount: 20000, years: 20000 },
  { id: "50ka", unit: "year", amount: 50000, years: 50000 },
  { id: "100ka", unit: "year", amount: 100000, years: 100000 },
  { id: "200ka", unit: "year", amount: 200000, years: 200000 },
  { id: "500ka", unit: "year", amount: 500000, years: 500000 },
  { id: "1Ma", unit: "year", amount: 1000000, years: 1000000 },
  { id: "2Ma", unit: "year", amount: 2000000, years: 2000000 },
  { id: "5Ma", unit: "year", amount: 5000000, years: 5000000 },
  { id: "10Ma", unit: "year", amount: 10000000, years: 10000000 },
  { id: "20Ma", unit: "year", amount: 20000000, years: 20000000 },
  { id: "50Ma", unit: "year", amount: 50000000, years: 50000000 },
  { id: "100Ma", unit: "year", amount: 100000000, years: 100000000 },
  { id: "200Ma", unit: "year", amount: 200000000, years: 200000000 },
  { id: "500Ma", unit: "year", amount: 500000000, years: 500000000 },
  { id: "1Ga", unit: "year", amount: 1000000000, years: 1000000000 },
];

const state = {
  centerYear: getNowTimelineValue(),
  stepIndex: scaleSteps.findIndex((step) => step.id === "1a"),
  selectedEventId: null,
  openEditorId: null,
  openGroupEditorId: null,
  width: 0,
  height: 0,
  tickCount: 0,
  anchorDetailsOnScrollBack: false,
  snappingBackToTimeline: false,
  resizeFrame: 0,
  searchResults: [],
  pendingAdds: new Set(),
  tooltipEventId: null,
  clickTimer: null,
  lastClickEventId: null,
  lastClickTime: 0,
  showEpochMenu: false,
  showTodayMarker: false,
  selectedTickValue: null,
  subYearTickAnchorValue: null,
  dragState: null,
  browserDragEventId: null,
  suppressClickUntil: 0,
  timelineMenuOpen: false,
  language: "de",
};

if (ui.addCustomEventButton) {
  ui.addCustomEventButton.classList.add("add-action-button");
  ui.addCustomEventButton.innerHTML = '<span class="add-action-plus">+</span><span>Ereignis</span>';
}

if (ui.addFolderButton) {
  ui.addFolderButton.classList.add("add-action-button");
  ui.addFolderButton.innerHTML = '<span class="add-action-plus">+</span><span>Ordner</span>';
}

if (ui.addEpochGroupButton) {
  ui.addEpochGroupButton.classList.add("add-action-button");
  ui.addEpochGroupButton.innerHTML = '<span class="add-action-plus">+</span><span>Hinzufügen</span>';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function t(key) {
  return I18N[state.language]?.[key] ?? I18N.de[key] ?? key;
}

function tf(key, replacements = {}) {
  let text = t(key);
  Object.entries(replacements).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function getMonthLabels() {
  return MONTH_LABELS[state.language] ?? MONTH_LABELS.de;
}

function getWikidataLanguageCode() {
  return state.language === "en" ? "en" : "de";
}

function getWikidataLanguageFallbacks() {
  const primary = getWikidataLanguageCode();
  return primary === "de" ? "de|en" : "en|de";
}

function getUiSortLocale() {
  return state.language === "en" ? "en" : "de";
}

function loadLanguagePreference() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && I18N[saved]) {
      state.language = saved;
    }
  } catch {
    state.language = "de";
  }
}

function saveLanguagePreference() {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
  } catch {
    // Ignore storage failures.
  }
}

function populateLanguageSelect() {
  if (!ui.languageSelect) return;
  ui.languageSelect.replaceChildren();
  LANGUAGE_OPTIONS.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.code;
    option.textContent = language.supported ? language.label : `${language.label} (${t("soon_suffix")})`;
    option.disabled = !language.supported;
    option.selected = language.code === state.language;
    ui.languageSelect.appendChild(option);
  });
}

function applyStaticTranslations() {
  document.title = "TimeMap";
  document.documentElement.lang = state.language;
  ui.timelineMenuButton?.setAttribute("aria-label", t("timeline_menu_open"));
  ui.timelineMenuCloseButton?.setAttribute("aria-label", t("timeline_menu_close"));
  svg?.setAttribute("aria-label", t("timeline_aria"));
  ui.fullscreenButton?.setAttribute("aria-label", t("fullscreen_toggle"));
  ui.openWorkspaceStrip?.setAttribute("aria-label", t("workspace_strip"));
  if (ui.timelineMenuLabel) ui.timelineMenuLabel.textContent = t("timeline_menu");
  if (ui.timelineMenuTitle) ui.timelineMenuTitle.textContent = t("timeline_menu_title");
  if (ui.menuLanguageTitle) ui.menuLanguageTitle.textContent = t("menu_language_title");
  if (ui.menuLanguageLabel) ui.menuLanguageLabel.textContent = t("menu_language_label");
  if (ui.menuLanguageDescription) ui.menuLanguageDescription.textContent = t("menu_language_description");
  if (ui.menuHelpTitle) ui.menuHelpTitle.textContent = t("menu_help_title");
  if (ui.menuHelpDescription) ui.menuHelpDescription.textContent = t("menu_help_description");
  if (ui.menuAppsTitle) ui.menuAppsTitle.textContent = t("menu_apps_title");
  if (ui.menuAppsDescription) ui.menuAppsDescription.textContent = t("menu_apps_description");
  if (ui.menuVisualToolsTitle) ui.menuVisualToolsTitle.textContent = t("menu_visual_tools_title");
  if (ui.menuVisualToolsDescription) ui.menuVisualToolsDescription.textContent = t("menu_visual_tools_description");
  if (ui.resetViewButton) ui.resetViewButton.textContent = t("reset_view");
  if (ui.zoomInButton) ui.zoomInButton.textContent = t("zoom_in");
  if (ui.zoomOutButton) ui.zoomOutButton.textContent = t("zoom_out");
  if (ui.focusNowButton) ui.focusNowButton.textContent = t("today");
  if (ui.workspaceStripLabel) ui.workspaceStripLabel.textContent = t("workspace_strip");
  if (ui.editorPanelLabel) ui.editorPanelLabel.textContent = t("editor_panel_label");
  if (ui.editorPanelTitle) ui.editorPanelTitle.textContent = t("editor_panel_title");
  if (ui.editorEmptyState) ui.editorEmptyState.textContent = t("editor_empty");
  if (ui.eventLibraryLabel) ui.eventLibraryLabel.textContent = t("event_library_label");
  if (ui.addCustomEventButton) ui.addCustomEventButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_event")}</span>`;
  if (ui.addFolderButton) ui.addFolderButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_folder")}</span>`;
  if (ui.addEpochGroupButton) ui.addEpochGroupButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_more")}</span>`;
  if (ui.importFolderButton) ui.importFolderButton.textContent = t("import");
  if (ui.searchPanelLabel) ui.searchPanelLabel.textContent = t("search_panel_label");
  if (ui.searchPanelTitle) ui.searchPanelTitle.textContent = t("search_panel_title");
  if (ui.searchInput) ui.searchInput.placeholder = t("search_placeholder");
  if (ui.searchSubmitButton) ui.searchSubmitButton.textContent = t("search_button");
  if (ui.searchStatus && !state.searchResults.length) ui.searchStatus.textContent = t("search_default");
}

async function applyLanguage(languageCode) {
  state.language = I18N[languageCode] ? languageCode : "de";
  saveLanguagePreference();
  populateLanguageSelect();
  applyStaticTranslations();
  await refreshLocalizedWikidataContent();
  renderEpochMenu();
  renderEventList();
  renderSearchResults();
  updateSelectionPanel();
  drawTimeline();
}

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });
  return element;
}

function getNowTimelineValue() {
  return dateToTimelineValue(new Date());
}

function isSafeDateYear(year) {
  return Number.isFinite(year) && Math.abs(year) <= SAFE_DATE_YEAR_LIMIT;
}

function dateToTimelineValue(date) {
  const year = date.getUTCFullYear();
  if (!isSafeDateYear(year) || !isSafeDateYear(year + 1)) {
    return year;
  }
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return year + ((date.getTime() - start) / Math.max(1, end - start));
}

function timelineValueToDate(value) {
  if (!Number.isFinite(value)) return null;
  const year = Math.floor(value);
  if (!isSafeDateYear(year) || !isSafeDateYear(year + 1)) {
    return null;
  }
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const ms = Math.round(start + (value - year) * (end - start));
  return new Date(ms);
}

function buildTimelineValue(year, month = 1, day = 1) {
  if (!isSafeDateYear(year) || !isSafeDateYear(year + 1)) {
    return year;
  }
  const date = new Date(Date.UTC(year, Math.max(0, month - 1), Math.max(1, day)));
  return dateToTimelineValue(date);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function createHtmlTitleContent(eventItem, titleTag = "strong") {
  const wrapper = document.createElement("span");
  wrapper.className = "title-content";

  if (isWarCategory(eventItem.category)) {
    const prefix = document.createElement("span");
    prefix.className = "title-prefix title-prefix-text";
    prefix.textContent = "⚔️";
    wrapper.appendChild(prefix);
  } else if (isFlagCategory(eventItem.category) && eventItem.flagImageUrl) {
    const flag = document.createElement("img");
    flag.className = "title-prefix title-prefix-flag";
    flag.src = eventItem.flagImageUrl;
    flag.alt = "";
    wrapper.appendChild(flag);
  }

  const title = document.createElement(titleTag);
  title.textContent = eventItem.title;
  wrapper.appendChild(title);
  return wrapper;
}

function estimateLabelWidth(eventItem) {
  const baseWidth = Math.max(24, eventItem.title.length * 7);
  if (isWarCategory(eventItem.category)) return baseWidth + 18;
  if (isFlagCategory(eventItem.category) && eventItem.flagImageUrl) return baseWidth + 18;
  return baseWidth;
}

function drawSvgLabelWithPrefix(eventItem, centerX, baselineY, options = {}) {
  const {
    fill = "#a4b0b8",
    fontSize = 13,
    fontWeight = 400,
    align = "above",
  } = options;

  const group = createSvgElement("g");
  let currentX = 0;

  if (isWarCategory(eventItem.category)) {
    const prefix = createSvgElement("text", {
      x: currentX,
      y: baselineY,
      fill,
      "font-size": fontSize,
      "font-family": "Segoe UI Emoji, Segoe UI, Arial, sans-serif",
      "font-weight": fontWeight,
      "text-anchor": "start",
    });
    prefix.textContent = "⚔️";
    group.appendChild(prefix);
    currentX += 16;
  } else if (isFlagCategory(eventItem.category) && eventItem.flagImageUrl) {
    const imageY = align === "above" ? baselineY - fontSize + 1 : baselineY - fontSize + 1;
    const image = createSvgElement("image", {
      href: eventItem.flagImageUrl,
      x: currentX,
      y: imageY,
      width: 12,
      height: 12,
      preserveAspectRatio: "xMidYMid meet",
    });
    group.appendChild(image);
    currentX += 16;
  }

  const text = createSvgElement("text", {
    x: currentX,
    y: baselineY,
    fill,
    "font-size": fontSize,
    "font-family": "Segoe UI, Arial, sans-serif",
    "font-weight": fontWeight,
    "text-anchor": "start",
  });
  text.textContent = eventItem.title;
  group.appendChild(text);
  svg.appendChild(group);

  try {
    const box = group.getBBox();
    const offsetX = centerX - (box.x + box.width / 2);
    group.setAttribute("transform", `translate(${offsetX} 0)`);
  } catch {
    const fallbackWidth = estimateLabelWidth(eventItem);
    group.setAttribute("transform", `translate(${centerX - fallbackWidth / 2} 0)`);
  }
}

function getStep() {
  return scaleSteps[state.stepIndex];
}

function getStepYears(step = getStep()) {
  return step.years;
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

function normalizeCategory(category) {
  return String(category ?? "").trim().toLowerCase();
}

function isWarCategory(category) {
  return normalizeCategory(category) === "krieg";
}

function isFlagCategory(category) {
  const normalized = normalizeCategory(category);
  return normalized === "staat" || normalized === "herrschaft";
}

function buildCommonsFileUrl(fileName) {
  if (!fileName) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

function yearToLabel(year) {
  const historicalYear = toHistoricalYear(Math.round(year));
  const absoluteYear = Math.abs(historicalYear);
  const sign = historicalYear < 0 ? "-" : "";
  if (absoluteYear >= 1000000000) return `${sign}${trimNumber(absoluteYear / 1000000000)} Ga`;
  if (absoluteYear >= 1000000) return `${sign}${trimNumber(absoluteYear / 1000000)} Ma`;
  if (absoluteYear >= 10000) return `${sign}${trimNumber(absoluteYear / 1000)} ka`;
  return String(historicalYear);
}

function yearToEditorValue(year) {
  if (!Number.isFinite(year)) return "";
  const roundedYear = Math.round(year);
  const absoluteYear = Math.abs(roundedYear);
  if (absoluteYear >= 1000000000) return `${trimNumber(roundedYear / 1000000000)} Ga`;
  if (absoluteYear >= 1000000) return `${trimNumber(roundedYear / 1000000)} Ma`;
  if (absoluteYear >= 10000) return `${trimNumber(roundedYear / 1000)} ka`;
  return String(toHistoricalYear(roundedYear));
}

function isTodayKeyword(rawValue) {
  const normalized = String(rawValue ?? "").trim().toLowerCase();
  return normalized === "heute" || normalized === "today";
}

function parseEditorYearValue(rawValue) {
  const normalized = String(rawValue ?? "").trim().replace(",", ".");
  if (!normalized) return NaN;
  if (isTodayKeyword(normalized)) return getNowTimelineValue();

  const match = normalized.match(/^([+-]?\d+(?:\.\d+)?)\s*([a-zA-Z]+)?$/);
  if (!match) return NaN;

  const numericValue = Number(match[1]);
  if (!Number.isFinite(numericValue)) return NaN;

  const unit = (match[2] ?? "a").toLowerCase();
  const multipliers = {
    a: 1,
    ka: 1000,
    ma: 1000000,
    ga: 1000000000,
  };
  const multiplier = multipliers[unit];
  if (!multiplier) return NaN;

  if (unit === "a") {
    return toAstronomicalYear(Math.round(numericValue));
  }
  return Math.round(numericValue * multiplier);
}

function stepToLabel(step) {
  if (step.unit === "day") return `${step.amount} d`;
  if (step.unit === "month") return `${step.amount} mo`;
  if (step.amount >= 1000000000) return `${trimNumber(step.amount / 1000000000)} Ga`;
  if (step.amount >= 1000000) return `${trimNumber(step.amount / 1000000)} Ma`;
  if (step.amount >= 1000) return `${trimNumber(step.amount / 1000)} ka`;
  return `${trimNumber(step.amount)} a`;
}

function roundCenterYearToStep(centerYear, step) {
  if (step.unit === "day") {
    const date = timelineValueToDate(centerYear);
    if (!date) return centerYear;
    const dayStart = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ));
    return dateToTimelineValue(dayStart);
  }

  if (step.unit === "month") {
    const date = timelineValueToDate(centerYear);
    if (!date) return centerYear;
    const monthIndex = date.getUTCMonth();
    const roundedMonth = Math.round(monthIndex / step.amount) * step.amount;
    const roundedDate = new Date(Date.UTC(date.getUTCFullYear(), roundedMonth, 1));
    return dateToTimelineValue(roundedDate);
  }

  const historicalYear = toHistoricalYear(centerYear);
  let roundedHistoricalYear = Math.round(historicalYear / step.amount) * step.amount;
  if (roundedHistoricalYear === 0) {
    roundedHistoricalYear = historicalYear < 0 ? -step.amount : step.amount;
  }
  return toAstronomicalYear(roundedHistoricalYear);
}

function getTimelineValueForEventStart(eventItem) {
  if (Number.isFinite(eventItem.startDateValue)) return eventItem.startDateValue;
  return Number.isFinite(eventItem.startYear) ? eventItem.startYear : null;
}

function getTimelineValueForEventEnd(eventItem) {
  if (eventItem?.endIsToday) return getNowTimelineValue();
  if (Number.isFinite(eventItem.endDateValue)) return eventItem.endDateValue;
  if (Number.isFinite(eventItem.endYear)) return eventItem.endYear;
  if (Number.isFinite(eventItem.startDateValue)) return eventItem.startDateValue;
  return Number.isFinite(eventItem.startYear) ? eventItem.startYear : null;
}

function formatBoundaryLabel(eventItem, edge) {
  if (edge === "end" && eventItem?.endIsToday) return t("today_keyword");
  const value = edge === "end" ? getTimelineValueForEventEnd(eventItem) : getTimelineValueForEventStart(eventItem);
  const precision = edge === "end" ? eventItem.endPrecision : eventItem.startPrecision;
  if (!Number.isFinite(value)) return "?";
  if (precision >= 11) {
    const date = timelineValueToDate(value);
    if (date) {
      return `${padNumber(date.getUTCDate())}.${padNumber(date.getUTCMonth() + 1)}.${toHistoricalYear(date.getUTCFullYear())}`;
    }
  }
  if (precision >= 10) {
    const date = timelineValueToDate(value);
    if (date) {
      return `${getMonthLabels()[date.getUTCMonth()]} ${toHistoricalYear(date.getUTCFullYear())}`;
    }
  }
  return yearToLabel(value);
}

function getTickLabel(value, step, majorTick = false) {
  if (step.unit === "day") {
    const date = timelineValueToDate(value);
    if (date) {
      return `${padNumber(date.getUTCDate())}.${padNumber(date.getUTCMonth() + 1)}.${toHistoricalYear(date.getUTCFullYear())}`;
    }
  }

  if (step.unit === "month") {
    const date = timelineValueToDate(value);
    if (date) {
      return `${getMonthLabels()[date.getUTCMonth()]} ${toHistoricalYear(date.getUTCFullYear())}`;
    }
  }

  return yearToLabel(value);
}

function getEventById(eventId) {
  return timelineEvents.find((eventItem) => eventItem.id === eventId) ?? null;
}

function getGroupById(groupId) {
  return eventGroups.find((groupItem) => groupItem.id === groupId) ?? null;
}

function getChildGroups(parentGroupId) {
  return eventGroups
    .filter((groupItem) => groupItem.parentGroupId === parentGroupId)
    .sort((left, right) => left.title.localeCompare(right.title, getUiSortLocale()));
}

function getRootGroups() {
  return getChildGroups(null);
}

function getAssignableGroups() {
  return [...eventGroups].sort((left, right) => left.title.localeCompare(right.title, getUiSortLocale()));
}

function getEventsForGroup(groupId) {
  return timelineEvents
    .filter((eventItem) => eventItem.groupId === groupId)
    .sort((left, right) => {
      const leftYear = Number.isFinite(getTimelineValueForEventStart(left))
        ? getTimelineValueForEventStart(left)
        : Number.POSITIVE_INFINITY;
      const rightYear = Number.isFinite(getTimelineValueForEventStart(right))
        ? getTimelineValueForEventStart(right)
        : Number.POSITIVE_INFINITY;
      return leftYear - rightYear;
    });
}

function getUngroupedEvents() {
  return timelineEvents
    .filter((eventItem) => !eventItem.groupId)
    .sort((left, right) => {
      const leftYear = Number.isFinite(getTimelineValueForEventStart(left))
        ? getTimelineValueForEventStart(left)
        : Number.POSITIVE_INFINITY;
      const rightYear = Number.isFinite(getTimelineValueForEventStart(right))
        ? getTimelineValueForEventStart(right)
        : Number.POSITIVE_INFINITY;
      return leftYear - rightYear;
    });
}

function getDescendantGroupIds(groupId) {
  const result = [];
  const stack = [groupId];
  while (stack.length > 0) {
    const currentId = stack.pop();
    result.push(currentId);
    getChildGroups(currentId).forEach((groupItem) => {
      stack.push(groupItem.id);
    });
  }
  return result;
}

function getGroupEventsDeep(groupId) {
  const descendantIds = new Set(getDescendantGroupIds(groupId));
  return timelineEvents.filter((eventItem) => descendantIds.has(eventItem.groupId));
}

function getAssignableParentEvents(eventItem) {
  if (!eventItem?.groupId) return [];
  return getEventsForGroup(eventItem.groupId)
    .filter((candidate) => candidate.id !== eventItem.id)
    .filter((candidate) => {
      let currentId = candidate.parentEventId;
      while (currentId) {
        if (currentId === eventItem.id) return false;
        currentId = getEventById(currentId)?.parentEventId ?? null;
      }
      return true;
    });
}

function sanitizeEventHierarchy() {
  timelineEvents.forEach((eventItem) => {
    if (!eventItem.parentEventId) return;
    const parentItem = getEventById(eventItem.parentEventId);
    if (!parentItem || parentItem.groupId !== eventItem.groupId) {
      eventItem.parentEventId = null;
      return;
    }

    const visitedIds = new Set([eventItem.id]);
    let currentItem = parentItem;
    while (currentItem) {
      if (visitedIds.has(currentItem.id)) {
        eventItem.parentEventId = null;
        return;
      }
      visitedIds.add(currentItem.id);
      currentItem = currentItem.parentEventId ? getEventById(currentItem.parentEventId) : null;
    }
  });
}

function setGroupEnabled(groupId, enabled) {
  const descendantIds = new Set(getDescendantGroupIds(groupId));
  eventGroups.forEach((groupItem) => {
    if (descendantIds.has(groupItem.id)) {
      groupItem.enabled = enabled;
    }
  });
  timelineEvents.forEach((eventItem) => {
    if (descendantIds.has(eventItem.groupId)) {
      eventItem.enabled = enabled;
    }
  });
}

function expandGroupAncestors(groupId) {
  let currentGroup = getGroupById(groupId);
  while (currentGroup) {
    currentGroup.expanded = true;
    currentGroup = currentGroup.parentGroupId ? getGroupById(currentGroup.parentGroupId) : null;
  }
}

function getGroupDepth(groupId) {
  let depth = 0;
  let currentGroup = getGroupById(groupId);
  while (currentGroup?.parentGroupId) {
    depth += 1;
    currentGroup = getGroupById(currentGroup.parentGroupId);
  }
  return depth;
}

function getRootGroupId(groupId) {
  let currentGroup = getGroupById(groupId);
  if (!currentGroup) return null;
  while (currentGroup.parentGroupId) {
    const parentGroup = getGroupById(currentGroup.parentGroupId);
    if (!parentGroup) break;
    currentGroup = parentGroup;
  }
  return currentGroup.id;
}

function canDropEventOnGroup(eventId, targetGroupId) {
  const eventItem = getEventById(eventId);
  const targetGroup = getGroupById(targetGroupId);
  if (!eventItem || !targetGroup || !eventItem.groupId) return false;
  if (!targetGroup.parentGroupId) return false;
  if (eventItem.groupId === targetGroupId) return false;
  return getRootGroupId(eventItem.groupId) === getRootGroupId(targetGroupId);
}

function getEventDescendantIds(eventId) {
  const result = [];
  const stack = [eventId];
  while (stack.length > 0) {
    const currentId = stack.pop();
    timelineEvents
      .filter((eventItem) => eventItem.parentEventId === currentId)
      .forEach((eventItem) => {
        result.push(eventItem.id);
        stack.push(eventItem.id);
      });
  }
  return result;
}

function canDropEventOnEvent(draggedEventId, targetEventId) {
  const draggedEvent = getEventById(draggedEventId);
  const targetEvent = getEventById(targetEventId);
  if (!draggedEvent || !targetEvent || draggedEvent.id === targetEvent.id) return false;
  if (!draggedEvent.groupId || !targetEvent.groupId) return false;
  if (getEventDescendantIds(draggedEvent.id).includes(targetEvent.id)) return false;
  return getRootGroupId(draggedEvent.groupId) === getRootGroupId(targetEvent.groupId);
}

function moveEventTreeToGroup(eventId, targetGroupId) {
  const ids = [eventId, ...getEventDescendantIds(eventId)];
  ids.forEach((id) => {
    const eventItem = getEventById(id);
    if (eventItem) eventItem.groupId = targetGroupId;
  });
}

function getGroupCheckboxState(groupId) {
  const groupItem = getGroupById(groupId);
  const descendantEvents = getGroupEventsDeep(groupId);
  if (!groupItem && descendantEvents.length === 0) {
    return { checked: false, indeterminate: false };
  }
  const eventEnabledValues = descendantEvents.map((eventItem) => eventItem.enabled);
  const groupEnabledValues = getDescendantGroupIds(groupId)
    .map((descendantId) => getGroupById(descendantId))
    .filter(Boolean)
    .map((candidate) => candidate.enabled !== false);
  const values = [...groupEnabledValues, ...eventEnabledValues];
  const allChecked = values.length === 0 ? (groupItem?.enabled !== false) : values.every(Boolean);
  const noneChecked = values.every((value) => !value);
  return {
    checked: allChecked,
    indeterminate: !allChecked && !noneChecked,
  };
}

function isRangeEvent(eventItem) {
  return Boolean(eventItem.isRange);
}

function getEventAnchorYear(eventItem) {
  const startValue = getTimelineValueForEventStart(eventItem);
  if (!isRangeEvent(eventItem)) {
    return startValue;
  }
  const endValue = getTimelineValueForEventEnd(eventItem);
  if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return startValue;
  return (startValue + endValue) / 2;
}

function getEventDateLabel(eventItem) {
  if (!isRangeEvent(eventItem)) {
    return formatBoundaryLabel(eventItem, "start");
  }
  return `${formatBoundaryLabel(eventItem, "start")} ${t("until_connector")} ${formatBoundaryLabel(eventItem, "end")}`;
}

function getVisibleRange() {
  const step = getStep();
  const halfTickCount = Math.floor(state.tickCount / 2);
  if (step.unit === "day") {
    const centerDate = timelineValueToDate(state.centerYear);
    if (centerDate) {
      const startDate = new Date(Date.UTC(
        centerDate.getUTCFullYear(),
        centerDate.getUTCMonth(),
        centerDate.getUTCDate() - halfTickCount * step.amount,
      ));
      const endDate = new Date(Date.UTC(
        centerDate.getUTCFullYear(),
        centerDate.getUTCMonth(),
        centerDate.getUTCDate() + halfTickCount * step.amount,
      ));
      return { start: dateToTimelineValue(startDate), end: dateToTimelineValue(endDate) };
    }
  }

  if (step.unit === "month") {
    const centerDate = timelineValueToDate(state.centerYear);
    if (centerDate) {
      const startDate = new Date(Date.UTC(
        centerDate.getUTCFullYear(),
        centerDate.getUTCMonth() - halfTickCount * step.amount,
        1,
      ));
      const endDate = new Date(Date.UTC(
        centerDate.getUTCFullYear(),
        centerDate.getUTCMonth() + halfTickCount * step.amount,
        1,
      ));
      return { start: dateToTimelineValue(startDate), end: dateToTimelineValue(endDate) };
    }
  }

  const halfRange = Math.floor(state.tickCount / 2) * getStepYears();
  return { start: state.centerYear - halfRange, end: state.centerYear + halfRange };
}

function getComparableTimelinePosition(value, step = getStep()) {
  if (step.unit === "year") return value;
  const date = timelineValueToDate(value);
  return date ? date.getTime() : value;
}

function alignTimelineValueToStepStart(value, step) {
  if (step.unit === "day") {
    const date = timelineValueToDate(value);
    if (!date) return value;
    return dateToTimelineValue(new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    )));
  }

  if (step.unit === "month") {
    const date = timelineValueToDate(value);
    if (!date) return value;
    return dateToTimelineValue(new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      1,
    )));
  }

  const year = Math.floor(value);
  return Math.floor(year / step.amount) * step.amount;
}

function shiftTimelineValueByStep(value, step, direction = 1) {
  if (step.unit === "day") {
    const date = timelineValueToDate(value);
    if (!date) return value + direction * getStepYears(step);
    const shifted = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + direction * step.amount,
    ));
    return dateToTimelineValue(shifted);
  }

  if (step.unit === "month") {
    const date = timelineValueToDate(value);
    if (!date) return value + direction * getStepYears(step);
    const shifted = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + direction * step.amount,
      1,
    ));
    return dateToTimelineValue(shifted);
  }

  return Math.round(value) + direction * step.amount;
}

function getTickAnchorValue(step = getStep()) {
  if (state.selectedTickValue != null) return state.selectedTickValue;
  if (step.unit !== "year" && state.subYearTickAnchorValue != null) {
    return state.subYearTickAnchorValue;
  }
  return alignTimelineValueToStepStart(state.centerYear, step);
}

function getTicks() {
  const step = getStep();
  if (step.unit === "year" || step.unit === "month") {
    const ticks = [];
    const halfTickCount = Math.floor(state.tickCount / 2);
    const anchor = getTickAnchorValue(step);
    let current = anchor;

    for (let index = 0; index < halfTickCount; index += 1) {
      current = shiftTimelineValueByStep(current, step, -1);
    }

    for (let index = 0; index < state.tickCount; index += 1) {
      ticks.push({
        index,
        slotIndex: index,
        year: current,
      });
      current = shiftTimelineValueByStep(current, step, 1);
    }

    return ticks;
  }

  const range = getVisibleRange();
  const ticks = [];
  const stepYears = getStepYears(step);
  const epsilon = Math.max(Number.EPSILON, stepYears / 10000);
  const anchor = getTickAnchorValue(step);

  let current = anchor;
  while (true) {
    const previous = shiftTimelineValueByStep(current, step, -1);
    if (!Number.isFinite(previous) || Math.abs(previous - current) < epsilon) break;
    if (previous < range.start - epsilon) break;
    current = previous;
  }

  for (let index = 0; index < 2048; index += 1) {
    if (current > range.end + epsilon) break;
    if (current >= range.start - epsilon && current <= range.end + epsilon) {
      ticks.push({
        index: ticks.length,
        year: current,
      });
    }
    const next = shiftTimelineValueByStep(current, step, 1);
    if (!Number.isFinite(next) || Math.abs(next - current) < epsilon) break;
    current = next;
  }

  return ticks;
}

function getTickX(tick) {
  if (tick && Number.isFinite(tick.slotIndex)) {
    const usableWidth = state.width - TIMELINE_PADDING_X * 2;
    const slotCount = Math.max(1, state.tickCount - 1);
    return TIMELINE_PADDING_X + (usableWidth * tick.slotIndex) / slotCount;
  }
  return Math.max(TIMELINE_PADDING_X, Math.min(state.width - TIMELINE_PADDING_X, getEventX(tick.year)));
}

function getClosestVisibleTickValue(targetValue = state.centerYear) {
  const ticks = getTicks();
  if (ticks.length === 0) return targetValue;
  return ticks.reduce((best, tick) => (
    best == null || Math.abs(tick.year - targetValue) < Math.abs(best - targetValue)
      ? tick.year
      : best
  ), null) ?? targetValue;
}

function isMajorTick(year) {
  const step = getStep();
  if (step.unit === "day") {
    const date = timelineValueToDate(year);
    return date ? date.getUTCDate() === 1 : false;
  }
  if (step.unit === "month") {
    const date = timelineValueToDate(year);
    return date ? date.getUTCMonth() === 0 : false;
  }
  const roundedYear = Math.round(year);
  const divisor = step.amount < 5 ? 5 : step.amount * 5;
  return roundedYear % divisor === 0;
}

function getEventX(year) {
  const step = getStep();
  const range = getVisibleRange();
  const usableWidth = state.width - TIMELINE_PADDING_X * 2;
  const startPosition = getComparableTimelinePosition(range.start, step);
  const endPosition = getComparableTimelinePosition(range.end, step);
  const valuePosition = getComparableTimelinePosition(year, step);
  const ratio = (valuePosition - startPosition) / Math.max(Number.EPSILON, endPosition - startPosition);
  return TIMELINE_PADDING_X + usableWidth * ratio;
}

function getTimelineRatioForClientX(clientX) {
  const rect = svg.getBoundingClientRect();
  const localX = clientX - rect.left;
  const usableWidth = Math.max(1, rect.width - TIMELINE_PADDING_X * 2);
  return clamp((localX - TIMELINE_PADDING_X) / usableWidth, 0, 1);
}

function getTimelineValueAtRatio(ratio) {
  const step = getStep();
  const range = getVisibleRange();
  if (step.unit !== "year") {
    const startPosition = getComparableTimelinePosition(range.start, step);
    const endPosition = getComparableTimelinePosition(range.end, step);
    const ms = startPosition + ratio * (endPosition - startPosition);
    return dateToTimelineValue(new Date(ms));
  }
  return range.start + ratio * (range.end - range.start);
}

function getRatioForTimelineValue(value) {
  const step = getStep();
  const range = getVisibleRange();
  if (step.unit !== "year") {
    const startPosition = getComparableTimelinePosition(range.start, step);
    const endPosition = getComparableTimelinePosition(range.end, step);
    const valuePosition = getComparableTimelinePosition(value, step);
    return clamp((valuePosition - startPosition) / Math.max(Number.EPSILON, endPosition - startPosition), 0, 1);
  }
  return clamp((value - range.start) / Math.max(Number.EPSILON, range.end - range.start), 0, 1);
}

function getEnabledEvents() {
  return timelineEvents.filter((eventItem) => eventItem.enabled);
}

function getTimelineLineY() {
  return state.height * 0.56;
}

function getInheritedGroupSetting(groupId, key) {
  let currentGroupId = groupId;
  while (currentGroupId) {
    const groupItem = getGroupById(currentGroupId);
    if (!groupItem) return undefined;
    if (groupItem[key] !== undefined) return groupItem[key];
    currentGroupId = groupItem.parentGroupId ?? null;
  }
  return undefined;
}

function getEffectiveEventSetting(eventItem, key) {
  if (eventItem[key] !== undefined) return eventItem[key];
  return getInheritedGroupSetting(eventItem.groupId, key);
}

function getEffectiveVisibleStepMin(eventItem) {
  const value = getEffectiveEventSetting(eventItem, "visibleStepMin");
  return value == null ? scaleSteps[0].years : value;
}

function getEffectiveVisibleStepMax(eventItem) {
  const value = getEffectiveEventSetting(eventItem, "visibleStepMax");
  return value == null ? scaleSteps[scaleSteps.length - 1].years : value;
}

function getEffectiveLane(eventItem) {
  const value = getEffectiveEventSetting(eventItem, "lane");
  if ((value === "+0" || value === "-0") && !isBarDisplay(eventItem)) return 1;
  return value === undefined ? undefined : value;
}

function getEffectiveColor(eventItem) {
  const value = getEffectiveEventSetting(eventItem, "color");
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getRelationStrokeDasharray(style) {
  return style === "dotted" ? "4 4" : null;
}

function getEventVisualBounds(eventItem, geometry) {
  if (!eventItem || !geometry) return null;
  if (isRangeEvent(eventItem)) {
    const horizontalPad = isBarDisplay(eventItem) ? 2 : 6;
    const verticalPad = isBarDisplay(eventItem) ? 7 : 0;
    return {
      left: Math.min(geometry.startX, geometry.endX) - horizontalPad,
      right: Math.max(geometry.startX, geometry.endX) + horizontalPad,
      top: geometry.markerY - verticalPad,
      bottom: geometry.markerY + verticalPad,
      centerX: geometry.anchorX,
      centerY: geometry.markerY,
    };
  }
  return {
    left: geometry.anchorX - 8,
    right: geometry.anchorX + 8,
    top: geometry.markerY - 8,
    bottom: geometry.markerY + 8,
    centerX: geometry.anchorX,
    centerY: geometry.markerY,
  };
}

function getRelationGeometry(parentItem, childItem, parentGeometry, childGeometry) {
  const parentBounds = getEventVisualBounds(parentItem, parentGeometry);
  const childBounds = getEventVisualBounds(childItem, childGeometry);
  if (!parentBounds || !childBounds) return null;

  const sameLevel = Math.abs(parentBounds.centerY - childBounds.centerY) <= 4;
  if (sameLevel) {
    const parentIsLeft = parentBounds.centerX <= childBounds.centerX;
    const startX = parentIsLeft ? parentBounds.right : parentBounds.left;
    const endX = parentIsLeft ? childBounds.left : childBounds.right;
    if (Math.abs(endX - startX) < 10) return null;
    return {
      orientation: "horizontal",
      x1: startX,
      y1: childBounds.centerY,
      x2: endX,
      y2: childBounds.centerY,
      parentBounds,
      childBounds,
    };
  }

  const overlapLeft = Math.max(parentBounds.left, childBounds.left);
  const overlapRight = Math.min(parentBounds.right, childBounds.right);
  if (overlapRight >= overlapLeft - 10) {
    const x = overlapRight >= overlapLeft ? (overlapLeft + overlapRight) / 2 : (parentBounds.centerX + childBounds.centerX) / 2;
    const parentIsAbove = parentBounds.centerY <= childBounds.centerY;
    return {
      orientation: "vertical",
      x1: x,
      y1: parentIsAbove ? parentBounds.bottom : parentBounds.top,
      x2: x,
      y2: parentIsAbove ? childBounds.top : childBounds.bottom,
      parentBounds,
      childBounds,
    };
  }

  return null;
}

function getTrimmedRelationLine(relationGeometry, direction) {
  const hasStartArrow = direction === "child-to-parent" || direction === "both";
  const hasEndArrow = direction === "parent-to-child" || direction === "both";
  const arrowGap = 7;
  const dx = relationGeometry.x2 - relationGeometry.x1;
  const dy = relationGeometry.y2 - relationGeometry.y1;
  const length = Math.hypot(dx, dy);
  if (!Number.isFinite(length) || length <= 1) return relationGeometry;

  const startGap = hasStartArrow ? arrowGap : 0;
  const endGap = hasEndArrow ? arrowGap : 0;
  if (length <= startGap + endGap + 4) return relationGeometry;

  const unitX = dx / length;
  const unitY = dy / length;
  return {
    ...relationGeometry,
    x1: relationGeometry.x1 + unitX * startGap,
    y1: relationGeometry.y1 + unitY * startGap,
    x2: relationGeometry.x2 - unitX * endGap,
    y2: relationGeometry.y2 - unitY * endGap,
  };
}

function isBarDisplay(eventItem) {
  return eventItem.displayMode === "bar";
}

function getBrowserGroups() {
  return getRootGroups();
}

function isEventVisibleAtCurrentZoom(eventItem) {
  const step = getStepYears();
  const min = getEffectiveVisibleStepMin(eventItem);
  const max = getEffectiveVisibleStepMax(eventItem);
  return step >= min && step <= max;
}

function getBarMarkerYForLane(lane, lineY) {
  const barZeroOffset = 20;
  const barLaneGap = 19;
  if (lane === "+0") return lineY - barZeroOffset;
  if (lane === "-0") return lineY + barLaneGap;
  if (typeof lane === "number" && lane > 0) {
    return lineY - (barZeroOffset + barLaneGap * lane);
  }
  if (typeof lane === "number" && lane < 0) {
    return lineY + barLaneGap * (Math.abs(lane) + 2);
  }
  return lineY - (barZeroOffset + barLaneGap);
}

function getLaneGeometry(eventItem, autoIndex, lineY) {
  const lane = getEffectiveLane(eventItem);

  if (isBarDisplay(eventItem)) {
    const barLane = lane == null ? "+0" : lane;
    if (barLane === "+0" || barLane === "-0" || typeof barLane === "number") {
      const markerY = getBarMarkerYForLane(barLane, lineY);
      return {
        markerY,
        labelY: markerY - 10,
      };
    }
  }

  const stackLevel = autoIndex % 6;
  const lineLane = typeof lane === "number" && lane !== 0
    ? lane
    : stackLevel + 1;
  const markerY = getBarMarkerYForLane(lineLane, lineY);
  return {
    markerY,
    labelY: markerY + (lineLane < 0 ? 28 : -14),
  };
}

function getMarkerYForFixedLane(lane, lineY) {
  return getBarMarkerYForLane(lane, lineY);
}

function getMarkerYForLineLane(lane, lineY) {
  return getBarMarkerYForLane(lane, lineY);
}

function getDraggableLanes(eventItem) {
  if (isBarDisplay(eventItem)) {
    return [...POSITIVE_LANES.slice().reverse(), "+0", "-0", ...NEGATIVE_LANES];
  }
  return [...POSITIVE_LANES.slice().reverse(), ...NEGATIVE_LANES];
}

function getNearestFixedLaneFromY(pointerY, eventItem) {
  const lineY = getTimelineLineY();
  let bestLane = isBarDisplay(eventItem) ? "+0" : 1;
  let bestDistance = Number.POSITIVE_INFINITY;

  getDraggableLanes(eventItem).forEach((lane) => {
    const laneY = getMarkerYForFixedLane(lane, lineY);
    const distance = Math.abs(pointerY - laneY);
    if (distance < bestDistance) {
      bestLane = lane;
      bestDistance = distance;
    }
  });

  return bestLane;
}

function normalizeEventDisplaySettings(eventItem) {
  if (!eventItem) return;
  eventItem.endIsToday = Boolean(eventItem.endIsToday);
  if (eventItem.displayMode === "bar" && (eventItem.lane === undefined || eventItem.lane === null)) {
    eventItem.lane = "+0";
  }
  if (eventItem.displayMode !== "bar" && eventItem.lane === "-0") {
    eventItem.lane = -1;
  }
  if (eventItem.displayMode !== "bar" && eventItem.lane === "+0") {
    eventItem.lane = 1;
  }
  if (!isRangeEvent(eventItem) && (eventItem.lane === "+0" || eventItem.lane === "-0")) {
    eventItem.lane = 1;
  }
}

function createSelectOption(value, label, selected) {
  const option = document.createElement("option");
  option.value = String(value);
  option.textContent = label;
  option.selected = selected;
  return option;
}

function createField(labelText, inputElement) {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(span, inputElement);
  return label;
}

function focusEditorNameField(kind, options = {}) {
  const { reveal = false, behavior = "smooth" } = options;
  window.requestAnimationFrame(() => {
    const selector = kind === "group"
      ? '.group-inline-editor [data-editor-name-field="group"]'
      : '.event-inline-editor [data-editor-name-field="event"]';
    const input = ui.eventList?.querySelector(selector);
    if (!input) return;
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
    input.select();
    if (reveal) {
      const editor = input.closest(".event-inline-editor");
      if (!editor) return;
      const targetTop = Math.max(0, getContainerScrollTopFor(editor) - 32);
      ui.appFrame.scrollTo({ top: targetTop, behavior });
    }
  });
}

function createColorField(labelText, textInput, onColorChange) {
  const label = document.createElement("label");
  label.className = "field compact-color-field";

  const controlsRow = document.createElement("div");
  controlsRow.className = "compact-color-row";
  const titleText = document.createElement("span");
  titleText.textContent = labelText;
  controlsRow.appendChild(titleText);

  const pickerButton = document.createElement("button");
  pickerButton.type = "button";
  pickerButton.className = "color-picker-button";
  pickerButton.setAttribute("aria-label", `${labelText} ${t("color_pick_aria")}`);
  const preview = document.createElement("span");
  preview.className = "color-preview";

  const pickerIcon = document.createElement("span");
  pickerIcon.className = "color-picker-icon";
  pickerIcon.textContent = "🎨";

  const palette = document.createElement("div");
  palette.className = "color-palette";
  palette.hidden = true;

  const swatches = [
    "#6f8f52", "#9ed3df", "#ffb347", "#ff8f5a",
    "#d16ba5", "#6c8cff", "#3fb68b", "#9aa5b1",
    "#c0a16b", "#7a4dff", "#c94c4c", "#ffffff",
  ];

  const applyPaletteValue = (value) => {
    textInput.value = value;
    onColorChange(value);
    updatePreview();
  };

  const updatePreview = () => {
    const value = String(textInput.value ?? "").trim();
    preview.style.background = value || "transparent";
    preview.classList.toggle("is-empty", !value);
  };

  swatches.forEach((value) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "color-swatch";
    swatch.style.background = value;
    swatch.setAttribute("aria-label", `Farbe ${value}`);
    swatch.addEventListener("click", (event) => {
      event.preventDefault();
      applyPaletteValue(value);
    });
    palette.appendChild(swatch);
  });

  const closePalette = () => {
    palette.hidden = true;
    document.removeEventListener("mousedown", handleDocumentPointerDown, true);
  };

  const openPalette = () => {
    palette.hidden = false;
    document.addEventListener("mousedown", handleDocumentPointerDown, true);
  };

  const togglePalette = () => {
    if (palette.hidden) {
      openPalette();
    } else {
      closePalette();
    }
  };

  function handleDocumentPointerDown(event) {
    if (label.contains(event.target)) {
      return;
    }
    closePalette();
  }

  pickerButton.addEventListener("click", (event) => {
    event.preventDefault();
    togglePalette();
  });

  textInput.addEventListener("input", updatePreview);
  textInput.addEventListener("change", updatePreview);
  pickerButton.appendChild(pickerIcon);
  controlsRow.append(textInput, preview, pickerButton);
  label.append(controlsRow, palette);
  updatePreview();
  return label;
}

function parseLaneValue(rawValue, { allowBarZero = false, allowBarNegativeZero = false, allowInherit = false } = {}) {
  const normalized = String(rawValue ?? "").trim();
  if (!normalized) return allowInherit ? undefined : null;
  if (normalized.toLowerCase() === "auto") return null;
  if (allowBarZero && normalized === "+0") return "+0";
  if (allowBarNegativeZero && normalized === "-0") return "-0";
  const numericValue = Number(normalized);
  if (!Number.isInteger(numericValue) || numericValue === 0) return null;
  if (POSITIVE_LANES.includes(numericValue) || NEGATIVE_LANES.includes(numericValue)) return numericValue;
  return null;
}

function laneValueToInputString(value) {
  if (value === undefined) return "";
  if (value === null) return "auto";
  return String(value);
}

function createLaneField(labelText, currentValue, onChange, options = {}) {
  const {
    allowBarZero = false,
    allowBarNegativeZero = false,
    inheritLabel = "",
  } = options;
  const label = document.createElement("label");
  label.className = "field";

  const title = document.createElement("span");
  title.textContent = labelText;

  const controls = document.createElement("div");
  controls.className = "lane-input-wrap";

  const decrementButton = document.createElement("button");
  decrementButton.type = "button";
  decrementButton.className = "lane-step-button";
  decrementButton.textContent = "-";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "lane-text-input";
  input.placeholder = inheritLabel || "auto";
  input.value = laneValueToInputString(currentValue);

  const incrementButton = document.createElement("button");
  incrementButton.type = "button";
  incrementButton.className = "lane-step-button";
  incrementButton.textContent = "+";

  const availableLanes = [
    ...NEGATIVE_LANES,
    ...(allowBarNegativeZero ? ["-0"] : []),
    ...(allowBarZero ? ["+0"] : []),
    ...POSITIVE_LANES,
  ];

  const commitInputValue = () => {
    const nextValue = parseLaneValue(input.value, {
      allowBarZero,
      allowBarNegativeZero,
      allowInherit: true,
    });
    onChange(nextValue);
    input.value = laneValueToInputString(nextValue);
  };

  const stepLane = (direction) => {
    const parsed = parseLaneValue(input.value, {
      allowBarZero,
      allowBarNegativeZero,
      allowInherit: true,
    });
    if (parsed === undefined || parsed === null) {
      input.value = direction > 0
        ? (allowBarZero ? "+0" : "1")
        : (allowBarNegativeZero ? "-0" : "-1");
      commitInputValue();
      return;
    }
    const currentIndex = availableLanes.findIndex((lane) => lane === parsed);
    if (currentIndex === -1) return;
    const nextIndex = Math.max(0, Math.min(availableLanes.length - 1, currentIndex + direction));
    input.value = laneValueToInputString(availableLanes[nextIndex]);
    commitInputValue();
  };

  decrementButton.addEventListener("click", () => stepLane(-1));
  incrementButton.addEventListener("click", () => stepLane(1));
  input.addEventListener("change", commitInputValue);

  controls.append(decrementButton, input, incrementButton);
  label.append(title, controls);
  return label;
}

function appendZoomOptions(selectElement, currentValue, inheritLabel) {
  if (inheritLabel) {
    selectElement.appendChild(createSelectOption("__inherit__", inheritLabel, currentValue === undefined));
  }
  selectElement.appendChild(createSelectOption("__all__", t("no_limit"), currentValue === null));
  scaleSteps.forEach((step) => {
    selectElement.appendChild(createSelectOption(step.id, stepToLabel(step), currentValue === step.years));
  });
}

function appendLaneOptions(selectElement, currentValue, inheritLabel, options = {}) {
  const { allowBarZero = false, allowBarNegativeZero = false, mode = "line" } = options;
  if (inheritLabel) {
    selectElement.appendChild(createSelectOption("__inherit__", inheritLabel, currentValue === undefined));
  }
  selectElement.appendChild(createSelectOption("__auto__", t("automatic"), currentValue === null));
  if (allowBarZero && mode === "bar") {
    selectElement.appendChild(createSelectOption("+0", t("bar_upper_zero"), currentValue === "+0"));
  }
  if (allowBarNegativeZero && mode === "bar") {
    selectElement.appendChild(createSelectOption("-0", t("bar_lower_zero"), currentValue === "-0"));
  }
  const lanes = [...NEGATIVE_LANES, ...POSITIVE_LANES];
  lanes.forEach((lane) => {
    const label = lane > 0 ? `+${lane} ${t("above_suffix")}` : `${lane} ${t("below_suffix")}`;
    selectElement.appendChild(createSelectOption(lane, label, currentValue === lane));
  });
}

function getSelectSettingValue(rawValue) {
  if (rawValue === "__inherit__") return undefined;
  if (rawValue === "__all__" || rawValue === "__auto__") return null;
  if (rawValue === "+0" || rawValue === "-0") return rawValue;
  if (rawValue === "") return undefined;
  const matchingStep = scaleSteps.find((step) => step.id === rawValue);
  if (matchingStep) return matchingStep.years;
  return Number(rawValue);
}

function getZoomOptionValue(stepValue) {
  if (stepValue === undefined) return "__inherit__";
  if (stepValue === null) return "__all__";
  const matchingStep = scaleSteps.find((step) => step.years === stepValue);
  return matchingStep ? matchingStep.id : String(stepValue);
}

function createEmptyEvent() {
  const currentYear = new Date().getFullYear();
  return {
    id: `custom-${Date.now()}`,
    source: "custom",
    sourceId: null,
    startYear: currentYear,
    endYear: currentYear,
    startDateValue: currentYear,
    endDateValue: currentYear,
    startPrecision: 9,
    endPrecision: 9,
    endIsToday: false,
    isRange: false,
    visibleStepMin: undefined,
    visibleStepMax: undefined,
    lane: undefined,
    displayMode: "line",
    color: undefined,
    title: t("new_event"),
    description: "",
    category: "",
    groupId: null,
    parentEventId: null,
    relationLineStyle: "none",
    relationDirection: "parent-to-child",
    enabled: true,
  };
}

function createEmptyGroup(parentGroupId = null) {
  return {
    id: `group-custom-${Date.now()}`,
    kind: "custom-folder",
    source: "custom",
    sourceId: null,
    title: t("new_folder"),
    description: "",
    parentGroupId,
    expanded: true,
    enabled: true,
    visibleStepMin: undefined,
    visibleStepMax: undefined,
    lane: undefined,
    color: undefined,
  };
}

function createUniqueId(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getGroupExportFilename(groupItem) {
  const safeTitle = String(groupItem.title || "ordner")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeTitle || "ordner"}.timemap.json`;
}

function buildFolderExportPayload(rootGroupId) {
  const rootGroup = getGroupById(rootGroupId);
  if (!rootGroup) return null;

  const groupIds = getDescendantGroupIds(rootGroupId);
  const groupIdSet = new Set(groupIds);
  const groups = groupIds
    .map((groupId) => getGroupById(groupId))
    .filter(Boolean)
    .map((groupItem) => ({
      id: groupItem.id,
      kind: groupItem.kind,
      source: groupItem.source,
      sourceId: groupItem.sourceId,
      title: groupItem.title,
      description: groupItem.description,
      parentGroupId: groupItem.id === rootGroupId ? null : groupItem.parentGroupId,
      expanded: groupItem.expanded,
      enabled: groupItem.enabled,
      visibleStepMin: groupItem.visibleStepMin,
      visibleStepMax: groupItem.visibleStepMax,
      lane: groupItem.lane,
      color: groupItem.color,
    }));

  const events = timelineEvents
    .filter((eventItem) => groupIdSet.has(eventItem.groupId))
    .map((eventItem) => ({
      id: eventItem.id,
      source: eventItem.source,
      sourceId: eventItem.sourceId,
      startYear: eventItem.startYear,
      endYear: eventItem.endYear,
      startDateValue: eventItem.startDateValue,
      endDateValue: eventItem.endDateValue,
      startPrecision: eventItem.startPrecision,
      endPrecision: eventItem.endPrecision,
      endIsToday: Boolean(eventItem.endIsToday),
      isRange: eventItem.isRange,
      visibleStepMin: eventItem.visibleStepMin,
      visibleStepMax: eventItem.visibleStepMax,
      lane: eventItem.lane,
      displayMode: eventItem.displayMode,
      color: eventItem.color,
      title: eventItem.title,
      description: eventItem.description,
      category: eventItem.category,
      groupId: eventItem.groupId,
      parentEventId: eventItem.parentEventId,
      relationLineStyle: eventItem.relationLineStyle,
      relationDirection: eventItem.relationDirection,
      enabled: eventItem.enabled,
      flagImageUrl: eventItem.flagImageUrl ?? null,
    }));

  return {
    type: "timemap-folder-export",
    version: TIMEMAP_FOLDER_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    rootGroupId,
    groups,
    events,
  };
}

function downloadFolderExport(groupId) {
  const groupItem = getGroupById(groupId);
  const payload = buildFolderExportPayload(groupId);
  if (!groupItem || !payload) return;

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = getGroupExportFilename(groupItem);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
  ui.eventBrowserInfo.textContent = tf("folder_exported", { title: groupItem.title });
}

async function importFolderPayload(payload) {
  if (!payload || payload.type !== "timemap-folder-export" || !Array.isArray(payload.groups) || !Array.isArray(payload.events)) {
    throw new Error("ungueltiges-format");
  }

  const groupIdMap = new Map();
  const eventIdMap = new Map();

  const orderedGroups = [...payload.groups].sort((left, right) => {
    if (left.parentGroupId == null && right.parentGroupId != null) return -1;
    if (left.parentGroupId != null && right.parentGroupId == null) return 1;
    return String(left.title ?? "").localeCompare(String(right.title ?? ""), "de");
  });

  orderedGroups.forEach((sourceGroup) => {
    const groupItem = {
      ...createEmptyGroup(),
      ...sourceGroup,
      id: createUniqueId("group-import"),
      parentGroupId: sourceGroup.parentGroupId ? (groupIdMap.get(sourceGroup.parentGroupId) ?? null) : null,
      expanded: sourceGroup.expanded !== false,
      enabled: sourceGroup.enabled !== false,
    };
    groupIdMap.set(sourceGroup.id, groupItem.id);
    eventGroups.push(groupItem);
  });

  payload.events.forEach((sourceEvent) => {
    const eventItem = {
      ...createEmptyEvent(),
      ...sourceEvent,
      id: createUniqueId("import"),
      groupId: sourceEvent.groupId ? (groupIdMap.get(sourceEvent.groupId) ?? null) : null,
      parentEventId: null,
      enabled: sourceEvent.enabled !== false,
      isRange: Boolean(sourceEvent.isRange),
      displayMode: sourceEvent.displayMode === "bar" ? "bar" : "line",
    };
    eventIdMap.set(sourceEvent.id, eventItem.id);
    timelineEvents.push(eventItem);
  });

  payload.events.forEach((sourceEvent) => {
    const importedEvent = getEventById(eventIdMap.get(sourceEvent.id));
    if (!importedEvent) return;
    importedEvent.parentEventId = sourceEvent.parentEventId ? (eventIdMap.get(sourceEvent.parentEventId) ?? null) : null;
    normalizeEventDisplaySettings(importedEvent);
  });

  sanitizeEventHierarchy();
  const importedRootGroupId = payload.rootGroupId ? groupIdMap.get(payload.rootGroupId) : null;
  const importedRootGroup = importedRootGroupId ? getGroupById(importedRootGroupId) : null;
  if (importedRootGroup) {
    importedRootGroup.expanded = true;
    state.openEditorId = null;
    state.openGroupEditorId = importedRootGroup.id;
  }
  await refreshLocalizedWikidataContent();
  if (importedRootGroup) {
    ui.eventBrowserInfo.textContent = tf("folder_imported", { title: importedRootGroup.title });
  } else {
    ui.eventBrowserInfo.textContent = t("folder_imported_generic");
  }
  renderEpochMenu();
  renderEventList();
  drawTimeline();
  if (importedRootGroup) {
    scrollToDetails("auto");
    focusEditorNameField("group", { reveal: true, behavior: "auto" });
  }
}

function createEarthHistoryPreset() {
  const rootGroup = {
    id: `group-${EARTH_HISTORY_PRESET.id}`,
    kind: "preset-root",
    source: "wikidata-preset",
    sourceId: EARTH_HISTORY_PRESET.sourceId,
    title: EARTH_HISTORY_PRESET.title,
    description: EARTH_HISTORY_PRESET.description,
    parentGroupId: null,
    expanded: true,
    enabled: true,
    visibleStepMin: undefined,
    visibleStepMax: undefined,
    lane: undefined,
    displayMode: "line",
    color: undefined,
  };

  const groups = [rootGroup];
  const events = [];

  Object.entries(EARTH_HISTORY_PRESET.typeLabels).forEach(([typeKey, typeLabel]) => {
    const typeGroupId = `group-${EARTH_HISTORY_PRESET.id}-${typeKey}`;
    const defaultZoom = EARTH_HISTORY_PRESET.defaultZoomByType[typeKey];
    groups.push({
      id: typeGroupId,
      kind: "preset-type",
      source: "wikidata-preset",
      sourceId: EARTH_HISTORY_PRESET.typeQids[typeKey],
      title: typeLabel,
      description: `${typeLabel} innerhalb der Erdzeitalter.`,
      parentGroupId: rootGroup.id,
      expanded: false,
      enabled: true,
      visibleStepMin: defaultZoom?.min,
      visibleStepMax: defaultZoom?.max,
      lane: undefined,
      color: undefined,
    });

    (EARTH_HISTORY_PRESET.itemsByType[typeKey] ?? []).forEach((entry) => {
      events.push({
        id: `wikidata-${entry.qid}`,
        source: "wikidata",
        sourceId: entry.qid,
        startYear: null,
        endYear: null,
        startDateValue: null,
        endDateValue: null,
        startPrecision: null,
        endPrecision: null,
        isRange: true,
        visibleStepMin: undefined,
        visibleStepMax: undefined,
        lane: typeKey === "epoch" ? "+0" : undefined,
        displayMode: typeKey === "epoch" ? "bar" : "line",
        color: undefined,
        title: entry.name,
        description: "",
        category: typeLabel,
        groupId: typeGroupId,
        parentEventId: null,
        relationLineStyle: "none",
        relationDirection: "parent-to-child",
        enabled: true,
      });
    });
  });

  return { groups, events };
}

function hideTooltip() {
  if (state.clickTimer) {
    clearTimeout(state.clickTimer);
    state.clickTimer = null;
  }
  state.lastClickEventId = null;
  state.lastClickTime = 0;
  state.tooltipEventId = null;
  if (ui.eventTooltip) {
    ui.eventTooltip.hidden = true;
    ui.eventTooltip.replaceChildren();
  }
}

function showTooltip(eventItem, anchorX, markerY) {
  if (!ui.eventTooltip) return;
  state.tooltipEventId = eventItem.id;
  ui.eventTooltip.replaceChildren();
  const title = createHtmlTitleContent(eventItem);
  const meta = document.createElement("span");
  meta.textContent = getEventDateLabel(eventItem);
  const description = document.createElement("span");
  description.textContent = eventItem.description || t("no_description");
  ui.eventTooltip.append(title, meta, description);
  ui.eventTooltip.hidden = false;

  const stageRect = svg.getBoundingClientRect();
  const tooltipWidth = 320;
  const left = Math.max(12, Math.min(anchorX - tooltipWidth / 2, stageRect.width - tooltipWidth - 12));
  const top = Math.max(12, markerY - 110);
  ui.eventTooltip.style.left = `${left}px`;
  ui.eventTooltip.style.top = `${top}px`;
}

function getVisibleEvents() {
  const range = getVisibleRange();
  return getEnabledEvents()
    .filter((eventItem) => Number.isFinite(getTimelineValueForEventStart(eventItem)))
    .filter((eventItem) => isEventVisibleAtCurrentZoom(eventItem))
    .filter((eventItem) => {
      const visibleStartValue = getTimelineValueForEventStart(eventItem);
      const visibleEndValue = isRangeEvent(eventItem)
        ? getTimelineValueForEventEnd(eventItem)
        : visibleStartValue;
      return visibleEndValue >= range.start && visibleStartValue <= range.end;
    })
    .sort((left, right) => getTimelineValueForEventStart(left) - getTimelineValueForEventStart(right));
}

function requestRedraw() {
  if (state.resizeFrame) cancelAnimationFrame(state.resizeFrame);
  state.resizeFrame = requestAnimationFrame(() => {
    state.resizeFrame = 0;
    drawTimeline();
  });
}

function updateSelectionPanel() {
  if (!ui.eventTitle || !ui.eventYear || !ui.eventDescription) {
    return;
  }
  const eventItem = getEventById(state.selectedEventId);
  if (!eventItem) {
    ui.eventTitle.textContent = t("no_event_selected");
    ui.eventYear.textContent = "-";
    ui.eventDescription.textContent = t("click_marker_hint");
    return;
  }
  ui.eventTitle.textContent = eventItem.title;
  ui.eventYear.textContent = Number.isFinite(eventItem.startYear)
    || Number.isFinite(eventItem.startDateValue)
    ? getEventDateLabel(eventItem)
    : t("no_year_data");
  ui.eventDescription.textContent = eventItem.description || t("no_description");
}

function selectEvent(eventId, openEditor = false) {
  const match = getEventById(eventId);
  if (!match) return;
  state.selectedEventId = eventId;
  state.openGroupEditorId = null;
  if (openEditor) state.openEditorId = eventId;
  updateSelectionPanel();
  renderEventList();
  drawTimeline();
}

function clearSelectedEvent() {
  state.selectedEventId = null;
  state.openGroupEditorId = null;
  hideTooltip();
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

function getContainerScrollTopFor(element) {
  const containerRect = ui.appFrame.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return ui.appFrame.scrollTop + (elementRect.top - containerRect.top);
}

function scrollToDetails(behavior = "smooth") {
  state.anchorDetailsOnScrollBack = true;
  const targetTop = getContainerScrollTopFor(ui.detailsView);
  requestAnimationFrame(() => {
    ui.appFrame.scrollTo({ top: targetTop, behavior });
  });
}

function scrollToTimeline() {
  const targetTop = getContainerScrollTopFor(ui.timelineView);
  requestAnimationFrame(() => {
    ui.appFrame.scrollTo({ top: targetTop, behavior: "smooth" });
  });
}

function openWorkspace(behavior = "smooth") {
  hideTooltip();
  requestAnimationFrame(() => {
    scrollToDetails(behavior);
  });
}

function toggleWorkspace() {
  const detailsTop = getContainerScrollTopFor(ui.detailsView);
  const currentTop = ui.appFrame.scrollTop;
  if (Math.abs(currentTop - detailsTop) < 40) {
    scrollToTimeline();
    return;
  }
  openWorkspace();
}

function setTimelineMenuOpen(isOpen) {
  state.timelineMenuOpen = Boolean(isOpen);
  if (ui.timelineSideMenu) {
    ui.timelineSideMenu.classList.toggle("is-open", state.timelineMenuOpen);
    ui.timelineSideMenu.setAttribute("aria-hidden", String(!state.timelineMenuOpen));
  }
  if (ui.timelineMenuOverlay) {
    ui.timelineMenuOverlay.hidden = !state.timelineMenuOpen;
  }
  if (ui.timelineMenuButton) {
    ui.timelineMenuButton.setAttribute("aria-expanded", String(state.timelineMenuOpen));
  }
}

function toggleTimelineMenu(event) {
  if (event) {
    event.preventDefault();
  }
  setTimelineMenuOpen(!state.timelineMenuOpen);
}

function handleWorkspaceStripOpen(event, behavior = "smooth") {
  if (event) {
    if (event.target?.closest?.("#fullscreenButton")) return;
    event.preventDefault();
  }
  openWorkspace(behavior);
}

async function toggleFullscreen(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Some embedded browsers can block fullscreen; in that case the F11 fallback still works.
  }
}

function toggleTodayFocus() {
  hideTooltip();
  state.centerYear = getNowTimelineValue();
  state.showTodayMarker = !state.showTodayMarker;
  clearSelectedEvent();
}

function isTextEditingElement(element) {
  if (!element) return false;
  const tagName = element.tagName?.toLowerCase?.();
  return tagName === "input"
    || tagName === "textarea"
    || tagName === "select"
    || Boolean(element.isContentEditable);
}

function isTimelineWindowActive() {
  if (!ui.appFrame || !ui.detailsView) return true;
  const detailsTop = getContainerScrollTopFor(ui.detailsView);
  return ui.appFrame.scrollTop < Math.max(80, detailsTop - 120);
}

function handleEventDragMove(event) {
  if (!state.dragState) return;
  const stageRect = svg.getBoundingClientRect();
  const localY = event.clientY - stageRect.top;
  const deltaY = event.clientY - state.dragState.startClientY;
  if (!state.dragState.dragging && Math.abs(deltaY) < 8) {
    return;
  }

  const eventItem = getEventById(state.dragState.eventId);
  if (!eventItem) return;

  state.dragState.dragging = true;
  const nextLane = getNearestFixedLaneFromY(localY, eventItem);
  if (eventItem.lane !== nextLane) {
    eventItem.lane = nextLane;
    drawTimeline();
  }
}

function finishEventDrag(event) {
  if (!state.dragState) return;
  const wasDragging = state.dragState.dragging;
  window.removeEventListener("pointermove", handleEventDragMove);
  window.removeEventListener("pointerup", finishEventDrag);
  window.removeEventListener("pointercancel", finishEventDrag);
  state.dragState = null;

  if (wasDragging) {
    state.suppressClickUntil = Date.now() + 250;
    renderEventList();
    drawTimeline();
  }
}

function bindEventDrag(target, eventItem) {
  target.style.cursor = "grab";
  target.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    hideTooltip();
    state.dragState = {
      eventId: eventItem.id,
      startClientY: event.clientY,
      dragging: false,
    };
    window.addEventListener("pointermove", handleEventDragMove);
    window.addEventListener("pointerup", finishEventDrag);
    window.addEventListener("pointercancel", finishEventDrag);
  });
}

function bindEventSelection(target, eventItem) {
  bindEventDrag(target, eventItem);
  target.addEventListener("click", () => {
    if (Date.now() < state.suppressClickUntil) {
      return;
    }
    const now = Date.now();
    const isDoubleClick = state.lastClickEventId === eventItem.id && now - state.lastClickTime <= 450;
    state.lastClickEventId = eventItem.id;
    state.lastClickTime = now;

    if (isDoubleClick) {
      if (state.clickTimer) {
        clearTimeout(state.clickTimer);
        state.clickTimer = null;
      }
      state.lastClickEventId = null;
      state.lastClickTime = 0;
        hideTooltip();
        state.openGroupEditorId = null;
        state.openEditorId = eventItem.id;
        state.selectedEventId = eventItem.id;
        updateSelectionPanel();
        renderEventList();
        drawTimeline();
        requestAnimationFrame(() => {
          scrollToDetails("auto");
        });
        return;
      }

    if (state.clickTimer) {
      clearTimeout(state.clickTimer);
    }
    state.clickTimer = window.setTimeout(() => {
      state.clickTimer = null;
      state.tooltipEventId = eventItem.id;
      state.selectedEventId = eventItem.id;
      updateSelectionPanel();
      drawTimeline();
    }, 240);
  });
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      hideTooltip();
      state.openGroupEditorId = null;
      state.openEditorId = eventItem.id;
      state.selectedEventId = eventItem.id;
      updateSelectionPanel();
      renderEventList();
      drawTimeline();
      requestAnimationFrame(() => {
        scrollToDetails("auto");
      });
    }
  });
}

function drawTimeline() {
  syncViewMetrics();
  svg.replaceChildren();

  const paddingX = TIMELINE_PADDING_X;
  const lineY = state.height * 0.56;
  const step = getStep();
  const ticks = getTicks();
  const visibleEvents = getVisibleEvents();
  const currentValue = getNowTimelineValue();
  const eventGeometries = new Map();
  const pendingRelations = [];

  visibleEvents.forEach((eventItem, index) => {
    const laneGeometry = getLaneGeometry(eventItem, index, lineY);
    eventGeometries.set(eventItem.id, {
      startX: getEventX(getTimelineValueForEventStart(eventItem)),
      endX: getEventX(getTimelineValueForEventEnd(eventItem)),
      anchorX: getEventX(getEventAnchorYear(eventItem)),
      markerY: laneGeometry.markerY,
      labelY: laneGeometry.labelY,
    });
  });

  svg.appendChild(createSvgElement("line", {
    x1: paddingX, y1: lineY, x2: state.width - paddingX, y2: lineY,
    stroke: "#9ed3df", "stroke-width": 2,
  }));

  const defs = createSvgElement("defs");
  defs.appendChild(createSvgElement("marker", {
    id: "relation-arrow-end",
    viewBox: "0 0 10 10",
    refX: 9,
    refY: 5,
    markerWidth: 6,
    markerHeight: 6,
    orient: "auto-start-reverse",
  }));
  defs.lastChild.appendChild(createSvgElement("path", {
    d: "M 0 0 L 10 5 L 0 10 z",
    fill: "#cfd7dc",
  }));
  defs.appendChild(createSvgElement("marker", {
    id: "relation-arrow-start",
    viewBox: "0 0 10 10",
    refX: 1,
    refY: 5,
    markerWidth: 6,
    markerHeight: 6,
    orient: "auto",
  }));
  defs.lastChild.appendChild(createSvgElement("path", {
    d: "M 10 0 L 0 5 L 10 10 z",
    fill: "#cfd7dc",
  }));
  svg.appendChild(defs);

  ticks.forEach((tick) => {
    const x = getTickX(tick);
    const majorTick = isMajorTick(tick.year);
    const isFutureTick = tick.year > currentValue;
    const tickFill = isFutureTick
      ? (majorTick ? "rgba(255, 179, 71, 0.42)" : "rgba(158, 211, 223, 0.38)")
      : (majorTick ? "#ffb347" : "#9ed3df");
    const labelFill = isFutureTick
      ? "rgba(164, 176, 184, 0.48)"
      : (majorTick ? "#eef3f6" : "#a4b0b8");
    const tickCircle = createSvgElement("circle", {
      cx: x, cy: lineY, r: majorTick ? 4.8 : 3.2, fill: tickFill,
      tabindex: 0,
      role: "button",
      "aria-label": `${t("axis_point")} ${getTickLabel(tick.year, step, majorTick)}`,
      cursor: "pointer",
    });
    tickCircle.addEventListener("click", (event) => {
      event.stopPropagation();
      const sameTickSelected = state.selectedTickValue != null && Math.abs(state.selectedTickValue - tick.year) < (getStepYears() / 100);
      if (sameTickSelected) {
        state.selectedTickValue = null;
      } else {
        state.selectedTickValue = tick.year;
      }
      hideTooltip();
      drawTimeline();
    });
    tickCircle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const sameTickSelected = state.selectedTickValue != null && Math.abs(state.selectedTickValue - tick.year) < (getStepYears() / 100);
        if (sameTickSelected) {
          state.selectedTickValue = null;
        } else {
          state.selectedTickValue = tick.year;
        }
        hideTooltip();
        drawTimeline();
      }
    });
    svg.appendChild(tickCircle);
    const tickText = createSvgElement("text", {
      x, y: lineY + 42, fill: labelFill,
      "font-size": 13,
      "font-family": "Segoe UI, Arial, sans-serif",
      "font-weight": 400,
      "text-anchor": "middle",
    });
    tickText.textContent = getTickLabel(tick.year, step, majorTick);
    svg.appendChild(tickText);
  });

  if (state.selectedTickValue != null) {
    const selectedVisibleTick = ticks.find((tick) => Math.abs(tick.year - state.selectedTickValue) < (getStepYears() / 100));
    const selectedTickX = selectedVisibleTick ? getTickX(selectedVisibleTick) : Math.max(paddingX, Math.min(state.width - paddingX, getEventX(state.selectedTickValue)));
    svg.appendChild(createSvgElement("circle", {
      cx: selectedTickX,
      cy: lineY,
      r: 8.8,
      fill: "none",
      stroke: "#ffb347",
      "stroke-width": 2,
      "pointer-events": "none",
    }));
    svg.appendChild(createSvgElement("circle", {
      cx: selectedTickX,
      cy: lineY,
      r: 3.6,
      fill: "#ffb347",
      "pointer-events": "none",
    }));
  }

  const futureStartX = Math.max(paddingX, Math.min(state.width - paddingX, getEventX(currentValue)));
  if (futureStartX < state.width - paddingX) {
    svg.appendChild(createSvgElement("line", {
      x1: futureStartX,
      y1: lineY,
      x2: state.width - paddingX,
      y2: lineY,
      stroke: "rgba(164, 176, 184, 0.5)",
      "stroke-width": 2.4,
    }));
  }

  if (state.showTodayMarker) {
    const todayX = Math.max(paddingX, Math.min(state.width - paddingX, getEventX(currentValue)));
    svg.appendChild(createSvgElement("line", {
      x1: todayX,
      y1: lineY - 6,
      x2: todayX,
      y2: lineY + 6,
      stroke: "#ffb347",
      "stroke-width": 2.4,
      "stroke-linecap": "round",
    }));
  }

  visibleEvents.forEach((eventItem) => {
    const geometry = eventGeometries.get(eventItem.id);
    const { startX, endX, anchorX, markerY } = geometry;
    const selected = eventItem.id === state.selectedEventId;
    const effectiveColor = getEffectiveColor(eventItem);
    const effectiveLane = getEffectiveLane(eventItem);
    const accent = selected ? "#ff8f5a" : (effectiveColor || (isBarDisplay(eventItem) ? BAR_DEFAULT_COLOR : "#9ed3df"));
    const pointRadius = selected ? 8 : 6;
    const rangeEndpointRadius = selected ? 6 : 4.5;
    const parentItem = eventItem.parentEventId ? getEventById(eventItem.parentEventId) : null;
    const parentGeometry = parentItem ? eventGeometries.get(parentItem.id) : null;
    const relationGeometry = parentItem && parentGeometry
      ? getRelationGeometry(parentItem, eventItem, parentGeometry, geometry)
      : null;
    const relationActive = parentItem && relationGeometry && eventItem.relationLineStyle !== "none";

    if (relationActive) {
      pendingRelations.push({
        eventItem,
        parentItem,
        childGeometry: geometry,
        parentGeometry,
        relationGeometry,
        selected,
      });
    }

    if (isBarDisplay(eventItem) && isRangeEvent(eventItem)) {
      const boxHeight = 14;
      const boxY = markerY - boxHeight / 2;
      const rangeBox = createSvgElement("rect", {
        x: Math.min(startX, endX),
        y: boxY,
        width: Math.max(12, Math.abs(endX - startX)),
        height: boxHeight,
        rx: 4,
        fill: accent,
        opacity: selected ? 0.95 : 0.82,
        stroke: selected ? "#ffb347" : "#d7edf2",
        "stroke-width": selected ? 2 : 1,
        tabindex: 0,
        role: "button",
        "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
      });
      bindEventSelection(rangeBox, eventItem);
      svg.appendChild(rangeBox);

      drawSvgLabelWithPrefix(eventItem, anchorX, markerY + 4, {
        fill: "#eef3f6",
        fontSize: 11.5,
        fontWeight: selected ? 600 : 500,
        align: "center",
      });

      if (state.tooltipEventId === eventItem.id) {
        showTooltip(eventItem, anchorX, markerY - 8);
      }
      return;
    }

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
          cx: x, cy: markerY, r: rangeEndpointRadius,
          fill: selected ? "#ffb347" : "#d7edf2", stroke: "#22272b", "stroke-width": 2,
          tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
        });
        bindEventSelection(endpoint, eventItem);
        svg.appendChild(endpoint);
      });
    } else {
      const marker = createSvgElement("circle", {
        cx: anchorX, cy: markerY, r: pointRadius,
        fill: accent, stroke: "#22272b", "stroke-width": 2,
        tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
      });
      bindEventSelection(marker, eventItem);
      svg.appendChild(marker);
    }

    drawSvgLabelWithPrefix(eventItem, anchorX, geometry.labelY, {
      fill: selected ? "#eef3f6" : "#a4b0b8",
      fontSize: 13,
      fontWeight: selected ? 600 : 400,
      align: geometry.labelY < lineY ? "above" : "below",
    });

    if (state.tooltipEventId === eventItem.id) {
      showTooltip(eventItem, anchorX, markerY);
    }
  });

  pendingRelations.forEach(({ eventItem, relationGeometry, selected }) => {
    const trimmedRelation = getTrimmedRelationLine(relationGeometry, eventItem.relationDirection);
    const relationLine = createSvgElement("line", {
      x1: trimmedRelation.x1,
      y1: trimmedRelation.y1,
      x2: trimmedRelation.x2,
      y2: trimmedRelation.y2,
    });

    relationLine.setAttribute("stroke", selected ? "#ff8f5a" : "rgba(238, 243, 246, 0.92)");
    relationLine.setAttribute("stroke-width", selected ? "2.2" : "1.8");
    relationLine.setAttribute("stroke-linecap", "round");
    const dasharray = getRelationStrokeDasharray(eventItem.relationLineStyle);
    if (dasharray) {
      relationLine.setAttribute("stroke-dasharray", dasharray);
    }
    if (eventItem.relationDirection === "parent-to-child" || eventItem.relationDirection === "both") {
      relationLine.setAttribute("marker-end", "url(#relation-arrow-end)");
    }
    if (eventItem.relationDirection === "child-to-parent" || eventItem.relationDirection === "both") {
      relationLine.setAttribute("marker-start", "url(#relation-arrow-start)");
    }
    svg.appendChild(relationLine);
  });

  const scaleLabel = createSvgElement("text", {
    x: state.width - paddingX, y: 42, fill: "#ffb347", "font-size": 18,
    "font-family": "Segoe UI, Arial, sans-serif", "font-weight": 600, "text-anchor": "end",
  });
  scaleLabel.textContent = stepToLabel(step);
  svg.appendChild(scaleLabel);
}

function createInlineEditor(eventItem) {
  normalizeEventDisplaySettings(eventItem);
  const editor = document.createElement("div");
  editor.className = "event-inline-editor";
  const rerenderEditor = ({ updateSelection = false, redrawTimeline = true, rerenderSearch = false } = {}) => {
    const scrollTop = ui.appFrame.scrollTop;
    if (updateSelection && state.selectedEventId === eventItem.id) updateSelectionPanel();
    renderEventList();
    if (rerenderSearch) renderSearchResults();
    if (redrawTimeline) drawTimeline();
    requestAnimationFrame(() => {
      ui.appFrame.scrollTop = scrollTop;
    });
  };

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.dataset.editorNameField = "event";
  titleInput.value = eventItem.title;
  titleInput.addEventListener("change", () => {
    eventItem.title = titleInput.value.trim() || eventItem.title;
    rerenderEditor({ updateSelection: true });
  });

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.value = eventItem.category === "Wikidata" ? "" : eventItem.category;
  categoryInput.addEventListener("change", async () => {
    eventItem.category = categoryInput.value.trim() || t("uncategorized");
    if (isFlagCategory(eventItem.category)) {
      await ensureEventFlag(eventItem);
    }
    rerenderEditor({ updateSelection: true });
  });

  const groupSelect = document.createElement("select");
  groupSelect.appendChild(createSelectOption("", t("no_folder_assigned"), eventItem.groupId == null));
  getAssignableGroups().forEach((groupItem) => {
    const prefix = "· ".repeat(getGroupDepth(groupItem.id));
    groupSelect.appendChild(createSelectOption(groupItem.id, `${prefix}${groupItem.title}`, eventItem.groupId === groupItem.id));
  });
  groupSelect.addEventListener("change", () => {
    eventItem.groupId = groupSelect.value || null;
    const assignableParents = getAssignableParentEvents(eventItem);
    if (!assignableParents.some((candidate) => candidate.id === eventItem.parentEventId)) {
      eventItem.parentEventId = null;
    }
    if (eventItem.groupId) {
      const groupItem = getGroupById(eventItem.groupId);
      if (groupItem) groupItem.expanded = true;
    }
    rerenderEditor();
  });

  const rangeCheckbox = document.createElement("input");
  rangeCheckbox.type = "checkbox";
  rangeCheckbox.checked = isRangeEvent(eventItem);
  let storedEndYear = eventItem.endYear;

  const startInput = document.createElement("input");
  startInput.type = "text";
  startInput.inputMode = "text";
  startInput.value = yearToEditorValue(eventItem.startYear);
  startInput.placeholder = t("example_start");

  const endInput = document.createElement("input");
  endInput.type = "text";
  endInput.inputMode = "text";
  endInput.value = eventItem.endIsToday ? t("today_keyword") : yearToEditorValue(storedEndYear);
  endInput.placeholder = t("example_end");

  const startLabelText = document.createElement("span");
  startLabelText.textContent = rangeCheckbox.checked ? t("from") : t("year");

  const startField = document.createElement("label");
  startField.className = "field";
  startField.append(startLabelText, startInput);

  const endLabelText = document.createElement("span");
  endLabelText.textContent = t("until");

  const endField = document.createElement("label");
  endField.className = "field";
  endField.append(endLabelText, endInput);

  const updateRangeUi = () => {
    startLabelText.textContent = rangeCheckbox.checked ? t("from") : t("year");
    endField.hidden = false;
    endField.classList.toggle("is-disabled", !rangeCheckbox.checked);
    endInput.disabled = !rangeCheckbox.checked;
    endInput.tabIndex = rangeCheckbox.checked ? 0 : -1;
    if (!rangeCheckbox.checked) {
      endInput.value = eventItem.endIsToday ? t("today_keyword") : yearToEditorValue(storedEndYear);
    } else if (eventItem.endIsToday && !String(endInput.value).trim()) {
      endInput.value = t("today_keyword");
    } else if (Number.isFinite(storedEndYear) && !String(endInput.value).trim()) {
      endInput.value = yearToEditorValue(storedEndYear);
    }
  };

  const applyYearChanges = () => {
    const startYear = parseEditorYearValue(startInput.value);
    const endIsToday = rangeCheckbox.checked && isTodayKeyword(endInput.value);
    const rawEndYear = endIsToday ? getNowTimelineValue() : parseEditorYearValue(endInput.value);
    if (!Number.isFinite(startYear)) return;
    eventItem.isRange = rangeCheckbox.checked;
    eventItem.endIsToday = Boolean(endIsToday);
    if (rangeCheckbox.checked && Number.isFinite(rawEndYear) && !endIsToday) {
      storedEndYear = rawEndYear;
    }
    const effectiveEndYear = rangeCheckbox.checked
      ? (Number.isFinite(rawEndYear) ? rawEndYear : (Number.isFinite(storedEndYear) ? storedEndYear : startYear))
      : startYear;
    eventItem.startYear = Math.min(startYear, effectiveEndYear);
    eventItem.endYear = rangeCheckbox.checked ? Math.max(startYear, effectiveEndYear) : storedEndYear;
    eventItem.startDateValue = eventItem.startYear;
    eventItem.endDateValue = rangeCheckbox.checked
      ? (endIsToday ? getNowTimelineValue() : eventItem.endYear)
      : eventItem.startYear;
    eventItem.startPrecision = 9;
    eventItem.endPrecision = endIsToday ? 11 : 9;
    normalizeEventDisplaySettings(eventItem);
    startInput.value = yearToEditorValue(eventItem.startYear);
    if (rangeCheckbox.checked) {
      endInput.value = eventItem.endIsToday ? t("today_keyword") : yearToEditorValue(eventItem.endYear);
    }
    updateRangeUi();
    rebuildLaneOptions();
    rerenderEditor({ updateSelection: true });
  };

  rangeCheckbox.addEventListener("change", applyYearChanges);
  startInput.addEventListener("change", applyYearChanges);
  endInput.addEventListener("change", applyYearChanges);
  updateRangeUi();

  const descriptionArea = document.createElement("textarea");
  descriptionArea.rows = 5;
  descriptionArea.value = eventItem.description;
  descriptionArea.addEventListener("change", () => {
    eventItem.description = descriptionArea.value.trim();
    rerenderEditor({ updateSelection: true, redrawTimeline: false });
  });

  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "field switch-field";
  const checkboxText = document.createElement("span");
  checkboxText.textContent = t("range_instead_of_point");
  const switchTrack = document.createElement("span");
  switchTrack.className = "switch-track";
  const switchThumb = document.createElement("span");
  switchThumb.className = "switch-thumb";
  switchTrack.appendChild(switchThumb);
  checkboxLabel.append(checkboxText, rangeCheckbox, switchTrack);

  const zoomMinSelect = document.createElement("select");
  appendZoomOptions(zoomMinSelect, eventItem.visibleStepMin, t("inherit_folder"));

  const zoomMaxSelect = document.createElement("select");
  appendZoomOptions(zoomMaxSelect, eventItem.visibleStepMax, t("inherit_folder"));

  const applyZoomVisibility = () => {
    const min = getSelectSettingValue(zoomMinSelect.value);
    const max = getSelectSettingValue(zoomMaxSelect.value);
    eventItem.visibleStepMin = min;
    eventItem.visibleStepMax = max;
    if (typeof min === "number" && typeof max === "number" && min > max) {
      eventItem.visibleStepMin = max;
      eventItem.visibleStepMax = min;
      zoomMinSelect.value = getZoomOptionValue(eventItem.visibleStepMin);
      zoomMaxSelect.value = getZoomOptionValue(eventItem.visibleStepMax);
    }
    rerenderEditor();
  };

  zoomMinSelect.addEventListener("change", applyZoomVisibility);
  zoomMaxSelect.addEventListener("change", applyZoomVisibility);

  const zoomRow = document.createElement("div");
  zoomRow.className = "field-row year-fields";
  zoomRow.append(
    createField(t("visible_from"), zoomMinSelect),
    createField(t("until").toLowerCase(), zoomMaxSelect),
  );

  const relationParentSelect = document.createElement("select");
  relationParentSelect.appendChild(createSelectOption("", t("relation_none"), eventItem.parentEventId == null));
  getAssignableParentEvents(eventItem).forEach((candidate) => {
    relationParentSelect.appendChild(createSelectOption(candidate.id, candidate.title, eventItem.parentEventId === candidate.id));
  });
  relationParentSelect.addEventListener("change", () => {
    eventItem.parentEventId = relationParentSelect.value || null;
    rerenderEditor();
  });

  const relationStyleSelect = document.createElement("select");
  relationStyleSelect.append(
    createSelectOption("none", t("line_none"), eventItem.relationLineStyle === "none"),
    createSelectOption("solid", t("line_solid"), eventItem.relationLineStyle === "solid"),
    createSelectOption("dotted", t("line_dotted"), eventItem.relationLineStyle === "dotted"),
  );
  relationStyleSelect.addEventListener("change", () => {
    const previousStyle = eventItem.relationLineStyle;
    eventItem.relationLineStyle = relationStyleSelect.value;
    if (previousStyle === "none" && eventItem.relationLineStyle !== "none") {
      eventItem.relationDirection = "none";
    }
    rerenderEditor({ redrawTimeline: true });
  });

  const relationDirectionSelect = document.createElement("select");
  relationDirectionSelect.append(
    createSelectOption("parent-to-child", t("arrow_down_right"), eventItem.relationDirection === "parent-to-child"),
    createSelectOption("child-to-parent", t("arrow_up_left"), eventItem.relationDirection === "child-to-parent"),
    createSelectOption("both", t("arrow_both"), eventItem.relationDirection === "both"),
    createSelectOption("none", t("arrow_none"), eventItem.relationDirection === "none"),
  );
  relationDirectionSelect.addEventListener("change", () => {
    eventItem.relationDirection = relationDirectionSelect.value;
    rerenderEditor({ redrawTimeline: true });
  });

  const relationRow = document.createElement("div");
  relationRow.className = "field-row year-fields";
  const relationStyleField = createField(t("line"), relationStyleSelect);
  const relationDirectionField = createField(t("arrows"), relationDirectionSelect);
  relationRow.append(
    relationStyleField,
    relationDirectionField,
  );
  const relationField = createField(t("relation"), relationParentSelect);

  const updateRelationEditorState = () => {
    const hasGroup = Boolean(eventItem.groupId);
    const hasParent = Boolean(eventItem.parentEventId);
    relationParentSelect.disabled = !hasGroup;
    relationStyleSelect.disabled = !hasGroup;
    relationDirectionSelect.disabled = !hasGroup;
    relationField.classList.toggle("is-disabled", !hasGroup);
    relationStyleField.classList.toggle("is-disabled", !hasGroup);
    relationDirectionField.classList.toggle("is-disabled", !hasGroup);
    relationRow.hidden = hasGroup ? !hasParent : false;
  };

  const displaySelect = document.createElement("select");
  displaySelect.appendChild(createSelectOption("line", t("display_line"), eventItem.displayMode !== "bar"));
  displaySelect.appendChild(createSelectOption("bar", t("display_bar"), eventItem.displayMode === "bar"));

  let laneField = createLaneField(
    t("display_height"),
    eventItem.lane,
    (nextValue) => {
      eventItem.lane = nextValue;
      normalizeEventDisplaySettings(eventItem);
      rerenderEditor();
    },
    {
      allowBarZero: eventItem.displayMode === "bar" && isRangeEvent(eventItem),
      allowBarNegativeZero: eventItem.displayMode === "bar" && isRangeEvent(eventItem),
      inheritLabel: t("inherit_folder"),
    },
  );

  displaySelect.addEventListener("change", () => {
    eventItem.displayMode = displaySelect.value === "bar" ? "bar" : "line";
    if (eventItem.displayMode === "bar" && !eventItem.color) {
      eventItem.color = BAR_DEFAULT_COLOR;
      colorInput.value = BAR_DEFAULT_COLOR;
    }
    normalizeEventDisplaySettings(eventItem);
    rerenderEditor();
  });

  const colorInput = document.createElement("input");
  colorInput.type = "text";
  colorInput.placeholder = t("example_color");
  colorInput.value = eventItem.color ?? "";
  const applyEventColorChange = (value = colorInput.value) => {
    eventItem.color = String(value).trim() || undefined;
    rerenderEditor();
  };
  colorInput.addEventListener("change", () => {
    applyEventColorChange(colorInput.value);
  });

  const yearRow = document.createElement("div");
  yearRow.className = "field-row year-fields";
  yearRow.append(startField, endField);

  const displayRow = document.createElement("div");
  displayRow.className = "field-row year-fields";
  displayRow.append(
    createField(t("display"), displaySelect),
    laneField,
  );

  editor.append(
    createField(t("title"), titleInput),
    createField(t("category"), categoryInput),
    createField(t("folder_or_epoch"), groupSelect),
    checkboxLabel,
    yearRow,
    zoomRow,
    displayRow,
    relationField,
    relationRow,
    createColorField(t("color_value"), colorInput, applyEventColorChange),
    createField(t("description"), descriptionArea),
  );
  updateRelationEditorState();
  relationParentSelect.addEventListener("change", () => {
    updateRelationEditorState();
  });
  return editor;
}

function renderEpochMenu() {
  if (!ui.epochMenu) return;
  ui.epochMenu.replaceChildren();
  ui.epochMenu.hidden = !state.showEpochMenu;
  if (!state.showEpochMenu) return;

  const item = document.createElement("div");
  item.className = "group-browser-item epoch-menu-item";

  const row = document.createElement("div");
  row.className = "group-row epoch-menu-row";

  const main = document.createElement("button");
  main.type = "button";
  main.className = "group-row-main epoch-menu-item-button";

  const title = document.createElement("strong");
  title.textContent = EARTH_HISTORY_PRESET.title;
  const note = document.createElement("span");
  note.textContent = t("contains_earth_history");
  main.append(title, note);

  const source = document.createElement("span");
  source.className = "group-row-source";
  source.textContent = `Wikidata ${EARTH_HISTORY_PRESET.sourceId}`;

  const existingGroup = eventGroups.find((groupItem) => (
    groupItem.id === `group-${EARTH_HISTORY_PRESET.id}` || groupItem.sourceId === EARTH_HISTORY_PRESET.sourceId
  ));
  if (existingGroup) {
    main.disabled = true;
    const added = document.createElement("span");
    added.className = "group-row-source";
    added.textContent = t("already_created");
    row.append(main, source, added);
  } else {
    main.addEventListener("click", async () => {
      const preset = createEarthHistoryPreset();
      eventGroups.push(...preset.groups);
      timelineEvents.push(...preset.events);
      state.showEpochMenu = false;
      state.openEditorId = null;
      state.openGroupEditorId = `group-${EARTH_HISTORY_PRESET.id}`;
      state.selectedEventId = null;
      renderEpochMenu();
      renderEventList();
      renderSearchResults();
      drawTimeline();
      ui.eventBrowserInfo.textContent = tf("loading_ranges_for", { title: EARTH_HISTORY_PRESET.title });

      try {
        await hydrateEventsFromWikidata(preset.events);
        renderEventList();
        drawTimeline();
      } catch {
        ui.eventBrowserInfo.textContent = tf("loading_ranges_failed", { title: EARTH_HISTORY_PRESET.title });
        renderEventList();
      }
    });
    row.append(main, source);
  }

  item.appendChild(row);
  ui.epochMenu.appendChild(item);
}

function hasOpenEventBranch(eventId) {
  const eventItem = getEventById(eventId);
  if (!eventItem) return false;
  if (state.openEditorId === eventId || eventItem.expanded) return true;
  return timelineEvents
    .filter((candidate) => candidate.parentEventId === eventId)
    .some((candidate) => hasOpenEventBranch(candidate.id));
}

function hasOpenGroupBranch(groupId) {
  const groupItem = getGroupById(groupId);
  if (!groupItem) return false;
  if (state.openGroupEditorId === groupId || groupItem.expanded) return true;
  return getChildGroups(groupId).some((candidate) => hasOpenGroupBranch(candidate.id))
    || getEventsForGroup(groupId)
      .filter((candidate) => candidate.parentEventId == null)
      .some((candidate) => hasOpenEventBranch(candidate.id));
}

function createEventBrowserItem(eventItem, options = {}) {
  const { child = false, depth = 0, muted = false } = options;
  const item = document.createElement("div");
  item.className = "event-browser-item";
  if (child) item.classList.add("is-child");
  if (state.openEditorId === eventItem.id) item.classList.add("is-open");
  if (muted) item.classList.add("is-focus-muted");
  item.style.setProperty("--tree-depth", String(depth));

  const row = document.createElement("div");
  row.className = "event-row";
  row.draggable = Boolean(eventItem.groupId);
  row.addEventListener("dragstart", (event) => {
    if (!eventItem.groupId) {
      event.preventDefault();
      return;
    }
    state.browserDragEventId = eventItem.id;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", eventItem.id);
  });
  row.addEventListener("dragend", () => {
    state.browserDragEventId = null;
    row.classList.remove("is-dragging");
  });
  row.addEventListener("dragover", (event) => {
    if (!canDropEventOnEvent(state.browserDragEventId, eventItem.id)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("is-drop-target");
  });
  row.addEventListener("drop", (event) => {
    const eventId = state.browserDragEventId || event.dataTransfer.getData("text/plain");
    if (!canDropEventOnEvent(eventId, eventItem.id)) return;
    event.preventDefault();
    event.stopPropagation();
    const draggedEvent = getEventById(eventId);
    if (!draggedEvent) return;
    moveEventTreeToGroup(draggedEvent.id, eventItem.groupId);
    draggedEvent.parentEventId = eventItem.id;
    eventItem.expanded = true;
    expandGroupAncestors(eventItem.groupId);
    state.browserDragEventId = null;
    renderEventList();
    drawTimeline();
  });
  const childEvents = getEventsForGroup(eventItem.groupId).filter((candidate) => candidate.parentEventId === eventItem.id);
  const hasChildEvents = childEvents.length > 0;
  const contextOpen = eventItem.expanded && hasChildEvents;
  const controlsMuted = muted || contextOpen;
  if (contextOpen) item.classList.add("is-context-open");
  row.draggable = Boolean(eventItem.groupId) && !controlsMuted;

  const checkWrap = document.createElement("label");
  checkWrap.className = "event-row-check";
  const enabledCheckbox = document.createElement("input");
  enabledCheckbox.type = "checkbox";
  enabledCheckbox.checked = eventItem.enabled;
  enabledCheckbox.disabled = controlsMuted;
  enabledCheckbox.addEventListener("change", () => {
    eventItem.enabled = enabledCheckbox.checked;
    if (!eventItem.enabled && state.selectedEventId === eventItem.id) {
      state.selectedEventId = null;
      updateSelectionPanel();
    }
    if (!eventItem.enabled && state.openEditorId === eventItem.id) {
      state.openEditorId = null;
    }
    renderEventList();
    drawTimeline();
  });
  checkWrap.appendChild(enabledCheckbox);

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "tree-row-toggle";
  toggleButton.textContent = hasChildEvents ? (eventItem.expanded ? "▾" : "▸") : "";
  toggleButton.disabled = !hasChildEvents || muted;
  toggleButton.setAttribute("aria-label", hasChildEvents ? t("show_child_events") : "");
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!hasChildEvents) return;
    eventItem.expanded = !eventItem.expanded;
    renderEventList();
  });

  const main = document.createElement("button");
  main.type = "button";
  main.className = "event-row-main";
  main.disabled = controlsMuted;
  main.addEventListener("click", () => {
    state.selectedEventId = eventItem.id;
    state.openGroupEditorId = null;
    state.openEditorId = state.openEditorId === eventItem.id ? null : eventItem.id;
    if (eventItem.groupId) {
      expandGroupAncestors(eventItem.groupId);
    }
    hideTooltip();
    updateSelectionPanel();
    renderEventList();
    drawTimeline();
  });

  main.append(createHtmlTitleContent(eventItem));

  if (!Number.isFinite(getTimelineValueForEventStart(eventItem))) {
    const warning = document.createElement("span");
    warning.className = "event-row-warning";
    warning.textContent = t("warning_missing_year_data");
    main.append(warning);
  }

  const date = document.createElement("span");
  date.className = "event-row-date";
  date.textContent = Number.isFinite(getTimelineValueForEventStart(eventItem)) ? getEventDateLabel(eventItem) : "-";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "event-row-delete";
  deleteButton.textContent = "X";
  deleteButton.disabled = controlsMuted;
  deleteButton.addEventListener("click", () => {
    const index = timelineEvents.findIndex((candidate) => candidate.id === eventItem.id);
    if (index === -1) return;
    timelineEvents.forEach((candidate) => {
      if (candidate.parentEventId === eventItem.id) {
        candidate.parentEventId = null;
      }
    });
    timelineEvents.splice(index, 1);
    if (state.openEditorId === eventItem.id) state.openEditorId = null;
    if (state.selectedEventId === eventItem.id) {
      state.selectedEventId = null;
      updateSelectionPanel();
    }
    renderEventList();
    renderSearchResults();
    drawTimeline();
  });

  row.append(checkWrap, toggleButton, main, date, deleteButton);
  item.appendChild(row);

  if (state.openEditorId === eventItem.id) {
    item.appendChild(createInlineEditor(eventItem));
  }

  return item;
}

function createGroupInlineEditor(groupItem) {
  const editor = document.createElement("div");
  editor.className = "event-inline-editor group-inline-editor";
  const rerenderGroupEditor = ({ redrawTimeline = true } = {}) => {
    const scrollTop = ui.appFrame.scrollTop;
    renderEventList();
    if (redrawTimeline) drawTimeline();
    requestAnimationFrame(() => {
      ui.appFrame.scrollTop = scrollTop;
    });
  };

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.dataset.editorNameField = "group";
  titleInput.value = groupItem.title;
  titleInput.addEventListener("change", () => {
    groupItem.title = titleInput.value.trim() || groupItem.title;
    rerenderGroupEditor({ redrawTimeline: false });
  });

  const zoomMinSelect = document.createElement("select");
  appendZoomOptions(zoomMinSelect, groupItem.visibleStepMin, t("no_default"));

  const zoomMaxSelect = document.createElement("select");
  appendZoomOptions(zoomMaxSelect, groupItem.visibleStepMax, t("no_default"));

  const applyZoomVisibility = () => {
    const min = getSelectSettingValue(zoomMinSelect.value);
    const max = getSelectSettingValue(zoomMaxSelect.value);
    groupItem.visibleStepMin = min;
    groupItem.visibleStepMax = max;
    if (typeof min === "number" && typeof max === "number" && min > max) {
      groupItem.visibleStepMin = max;
      groupItem.visibleStepMax = min;
      zoomMinSelect.value = getZoomOptionValue(groupItem.visibleStepMin);
      zoomMaxSelect.value = getZoomOptionValue(groupItem.visibleStepMax);
    }
    rerenderGroupEditor();
  };
  zoomMinSelect.addEventListener("change", applyZoomVisibility);
  zoomMaxSelect.addEventListener("change", applyZoomVisibility);

  const laneField = createLaneField(
    t("folder_display_height"),
    groupItem.lane,
    (nextValue) => {
      groupItem.lane = nextValue;
      rerenderGroupEditor();
    },
    {
      allowBarZero: true,
      allowBarNegativeZero: true,
      inheritLabel: t("no_default"),
    },
  );

  const colorInput = document.createElement("input");
  colorInput.type = "text";
  colorInput.placeholder = t("example_group_color");
  colorInput.value = groupItem.color ?? "";
  const applyGroupColorChange = (value = colorInput.value) => {
    groupItem.color = String(value).trim() || undefined;
    rerenderGroupEditor();
  };
  colorInput.addEventListener("change", () => {
    applyGroupColorChange(colorInput.value);
  });

  const zoomRow = document.createElement("div");
  zoomRow.className = "field-row year-fields";
  zoomRow.append(
    createField(t("standard_visible_from"), zoomMinSelect),
    createField(t("until").toLowerCase(), zoomMaxSelect),
  );

  editor.append(
    createField(t("folder_name"), titleInput),
    zoomRow,
    laneField,
    createColorField(t("folder_color_value"), colorInput, applyGroupColorChange),
  );
  return editor;
}

function buildEventHierarchy(groupId, parentEventId = null, depth = 0, inheritedMuted = false) {
  const directChildren = getEventsForGroup(groupId)
    .filter((eventItem) => (eventItem.parentEventId ?? null) === parentEventId);
  const activeChildId = directChildren.find((eventItem) => hasOpenEventBranch(eventItem.id))?.id ?? null;

  return directChildren.flatMap((eventItem) => {
    const ownMuted = inheritedMuted || (activeChildId != null && activeChildId !== eventItem.id);
    return [
      { eventItem, depth, muted: ownMuted },
      ...(eventItem.expanded ? buildEventHierarchy(groupId, eventItem.id, depth + 1, ownMuted) : []),
    ];
  });
}

function createGroupBrowserItem(groupItem, options = {}) {
  const { muted = false } = options;
  const container = document.createElement("div");
  container.className = "group-browser-item";
  if (groupItem.parentGroupId) container.classList.add("is-child-group");
  if (muted) container.classList.add("is-focus-muted");
  container.style.setProperty("--tree-depth", String(Math.max(0, getGroupDepth(groupItem.id) - 1)));

  const row = document.createElement("div");
  row.className = "group-row";
  row.addEventListener("dragover", (event) => {
    if (!canDropEventOnGroup(state.browserDragEventId, groupItem.id)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("is-drop-target");
  });
  row.addEventListener("drop", (event) => {
    const eventId = state.browserDragEventId || event.dataTransfer.getData("text/plain");
    if (!canDropEventOnGroup(eventId, groupItem.id)) return;
    event.preventDefault();
    const eventItem = getEventById(eventId);
    if (!eventItem) return;
    moveEventTreeToGroup(eventItem.id, groupItem.id);
    eventItem.parentEventId = null;
    groupItem.expanded = true;
    expandGroupAncestors(groupItem.id);
    state.browserDragEventId = null;
    renderEventList();
    drawTimeline();
  });
  const directChildGroups = getChildGroups(groupItem.id);
  const directEventEntries = getEventsForGroup(groupItem.id).filter((eventItem) => eventItem.parentEventId == null);
  const hasVisibleChildren = directChildGroups.length > 0 || directEventEntries.length > 0;
  const contextOpen = groupItem.expanded && hasVisibleChildren;
  const controlsMuted = muted || contextOpen;
  if (contextOpen) container.classList.add("is-context-open");

  const checkWrap = document.createElement("label");
  checkWrap.className = "event-row-check";
  const enabledCheckbox = document.createElement("input");
  enabledCheckbox.type = "checkbox";
  const checkboxState = getGroupCheckboxState(groupItem.id);
  enabledCheckbox.checked = checkboxState.checked;
  enabledCheckbox.indeterminate = checkboxState.indeterminate;
  enabledCheckbox.disabled = controlsMuted;
  enabledCheckbox.addEventListener("change", () => {
    setGroupEnabled(groupItem.id, enabledCheckbox.checked);
    renderEventList();
    drawTimeline();
  });
  checkWrap.appendChild(enabledCheckbox);

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "group-row-toggle";
  toggleButton.disabled = muted;
  toggleButton.textContent = groupItem.expanded ? "▾" : "▸";
  toggleButton.addEventListener("click", () => {
    groupItem.expanded = !groupItem.expanded;
    renderEventList();
  });

  const main = document.createElement("div");
  main.className = "group-row-main";
  main.classList.toggle("is-disabled", controlsMuted);

  const title = document.createElement("strong");
  title.textContent = groupItem.title;
  const meta = document.createElement("span");
  const deepEventCount = getGroupEventsDeep(groupItem.id).length;
  meta.textContent = deepEventCount === 0 && directChildGroups.length === 0
    ? t("event_count_summary_zero")
    : tf("event_count_summary", { events: deepEventCount, folders: directChildGroups.length });
  main.append(title, meta);

  const source = document.createElement("span");
  source.className = "group-row-source";
  source.textContent = groupItem.sourceId ? `Wikidata ${groupItem.sourceId}` : t("local_group");

  const addSubgroupButton = document.createElement("button");
  addSubgroupButton.type = "button";
  addSubgroupButton.className = "group-row-export group-row-subgroup";
  addSubgroupButton.disabled = controlsMuted;
  addSubgroupButton.textContent = t("add_subfolder");
  addSubgroupButton.addEventListener("click", () => {
    const newGroup = createEmptyGroup(groupItem.id);
    eventGroups.push(newGroup);
    groupItem.expanded = true;
    state.openEditorId = null;
    state.openGroupEditorId = newGroup.id;
    renderEventList();
    focusEditorNameField("group", { reveal: true, behavior: "auto" });
  });

  const propertiesButton = document.createElement("button");
  propertiesButton.type = "button";
  propertiesButton.className = "group-row-export group-row-properties";
  if (state.openGroupEditorId === groupItem.id) {
    propertiesButton.classList.add("is-active");
  }
  propertiesButton.disabled = controlsMuted;
  propertiesButton.textContent = "⚙";
  propertiesButton.setAttribute("aria-label", t("folder_properties"));
  propertiesButton.addEventListener("click", () => {
    state.openEditorId = null;
    state.openGroupEditorId = state.openGroupEditorId === groupItem.id ? null : groupItem.id;
    renderEventList();
  });

  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.className = "group-row-export";
  exportButton.disabled = controlsMuted;
  exportButton.textContent = t("export_label");
  exportButton.addEventListener("click", () => {
    downloadFolderExport(groupItem.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "event-row-delete";
  deleteButton.disabled = controlsMuted;
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => {
    const descendantIds = new Set(getDescendantGroupIds(groupItem.id));
    if (state.openGroupEditorId && descendantIds.has(state.openGroupEditorId)) {
      state.openGroupEditorId = null;
    }
    for (let index = timelineEvents.length - 1; index >= 0; index -= 1) {
      if (descendantIds.has(timelineEvents[index].groupId)) {
        if (state.openEditorId === timelineEvents[index].id) state.openEditorId = null;
        if (state.selectedEventId === timelineEvents[index].id) state.selectedEventId = null;
        timelineEvents.splice(index, 1);
      }
    }
    for (let index = eventGroups.length - 1; index >= 0; index -= 1) {
      if (descendantIds.has(eventGroups[index].id)) {
        eventGroups.splice(index, 1);
      }
    }
    renderEpochMenu();
    renderEventList();
    renderSearchResults();
    updateSelectionPanel();
    drawTimeline();
  });

  row.append(checkWrap, toggleButton, main, source, addSubgroupButton, propertiesButton, exportButton, deleteButton);
  container.appendChild(row);

  if (state.openGroupEditorId === groupItem.id) {
    container.appendChild(createGroupInlineEditor(groupItem));
  }

  if (groupItem.expanded) {
    const children = buildEventHierarchy(groupItem.id);
    const childGroups = directChildGroups;
    const activeChildGroupId = childGroups.find((childGroupItem) => hasOpenGroupBranch(childGroupItem.id))?.id ?? null;
    const activeChildEventId = directEventEntries.find((eventItem) => hasOpenEventBranch(eventItem.id))?.id ?? null;
    const childList = document.createElement("div");
    childList.className = "group-children";
    if (childGroups.length === 0 && children.length === 0) {
      const empty = document.createElement("div");
      empty.className = "group-empty";
      empty.textContent = t("no_events_in_epoch");
      childList.appendChild(empty);
    } else {
      childGroups.forEach((childGroupItem) => {
        const childMuted = activeChildGroupId != null || activeChildEventId != null
          ? activeChildGroupId !== childGroupItem.id
          : false;
        childList.appendChild(createGroupBrowserItem(childGroupItem, { muted: childMuted }));
      });
      children.forEach(({ eventItem, depth, muted: childMuted }) => {
        const directListMuted = eventItem.parentEventId == null && (activeChildGroupId != null || activeChildEventId != null)
          ? activeChildEventId !== eventItem.id
          : false;
        childList.appendChild(createEventBrowserItem(eventItem, {
          child: true,
          depth: depth + 1,
          muted: childMuted || directListMuted,
        }));
      });
    }
    container.appendChild(childList);
  }

  return container;
}

function renderEventList() {
  sanitizeEventHierarchy();
  ui.eventList.replaceChildren();
  const browserGroups = getBrowserGroups();
  const ungroupedEvents = getUngroupedEvents();
  ui.eventBrowserInfo.textContent = tf("browser_info", { events: timelineEvents.length, folders: browserGroups.length });

  if (timelineEvents.length === 0 && browserGroups.length === 0) {
    ui.editorEmptyState.hidden = false;
    const emptyState = document.createElement("p");
    emptyState.className = "event-description";
    emptyState.textContent = t("browser_empty");
    ui.eventList.appendChild(emptyState);
    return;
  }

  ui.editorEmptyState.hidden = true;
  browserGroups.forEach((groupItem) => {
    ui.eventList.appendChild(createGroupBrowserItem(groupItem));
  });

  ungroupedEvents.forEach((eventItem) => {
    ui.eventList.appendChild(createEventBrowserItem(eventItem));
  });
}

function pan(direction) {
  hideTooltip();
  state.subYearTickAnchorValue = null;
  state.centerYear += direction * getStepYears();
  drawTimeline();
}

function zoom(direction) {
  const currentStep = getStep();
  const nextIndex = clamp(state.stepIndex + direction, 0, scaleSteps.length - 1);
  if (nextIndex === state.stepIndex) return;
  hideTooltip();
  const nextStep = scaleSteps[nextIndex];
  const isSubYearTransition = currentStep.unit !== "year" || nextStep.unit !== "year";
  const anchoredValue = state.selectedTickValue ?? getClosestVisibleTickValue(state.centerYear);
  const ratio = state.selectedTickValue != null
    ? getRatioForTimelineValue(state.selectedTickValue)
    : 0.5;
  state.subYearTickAnchorValue = isSubYearTransition && state.selectedTickValue == null
    ? anchoredValue
    : null;
  state.stepIndex = nextIndex;
  const newHalfRange = Math.floor(state.tickCount / 2) * getStepYears();
  state.centerYear = anchoredValue - ((ratio * 2) - 1) * newHalfRange;
  drawTimeline();
}

function zoomAtClientX(direction, clientX) {
  const currentStep = getStep();
  const nextIndex = clamp(state.stepIndex + direction, 0, scaleSteps.length - 1);
  if (nextIndex === state.stepIndex) return;
  hideTooltip();

  const nextStep = scaleSteps[nextIndex];
  const anchoredValue = state.selectedTickValue ?? getTimelineValueAtRatio(getTimelineRatioForClientX(clientX));
  const ratio = state.selectedTickValue != null
    ? getRatioForTimelineValue(state.selectedTickValue)
    : getTimelineRatioForClientX(clientX);

  state.subYearTickAnchorValue = state.selectedTickValue == null && (currentStep.unit !== "year" || nextStep.unit !== "year")
    ? anchoredValue
    : null;
  state.stepIndex = nextIndex;
  const newHalfRange = Math.floor(state.tickCount / 2) * getStepYears();
  state.centerYear = anchoredValue - ((ratio * 2) - 1) * newHalfRange;
  drawTimeline();
}

function resetView() {
  state.subYearTickAnchorValue = null;
  state.centerYear = getNowTimelineValue();
  state.stepIndex = scaleSteps.findIndex((step) => step.id === "1a");
  clearSelectedEvent();
}

function handleWheel(event) {
  event.preventDefault();
  if (ui.appFrame.scrollTop > 40 && event.deltaY < 0) {
    hideTooltip();
    scrollToTimeline();
    return;
  }
  const direction = event.deltaY > 0 ? 1 : -1;
  if (event.shiftKey) {
    zoomAtClientX(direction, event.clientX);
    return;
  }
  pan(direction);
}

function handleScrollAnchor() {
  hideTooltip();
  if (!state.anchorDetailsOnScrollBack || state.snappingBackToTimeline) return;
  const scrollTop = ui.appFrame.scrollTop;
  const threshold = Math.max(120, window.innerHeight * 0.35);
    if (scrollTop < threshold) {
      state.snappingBackToTimeline = true;
      state.anchorDetailsOnScrollBack = false;
      clearSelectedEvent();
      scrollToTimeline();
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
    ui.searchStatus.textContent = tf("loading_result", { title: result.label });
    const eventItem = await addWikidataResult(result);
    state.pendingAdds.delete(result.id);
      if (eventItem) {
        ui.searchStatus.textContent = tf("result_added", { title: eventItem.title });
        state.openGroupEditorId = null;
        state.openEditorId = eventItem.id;
        selectEvent(eventItem.id, true);
        renderEventList();
        scrollToDetails("auto");
        focusEditorNameField("event", { reveal: true, behavior: "auto" });
      } else {
      checkbox.checked = false;
      checkbox.disabled = false;
      ui.searchStatus.textContent = tf("result_no_years", { title: result.label });
    }
    renderSearchResults();
  });

  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = `${result.label} (${result.id})`;
  const description = document.createElement("span");
  description.textContent = result.description || t("no_description");
  const meta = document.createElement("small");
  meta.textContent = checkbox.checked ? t("search_added") : t("search_add_hint");
  content.append(title, description, meta);

  wrapper.append(checkbox, content);
  return wrapper;
}

async function handleImportFolderFile(event) {
  const [file] = Array.from(event.target.files ?? []);
  if (!file) return;

  try {
    const fileContent = await file.text();
    const payload = JSON.parse(fileContent);
    await importFolderPayload(payload);
    scrollToDetails();
  } catch {
    ui.eventBrowserInfo.textContent = t("import_failed");
  } finally {
    event.target.value = "";
  }
}

function renderSearchResults() {
  ui.searchResults.replaceChildren();
  if (state.searchResults.length === 0) {
    const hint = document.createElement("p");
    hint.className = "event-description";
    hint.textContent = t("search_empty");
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
    language: getWikidataLanguageCode(),
    uselang: getWikidataLanguageCode(),
    type: "item",
    limit: "10",
    search: query,
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("wikidata-search-failed");
  return normalizeSearchResults(await response.json());
}

function extractTimeInfoFromTimeValue(timeValue) {
  if (!timeValue?.time) return null;
  const match = /^([+-]\d+)-(\d{2})-(\d{2})T/.exec(timeValue.time);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const precision = Number(timeValue.precision ?? 9);
  let value = year;

  if (precision >= 11) {
    value = buildTimelineValue(year, month, day);
  } else if (precision >= 10) {
    value = buildTimelineValue(year, month, 1);
  }

  return { year, month, day, precision, value };
}

function getClaimTimeInfo(entity, propertyId) {
  const claims = entity.claims?.[propertyId];
  const timeValue = claims?.[0]?.mainsnak?.datavalue?.value;
  return extractTimeInfoFromTimeValue(timeValue);
}

function getClaimYear(entity, propertyId) {
  return getClaimTimeInfo(entity, propertyId)?.year ?? null;
}

function getFlagImageUrl(entity) {
  const claims = entity.claims?.P41;
  const fileName = claims?.[0]?.mainsnak?.datavalue?.value;
  return buildCommonsFileUrl(fileName);
}

function getWikidataYears(entity) {
  const birthTime = getClaimTimeInfo(entity, "P569");
  const deathTime = getClaimTimeInfo(entity, "P570");
  if (birthTime && deathTime) {
    return {
      startYear: Math.min(birthTime.year, deathTime.year),
      endYear: Math.max(birthTime.year, deathTime.year),
      startDateValue: Math.min(birthTime.value, deathTime.value),
      endDateValue: Math.max(birthTime.value, deathTime.value),
      startPrecision: birthTime.year <= deathTime.year ? birthTime.precision : deathTime.precision,
      endPrecision: birthTime.year <= deathTime.year ? deathTime.precision : birthTime.precision,
    };
  }

  const pointCandidates = ["P585", "P571", "P577", "P569", "P570", "P580"];
  const rangeStart = getClaimTimeInfo(entity, "P580") ?? getClaimTimeInfo(entity, "P571");
  const rangeEnd = getClaimTimeInfo(entity, "P582") ?? getClaimTimeInfo(entity, "P576") ?? getClaimTimeInfo(entity, "P570");
  if (rangeStart && rangeEnd) {
    const startsEarlier = rangeStart.value <= rangeEnd.value;
    return {
      startYear: Math.min(rangeStart.year, rangeEnd.year),
      endYear: Math.max(rangeStart.year, rangeEnd.year),
      startDateValue: Math.min(rangeStart.value, rangeEnd.value),
      endDateValue: Math.max(rangeStart.value, rangeEnd.value),
      startPrecision: startsEarlier ? rangeStart.precision : rangeEnd.precision,
      endPrecision: startsEarlier ? rangeEnd.precision : rangeStart.precision,
    };
  }

  for (const propertyId of pointCandidates) {
    const pointTime = getClaimTimeInfo(entity, propertyId);
    if (pointTime) {
      return {
        startYear: pointTime.year,
        endYear: pointTime.year,
        startDateValue: pointTime.value,
        endDateValue: pointTime.value,
        startPrecision: pointTime.precision,
        endPrecision: pointTime.precision,
      };
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
    languages: getWikidataLanguageFallbacks(),
    languagefallback: "1",
    props: "labels|descriptions|claims",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Wikidata-Details konnten nicht geladen werden");
  const payload = await response.json();
  return payload.entities?.[entityId] ?? null;
}

async function fetchWikidataEntities(entityIds) {
  const ids = [...new Set(entityIds.filter(Boolean))];
  if (ids.length === 0) return {};
  const chunkSize = 40;
  const entities = {};

  for (let index = 0; index < ids.length; index += chunkSize) {
    const chunk = ids.slice(index, index + chunkSize);
    const url = new URL(WIKIDATA_API_URL);
    url.search = new URLSearchParams({
      action: "wbgetentities",
      format: "json",
      origin: "*",
      ids: chunk.join("|"),
      languages: getWikidataLanguageFallbacks(),
      languagefallback: "1",
      props: "labels|descriptions|claims",
    }).toString();

    const response = await fetch(url);
    if (!response.ok) throw new Error("Wikidata-Details konnten nicht geladen werden");
    const payload = await response.json();
    Object.assign(entities, payload.entities ?? {});
  }

  return entities;
}

function buildEventFromWikidata(entityId, entity, searchFallback) {
  const years = getWikidataYears(entity);
  const preferredLanguage = getWikidataLanguageCode();
  const fallbackLanguage = preferredLanguage === "de" ? "en" : "de";
  const label = entity.labels?.[preferredLanguage]?.value || entity.labels?.[fallbackLanguage]?.value || searchFallback.label || entityId;
  const description = entity.descriptions?.[preferredLanguage]?.value || entity.descriptions?.[fallbackLanguage]?.value || searchFallback.description || "";
  return {
    id: `wikidata-${entityId}`,
    source: "wikidata",
    sourceId: entityId,
    startYear: years?.startYear ?? null,
    endYear: years?.endYear ?? null,
    startDateValue: years?.startDateValue ?? years?.startYear ?? null,
    endDateValue: years?.endDateValue ?? years?.endYear ?? null,
    startPrecision: years?.startPrecision ?? null,
    endPrecision: years?.endPrecision ?? null,
    endIsToday: false,
    isRange: years ? (years.startDateValue !== years.endDateValue || years.startYear !== years.endYear) : false,
    visibleStepMin: undefined,
    visibleStepMax: undefined,
    lane: undefined,
    displayMode: "line",
    color: undefined,
    flagImageUrl: null,
    title: label,
    description,
    category: "",
    groupId: null,
    parentEventId: null,
    relationLineStyle: "none",
    relationDirection: "parent-to-child",
    enabled: true,
  };
}

function applyWikidataEntityToEvent(eventItem, entity, fallback = {}) {
  if (!eventItem || !entity) return;
  const years = getWikidataYears(entity);
  const preferredLanguage = getWikidataLanguageCode();
  const fallbackLanguage = preferredLanguage === "de" ? "en" : "de";
  const label = entity.labels?.[preferredLanguage]?.value || entity.labels?.[fallbackLanguage]?.value || fallback.label || eventItem.title || eventItem.sourceId;
  const description = entity.descriptions?.[preferredLanguage]?.value || entity.descriptions?.[fallbackLanguage]?.value || fallback.description || eventItem.description || "";

  eventItem.title = label;
  eventItem.description = description;
  eventItem.flagImageUrl = getFlagImageUrl(entity);
  if (!eventItem.displayMode) {
    eventItem.displayMode = eventItem.category === "Epoche" ? "bar" : "line";
  }
  if (years) {
    eventItem.startYear = years.startYear;
    eventItem.endYear = years.endYear;
    eventItem.startDateValue = years.startDateValue ?? years.startYear;
    eventItem.endDateValue = years.endDateValue ?? years.endYear;
    eventItem.startPrecision = years.startPrecision ?? 9;
    eventItem.endPrecision = years.endPrecision ?? 9;
    eventItem.endIsToday = false;
    eventItem.isRange = years.startDateValue !== years.endDateValue || years.startYear !== years.endYear;
  } else {
    eventItem.startYear = null;
    eventItem.endYear = null;
    eventItem.startDateValue = null;
    eventItem.endDateValue = null;
    eventItem.startPrecision = null;
    eventItem.endPrecision = null;
    eventItem.endIsToday = false;
    eventItem.isRange = eventItem.category === "Aeon"
      || eventItem.category === "Aera"
      || eventItem.category === "Periode"
      || eventItem.category === "Epoche";
  }
  normalizeEventDisplaySettings(eventItem);
}

function applyWikidataLocalizationToEvent(eventItem, entity, fallback = {}) {
  if (!eventItem || !entity) return;
  const preferredLanguage = getWikidataLanguageCode();
  const fallbackLanguage = preferredLanguage === "de" ? "en" : "de";
  const label = entity.labels?.[preferredLanguage]?.value || entity.labels?.[fallbackLanguage]?.value || fallback.label;
  const description = entity.descriptions?.[preferredLanguage]?.value || entity.descriptions?.[fallbackLanguage]?.value || fallback.description;

  if (label) {
    eventItem.title = label;
  }
  if (description) {
    eventItem.description = description;
  }

  const flagImageUrl = getFlagImageUrl(entity);
  if (flagImageUrl) {
    eventItem.flagImageUrl = flagImageUrl;
  }
}

function applyWikidataEntityToGroup(groupItem, entity) {
  if (!groupItem || !entity) return;
  const preferredLanguage = getWikidataLanguageCode();
  const fallbackLanguage = preferredLanguage === "de" ? "en" : "de";
  const label = entity.labels?.[preferredLanguage]?.value || entity.labels?.[fallbackLanguage]?.value;
  const description = entity.descriptions?.[preferredLanguage]?.value || entity.descriptions?.[fallbackLanguage]?.value;
  if (label) {
    groupItem.title = label;
  }
  if (description) {
    groupItem.description = description;
  }
}

async function refreshLocalizedWikidataContent() {
  const wikidataEvents = timelineEvents.filter((eventItem) => eventItem?.sourceId && eventItem.source === "wikidata");
  const wikidataGroups = eventGroups.filter((groupItem) => groupItem?.sourceId && groupItem.source === "wikidata-preset");
  const allIds = [
    ...wikidataEvents.map((eventItem) => eventItem.sourceId),
    ...wikidataGroups.map((groupItem) => groupItem.sourceId),
  ];

  if (allIds.length === 0) return;

  try {
    const entities = await fetchWikidataEntities(allIds);
    wikidataEvents.forEach((eventItem) => {
      const entity = entities[eventItem.sourceId];
      if (!entity) return;
      applyWikidataLocalizationToEvent(eventItem, entity);
    });
    wikidataGroups.forEach((groupItem) => {
      const entity = entities[groupItem.sourceId];
      if (!entity) return;
      applyWikidataEntityToGroup(groupItem, entity);
    });
  } catch {
    // Keep current visible texts if a language refresh from Wikidata fails.
  }
}

async function hydrateEventsFromWikidata(eventItems) {
  const pendingEvents = eventItems.filter((eventItem) => eventItem?.sourceId);
  if (pendingEvents.length === 0) return;

  const ids = pendingEvents.map((eventItem) => eventItem.sourceId);
  const entities = await fetchWikidataEntities(ids);
  pendingEvents.forEach((eventItem) => {
    const entity = entities[eventItem.sourceId];
    if (!entity) return;
    applyWikidataEntityToEvent(eventItem, entity);
  });
}

async function ensureEventFlag(eventItem) {
  if (!eventItem || eventItem.source !== "wikidata" || !eventItem.sourceId || eventItem.flagImageUrl) {
    return;
  }
  try {
    const entity = await fetchWikidataEntity(eventItem.sourceId);
    if (!entity) return;
    eventItem.flagImageUrl = getFlagImageUrl(entity);
  } catch {
    // Ignore flag lookup failures and keep the text-only fallback.
  }
}

async function addWikidataResult(result) {
  const existing = timelineEvents.find((eventItem) => eventItem.sourceId === result.id);

  try {
    const entity = await fetchWikidataEntity(result.id);
    if (!entity) return null;
    const importedEvent = buildEventFromWikidata(result.id, entity, result);

    if (existing) {
      applyWikidataEntityToEvent(existing, entity, result);
      existing.enabled = true;

      // Refresh empty/default metadata from the current Wikidata payload without
      // overwriting user edits indiscriminately.
      if (!existing.title || existing.title === result.label) {
        existing.title = importedEvent.title;
      }
      if (!existing.description || existing.description === result.description) {
        existing.description = importedEvent.description;
      }
      if (!existing.category || existing.category === "Wikidata") {
        existing.category = importedEvent.category;
      }
      if (existing.visibleStepMin === undefined) existing.visibleStepMin = null;
      if (existing.visibleStepMax === undefined) existing.visibleStepMax = null;
      if (existing.lane === undefined) existing.lane = null;
      if (!existing.displayMode) existing.displayMode = importedEvent.displayMode;
      normalizeEventDisplaySettings(existing);
      return existing;
    }

    timelineEvents.push(importedEvent);
    return importedEvent;
  } catch {
    if (existing) {
      existing.enabled = true;
      return existing;
    }
    return null;
  }
}

async function handleSearchSubmit(event) {
  event.preventDefault();
  const query = ui.searchInput.value.trim();
  if (!query) {
    ui.searchStatus.textContent = t("search_enter_query");
    return;
  }

  ui.searchStatus.textContent = tf("search_loading", { query });
  try {
    state.searchResults = await searchWikidata(query);
    ui.searchStatus.textContent = state.searchResults.length > 0
      ? tf("search_results_found", { count: state.searchResults.length })
      : t("search_no_results");
  } catch {
    state.searchResults = [];
    ui.searchStatus.textContent = t("search_failed");
  }
  renderSearchResults();
}

function bindEvents() {
  svg.addEventListener("wheel", handleWheel, { passive: false });
  svg.addEventListener("click", (event) => {
    if (event.target === svg) {
      hideTooltip();
      drawTimeline();
    }
  });
  window.addEventListener("resize", requestRedraw);
  ui.appFrame.addEventListener("scroll", handleScrollAnchor, { passive: true });
  ui.searchForm.addEventListener("submit", handleSearchSubmit);
  ui.languageSelect.addEventListener("change", async () => {
    await applyLanguage(ui.languageSelect.value);
  });
  ui.timelineMenuButton.addEventListener("click", toggleTimelineMenu);
  ui.timelineMenuCloseButton.addEventListener("click", () => {
    setTimelineMenuOpen(false);
  });
  ui.timelineMenuOverlay.addEventListener("click", () => {
    setTimelineMenuOpen(false);
  });
  ui.openWorkspaceStrip.addEventListener("click", (event) => {
    handleWorkspaceStripOpen(event, "auto");
  });
  ui.openWorkspaceStrip.addEventListener("pointerup", (event) => {
    handleWorkspaceStripOpen(event, "auto");
  });
  ui.openWorkspaceStrip.addEventListener("dblclick", (event) => {
    event.preventDefault();
    openWorkspace("auto");
  });
  ui.openWorkspaceStrip.addEventListener("touchend", (event) => {
    event.preventDefault();
    openWorkspace("auto");
  }, { passive: false });
  ui.openWorkspaceStrip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      handleWorkspaceStripOpen(event);
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.timelineMenuOpen) {
      setTimelineMenuOpen(false);
    }
  });
  ui.openWorkspaceStrip.addEventListener("wheel", (event) => {
    handleWorkspaceStripOpen(event);
  }, { passive: false });
  ui.fullscreenButton.addEventListener("pointerup", (event) => {
    event.stopPropagation();
  });
  ui.fullscreenButton.addEventListener("click", toggleFullscreen);
  ui.addCustomEventButton.addEventListener("click", () => {
    const newEvent = createEmptyEvent();
    timelineEvents.push(newEvent);
    state.openGroupEditorId = null;
    state.openEditorId = newEvent.id;
    selectEvent(newEvent.id, true);
    renderEventList();
    scrollToDetails("auto");
    focusEditorNameField("event", { reveal: true, behavior: "auto" });
  });
  ui.addFolderButton.addEventListener("click", () => {
    const newGroup = createEmptyGroup();
    eventGroups.push(newGroup);
    state.openEditorId = null;
    state.openGroupEditorId = newGroup.id;
    renderEventList();
    scrollToDetails("auto");
    focusEditorNameField("group", { reveal: true, behavior: "auto" });
  });
  ui.addEpochGroupButton.addEventListener("click", () => {
    state.showEpochMenu = !state.showEpochMenu;
    renderEpochMenu();
  });
  ui.importFolderButton.addEventListener("click", () => {
    ui.importFolderInput.click();
  });
  ui.importFolderInput.addEventListener("change", handleImportFolderFile);

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
  ui.focusNowButton.addEventListener("click", toggleTodayFocus);

  window.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.code === "Space") && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      if (isTextEditingElement(document.activeElement) || !isTimelineWindowActive()) {
        return;
      }
      event.preventDefault();
      toggleTodayFocus();
      return;
    }
    hideTooltip();
    if (event.shiftKey && event.key === "ArrowUp") {
      event.preventDefault();
      zoom(-1);
      return;
    }
    if (event.shiftKey && event.key === "ArrowDown") {
      event.preventDefault();
      zoom(1);
      return;
    }
    if (event.key === "ArrowLeft") pan(-1);
    if (event.key === "ArrowRight") pan(1);
    if (event.key === "+" || event.key === "=") zoom(-1);
    if (event.key === "-") zoom(1);
  });
}

function init() {
  loadLanguagePreference();
  populateLanguageSelect();
  bindEvents();
  applyStaticTranslations();
  updateSelectionPanel();
  renderEpochMenu();
  renderEventList();
  renderSearchResults();
  drawTimeline();
}

init();
