const SVG_NS = "http://www.w3.org/2000/svg";
const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";
const OWID_SEARCH_API_URL = "https://ourworldindata.org/api/search";

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
  importChartButton: document.getElementById("importChartButton"),
  importChartInput: document.getElementById("importChartInput"),
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
  searchLoadingPanel: document.getElementById("searchLoadingPanel"),
  searchLoadingLabel: document.getElementById("searchLoadingLabel"),
  searchLoadingPercent: document.getElementById("searchLoadingPercent"),
  searchLoadingFill: document.getElementById("searchLoadingFill"),
  searchLoadingText: document.getElementById("searchLoadingText"),
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
  editorPanel: document.querySelector(".editor-panel"),
  searchPanel: document.querySelector(".search-panel"),
  searchPanelLabel: document.getElementById("searchPanelLabel"),
  searchPanelTitle: document.getElementById("searchPanelTitle"),
  eventSourceLabel: document.getElementById("eventSourceLabel"),
  eventSourceSelect: document.getElementById("eventSourceSelect"),
  searchSubmitButton: document.getElementById("searchSubmitButton"),
  chartStatus: document.getElementById("chartStatus"),
  chartSearchResults: document.getElementById("chartSearchResults"),
  chartSearchForm: document.getElementById("chartSearchForm"),
  chartSearchInput: document.getElementById("chartSearchInput"),
  chartSearchSubmitButton: document.getElementById("chartSearchSubmitButton"),
  chartSourceLabel: document.getElementById("chartSourceLabel"),
  chartSourceSelect: document.getElementById("chartSourceSelect"),
  modeEventsButton: document.getElementById("modeEventsButton"),
  modeChartsButton: document.getElementById("modeChartsButton"),
  modeSourcesButton: document.getElementById("modeSourcesButton"),
  eventsModePanel: document.getElementById("eventsModePanel"),
  chartsModePanel: document.getElementById("chartsModePanel"),
  sourcesModePanel: document.getElementById("sourcesModePanel"),
  sourcesSourceLabel: document.getElementById("sourcesSourceLabel"),
  sourcesSourceSelect: document.getElementById("sourcesSourceSelect"),
  sourcesSearchForm: document.getElementById("sourcesSearchForm"),
  sourcesSearchInput: document.getElementById("sourcesSearchInput"),
  sourcesSearchSubmitButton: document.getElementById("sourcesSearchSubmitButton"),
  sourcesStatus: document.getElementById("sourcesStatus"),
  sourcesResults: document.getElementById("sourcesResults"),
  sourcesPlaceholder: document.getElementById("sourcesPlaceholder"),
  chartStripControls: document.getElementById("chartStripControls"),
  toggleChartsButton: document.getElementById("toggleChartsButton"),
  toggleYAxisButton: document.getElementById("toggleYAxisButton"),
  confirmDeleteModal: document.getElementById("confirmDeleteModal"),
  confirmDeleteBackdrop: document.getElementById("confirmDeleteBackdrop"),
  confirmDeleteTitle: document.getElementById("confirmDeleteTitle"),
  confirmDeleteMessage: document.getElementById("confirmDeleteMessage"),
  confirmDeleteCancelButton: document.getElementById("confirmDeleteCancelButton"),
  confirmDeleteConfirmButton: document.getElementById("confirmDeleteConfirmButton"),
};

const timelineEvents = [];
const eventGroups = [];
const chartItems = [];
const DAYS_PER_YEAR = 365.2425;
const SAFE_DATE_YEAR_LIMIT = 275000;
const MONTH_LABELS = {
  de: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const BAR_DEFAULT_COLOR = "#6f8f52";
const TIMELINE_PADDING_X = 80;
const TIMEMAP_FOLDER_EXPORT_VERSION = 1;
const POSITIVE_LANES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const NEGATIVE_LANES = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14];
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
    timeline_menu_open: "Menü öffnen",
    timeline_menu_close: "Menü schließen",
    timeline_menu: "Menü",
    timeline_menu_title: "Zeitstrahl-Menü",
    menu_language_title: "1. Sprachauswahl",
    menu_language_label: "Sprache",
    menu_language_description: "Deutsch und Englisch sind bereits funktional. Weitere EU-Sprachen plus Ukrainisch sind vorbereitet.",
    menu_help_title: "2. Hilfe zur Funktionsweise der App",
    menu_help_description: "Platz für eine kurze Einführung, Bedienhinweise und erklärende Beispiele.",
    menu_apps_title: "3. Wechsel zu anderen Applikationen",
    menu_apps_description: "Vorbereitung für weitere Werkzeuge wie GenMap zur Anzeige genealogischer GEDCOM-Dateien.",
    menu_visual_tools_title: "4. Weitere Data-Visualisation Tools",
    menu_visual_tools_description: "Bereich für künftige Module und alternative Visualisierungsansichten.",
    reset_view: "Startansicht",
    zoom_in: "Zoomen +",
    zoom_out: "Zoomen -",
    today: "Heute",
    timeline_aria: "Interaktiver historischer Zahlenstrahl",
    workspace_strip: "Ereignisbibliothek",
    fullscreen_toggle: "Vollbild umschalten",
    editor_panel_label: "Bearbeitung",
    editor_panel_title: "Ereignisbibliothek",
    editor_empty: "Füge über die Suche rechts ein Wikidata-Ereignis hinzu oder wähle einen vorhandenen Eintrag aus dem Zeitstrahl.",
    event_library_label: "Ereignisbrowser",
    add_event: "Ereignis",
    add_folder: "Ordner",
    add_more: "Hinzufügen",
    import: "Importieren",
    data_mode_events: "Ereignisse",
    data_mode_charts: "Charts",
    data_mode_sources: "Quellen",
    search_panel_label: "Wikidata-Suche",
    search_panel_title: "Einträge finden und hinzufügen",
    chart_panel_label: "Chart-Suche",
    chart_panel_title: "Charts finden und importieren",
    sources_panel_label: "Quellen",
    sources_panel_title: "Quellen und Datensätze",
    search_placeholder: "Wikidata durchsuchen",
    search_button: "Suchen",
    search_default: "Suche nach historischen Ereignissen, Personen, Epochen oder Bauwerken.",
    loading_label: "Ladevorgang",
    loading_prepare: "Bereite Ladevorgang vor ...",
    loading_processing_result: "Verarbeite {title} und übernehme die Daten in den Zeitstrahl ...",
    loading_update_view: "Aktualisiere Ansicht und Editor ...",
    loading_read_file: "Lese Datei {title} ...",
    loading_parse_file: "Prüfe und verarbeite die Importdatei ...",
    loading_import_folder: "Importiere Ordner {title} ...",
    loading_localize_content: "Aktualisiere Sprachdaten und Anzeigen ...",
    no_description: "Keine Beschreibung vorhanden.",
    no_event_selected: "Kein Ereignis ausgewählt",
    click_marker_hint: "Klicke auf einen Marker auf dem Zeitstrahl oder füge rechts ein Wikidata-Element hinzu.",
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
    arrow_down_right: "Master -> Slave",
    arrow_up_left: "Slave -> Master",
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
    folder: "Ordner",
    folder_relation_hint: "Ordnen Sie das Ereignis in einen Ordner, um es einem Ereignis darin zuordnen zu können und es grafisch zu verknüpfen.",
    description: "Beschreibung",
    folder_name: "Ordnername",
    standard_visible_from: "Standard sichtbar von",
    folder_force_settings: "Zuweisung der Ordnereigenschaften erzwingen",
    inherit_folder: "vom Ordner erben",
    example_start: "z. B. 1789 oder -66 Ma",
    example_end: "z. B. 1799, -65 Ma oder heute",
    example_color: "vom Ordner erben oder z. B. #6f8f52",
    example_group_color: "z. B. #6f8f52",
    soon_suffix: "bald",
    no_year_data: "Jahresdaten fehlen",
    axis_point: "Achsenpunkt",
    color_pick_aria: "auswählen",
    no_limit: "keine Einschränkung",
    automatic: "Automatisch",
    bar_upper_zero: "+0 für Balken",
    bar_lower_zero: "-0 unterhalb",
    above_suffix: "oberhalb",
    below_suffix: "unterhalb",
    uncategorized: "Unkategorisiert",
    no_default: "keine Vorgabe",
    color_value: "Farbwert",
    folder_color_value: "Standard-Farbwert",
    display_height: "Darstellungshöhe",
    folder_display_height: "Standard-Darstellungshöhe",
    contains_earth_history: "enthält Äon, Ära, Periode und Epoche aus der lokalen Referenz",
    already_created: "bereits angelegt",
    loading_ranges_for: "Lade Zeiträume für {title} aus Wikidata ...",
    loading_ranges_failed: "Zeiträume für {title} konnten nicht automatisch geladen werden.",
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
    search_add_hint: "Haken setzen zum Hinzufügen",
    search_added: "Bereits hinzugefügt",
    import_failed: "Import fehlgeschlagen. Bitte eine gültige TimeMap-JSON wählen.",
    search_empty: "Noch keine Treffer. Starte oben eine Suche in Wikidata.",
    search_enter_query: "Bitte gib zuerst einen Suchbegriff ein.",
    search_loading: "Suche nach \"{query}\" in Wikidata ...",
    search_results_found: "{count} Treffer gefunden.",
    search_no_results: "Keine Treffer gefunden.",
    search_failed: "Die Wikidata-Suche konnte nicht geladen werden. Bitte später erneut versuchen.",
    loading_result: "Lade {title} aus Wikidata ...",
    result_added: "{title} wurde hinzugefügt und kann jetzt links bearbeitet werden.",
    result_no_years: "Zu {title} konnten keine brauchbaren Zeitdaten geladen werden.",
    folder_exported: "Ordner {title} wurde als JSON exportiert.",
    folder_imported: "Ordner {title} wurde importiert.",
    folder_imported_generic: "Ordner wurde importiert.",
    chart_import: "Chart importieren",
    chart_status_default: "Importiere lokale JSON-Charts, um Zeitreihen auf dem Zeitstrahl darzustellen.",
    chart_status_imported: "Chart {title} wurde importiert.",
    chart_import_failed: "Chart-Import fehlgeschlagen. Bitte eine gültige Chart-JSON wählen.",
    chart_search_placeholder: "Charts durchsuchen",
    chart_search_default: "Suche nach Chart-Datenquellen. Zuerst ist Our World in Data angebunden.",
    chart_search_loading: "Suche nach \"{query}\" in {source} ...",
    chart_search_no_results: "Keine Chart-Treffer gefunden.",
    chart_search_failed: "Die Chart-Suche konnte nicht geladen werden. Bitte später erneut versuchen.",
    chart_search_results_found: "{count} Chart-Treffer gefunden.",
    chart_source_owid: "Our World in Data",
    chart_source_worldbank: "World Bank",
    chart_source_eurostat: "Eurostat",
    chart_source_oecd: "OECD",
    chart_source_coming_soon: "{source} folgt später.",
    chart_variant: "Variante",
    chart_entities: "Entität",
    chart_entity_auto: "automatisch",
    chart_import_remote: "Chart hinzufügen",
    chart_loading_remote: "Lade Chart {title} von {source} ...",
    chart_imported_remote: "{title} wurde aus {source} importiert.",
    chart_points_invalid: "Der Chart {title} enthält nicht genug nutzbare Datenpunkte.",
    chart_date_range_unknown: "Zeitspanne unbekannt",
    delete_confirm_title: "Löschen bestätigen",
    delete_confirm_message: "Sind Sie sicher, dass Sie dieses Objekt aus der Bibliothek löschen wollen?",
    cancel: "Abbrechen",
    delete: "Löschen",
    chart_browser_label: "Charts",
    chart_empty: "Noch keine Charts importiert.",
    chart_points_count: "{count} Datenpunkte",
    chart_source_none: "keine Quelle",
    chart_display_events: "Ereignisfokus",
    chart_display_mixed: "Mischansicht",
    chart_display_focus: "Chartfokus",
    chart_display_mode: "Chart-Ebene",
    chart_line_style: "Linienart",
    chart_y_axis: "Y-Achse des Charts",
    chart_axis_label: "Y-Achsen-Beschriftung",
    chart_axis_label_none: "ohne Einheit",
    chart_show_axis: "Y-Achse zeigen",
    chart_source: "Quelle",
    chart_import_hint: "Importiere lokale JSON-Zeitreihen. Später können hier externe Datenquellen hinzukommen.",
    chart_open_library: "In Bibliothek öffnen",
    chart_strip_events: "Ereignisse vorn",
    chart_strip_mixed: "Mischen",
    chart_strip_focus: "Chart vorn",
    chart_strip_axis: "Y-Achse",
    sources_placeholder: "Quellen werden vorbereitet. Später können hier Publikationen, Datensätze und Erscheinungsdaten durchsucht werden.",
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
    data_mode_events: "Events",
    data_mode_charts: "Charts",
    data_mode_sources: "Sources",
    search_panel_label: "Wikidata Search",
    search_panel_title: "Find and add entries",
    chart_panel_label: "Chart Search",
    chart_panel_title: "Find and import charts",
    sources_panel_label: "Sources",
    sources_panel_title: "Sources and datasets",
    search_placeholder: "Search Wikidata",
    search_button: "Search",
    search_default: "Search for historical events, people, epochs, or buildings.",
    loading_label: "Loading",
    loading_prepare: "Preparing import ...",
    loading_processing_result: "Processing {title} and applying the data to the timeline ...",
    loading_update_view: "Updating view and editor ...",
    loading_read_file: "Reading file {title} ...",
    loading_parse_file: "Checking and processing import file ...",
    loading_import_folder: "Importing folder {title} ...",
    loading_localize_content: "Updating language data and views ...",
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
    arrow_down_right: "master -> slave",
    arrow_up_left: "slave -> master",
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
    folder: "Folder",
    folder_relation_hint: "Assign the event to a folder so it can be assigned to an event inside it and linked visually.",
    description: "Description",
    folder_name: "Folder name",
    standard_visible_from: "Standard visible from",
    folder_force_settings: "Force folder properties",
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
    chart_import: "Import chart",
    chart_status_default: "Import local JSON charts to render time series on the timeline.",
    chart_status_imported: "Chart {title} was imported.",
    chart_import_failed: "Chart import failed. Please choose a valid chart JSON file.",
    chart_search_placeholder: "Search charts",
    chart_search_default: "Search chart data sources. Our World in Data is connected first.",
    chart_search_loading: "Searching {source} for \"{query}\" ...",
    chart_search_no_results: "No chart results found.",
    chart_search_failed: "Chart search could not be loaded. Please try again later.",
    chart_search_results_found: "{count} chart results found.",
    chart_source_owid: "Our World in Data",
    chart_source_worldbank: "World Bank",
    chart_source_eurostat: "Eurostat",
    chart_source_oecd: "OECD",
    chart_source_coming_soon: "{source} is coming later.",
    chart_variant: "Variant",
    chart_entities: "Entity",
    chart_entity_auto: "automatic",
    chart_import_remote: "Add chart",
    chart_loading_remote: "Loading chart {title} from {source} ...",
    chart_imported_remote: "{title} was imported from {source}.",
    chart_points_invalid: "Chart {title} does not contain enough usable data points.",
    chart_date_range_unknown: "date range unknown",
    delete_confirm_title: "Confirm deletion",
    delete_confirm_message: "Are you sure you want to remove this object from the library?",
    cancel: "Cancel",
    delete: "Delete",
    chart_browser_label: "Charts",
    chart_empty: "No charts imported yet.",
    chart_points_count: "{count} data points",
    chart_source_none: "no source",
    chart_display_events: "Event focus",
    chart_display_mixed: "Mixed view",
    chart_display_focus: "Chart focus",
    chart_display_mode: "Chart layer",
    chart_line_style: "Line style",
    chart_y_axis: "Chart Y axis",
    chart_axis_label: "Y-axis label",
    chart_axis_label_none: "no unit",
    chart_show_axis: "Show Y axis",
    chart_source: "Source",
    chart_import_hint: "Import local JSON time series. External sources can be added here later.",
    chart_open_library: "Open in library",
    chart_strip_events: "Events front",
    chart_strip_mixed: "Mixed",
    chart_strip_focus: "Chart front",
    chart_strip_axis: "Y axis",
    sources_placeholder: "Sources are being prepared. Later, publications, datasets and publication dates can be searched here.",
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
    eon: "Äon",
    era: "Ära",
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
  chartSearchResults: [],
  chartSearchQuery: "",
  chartSearchSource: "owid",
  eventSearchSource: "wikidata",
  sourcesSearchSource: "wikisource",
  pendingAdds: new Set(),
  loadingHideTimer: null,
  folderImportLoading: null,
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
  browserDragGroupId: null,
  browserDragChartId: null,
  suppressClickUntil: 0,
  timelineMenuOpen: false,
  language: "de",
  activeContextGroupId: null,
  activeDataMode: null,
  openChartEditorId: null,
  activeChartId: null,
  chartDisplayMode: "mixed",
  showYAxis: false,
};

Object.assign(I18N.de, {
  timeline_menu_open: "Men\u00fc \u00f6ffnen",
  timeline_menu_close: "Men\u00fc schlie\u00dfen",
  timeline_menu: "Men\u00fc",
  timeline_menu_title: "Zeitstrahl-Men\u00fc",
  menu_language_description: "Deutsch und Englisch sind bereits funktional. Weitere EU-Sprachen plus Ukrainisch sind vorbereitet.",
  menu_help_description: "Platz f\u00fcr eine kurze Einf\u00fchrung, Bedienhinweise und erkl\u00e4rende Beispiele.",
  menu_apps_description: "Vorbereitung f\u00fcr weitere Werkzeuge wie GenMap zur Anzeige genealogischer GEDCOM-Dateien.",
  menu_visual_tools_description: "Bereich f\u00fcr k\u00fcnftige Module und alternative Visualisierungsansichten.",
  editor_empty: "F\u00fcge \u00fcber die Suche rechts ein Wikidata-Ereignis hinzu oder w\u00e4hle einen vorhandenen Eintrag aus dem Zeitstrahl.",
  add_more: "Hinzuf\u00fcgen",
  search_panel_title: "Eintr\u00e4ge finden und hinzuf\u00fcgen",
  delete_confirm_title: "L\u00f6schen best\u00e4tigen",
  delete_confirm_message: "Sind Sie sicher, dass Sie dieses Objekt aus der Bibliothek l\u00f6schen wollen?",
  delete: "L\u00f6schen",
  panel_choose_mode_label: "Suche",
  panel_choose_mode_title: "Modus ausw\u00e4hlen",
  sources_search_placeholder: "Quellen durchsuchen",
  sources_search_default: "Quellensuche wird vorbereitet. W\u00e4hle oben eine Quelle aus.",
  sources_search_coming_soon: "{source} wird als Quellensuche vorbereitet.",
  source_wikidata: "Wikidata",
  source_wikisource: "Wikisource",
  source_crossref: "Crossref",
  source_dataverse: "Dataverse",
});

Object.assign(I18N.en, {
  timeline_menu_open: "Open menu",
  timeline_menu_close: "Close menu",
  timeline_menu: "Menu",
  timeline_menu_title: "Timeline menu",
  menu_help_description: "Space for a short introduction, usage notes, and explanatory examples.",
  menu_apps_description: "Preparation for additional tools such as GenMap for genealogical GEDCOM files.",
  menu_visual_tools_description: "Area for future modules and alternative visualization views.",
  editor_empty: "Add a Wikidata event using the search on the right or select an existing item from the timeline.",
  search_panel_title: "Find and add entries",
  delete_confirm_title: "Confirm deletion",
  delete_confirm_message: "Are you sure you want to delete this object from the library?",
  delete: "Delete",
  panel_choose_mode_label: "Search",
  panel_choose_mode_title: "Choose mode",
  sources_search_placeholder: "Search sources",
  sources_search_default: "Source search is being prepared. Choose a source above.",
  sources_search_coming_soon: "{source} is being prepared as a source search.",
  source_wikidata: "Wikidata",
  source_wikisource: "Wikisource",
  source_crossref: "Crossref",
  source_dataverse: "Dataverse",
});

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
  ui.addEpochGroupButton.disabled = true;
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

function populateChartSourceSelect() {
  if (!ui.chartSourceSelect) return;
  const sourceOptions = [
    { value: "owid", label: t("chart_source_owid"), disabled: false },
    { value: "worldbank", label: `${t("chart_source_worldbank")} (${t("soon_suffix")})`, disabled: true },
    { value: "eurostat", label: `${t("chart_source_eurostat")} (${t("soon_suffix")})`, disabled: true },
    { value: "oecd", label: `${t("chart_source_oecd")} (${t("soon_suffix")})`, disabled: true },
  ];
  ui.chartSourceSelect.replaceChildren();
  sourceOptions.forEach((sourceOption) => {
    const option = document.createElement("option");
    option.value = sourceOption.value;
    option.textContent = sourceOption.label;
    option.disabled = sourceOption.disabled;
    option.selected = state.chartSearchSource === sourceOption.value;
    ui.chartSourceSelect.appendChild(option);
  });
}

function populateEventSourceSelect() {
  if (!ui.eventSourceSelect) return;
  const sourceOptions = [
    { value: "wikidata", label: t("source_wikidata"), disabled: false },
  ];
  ui.eventSourceSelect.replaceChildren();
  sourceOptions.forEach((sourceOption) => {
    const option = document.createElement("option");
    option.value = sourceOption.value;
    option.textContent = sourceOption.label;
    option.disabled = sourceOption.disabled;
    option.selected = state.eventSearchSource === sourceOption.value;
    ui.eventSourceSelect.appendChild(option);
  });
}

function populateSourcesSourceSelect() {
  if (!ui.sourcesSourceSelect) return;
  const sourceOptions = [
    { value: "wikisource", label: t("source_wikisource"), disabled: false },
    { value: "crossref", label: `${t("source_crossref")} (${t("soon_suffix")})`, disabled: true },
    { value: "dataverse", label: `${t("source_dataverse")} (${t("soon_suffix")})`, disabled: true },
  ];
  ui.sourcesSourceSelect.replaceChildren();
  sourceOptions.forEach((sourceOption) => {
    const option = document.createElement("option");
    option.value = sourceOption.value;
    option.textContent = sourceOption.label;
    option.disabled = sourceOption.disabled;
    option.selected = state.sourcesSearchSource === sourceOption.value;
    ui.sourcesSourceSelect.appendChild(option);
  });
}

function updateDataModeUi() {
  const hasActiveMode = Boolean(state.activeDataMode);
  ui.eventsModePanel.hidden = state.activeDataMode !== "events";
  ui.chartsModePanel.hidden = state.activeDataMode !== "charts";
  ui.sourcesModePanel.hidden = state.activeDataMode !== "sources";
  ui.modeEventsButton?.classList.toggle("is-active", state.activeDataMode === "events");
  ui.modeChartsButton?.classList.toggle("is-active", state.activeDataMode === "charts");
  ui.modeSourcesButton?.classList.toggle("is-active", state.activeDataMode === "sources");
  if (ui.searchPanelLabel) {
    ui.searchPanelLabel.textContent = !hasActiveMode
      ? t("panel_choose_mode_label")
      : state.activeDataMode === "charts"
      ? t("chart_panel_label")
      : (state.activeDataMode === "sources" ? t("sources_panel_label") : t("search_panel_label"));
  }
  if (ui.searchPanelTitle) {
    ui.searchPanelTitle.textContent = !hasActiveMode
      ? t("panel_choose_mode_title")
      : state.activeDataMode === "charts"
      ? t("chart_panel_title")
      : (state.activeDataMode === "sources" ? t("sources_panel_title") : t("search_panel_title"));
  }
  if (ui.chartStatus && state.activeDataMode === "charts" && !state.chartSearchQuery && !state.chartSearchResults.length && !chartItems.length) {
    ui.chartStatus.textContent = t("chart_search_default");
  }
}

function updateChartStripControls() {
  if (ui.chartStripControls) {
    ui.chartStripControls.hidden = chartItems.length === 0;
  }
  ui.toggleChartsButton?.classList.toggle("is-active", state.chartDisplayMode === "events");
  ui.toggleYAxisButton?.classList.toggle("is-active", state.showYAxis);
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
  if (ui.fullscreenButton) ui.fullscreenButton.textContent = "\u26f6";
  if (ui.editorPanelLabel) ui.editorPanelLabel.textContent = t("editor_panel_label");
  if (ui.editorPanelTitle) ui.editorPanelTitle.textContent = t("editor_panel_title");
  if (ui.editorEmptyState) ui.editorEmptyState.textContent = t("editor_empty");
  if (ui.eventLibraryLabel) ui.eventLibraryLabel.textContent = t("event_library_label");
  if (ui.addCustomEventButton) ui.addCustomEventButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_event")}</span>`;
  if (ui.addFolderButton) ui.addFolderButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_folder")}</span>`;
  if (ui.addEpochGroupButton) ui.addEpochGroupButton.innerHTML = `<span class="add-action-plus">+</span><span>${t("add_more")}</span>`;
  if (ui.addEpochGroupButton) ui.addEpochGroupButton.disabled = true;
  if (ui.importFolderButton) ui.importFolderButton.textContent = t("import");
  if (ui.modeEventsButton) ui.modeEventsButton.textContent = t("data_mode_events");
  if (ui.modeChartsButton) ui.modeChartsButton.textContent = t("data_mode_charts");
  if (ui.modeSourcesButton) ui.modeSourcesButton.textContent = t("data_mode_sources");
  if (ui.eventSourceLabel) ui.eventSourceLabel.textContent = t("chart_source");
  if (ui.chartSourceLabel) ui.chartSourceLabel.textContent = t("chart_source");
  if (ui.sourcesSourceLabel) ui.sourcesSourceLabel.textContent = t("chart_source");
  if (ui.sourcesSearchInput) ui.sourcesSearchInput.placeholder = t("sources_search_placeholder");
  if (ui.sourcesSearchSubmitButton) ui.sourcesSearchSubmitButton.textContent = t("search_button");
  if (ui.chartSearchInput) ui.chartSearchInput.placeholder = t("chart_search_placeholder");
  if (ui.chartSearchSubmitButton) ui.chartSearchSubmitButton.textContent = t("search_button");
  if (ui.importChartButton) ui.importChartButton.textContent = t("chart_import");
  if (ui.chartStatus && !chartItems.length && !state.chartSearchQuery && !state.chartSearchResults.length) ui.chartStatus.textContent = t("chart_search_default");
  if (ui.sourcesStatus) ui.sourcesStatus.textContent = t("sources_search_default");
  if (ui.sourcesPlaceholder) ui.sourcesPlaceholder.textContent = t("sources_search_default");
  if (ui.toggleChartsButton) ui.toggleChartsButton.title = t("chart_strip_events");
  if (ui.toggleYAxisButton) ui.toggleYAxisButton.title = t("chart_strip_axis");
  if (ui.confirmDeleteTitle) ui.confirmDeleteTitle.textContent = t("delete_confirm_title");
  if (ui.confirmDeleteMessage) ui.confirmDeleteMessage.textContent = t("delete_confirm_message");
  if (ui.confirmDeleteCancelButton) ui.confirmDeleteCancelButton.textContent = t("cancel");
  if (ui.confirmDeleteConfirmButton) ui.confirmDeleteConfirmButton.textContent = t("delete");
  if (ui.searchInput) ui.searchInput.placeholder = t("search_placeholder");
  if (ui.searchSubmitButton) ui.searchSubmitButton.textContent = t("search_button");
  if (ui.searchLoadingLabel) ui.searchLoadingLabel.textContent = t("loading_label");
  if (ui.searchLoadingText && ui.searchLoadingPanel?.hidden) ui.searchLoadingText.textContent = t("loading_prepare");
  if (ui.searchStatus && !state.searchResults.length) ui.searchStatus.textContent = t("search_default");
  populateEventSourceSelect();
  populateChartSourceSelect();
  populateSourcesSourceSelect();
  updateDataModeUi();
  updateChartStripControls();
}

function clearLoadingHideTimer() {
  if (state.loadingHideTimer != null) {
    window.clearTimeout(state.loadingHideTimer);
    state.loadingHideTimer = null;
  }
}

function waitForNextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 0);
    });
  });
}

function eventHasLibraryRelations(eventItem) {
  if (!eventItem) return false;
  if (eventItem.parentEventId) return true;
  return timelineEvents.some((candidate) => candidate.parentEventId === eventItem.id);
}

function confirmDeleteFromLibrary() {
  return new Promise((resolve) => {
    if (!ui.confirmDeleteModal) {
      resolve(true);
      return;
    }
    const cleanup = (result) => {
      ui.confirmDeleteModal.hidden = true;
      ui.confirmDeleteCancelButton?.removeEventListener("click", onCancel);
      ui.confirmDeleteConfirmButton?.removeEventListener("click", onConfirm);
      ui.confirmDeleteBackdrop?.removeEventListener("click", onCancel);
      resolve(result);
    };
    const onCancel = () => cleanup(false);
    const onConfirm = () => cleanup(true);
    ui.confirmDeleteModal.hidden = false;
    ui.confirmDeleteCancelButton?.addEventListener("click", onCancel, { once: true });
    ui.confirmDeleteConfirmButton?.addEventListener("click", onConfirm, { once: true });
    ui.confirmDeleteBackdrop?.addEventListener("click", onCancel, { once: true });
  });
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function setSearchLoadingState({ visible, text = "", progress = 0 }) {
  if (!ui.searchLoadingPanel || !ui.searchLoadingFill || !ui.searchLoadingPercent || !ui.searchLoadingText) return;
  clearLoadingHideTimer();
  const clampedProgress = clamp(Number(progress) || 0, 0, 100);
  ui.searchLoadingPanel.hidden = !visible;
  ui.searchLoadingFill.style.width = `${clampedProgress}%`;
  ui.searchLoadingPercent.textContent = `${Math.round(clampedProgress)}%`;
  ui.searchLoadingText.textContent = text || t("loading_prepare");
}

function hideSearchLoading(delay = 0) {
  if (!ui.searchLoadingPanel) return;
  clearLoadingHideTimer();
  const hide = () => {
    ui.searchLoadingPanel.hidden = true;
  };
  if (delay > 0) {
    state.loadingHideTimer = window.setTimeout(hide, delay);
    return;
  }
  hide();
}

function setFolderImportLoading({ visible, title = "", text = "", progress = 0, groupId = null }) {
  state.folderImportLoading = visible
    ? {
      title: title || t("import"),
      text: text || t("loading_prepare"),
      progress: clamp(Number(progress) || 0, 0, 100),
      groupId,
    }
    : null;
  if (visible && !groupId && ui.eventBrowserInfo) {
    ui.eventBrowserInfo.textContent = text || title || t("loading_prepare");
  }
  renderEventList();
}

function createInlineLoadingBody(loadingState) {
  const body = document.createElement("div");
  body.className = "import-loading-body";

  const bar = document.createElement("div");
  bar.className = "search-loading-bar";
  bar.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.className = "search-loading-fill";
  fill.style.width = `${loadingState.progress}%`;

  bar.appendChild(fill);
  body.appendChild(bar);
  return body;
}

async function applyLanguage(languageCode) {
  state.language = I18N[languageCode] ? languageCode : "de";
  saveLanguagePreference();
  populateLanguageSelect();
  applyStaticTranslations();
  await refreshLocalizedWikidataContent();
  renderEpochMenu();
  renderEventList();
  renderChartResults();
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

function rectanglesOverlap(left, right, padding = 0) {
  return !(
    (left.x + left.width + padding) <= right.x
    || (right.x + right.width + padding) <= left.x
    || (left.y + left.height + padding) <= right.y
    || (right.y + right.height + padding) <= left.y
  );
}

function normalizeRect(rect) {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

function insetRect(rect, insetX = 0, insetY = insetX) {
  return {
    x: rect.x + insetX,
    y: rect.y + insetY,
    width: Math.max(0, rect.width - insetX * 2),
    height: Math.max(0, rect.height - insetY * 2),
  };
}

function getSvgSpaceRect(element) {
  if (!element || !svg) return null;
  try {
    const svgRect = svg.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    return {
      x: elementRect.left - svgRect.left,
      y: elementRect.top - svgRect.top,
      width: elementRect.width,
      height: elementRect.height,
    };
  } catch {
    return null;
  }
}

function drawSvgLabelWithPrefix(eventItem, centerX, baselineY, options = {}) {
  const {
    fill = "#a4b0b8",
    fontSize = 13,
    fontWeight = 400,
    align = "above",
  } = options;

  const group = createSvgElement("g", {
    "pointer-events": "visiblePainted",
  });
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

  const bounds = getSvgSpaceRect(group);

  return { group, bounds };
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
  sanitizeChartHierarchy();
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

function expandEventAncestors(eventId) {
  let currentEvent = getEventById(eventId);
  while (currentEvent?.parentEventId) {
    const parentEvent = getEventById(currentEvent.parentEventId);
    if (!parentEvent) break;
    parentEvent.expanded = true;
    currentEvent = parentEvent;
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
  if (!eventItem || !targetGroup) return false;
  if (eventItem.groupId === targetGroupId) return false;
  if (!eventItem.groupId) return true;
  return getRootGroupId(eventItem.groupId) === getRootGroupId(targetGroupId);
}

function canDropChartOnGroup(chartId, targetGroupId) {
  const chartItem = getChartById(chartId);
  const targetGroup = getGroupById(targetGroupId);
  if (!chartItem || !targetGroup) return false;
  if (chartItem.groupId === targetGroupId && !chartItem.parentEventId) return false;
  if (!chartItem.groupId) return true;
  return getRootGroupId(chartItem.groupId) === getRootGroupId(targetGroupId);
}

function canDropGroupOnGroup(draggedGroupId, targetGroupId) {
  const draggedGroup = getGroupById(draggedGroupId);
  const targetGroup = getGroupById(targetGroupId);
  if (!draggedGroup || !targetGroup || draggedGroup.id === targetGroup.id) return false;
  if (getDescendantGroupIds(draggedGroup.id).includes(targetGroup.id)) return false;
  return true;
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
  if (!targetEvent.groupId) return false;
  if (!draggedEvent.groupId) return true;
  if (getEventDescendantIds(draggedEvent.id).includes(targetEvent.id)) return false;
  return getRootGroupId(draggedEvent.groupId) === getRootGroupId(targetEvent.groupId);
}

function canDropChartOnEvent(chartId, targetEventId) {
  const chartItem = getChartById(chartId);
  const targetEvent = getEventById(targetEventId);
  if (!chartItem || !targetEvent) return false;
  if (!targetEvent.groupId) return false;
  if (!chartItem.groupId) return true;
  return getRootGroupId(chartItem.groupId) === getRootGroupId(targetEvent.groupId);
}

function moveEventTreeToGroup(eventId, targetGroupId) {
  const ids = [eventId, ...getEventDescendantIds(eventId)];
  ids.forEach((id) => {
    const eventItem = getEventById(id);
    if (eventItem) eventItem.groupId = targetGroupId;
  });
}

function moveChartToGroup(chartId, targetGroupId) {
  const chartItem = getChartById(chartId);
  if (!chartItem) return;
  chartItem.groupId = targetGroupId;
}

function moveGroupTreeToGroup(groupId, targetGroupId) {
  const groupItem = getGroupById(groupId);
  if (!groupItem) return;
  groupItem.parentGroupId = targetGroupId;
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

function getVisibleObjectLabelCenterX(startX, endX, viewportLeft, viewportRight, fallbackX) {
  const objectLeft = Math.min(startX, endX);
  const objectRight = Math.max(startX, endX);
  const visibleLeft = Math.max(viewportLeft, objectLeft);
  const visibleRight = Math.min(viewportRight, objectRight);

  if (objectLeft < viewportLeft && objectRight > viewportRight) {
    return (viewportLeft + viewportRight) / 2;
  }
  if (objectLeft < viewportLeft) {
    return (viewportLeft + visibleRight) / 2;
  }
  if (objectRight > viewportRight) {
    return (visibleLeft + viewportRight) / 2;
  }
  return fallbackX;
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

function getForcedGroupSetting(groupId, key) {
  let currentGroupId = groupId;
  while (currentGroupId) {
    const groupItem = getGroupById(currentGroupId);
    if (!groupItem) return undefined;
    if (groupItem.forceSettings === true && groupItem[key] !== undefined) {
      return groupItem[key];
    }
    currentGroupId = groupItem.parentGroupId ?? null;
  }
  return undefined;
}

function getEffectiveEventSetting(eventItem, key) {
  const forcedGroupValue = getForcedGroupSetting(eventItem.groupId, key);
  if (forcedGroupValue !== undefined) return forcedGroupValue;
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

function isSlaveTriangleRelationCase(parentItem, childItem, parentGeometry, childGeometry) {
  if (!parentItem || !childItem || !parentGeometry || !childGeometry) return false;
  if (!isBarDisplay(parentItem) || !isRangeEvent(parentItem) || isRangeEvent(childItem)) return false;
  if (childItem.relationLineStyle === "none") return false;
  if (childItem.relationDirection !== "parent-to-child") return false;
  const laneDistance = Math.abs((parentGeometry.markerY ?? 0) - (childGeometry.markerY ?? 0));
  return laneDistance >= 17 && laneDistance <= 21;
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
    labelY: markerY + (lineLane < 0 ? 14 : -7),
  };
}

function isPointAssignedOnBar(parentItem, parentGeometry, childItem, childGeometry) {
  if (!parentItem || !parentGeometry || !childItem || !childGeometry) return false;
  if (!isBarDisplay(parentItem) || !isRangeEvent(parentItem)) return false;
  const parentBounds = getEventVisualBounds(parentItem, parentGeometry);
  const childBounds = getEventVisualBounds(childItem, childGeometry);
  if (!parentBounds || !childBounds) return false;
  const horizontalOverlap = childBounds.right >= parentBounds.left - 2
    && childBounds.left <= parentBounds.right + 2;
  const verticalOverlap = childBounds.bottom >= parentBounds.top - 2
    && childBounds.top <= parentBounds.bottom + 2;
  return horizontalOverlap && verticalOverlap;
}

function getLabelYAwayFromParent(eventItem, geometry, parentGeometry, options = {}) {
  const { extended = false, preferredSide = null } = options;
  if (!geometry || !parentGeometry) return geometry?.labelY ?? 0;
  let resolvedPreferredSide = preferredSide ?? (parentGeometry.markerY <= geometry.markerY ? "below" : "above");
  const effectiveLane = getEffectiveLane(eventItem);
  const laneValue = typeof effectiveLane === "string" ? effectiveLane.trim() : effectiveLane;
  if ((laneValue === -1 || laneValue === -2 || laneValue === "-1" || laneValue === "-2") && resolvedPreferredSide === "above") {
    resolvedPreferredSide = "below";
  }
  const assignedOnBar = Math.abs((geometry.markerY ?? 0) - (parentGeometry.markerY ?? 0)) <= 4;
  const aboveOffset = resolvedPreferredSide === "above" && assignedOnBar
    ? -26
    : (extended ? -25 : (isBarDisplay(eventItem) && isRangeEvent(eventItem) ? -10 : -7));
  const belowOffset = extended ? 25 : (isBarDisplay(eventItem) && isRangeEvent(eventItem) ? 18 : 14);
  return resolvedPreferredSide === "below"
    ? geometry.markerY + belowOffset
    : geometry.markerY + aboveOffset;
}

function getNormalizedLaneValue(value) {
  return typeof value === "string" ? value.trim() : value;
}

function getSlaveTrianglePreferredSide(parentItem) {
  const parentLane = getNormalizedLaneValue(getEffectiveLane(parentItem));
  if (parentLane === -1 || parentLane === -2 || parentLane === "-1" || parentLane === "-2") {
    return "below";
  }
  if (typeof parentLane === "number" && parentLane <= -3) {
    return "above";
  }
  if (typeof parentLane === "string" && /^-\d+$/.test(parentLane) && Number(parentLane) <= -3) {
    return "above";
  }
  return null;
}

function getBarAttachmentSideFromDrag(startMarkerY, currentMarkerY, fallback = "above") {
  if (!Number.isFinite(startMarkerY) || !Number.isFinite(currentMarkerY) || Math.abs(currentMarkerY - startMarkerY) < 1) {
    return fallback;
  }
  return currentMarkerY > startMarkerY ? "below" : "above";
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
  const { reveal = false, behavior = "smooth", targetId = null } = options;
  window.requestAnimationFrame(() => {
    const selector = kind === "group"
      ? (targetId
        ? `.group-inline-editor[data-group-id="${targetId}"] [data-editor-name-field="group"]`
        : '.group-inline-editor [data-editor-name-field="group"]')
      : kind === "chart"
        ? (targetId
          ? `.chart-inline-editor[data-chart-id="${targetId}"] [data-editor-name-field="chart"]`
          : '.chart-inline-editor [data-editor-name-field="chart"]')
      : (targetId
        ? `.event-inline-editor[data-event-id="${targetId}"] [data-editor-name-field="event"]`
        : '.event-inline-editor [data-editor-name-field="event"]');
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
      const groupEditor = input.closest(".group-inline-editor");
      const chartEditor = input.closest(".chart-inline-editor");
      const targetEditor = editor ?? groupEditor ?? chartEditor;
      if (!targetEditor || !ui.editorPanel) return;
      const panelRect = ui.editorPanel.getBoundingClientRect();
      const editorRect = targetEditor.getBoundingClientRect();
      const targetTop = ui.editorPanel.scrollTop + (editorRect.top - panelRect.top) - 24;
      ui.editorPanel.scrollTo({ top: Math.max(0, targetTop), behavior });
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
    barAttachmentSide: "above",
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
    forceSettings: false,
  };
}

function createEmptyChart() {
  return {
    id: createUniqueId("chart"),
    type: "chart",
    title: "Neuer Chart",
    description: "",
    sourceTitle: "",
    sourceUrl: "",
    sourceUnit: "",
    groupId: null,
    parentEventId: null,
    color: "#c96f4a",
    lineStyle: "solid",
    fillMode: "none",
    visible: true,
    displayMode: "mixed",
    yAxisEnabled: true,
    yAxisSide: "left",
    yScaleMode: "linear",
    yAxisLabel: "",
    yOffsetPx: 0,
    visibleStepMin: 1,
    visibleStepMax: 1000000000,
    xPrecision: "year",
    points: [],
  };
}

function normalizeChartItem(chartItem) {
  if (!chartItem) return;
  chartItem.id = chartItem.id || createUniqueId("chart");
  chartItem.type = "chart";
  chartItem.title = String(chartItem.title || "Chart").trim() || "Chart";
  chartItem.description = String(chartItem.description || "").trim();
  chartItem.sourceTitle = String(chartItem.sourceTitle || "").trim();
  chartItem.sourceUrl = String(chartItem.sourceUrl || "").trim();
  chartItem.sourceUnit = String(chartItem.sourceUnit || "").trim();
  chartItem.groupId = chartItem.groupId || null;
  chartItem.parentEventId = chartItem.parentEventId || null;
  chartItem.color = String(chartItem.color || "#c96f4a").trim() || "#c96f4a";
  chartItem.lineStyle = chartItem.lineStyle === "dotted" ? "dotted" : "solid";
  chartItem.fillMode = chartItem.fillMode === "soft" ? "soft" : "none";
  chartItem.visible = chartItem.visible !== false;
  chartItem.displayMode = chartItem.displayMode === "background" || chartItem.displayMode === "foreground"
    ? chartItem.displayMode
    : "mixed";
  chartItem.yAxisEnabled = chartItem.yAxisEnabled !== false;
  chartItem.yAxisSide = "left";
  chartItem.yScaleMode = chartItem.yScaleMode === "log" ? "log" : "linear";
  chartItem.yAxisLabel = String(chartItem.yAxisLabel || "").trim();
  chartItem.yOffsetPx = Number.isFinite(chartItem.yOffsetPx) ? chartItem.yOffsetPx : 0;
  chartItem.visibleStepMin = Number.isFinite(chartItem.visibleStepMin) ? chartItem.visibleStepMin : 1;
  chartItem.visibleStepMax = Number.isFinite(chartItem.visibleStepMax) ? chartItem.visibleStepMax : 1000000000;
  chartItem.xPrecision = chartItem.xPrecision || "year";
  chartItem.points = Array.isArray(chartItem.points)
    ? chartItem.points
      .map((point, index) => ({
        id: point?.id || `${chartItem.id}-point-${index + 1}`,
        x: Number(point?.x),
        y: Number(point?.y),
        label: String(point?.label || "").trim(),
        description: String(point?.description || "").trim(),
        visible: point?.visible !== false,
      }))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
      .sort((a, b) => a.x - b.x)
    : [];
}

function getChartById(chartId) {
  return chartItems.find((chartItem) => chartItem.id === chartId) ?? null;
}

function getChartsForGroup(groupId) {
  return chartItems
    .filter((chartItem) => chartItem.groupId === groupId)
    .sort((left, right) => String(left.title || "").localeCompare(String(right.title || ""), getUiSortLocale()));
}

function getUngroupedCharts() {
  return chartItems
    .filter((chartItem) => !chartItem.groupId)
    .sort((left, right) => String(left.title || "").localeCompare(String(right.title || ""), getUiSortLocale()));
}

function getChildChartsForEvent(eventId) {
  return chartItems
    .filter((chartItem) => chartItem.parentEventId === eventId)
    .sort((left, right) => String(left.title || "").localeCompare(String(right.title || ""), getUiSortLocale()));
}

function getAssignableParentEventsForChart(chartItem) {
  if (!chartItem?.groupId) return [];
  return getEventsForGroup(chartItem.groupId);
}

function sanitizeChartHierarchy() {
  chartItems.forEach((chartItem) => {
    if (!chartItem.groupId) {
      chartItem.parentEventId = null;
      return;
    }
    if (!getGroupById(chartItem.groupId)) {
      chartItem.groupId = null;
      chartItem.parentEventId = null;
      return;
    }
    if (!chartItem.parentEventId) return;
    const parentEvent = getEventById(chartItem.parentEventId);
    if (!parentEvent || parentEvent.groupId !== chartItem.groupId) {
      chartItem.parentEventId = null;
    }
  });
}

function getVisibleCharts() {
  const stepYears = getStepYears();
  return chartItems.filter((chartItem) => (
    chartItem.visible !== false
    && stepYears >= (chartItem.visibleStepMin ?? 1)
    && stepYears <= (chartItem.visibleStepMax ?? 1000000000)
    && Array.isArray(chartItem.points)
    && chartItem.points.length >= 2
  ));
}

function getActiveChart() {
  const visibleCharts = getVisibleCharts();
  if (!visibleCharts.length) return null;
  const preferredId = state.openChartEditorId ?? state.activeChartId;
  return visibleCharts.find((chartItem) => chartItem.id === preferredId) ?? visibleCharts[0];
}

function getChartAxisGroupKey(chartItem) {
  const label = String(chartItem?.yAxisLabel || "").trim().toLowerCase();
  return label || null;
}

function getChartAxisGroupId(chartItem) {
  const labelKey = getChartAxisGroupKey(chartItem);
  return labelKey ? `axis:${labelKey}` : `chart:${chartItem.id}`;
}

function getChartAxisGroups(charts = getVisibleCharts()) {
  const groups = new Map();
  charts.forEach((chartItem) => {
    const groupId = getChartAxisGroupId(chartItem);
    const current = groups.get(groupId);
    if (current) {
      current.push(chartItem);
    } else {
      groups.set(groupId, [chartItem]);
    }
  });
  return groups;
}

function getChartsInAxisGroup(chartItem, charts = chartItems) {
  const targetGroupId = getChartAxisGroupId(chartItem);
  return charts.filter((candidate) => getChartAxisGroupId(candidate) === targetGroupId);
}

function getChartAxisGroupRepresentative(chartItem, charts = getVisibleCharts()) {
  const group = getChartsInAxisGroup(chartItem, charts);
  if (!group.length) return chartItem;
  return group.find((candidate) => candidate.id === state.activeChartId)
    ?? group.find((candidate) => candidate.id === chartItem.id)
    ?? group[0];
}

function getChartAxisGroupOffset(chartItem, charts = getVisibleCharts()) {
  const representative = getChartAxisGroupRepresentative(chartItem, charts);
  return Number(representative?.yOffsetPx) || 0;
}

function setChartAxisGroupOffset(chartItem, offsetPx, charts = chartItems) {
  getChartsInAxisGroup(chartItem, charts).forEach((candidate) => {
    candidate.yOffsetPx = offsetPx;
  });
}

function isChartMuteMode() {
  return state.chartDisplayMode === "events";
}

function getChartRenderColor(chartItem) {
  if (isChartMuteMode()) return "#8b949b";
  return chartItem.color || "#a4b0b8";
}

function getChartDisplayPreset(chartItem) {
  const displayMode = state.chartDisplayMode;
  const isActive = getActiveChart()?.id === chartItem.id;
  if (displayMode === "events") {
    return { opacity: isActive ? 0.52 : 0.32, strokeWidth: isActive ? 2.5 : 1.9 };
  }
  if (displayMode === "chart-focus") {
    return { opacity: isActive ? 0.96 : 0.42, strokeWidth: isActive ? 3.2 : 2.1 };
  }
  return { opacity: isActive ? 0.86 : 0.62, strokeWidth: isActive ? 2.9 : 2.2 };
}

function parseChartImportPayload(payload) {
  if (payload?.type === "chart") return [payload];
  if (payload?.type === "chart-export" && Array.isArray(payload.charts)) return payload.charts;
  if (Array.isArray(payload?.charts)) return payload.charts;
  if (Array.isArray(payload)) return payload;
  return [];
}

function normalizeOwidChartSearchResults(payload) {
  return (payload?.results ?? payload?.hits ?? [])
    .filter((entry) => {
      const url = String(entry?.url || "").trim();
      return Boolean(url) && (
        entry?.type === "chart"
        || entry?.contentType === "chart"
        || url.includes("/grapher/")
      );
    })
    .map((entry) => ({
      source: "owid",
      id: entry.slug || entry.url,
      slug: entry.slug || "",
      title: String(entry.title || "Chart").trim(),
      subtitle: String(entry.subtitle || "").trim(),
      variantName: String(entry.variantName || "").trim(),
      availableEntities: Array.isArray(entry.availableEntities) ? entry.availableEntities.filter(Boolean) : [],
      availableTabs: Array.isArray(entry.availableTabs) ? entry.availableTabs.filter(Boolean) : [],
      url: String(entry.url || "").trim(),
      publishedAt: entry.publishedAt || "",
      updatedAt: entry.updatedAt || "",
    }));
}

async function searchOwidCharts(query) {
  const params = new URLSearchParams({
    q: query,
    type: "charts",
    hitsPerPage: "12",
  });
  const response = await fetchWithTimeout(`${OWID_SEARCH_API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("owid-search-failed");
  return normalizeOwidChartSearchResults(await response.json());
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("fetch-timeout");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function parseCsvRows(csvText) {
  const lines = String(csvText || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function getDefaultOwidEntity(result) {
  if (!Array.isArray(result?.availableEntities) || !result.availableEntities.length) return "";
  return result.availableEntities.includes("World")
    ? "World"
    : result.availableEntities[0];
}

function getOwidChartUrls(result) {
  const baseUrl = new URL(result.url, "https://ourworldindata.org");
  return {
    csvUrl: `${baseUrl.origin}${baseUrl.pathname}.csv${baseUrl.search}`,
    metadataUrl: `${baseUrl.origin}${baseUrl.pathname}.metadata.json${baseUrl.search}`,
  };
}

async function fetchOwidChartBundle(result) {
  const { csvUrl, metadataUrl } = getOwidChartUrls(result);
  const [csvResponse, metadataResponse] = await Promise.all([
    fetchWithTimeout(csvUrl),
    fetchWithTimeout(metadataUrl),
  ]);
  if (!csvResponse.ok || !metadataResponse.ok) throw new Error("owid-fetch-failed");
  const [csvText, metadata] = await Promise.all([
    csvResponse.text(),
    metadataResponse.json(),
  ]);
  return { csvText, metadata };
}

function getOwidColumnMetadata(metadata, columnName) {
  if (!metadata?.columns) return null;
  if (Array.isArray(metadata.columns)) {
    return metadata.columns.find((column) => (
      column?.slug === columnName
      || column?.shortName === columnName
      || column?.titleShort === columnName
      || column?.titlePublic === columnName
      || column?.titleLong === columnName
      || column?.name === columnName
    )) ?? null;
  }
  return metadata.columns[columnName] ?? null;
}

function resolveOwidValueColumn(rows, metadata) {
  const firstRow = rows[0];
  if (!firstRow) return null;
  const ignoredColumns = new Set(["Entity", "Code", "Year", "Day"]);
  const headers = Object.keys(firstRow).filter((header) => !ignoredColumns.has(header));
  const preferredHeader = headers.find((header) => rows.some((row) => Number.isFinite(Number(row[header]))));
  if (!preferredHeader) return null;
  return {
    name: preferredHeader,
    metadata: getOwidColumnMetadata(metadata, preferredHeader),
  };
}

function parseOwidPointX(rawValue, precision) {
  const value = String(rawValue ?? "").trim();
  if (!value) return NaN;
  if (precision === "day") {
    const match = value.match(/^(-?\d{1,6})-(\d{2})-(\d{2})$/);
    if (!match) return NaN;
    return buildTimelineValue(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  const year = Number(value);
  return Number.isFinite(year) ? toAstronomicalYear(Math.round(year)) : NaN;
}

function getChartPointRangeLabel(points = []) {
  if (!Array.isArray(points) || points.length === 0) return t("chart_date_range_unknown");
  const sortedPoints = [...points]
    .filter((point) => Number.isFinite(point.x))
    .sort((left, right) => left.x - right.x);
  if (!sortedPoints.length) return t("chart_date_range_unknown");
  const start = sortedPoints[0];
  const end = sortedPoints[sortedPoints.length - 1];
  const precision = Number.isFinite(start.x) && Number.isInteger(start.x) && Number.isFinite(end.x) && Number.isInteger(end.x)
    ? 9
    : 11;
  const startLabel = formatTimelineValue(start.x, precision);
  const endLabel = formatTimelineValue(end.x, precision);
  return startLabel === endLabel ? startLabel : `${startLabel} ${t("until_connector")} ${endLabel}`;
}

function buildOwidChartItem(result, csvText, metadata, selectedEntity = "") {
  const rows = parseCsvRows(csvText);
  const timeColumn = rows[0]?.Day ? "Day" : (rows[0]?.Year ? "Year" : null);
  if (!timeColumn) throw new Error("owid-missing-time");
  const effectiveEntity = selectedEntity || getDefaultOwidEntity(result);
  const relevantRows = rows.filter((row) => {
    if (!row.Entity || !effectiveEntity) return true;
    return String(row.Entity).trim() === effectiveEntity;
  });
  const sourceRows = relevantRows.length ? relevantRows : rows;
  const valueColumn = resolveOwidValueColumn(sourceRows, metadata);
  if (!valueColumn) throw new Error("owid-missing-value");
  const xPrecision = timeColumn === "Day" ? "day" : "year";
  const points = sourceRows
    .map((row, index) => ({
      id: `${result.slug || "owid"}-point-${index + 1}`,
      x: parseOwidPointX(row[timeColumn], xPrecision),
      y: Number(row[valueColumn.name]),
      label: "",
      description: effectiveEntity || String(row.Entity || "").trim(),
      visible: true,
    }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((left, right) => left.x - right.x);
  if (points.length < 2) throw new Error("owid-not-enough-points");

  const columnMeta = valueColumn.metadata ?? {};
  const unit = String(columnMeta.unit || columnMeta.unitShort || "").trim();
  const titleSuffix = effectiveEntity ? ` — ${effectiveEntity}` : "";
  const descriptionParts = [
    result.subtitle,
    result.variantName,
    unit,
  ].filter(Boolean);
  const axisLabelParts = [
    result.title,
    effectiveEntity && effectiveEntity !== "World" ? effectiveEntity : "",
    unit ? `(${unit})` : "",
  ].filter(Boolean);

  return {
    ...createEmptyChart(),
    sourceKey: "owid",
    sourceItemId: result.slug,
    sourceEntity: effectiveEntity,
    sourceMetric: valueColumn.name,
    sourceUnit: unit,
    yAxisLabel: axisLabelParts.join(" — ") || valueColumn.name || "",
    title: `${result.title}${titleSuffix}`,
    description: descriptionParts.join(" · "),
    sourceTitle: t("chart_source_owid"),
    sourceUrl: result.url,
    xPrecision,
    points,
  };
}

function findImportedChartBySource(sourceKey, sourceItemId, sourceEntity = "") {
  return chartItems.find((chartItem) => (
    chartItem.sourceKey === sourceKey
    && chartItem.sourceItemId === sourceItemId
    && String(chartItem.sourceEntity || "") === String(sourceEntity || "")
  )) ?? null;
}

function openChartInLibrary(chartItem) {
  if (!chartItem) return;
  state.openChartEditorId = chartItem.id;
  state.activeChartId = chartItem.id;
  state.showYAxis = chartItem.yAxisEnabled !== false;
  updateChartStripControls();
  renderEventList();
  renderChartResults();
  drawTimeline();
  scrollToDetails("auto");
  focusEditorNameField("chart", { reveal: true, behavior: "auto", targetId: chartItem.id });
}

async function handleChartSearchImport(result, selectedEntity = "") {
  const effectiveEntity = selectedEntity || getDefaultOwidEntity(result);
  const existing = findImportedChartBySource("owid", result.slug, effectiveEntity);
  if (existing) {
    openChartInLibrary(existing);
    return;
  }

  if (ui.chartStatus) {
    ui.chartStatus.textContent = tf("chart_loading_remote", {
      title: result.title,
      source: t("chart_source_owid"),
    });
  }
  try {
    const { csvText, metadata } = await fetchOwidChartBundle(result);
    const chartItem = buildOwidChartItem(result, csvText, metadata, effectiveEntity);
    normalizeChartItem(chartItem);
    chartItems.push(chartItem);
    state.activeChartId = chartItem.id;
    state.openChartEditorId = null;
    state.showYAxis = chartItem.yAxisEnabled !== false;
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
    if (ui.chartStatus) {
      ui.chartStatus.textContent = tf("chart_imported_remote", {
        title: chartItem.title,
        source: t("chart_source_owid"),
      });
    }
    scrollToDetails("auto");
  } catch (error) {
    if (ui.chartStatus) {
      ui.chartStatus.textContent = error?.message === "owid-not-enough-points"
        ? tf("chart_points_invalid", { title: result.title })
        : t("chart_import_failed");
    }
  }
}

async function hydrateChartSearchRange(result) {
  if (!result || result.rangeLabel || result.rangeLoading) return result?.rangeLabel;
  result.rangeLoading = true;
  try {
    const { csvText } = await fetchOwidChartBundle(result);
    const rows = parseCsvRows(csvText);
    const timeColumn = rows[0]?.Day ? "Day" : (rows[0]?.Year ? "Year" : null);
    if (!timeColumn) {
      result.rangeLabel = t("chart_date_range_unknown");
      return result.rangeLabel;
    }
    const points = rows
      .map((row) => ({ x: parseOwidPointX(row[timeColumn], timeColumn === "Day" ? "day" : "year") }))
      .filter((point) => Number.isFinite(point.x));
    result.rangeLabel = getChartPointRangeLabel(points);
    return result.rangeLabel;
  } catch {
    result.rangeLabel = t("chart_date_range_unknown");
    return result.rangeLabel;
  } finally {
    result.rangeLoading = false;
  }
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
      forceSettings: groupItem.forceSettings === true,
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
      barAttachmentSide: eventItem.barAttachmentSide,
      relationLineStyle: eventItem.relationLineStyle,
      relationDirection: eventItem.relationDirection,
      enabled: eventItem.enabled,
      flagImageUrl: eventItem.flagImageUrl ?? null,
    }));

  const charts = chartItems
    .filter((chartItem) => groupIdSet.has(chartItem.groupId))
    .map((chartItem) => ({
      id: chartItem.id,
      type: chartItem.type,
      sourceKey: chartItem.sourceKey,
      sourceItemId: chartItem.sourceItemId,
      sourceTitle: chartItem.sourceTitle,
      sourceUrl: chartItem.sourceUrl,
      sourceEntity: chartItem.sourceEntity,
      sourceMetric: chartItem.sourceMetric,
      sourceUnit: chartItem.sourceUnit,
      title: chartItem.title,
      description: chartItem.description,
      color: chartItem.color,
      lineStyle: chartItem.lineStyle,
      fillMode: chartItem.fillMode,
      visible: chartItem.visible !== false,
      displayMode: chartItem.displayMode,
      yAxisEnabled: chartItem.yAxisEnabled !== false,
      yAxisSide: chartItem.yAxisSide,
      yScaleMode: chartItem.yScaleMode,
      yAxisLabel: chartItem.yAxisLabel,
      xPrecision: chartItem.xPrecision,
      visibleStepMin: chartItem.visibleStepMin,
      visibleStepMax: chartItem.visibleStepMax,
      yOffsetPx: chartItem.yOffsetPx,
      groupId: chartItem.groupId,
      parentEventId: chartItem.parentEventId,
      points: Array.isArray(chartItem.points)
        ? chartItem.points.map((point) => ({
          x: point.x,
          y: point.y,
          label: point.label,
          description: point.description,
          meta: point.meta,
        }))
        : [],
    }));

  return {
    type: "timemap-folder-export",
    version: TIMEMAP_FOLDER_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    rootGroupId,
    groups,
    events,
    charts,
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

async function importFolderPayload(payload, onProgress = null) {
  if (!payload || payload.type !== "timemap-folder-export" || !Array.isArray(payload.groups) || !Array.isArray(payload.events)) {
    throw new Error("ungültiges-format");
  }

  const groupIdMap = new Map();
  const eventIdMap = new Map();
  const chartIdMap = new Map();
  const folderTitle = payload.title ?? payload.groups.find((group) => group.parentGroupId == null)?.title ?? "TimeMap";

  if (typeof onProgress === "function") {
    onProgress({
      text: tf("loading_import_folder", { title: folderTitle }),
      progress: 56,
    });
  }

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
      expanded: false,
      enabled: sourceGroup.enabled !== false,
      forceSettings: sourceGroup.forceSettings === true,
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

  (payload.charts ?? []).forEach((sourceChart) => {
    const chartItem = {
      ...createEmptyChart(),
      ...sourceChart,
      id: createUniqueId("chart-import"),
      groupId: sourceChart.groupId ? (groupIdMap.get(sourceChart.groupId) ?? null) : null,
      parentEventId: null,
      visible: sourceChart.visible !== false,
      yAxisEnabled: sourceChart.yAxisEnabled !== false,
      points: Array.isArray(sourceChart.points)
        ? sourceChart.points.map((point) => ({
          x: point.x,
          y: point.y,
          label: point.label ?? "",
          description: point.description ?? "",
          meta: point.meta ?? null,
        }))
        : [],
    };
    normalizeChartItem(chartItem);
    chartIdMap.set(sourceChart.id, chartItem.id);
    chartItems.push(chartItem);
  });

  (payload.charts ?? []).forEach((sourceChart) => {
    const importedChart = getChartById(chartIdMap.get(sourceChart.id));
    if (!importedChart) return;
    importedChart.parentEventId = sourceChart.parentEventId ? (eventIdMap.get(sourceChart.parentEventId) ?? null) : null;
    normalizeChartItem(importedChart);
  });

  sanitizeEventHierarchy();
  const importedRootGroupId = payload.rootGroupId ? groupIdMap.get(payload.rootGroupId) : null;
  const importedRootGroup = importedRootGroupId ? getGroupById(importedRootGroupId) : null;
  if (typeof onProgress === "function" && importedRootGroup) {
    onProgress({
      title: importedRootGroup.title,
      text: tf("loading_import_folder", { title: importedRootGroup.title }),
      progress: 64,
      groupId: importedRootGroup.id,
    });
    await waitForNextPaint();
  }
  if (importedRootGroup) {
    state.openEditorId = null;
    state.openGroupEditorId = null;
  }
  if (typeof onProgress === "function") {
    onProgress({
      text: t("loading_localize_content"),
      progress: 76,
    });
    await waitForNextPaint();
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
  if (typeof onProgress === "function") {
    onProgress({
      text: t("loading_update_view"),
      progress: 94,
    });
    await waitForNextPaint();
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

function showInfoTooltip(titleText, metaText, descriptionText, anchorX, markerY) {
  if (!ui.eventTooltip) return;
  state.tooltipEventId = null;
  ui.eventTooltip.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = titleText;
  const meta = document.createElement("span");
  meta.textContent = metaText;
  const description = document.createElement("span");
  description.textContent = descriptionText;
  ui.eventTooltip.append(title, meta, description);
  ui.eventTooltip.hidden = false;

  const stageRect = svg.getBoundingClientRect();
  const tooltipWidth = 320;
  const left = Math.max(12, Math.min(anchorX - tooltipWidth / 2, stageRect.width - tooltipWidth - 12));
  const top = Math.max(12, markerY - 110);
  ui.eventTooltip.style.left = `${left}px`;
  ui.eventTooltip.style.top = `${top}px`;
}

function formatChartPointX(value, xPrecision = "year") {
  const precision = xPrecision === "day" ? 11 : 9;
  return formatTimelineValue(value, precision);
}

function getChartLegendLabel(chartItem) {
  const unitSuffix = chartItem.sourceUnit ? ` (${chartItem.sourceUnit})` : "";
  return `${chartItem.title || chartItem.yAxisLabel || chartItem.sourceMetric || t("chart_axis_label_none")}${unitSuffix}`;
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
  state.openChartEditorId = null;
  state.activeContextGroupId = match.groupId ?? null;
  if (openEditor) state.openEditorId = eventId;
  updateSelectionPanel();
  renderEventList();
  drawTimeline();
}

function clearSelectedEvent() {
  state.selectedEventId = null;
  state.openGroupEditorId = null;
  state.openChartEditorId = null;
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
    if (event.target?.closest?.("#chartStripControls")) return;
    if (event.type === "wheel" && event.deltaY <= 0) return;
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

function getChartPlotBounds(lineY) {
  const chartTop = 56;
  const chartBottom = Math.max(96, lineY - 70);
  const chartHeight = chartBottom - chartTop;
  return { chartTop, chartBottom, chartHeight };
}

function handleEventDragMove(event) {
  if (!state.dragState) return;
  if (state.dragState.type === "chart") {
    const chartItem = chartItems.find((candidate) => candidate.id === state.dragState.chartId);
    if (!chartItem) return;
    const deltaY = event.clientY - state.dragState.startClientY;
    if (!state.dragState.dragging && Math.abs(deltaY) < 8) {
      return;
    }
    state.dragState.dragging = true;
    const nextOffset = clamp(
      state.dragState.startOffsetPx + deltaY,
      state.dragState.minOffsetPx,
      state.dragState.maxOffsetPx,
    );
    setChartAxisGroupOffset(chartItem, nextOffset);
    drawTimeline();
    return;
  }
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
  const lineY = getTimelineLineY();
  const parentItem = eventItem.parentEventId ? getEventById(eventItem.parentEventId) : null;
  if (parentItem && isBarDisplay(parentItem) && isRangeEvent(parentItem)) {
    const parentLane = getEffectiveLane(parentItem);
    const parentMarkerY = getMarkerYForFixedLane(parentLane == null ? "+0" : parentLane, lineY);
    const nextLaneY = getMarkerYForFixedLane(nextLane, lineY);
    if (Math.abs(nextLaneY - parentMarkerY) <= 4) {
      eventItem.barAttachmentSide = localY > parentMarkerY ? "below" : "above";
    }
  }
  if (eventItem.lane !== nextLane) {
    if (isBarDisplay(eventItem) && isRangeEvent(eventItem)) {
      const nextLaneY = getMarkerYForFixedLane(nextLane == null ? "+0" : nextLane, lineY);
      const attachmentSide = getBarAttachmentSideFromDrag(state.dragState.startMarkerY, nextLaneY, "above");
      (state.dragState.attachedChildIds ?? []).forEach((childId) => {
        const childItem = getEventById(childId);
        if (childItem) {
          childItem.lane = nextLane;
        }
      });
      (state.dragState.attachedRelativeChildren ?? []).forEach(({ id, deltaY }) => {
        const childItem = getEventById(id);
        if (childItem) {
          childItem.lane = getNearestFixedLaneFromY(nextLaneY + deltaY, childItem);
        }
      });
    }
    eventItem.lane = nextLane;
    drawTimeline();
  }
}

function finishEventDrag(event) {
  if (!state.dragState) return;
  const dragState = state.dragState;
  const wasDragging = state.dragState.dragging;
  window.removeEventListener("pointermove", handleEventDragMove);
  window.removeEventListener("pointerup", finishEventDrag);
  window.removeEventListener("pointercancel", finishEventDrag);
  state.dragState = null;

  if (dragState.type === "chart") {
    if (wasDragging) {
      state.suppressClickUntil = Date.now() + 250;
      renderEventList();
      drawTimeline();
    }
    return;
  }

  if (wasDragging) {
    const eventItem = getEventById(dragState.eventId);
    if (eventItem && isBarDisplay(eventItem) && isRangeEvent(eventItem)) {
      const lineY = getTimelineLineY();
      const finalLane = getEffectiveLane(eventItem);
      const finalMarkerY = getMarkerYForFixedLane(finalLane == null ? "+0" : finalLane, lineY);
      const attachmentSide = getBarAttachmentSideFromDrag(dragState.startMarkerY, finalMarkerY, "above");
      const parentGeometry = {
        startX: getEventX(getTimelineValueForEventStart(eventItem)),
        endX: getEventX(getTimelineValueForEventEnd(eventItem)),
        anchorX: getEventX(getEventAnchorYear(eventItem)),
        markerY: finalMarkerY,
      };
      timelineEvents
        .filter((childItem) => childItem.parentEventId === eventItem.id)
        .forEach((childItem) => {
          const childGeometry = {
            startX: getEventX(getTimelineValueForEventStart(childItem)),
            endX: getEventX(getTimelineValueForEventEnd(childItem)),
            anchorX: getEventX(getEventAnchorYear(childItem)),
            markerY: getLaneGeometry(childItem, 0, lineY).markerY,
          };
          if (isPointAssignedOnBar(eventItem, parentGeometry, childItem, childGeometry)) {
            childItem.lane = finalLane;
            if (!(dragState.attachedChildIds ?? []).includes(childItem.id)) {
              childItem.barAttachmentSide = attachmentSide;
            }
          }
        });
    }
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
    const lineY = getTimelineLineY();
    const effectiveLane = getEffectiveLane(eventItem);
    state.dragState = {
      eventId: eventItem.id,
      startClientY: event.clientY,
      dragging: false,
      startMarkerY: getMarkerYForFixedLane(effectiveLane == null ? "+0" : effectiveLane, lineY),
      attachedChildIds: isBarDisplay(eventItem) && isRangeEvent(eventItem)
        ? (() => {
          const parentGeometry = {
            startX: getEventX(getTimelineValueForEventStart(eventItem)),
            endX: getEventX(getTimelineValueForEventEnd(eventItem)),
            anchorX: getEventX(getEventAnchorYear(eventItem)),
            markerY: getMarkerYForFixedLane(effectiveLane == null ? "+0" : effectiveLane, lineY),
          };
          return timelineEvents
            .filter((childItem) => childItem.parentEventId === eventItem.id)
            .filter((childItem) => {
              const childGeometry = {
                startX: getEventX(getTimelineValueForEventStart(childItem)),
                endX: getEventX(getTimelineValueForEventEnd(childItem)),
                anchorX: getEventX(getEventAnchorYear(childItem)),
                markerY: getLaneGeometry(childItem, 0, lineY).markerY,
              };
              return isPointAssignedOnBar(eventItem, parentGeometry, childItem, childGeometry);
            })
            .map((childItem) => childItem.id);
        })()
        : [],
      attachedRelativeChildren: isBarDisplay(eventItem) && isRangeEvent(eventItem)
        ? (() => {
          const parentGeometry = {
            startX: getEventX(getTimelineValueForEventStart(eventItem)),
            endX: getEventX(getTimelineValueForEventEnd(eventItem)),
            anchorX: getEventX(getEventAnchorYear(eventItem)),
            markerY: getMarkerYForFixedLane(effectiveLane == null ? "+0" : effectiveLane, lineY),
          };
          return timelineEvents
            .filter((childItem) => childItem.parentEventId === eventItem.id)
            .filter((childItem) => {
              const childGeometry = {
                startX: getEventX(getTimelineValueForEventStart(childItem)),
                endX: getEventX(getTimelineValueForEventEnd(childItem)),
                anchorX: getEventX(getEventAnchorYear(childItem)),
                markerY: getLaneGeometry(childItem, 0, lineY).markerY,
              };
              return isSlaveTriangleRelationCase(eventItem, childItem, parentGeometry, childGeometry);
            })
            .map((childItem) => ({
              id: childItem.id,
              deltaY: getLaneGeometry(childItem, 0, lineY).markerY - parentGeometry.markerY,
            }));
        })()
        : [],
    };
    window.addEventListener("pointermove", handleEventDragMove);
    window.addEventListener("pointerup", finishEventDrag);
    window.addEventListener("pointercancel", finishEventDrag);
  });
}

function bindChartDrag(target, chartItem, lineY) {
  if (isChartMuteMode()) return;
  target.style.cursor = "grab";
  target.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    hideTooltip();
    const dragBounds = state.chartDragBounds?.[getChartAxisGroupId(chartItem)] ?? null;
    const groupOffset = getChartAxisGroupOffset(chartItem, getVisibleCharts());
    state.dragState = {
      type: "chart",
      chartId: chartItem.id,
      startClientY: event.clientY,
      startOffsetPx: groupOffset,
      minOffsetPx: Number.isFinite(dragBounds?.minOffsetPx) ? dragBounds.minOffsetPx : groupOffset - 120,
      maxOffsetPx: Number.isFinite(dragBounds?.maxOffsetPx) ? dragBounds.maxOffsetPx : groupOffset + 120,
      dragging: false,
    };
    window.addEventListener("pointermove", handleEventDragMove);
    window.addEventListener("pointerup", finishEventDrag);
    window.addEventListener("pointercancel", finishEventDrag);
  });
}

function openEventInLibrary(eventItem) {
  hideTooltip();
  if (state.clickTimer) {
    clearTimeout(state.clickTimer);
    state.clickTimer = null;
  }
  state.lastClickEventId = null;
  state.lastClickTime = 0;
  state.openGroupEditorId = null;
  state.openEditorId = eventItem.id;
  state.selectedEventId = eventItem.id;
  state.activeContextGroupId = eventItem.groupId ?? null;
  if (eventItem.groupId) {
    expandGroupAncestors(eventItem.groupId);
  }
  expandEventAncestors(eventItem.id);
  updateSelectionPanel();
  renderEventList();
  drawTimeline();
  requestAnimationFrame(() => {
    scrollToDetails("auto");
    focusEditorNameField("event", { reveal: true, behavior: "auto", targetId: eventItem.id });
  });
}

function bindEventSelection(target, eventItem) {
  bindEventDrag(target, eventItem);
  target.addEventListener("click", () => {
    if (Date.now() < state.suppressClickUntil) {
      return;
    }

    if (state.clickTimer) {
      clearTimeout(state.clickTimer);
    }
    state.lastClickEventId = eventItem.id;
    state.lastClickTime = Date.now();
    state.clickTimer = window.setTimeout(() => {
      state.clickTimer = null;
      state.tooltipEventId = eventItem.id;
      state.selectedEventId = eventItem.id;
      updateSelectionPanel();
      drawTimeline();
    }, 240);
  });
  target.addEventListener("dblclick", (event) => {
    event.preventDefault();
    if (Date.now() < state.suppressClickUntil) {
      return;
    }
    openEventInLibrary(eventItem);
  });
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEventInLibrary(eventItem);
    }
  });
}

function drawChartsOnTimeline({ paddingX, lineY }) {
  const visibleCharts = getVisibleCharts();
  state.chartDragBounds = {};
  if (!visibleCharts.length) return;
  const chartsMuted = isChartMuteMode();

  const { chartTop, chartBottom, chartHeight } = getChartPlotBounds(lineY);
  if (chartBottom <= chartTop + 24) return;
  const activeChart = getActiveChart();
  const axisGroups = getChartAxisGroups(visibleCharts);
  const axisScaleMap = new Map();
  axisGroups.forEach((group, groupId) => {
    const yValues = group.flatMap((chartItem) => chartItem.points.map((point) => point.y));
    const minY = yValues.length ? Math.min(...yValues) : 0;
    const maxY = yValues.length ? Math.max(...yValues) : 1;
    const yMin = minY === maxY ? minY - 1 : minY;
    const yMax = minY === maxY ? maxY + 1 : maxY;
    const offset = getChartAxisGroupOffset(group[0], visibleCharts);
    axisScaleMap.set(groupId, {
      yMin,
      yMax,
      offset,
      mapY(value) {
        return chartBottom - ((value - yMin) / (yMax - yMin)) * chartHeight + offset;
      },
    });
  });
  const getChartScale = (chartItem) => axisScaleMap.get(getChartAxisGroupId(chartItem));
  const getChartY = (chartItem, value) => getChartScale(chartItem)?.mapY(value) ?? chartBottom;
  const activeAxisGroupId = activeChart ? getChartAxisGroupId(activeChart) : null;
  const activeScale = activeChart ? getChartScale(activeChart) : null;

  if (state.showYAxis && activeChart?.yAxisEnabled !== false && activeScale) {
    const axisX = paddingX - 36;
    const axisColor = chartsMuted ? "#8b949b" : (activeChart?.color || "#a4b0b8");
    svg.appendChild(createSvgElement("line", {
      x1: axisX,
      y1: chartTop + activeScale.offset,
      x2: axisX,
      y2: chartBottom + activeScale.offset,
      stroke: "rgba(238, 243, 246, 0.58)",
      "stroke-width": 1.4,
    }));
    [activeScale.yMax, (activeScale.yMin + activeScale.yMax) / 2, activeScale.yMin].forEach((value) => {
      const y = activeScale.mapY(value);
      svg.appendChild(createSvgElement("line", {
        x1: axisX - 5,
        y1: y,
        x2: axisX,
        y2: y,
        stroke: "rgba(238, 243, 246, 0.58)",
        "stroke-width": 1.2,
      }));
      const label = createSvgElement("text", {
        x: axisX - 8,
        y: y + 4,
        fill: axisColor,
        opacity: 0.96,
        "font-size": 11,
        "font-family": "Segoe UI, Arial, sans-serif",
        "text-anchor": "end",
      });
      label.textContent = Number(value).toFixed(Math.abs(value) < 10 ? 2 : 0);
      svg.appendChild(label);
    });
  }

  if (visibleCharts.length) {
    const baseLabelY = state.height - 24;
    visibleCharts.forEach((chartItem, index) => {
      const groupId = getChartAxisGroupId(chartItem);
      const isChecked = state.showYAxis && activeAxisGroupId === groupId && chartItem.yAxisEnabled !== false;
      const rowY = baseLabelY - (index * 15);
      const labelsX = 10;
      const clickTarget = createSvgElement("rect", {
        x: labelsX - 2,
        y: rowY - 10,
        width: 260,
        height: 14,
        fill: "transparent",
      });
      if (!chartsMuted) {
        clickTarget.style.cursor = "pointer";
        clickTarget.addEventListener("click", () => {
          state.activeChartId = chartItem.id;
          state.showYAxis = chartItem.yAxisEnabled !== false;
          updateChartStripControls();
          drawTimeline();
        });
      }
      svg.appendChild(clickTarget);

      const checkbox = createSvgElement("rect", {
        x: labelsX,
        y: rowY - 8,
        width: 9,
        height: 9,
        rx: 2,
        ry: 2,
        fill: isChecked ? getChartRenderColor(chartItem) : "transparent",
        stroke: getChartRenderColor(chartItem),
        "stroke-width": 1.2,
      });
      if (!chartsMuted) {
        checkbox.style.cursor = "pointer";
        checkbox.addEventListener("click", () => {
          state.activeChartId = chartItem.id;
          state.showYAxis = chartItem.yAxisEnabled !== false;
          updateChartStripControls();
          drawTimeline();
        });
      }
      svg.appendChild(checkbox);

      if (isChecked) {
        const checkMark = createSvgElement("path", {
          d: `M ${labelsX + 2} ${rowY - 4} L ${labelsX + 4} ${rowY - 2} L ${labelsX + 7} ${rowY - 6}`,
          fill: "none",
          stroke: "#1f2428",
          "stroke-width": 1.4,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        });
        if (!chartsMuted) {
          checkMark.style.cursor = "pointer";
          checkMark.addEventListener("click", () => {
            state.activeChartId = chartItem.id;
            state.showYAxis = chartItem.yAxisEnabled !== false;
            updateChartStripControls();
            drawTimeline();
          });
        }
        svg.appendChild(checkMark);
      }

      const label = createSvgElement("text", {
        x: labelsX + 15,
        y: rowY,
        fill: getChartRenderColor(chartItem),
        opacity: 0.94,
        "font-size": 11,
        "font-family": "Segoe UI, Arial, sans-serif",
        "text-anchor": "start",
      });
      if (!chartsMuted) {
        label.style.cursor = "pointer";
        label.addEventListener("click", () => {
          state.activeChartId = chartItem.id;
          state.showYAxis = chartItem.yAxisEnabled !== false;
          updateChartStripControls();
          drawTimeline();
        });
      }
      label.textContent = getChartLegendLabel(chartItem);
      svg.appendChild(label);
    });
  }

  visibleCharts.forEach((chartItem) => {
    const preset = getChartDisplayPreset(chartItem);
    const renderColor = getChartRenderColor(chartItem);
    const chartScale = getChartScale(chartItem);
    if (!chartScale) return;
    const visiblePoints = chartItem.points.filter((point) => {
      const x = getEventX(point.x);
      return x >= paddingX - 24 && x <= state.width - paddingX + 24;
    });
    if (visiblePoints.length < 2) return;
    const pointCoordinates = visiblePoints.map((point) => `${getEventX(point.x)},${getChartY(chartItem, point.y)}`);

    if (chartItem.fillMode === "soft") {
      svg.appendChild(createSvgElement("polygon", {
        fill: renderColor,
        opacity: Math.min(0.16, preset.opacity * 0.2),
        points: [
          ...pointCoordinates,
          `${getEventX(visiblePoints[visiblePoints.length - 1].x)},${chartBottom + chartScale.offset}`,
          `${getEventX(visiblePoints[0].x)},${chartBottom + chartScale.offset}`,
        ].join(" "),
      }));
    }

    const polyline = createSvgElement("polyline", {
      fill: "none",
      stroke: renderColor,
      opacity: preset.opacity,
      "stroke-width": preset.strokeWidth,
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
      points: pointCoordinates.join(" "),
    });
    if (chartItem.lineStyle === "dotted") {
      polyline.setAttribute("stroke-dasharray", "4 4");
    }
    bindChartDrag(polyline, chartItem, lineY);
    svg.appendChild(polyline);

    const dragHit = createSvgElement("polyline", {
      fill: "none",
      stroke: "transparent",
      "stroke-width": 18,
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
      points: pointCoordinates.join(" "),
    });
    bindChartDrag(dragHit, chartItem, lineY);
    svg.appendChild(dragHit);

    visiblePoints.forEach((point) => {
      const pointX = getEventX(point.x);
      const pointY = getChartY(chartItem, point.y);
      const showPointTooltip = () => {
        const xLabel = formatChartPointX(point.x, chartItem.xPrecision);
        const yValue = Number(point.y);
        const yLabel = Number.isFinite(yValue)
          ? `${Math.abs(yValue) < 10 ? yValue.toFixed(2) : yValue.toFixed(0)}${chartItem.sourceUnit ? ` ${chartItem.sourceUnit}` : ""}`
          : String(point.y);
        showInfoTooltip(
          chartItem.title || chartItem.sourceMetric || t("chart_axis_label_none"),
          `x: ${xLabel} | y: ${yLabel}`,
          point.description || chartItem.sourceTitle || t("chart_source_none"),
          pointX,
          pointY,
        );
      };
      const pointHoverHit = createSvgElement("circle", {
        cx: pointX,
        cy: pointY,
        r: 10,
        fill: "#ffffff",
        opacity: 0.001,
        "pointer-events": "none",
      });
      pointHoverHit.addEventListener("mouseenter", () => {
        const xLabel = formatChartPointX(point.x, chartItem.xPrecision);
        const yValue = Number(point.y);
        const yLabel = Number.isFinite(yValue)
          ? `${Math.abs(yValue) < 10 ? yValue.toFixed(2) : yValue.toFixed(0)}${chartItem.sourceUnit ? ` ${chartItem.sourceUnit}` : ""}`
          : String(point.y);
        showInfoTooltip(
          chartItem.title,
          `x: ${xLabel} · y: ${yLabel}`,
          point.description || chartItem.sourceTitle || t("chart_source_none"),
          pointX,
          pointY,
        );
      });
      pointHoverHit.addEventListener("mouseleave", () => {
        hideTooltip();
      });
      bindChartDrag(pointHoverHit, chartItem, lineY);
      svg.appendChild(pointHoverHit);
      const pointMarker = createSvgElement("circle", {
        cx: pointX,
        cy: pointY,
        r: chartItem.id === activeChart?.id ? 3.4 : 2.6,
        fill: renderColor,
        opacity: Math.min(1, preset.opacity + 0.08),
        "pointer-events": "all",
      });
      pointMarker.addEventListener("mouseenter", () => {
        const xLabel = formatChartPointX(point.x, chartItem.xPrecision);
        const yValue = Number(point.y);
        const yLabel = Number.isFinite(yValue)
          ? `${Math.abs(yValue) < 10 ? yValue.toFixed(2) : yValue.toFixed(0)}${chartItem.sourceUnit ? ` ${chartItem.sourceUnit}` : ""}`
          : String(point.y);
        showInfoTooltip(
          chartItem.title,
          `x: ${xLabel} · y: ${yLabel}`,
          point.description || chartItem.sourceTitle || t("chart_source_none"),
          pointX,
          pointY,
        );
      });
      pointMarker.addEventListener("mouseleave", () => {
        hideTooltip();
      });
      pointHoverHit.addEventListener("mouseenter", showPointTooltip);
      pointHoverHit.addEventListener("mouseleave", hideTooltip);
      pointMarker.addEventListener("mouseenter", showPointTooltip);
      pointMarker.addEventListener("mouseleave", hideTooltip);
      bindChartDrag(pointMarker, chartItem, lineY);
      svg.appendChild(pointMarker);
    });
  });

  const topLaneY = getBarMarkerYForLane(POSITIVE_LANES[POSITIVE_LANES.length - 1], lineY);
  const bottomLaneY = getBarMarkerYForLane(NEGATIVE_LANES[NEGATIVE_LANES.length - 1], lineY);
  axisGroups.forEach((group, groupId) => {
    const scale = axisScaleMap.get(groupId);
    if (!scale) return;
    const renderedYs = group.flatMap((chartItem) => chartItem.points.map((point) => scale.mapY(point.y)));
    if (!renderedYs.length) return;
    const currentMinY = Math.min(...renderedYs);
    const currentMaxY = Math.max(...renderedYs);
    state.chartDragBounds[groupId] = {
      minOffsetPx: scale.offset + (topLaneY - currentMinY),
      maxOffsetPx: scale.offset + (bottomLaneY - currentMaxY),
    };
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
  const occupiedGraphicBounds = [];
  const labelPlacements = [];
  const pendingAssignedOnBarVisuals = [];

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

  drawChartsOnTimeline({ paddingX, lineY });

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
    const visibleLabelCenterX = isRangeEvent(eventItem)
      ? getVisibleObjectLabelCenterX(startX, endX, paddingX, state.width - paddingX, anchorX)
      : anchorX;
    const selected = eventItem.id === state.selectedEventId;
    const effectiveColor = getEffectiveColor(eventItem);
    const effectiveLane = getEffectiveLane(eventItem);
    const accent = selected ? "#ff8f5a" : (effectiveColor || (isBarDisplay(eventItem) ? BAR_DEFAULT_COLOR : "#9ed3df"));
    const pointRadius = selected ? 8 : 6;
    const rangeEndpointRadius = selected ? 6 : 4.5;
    const parentItem = eventItem.parentEventId ? getEventById(eventItem.parentEventId) : null;
    const parentGeometry = parentItem ? eventGeometries.get(parentItem.id) : null;
    const assignedOnBar = isPointAssignedOnBar(parentItem, parentGeometry, eventItem, geometry);
    const relationGeometry = parentItem && parentGeometry
      ? getRelationGeometry(parentItem, eventItem, parentGeometry, geometry)
      : null;
    const slaveTriangleRelation = !assignedOnBar
      && isSlaveTriangleRelationCase(parentItem, eventItem, parentGeometry, geometry);
    const relationActive = parentItem && relationGeometry && eventItem.relationLineStyle !== "none" && !assignedOnBar;

    if (relationActive) {
      pendingRelations.push({
        eventItem,
        parentItem,
        childGeometry: geometry,
        parentGeometry,
        relationGeometry,
        selected,
        slaveTriangleRelation,
      });
    }

    if (isBarDisplay(eventItem) && isRangeEvent(eventItem)) {
      const boxHeight = 14;
      const boxY = markerY - boxHeight / 2;
      const boxX = Math.min(startX, endX);
      const boxWidth = Math.max(12, Math.abs(endX - startX));
      const rangeBox = createSvgElement("rect", {
        x: boxX,
        y: boxY,
        width: boxWidth,
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
      occupiedGraphicBounds.push({
        eventId: eventItem.id,
        kind: "bar",
        rect: insetRect({ x: boxX, y: boxY, width: boxWidth, height: boxHeight }, 0.5, 1.5),
      });

      const labelResult = drawSvgLabelWithPrefix(eventItem, visibleLabelCenterX, markerY + 4, {
        fill: "#eef3f6",
        fontSize: 11.5,
        fontWeight: selected ? 600 : 500,
        align: "center",
      });
      if (labelResult?.group) {
        bindEventSelection(labelResult.group, eventItem);
      }
      labelPlacements.push({
        eventId: eventItem.id,
        kind: "bar",
        bounds: labelResult?.bounds ?? null,
        group: labelResult?.group ?? null,
      });

      if (state.tooltipEventId === eventItem.id) {
        showTooltip(eventItem, anchorX, markerY - 8);
      }
      return;
    }

    let pointMarker = null;
    let pointGraphicBounds = null;
    let assignedVisualElements = [];
    let assignedVisualBounds = [];
    const pointVisualRadius = assignedOnBar ? rangeEndpointRadius : pointRadius;

    if (isRangeEvent(eventItem)) {
      const rangeStrokeWidth = selected ? 6 : 4;
      const rangeLine = createSvgElement("line", {
        x1: startX, y1: markerY, x2: endX, y2: markerY,
        stroke: accent, "stroke-width": rangeStrokeWidth, "stroke-linecap": "round",
        tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
      });
      bindEventSelection(rangeLine, eventItem);
      svg.appendChild(rangeLine);
      const rangeLineBounds = {
        eventId: eventItem.id,
        kind: "line",
        rect: {
          x: Math.min(startX, endX),
          y: markerY - rangeStrokeWidth / 2,
          width: Math.max(1, Math.abs(endX - startX)),
          height: rangeStrokeWidth,
        },
      };
      occupiedGraphicBounds.push(rangeLineBounds);
      assignedVisualElements.push(rangeLine);
      assignedVisualBounds.push(rangeLineBounds.rect);

      [startX, endX].forEach((x) => {
        const endpoint = createSvgElement("circle", {
          cx: x, cy: markerY, r: rangeEndpointRadius,
          fill: selected ? "#ffb347" : "#d7edf2", stroke: "#22272b", "stroke-width": 2,
          tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
        });
        bindEventSelection(endpoint, eventItem);
        svg.appendChild(endpoint);
        const endpointBounds = {
          eventId: eventItem.id,
          kind: "endpoint",
          rect: {
            x: x - rangeEndpointRadius,
            y: markerY - rangeEndpointRadius,
            width: rangeEndpointRadius * 2,
            height: rangeEndpointRadius * 2,
          },
        };
        occupiedGraphicBounds.push(endpointBounds);
        assignedVisualElements.push(endpoint);
        assignedVisualBounds.push(endpointBounds.rect);
      });
    } else {
      if (!slaveTriangleRelation) {
        pointMarker = createSvgElement("circle", {
          cx: anchorX, cy: markerY, r: pointVisualRadius,
          fill: accent, stroke: "#22272b", "stroke-width": 2,
          tabindex: 0, role: "button", "aria-label": `${eventItem.title}, ${getEventDateLabel(eventItem)}`,
        });
        bindEventSelection(pointMarker, eventItem);
        svg.appendChild(pointMarker);
        pointGraphicBounds = {
          eventId: eventItem.id,
          kind: "point",
          rect: {
            x: anchorX - pointVisualRadius,
            y: markerY - pointVisualRadius,
            width: pointVisualRadius * 2,
            height: pointVisualRadius * 2,
          },
        };
        assignedVisualElements.push(pointMarker);
        assignedVisualBounds.push(pointGraphicBounds.rect);
      }
    }

    const previewAttachmentSide = assignedOnBar
      ? (
        state.dragState?.eventId === parentItem?.id && state.dragState.dragging
          ? (
            (state.dragState.attachedChildIds ?? []).includes(eventItem.id)
              ? (eventItem.barAttachmentSide === "below" ? "below" : "above")
              : null
          )
          : (eventItem.barAttachmentSide === "below" ? "below" : "above")
      )
      : null;

    const specialLabelSide = slaveTriangleRelation
      ? (getSlaveTrianglePreferredSide(parentItem) ?? (assignedOnBar ? previewAttachmentSide : null))
      : (assignedOnBar ? previewAttachmentSide : null);
    const specialLabelY = parentGeometry
      ? getLabelYAwayFromParent(
        eventItem,
        geometry,
        parentGeometry,
        {
          extended: assignedOnBar && eventItem.relationLineStyle !== "none",
          preferredSide: specialLabelSide,
        },
      )
      : geometry.labelY;

    if (assignedOnBar && eventItem.relationLineStyle !== "none") {
      const connectorStartY = isRangeEvent(eventItem)
        ? markerY + (specialLabelY < markerY ? -(selected ? 3 : 2) : (selected ? 3 : 2))
        : specialLabelY < markerY
          ? markerY - pointVisualRadius
          : markerY + pointVisualRadius;
      const labelConnector = createSvgElement("line", {
        x1: anchorX,
        y1: connectorStartY,
        x2: anchorX,
        y2: specialLabelY + (specialLabelY < markerY ? 5 : -12),
        stroke: selected ? "#ff8f5a" : "rgba(238, 243, 246, 0.92)",
        "stroke-width": selected ? 2.2 : 1.8,
        "stroke-linecap": "round",
      });
      const connectorDasharray = getRelationStrokeDasharray(eventItem.relationLineStyle);
      if (connectorDasharray) {
        labelConnector.setAttribute("stroke-dasharray", connectorDasharray);
      }
      svg.appendChild(labelConnector);
    }

      const labelResult = drawSvgLabelWithPrefix(eventItem, visibleLabelCenterX, specialLabelY, {
        fill: selected ? "#eef3f6" : "#a4b0b8",
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
      align: specialLabelY < markerY ? "above" : "below",
    });
    if (labelResult?.group) {
      bindEventSelection(labelResult.group, eventItem);
    }
    if (assignedOnBar && assignedVisualElements.length > 0 && parentItem) {
      const aggregateRect = assignedVisualBounds.reduce((acc, rect) => {
        if (!acc) return { ...rect };
        const left = Math.min(acc.x, rect.x);
        const top = Math.min(acc.y, rect.y);
        const right = Math.max(acc.x + acc.width, rect.x + rect.width);
        const bottom = Math.max(acc.y + acc.height, rect.y + rect.height);
        return {
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
        };
      }, null);
      pendingAssignedOnBarVisuals.push({
        elements: assignedVisualElements,
        visualRect: aggregateRect ? insetRect(aggregateRect, -2, -2) : null,
        parentEventId: parentItem.id,
      });
    }

    if (pointGraphicBounds) {
      occupiedGraphicBounds.push(pointGraphicBounds);
    }

    labelPlacements.push({
      eventId: eventItem.id,
      kind: isBarDisplay(eventItem) ? "bar" : "line",
      bounds: labelResult?.bounds ?? null,
      group: labelResult?.group ?? null,
      ignoreGraphicEventIds: assignedOnBar && parentItem ? [parentItem.id] : [],
    });

    if (state.tooltipEventId === eventItem.id) {
      showTooltip(eventItem, anchorX, markerY);
    }
  });

  pendingRelations.forEach(({ eventItem, parentItem, relationGeometry, selected, slaveTriangleRelation }) => {
    if (slaveTriangleRelation && relationGeometry.orientation === "vertical" && parentItem) {
      const parentAccent = getEffectiveColor(parentItem) || BAR_DEFAULT_COLOR;
      const parentSelected = state.selectedEventId === parentItem.id;
      const parentOpacity = parentSelected ? 0.95 : 0.82;
      const parentStroke = parentSelected ? "#ffb347" : "#d7edf2";
      const parentStrokeWidth = parentSelected ? 2 : 1;
      const trianglePreferredSide = getSlaveTrianglePreferredSide(parentItem);
      const drawBelowBar = trianglePreferredSide === "below";
      const baseY = drawBelowBar ? relationGeometry.parentBounds.bottom : relationGeometry.parentBounds.top;
      const coverY = drawBelowBar ? (baseY - 0.6) : (baseY + 0.6);
      const tipY = drawBelowBar ? (baseY + 7.2) : (baseY - 7.2);
      const leftX = relationGeometry.x1 - 5.2;
      const rightX = relationGeometry.x1 + 5.2;
      const triangle = createSvgElement("polygon", {
        points: `${leftX},${coverY} ${rightX},${coverY} ${relationGeometry.x1},${tipY}`,
        fill: parentAccent,
        opacity: parentOpacity,
      });
      svg.appendChild(triangle);
      const baseOverlay = createSvgElement("rect", {
        x: leftX - 0.25,
        y: baseY - (parentStrokeWidth / 2) - 0.6,
        width: (rightX - leftX) + 0.5,
        height: parentStrokeWidth + 1.2,
        fill: parentAccent,
      });
      svg.appendChild(baseOverlay);
      const outline = createSvgElement("path", {
        d: `M ${leftX} ${baseY} L ${relationGeometry.x1} ${tipY} L ${rightX} ${baseY}`,
        fill: "none",
        stroke: parentStroke,
        "stroke-width": parentStrokeWidth,
        "stroke-linecap": "butt",
        "stroke-linejoin": "round",
      });
      svg.appendChild(outline);
      return;
    }
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

  const visibleLabelBounds = [];
  const visibleLabelBoundsByEventId = new Map();
  labelPlacements.forEach(({ eventId, kind, bounds, group, ignoreGraphicEventIds = [] }) => {
    if (!bounds || !group) return;
    const overlapsGraphic = occupiedGraphicBounds.some(({ eventId: foreignEventId, kind: foreignKind, rect }) => {
      if (foreignEventId === eventId) return false;
      if (ignoreGraphicEventIds.includes(foreignEventId)) return false;
      if (kind === "bar") return false;
      return rectanglesOverlap(bounds, rect, 0);
    });
    const labelPadding = kind === "bar" ? 0 : 4;
    const overlapsVisibleLabel = visibleLabelBounds.some((rect) => rectanglesOverlap(bounds, rect, labelPadding));
    if (overlapsGraphic || overlapsVisibleLabel) {
      group.setAttribute("display", "none");
      return;
    }
    visibleLabelBounds.push(bounds);
    visibleLabelBoundsByEventId.set(eventId, bounds);
  });

  pendingAssignedOnBarVisuals.forEach(({ elements, visualRect, parentEventId }) => {
    const parentLabelBounds = visibleLabelBoundsByEventId.get(parentEventId);
    if (!parentLabelBounds || !visualRect) return;
    if (rectanglesOverlap(visualRect, parentLabelBounds, 0)) {
      elements.forEach((element) => {
        element.setAttribute("display", "none");
      });
    }
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
  editor.dataset.eventId = eventItem.id;
  const rerenderEditor = ({ updateSelection = false, redrawTimeline = true, rerenderSearch = false } = {}) => {
    const scrollTop = ui.editorPanel?.scrollTop ?? 0;
    if (updateSelection && state.selectedEventId === eventItem.id) updateSelectionPanel();
    renderEventList();
    if (rerenderSearch) renderSearchResults();
    if (redrawTimeline) drawTimeline();
    requestAnimationFrame(() => {
      if (ui.editorPanel) ui.editorPanel.scrollTop = scrollTop;
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
    const previousGroupId = eventItem.groupId;
    eventItem.groupId = groupSelect.value || null;
    state.openGroupEditorId = null;
    state.activeContextGroupId = eventItem.groupId ?? null;
    const assignableParents = getAssignableParentEvents(eventItem);
    if (!assignableParents.some((candidate) => candidate.id === eventItem.parentEventId)) {
      eventItem.parentEventId = null;
    }
    if (previousGroupId && previousGroupId !== eventItem.groupId) {
      const previousGroup = getGroupById(previousGroupId);
      if (previousGroup) {
        previousGroup.expanded = false;
      }
    }
    if (eventItem.groupId) {
      const groupItem = getGroupById(eventItem.groupId);
      if (groupItem) {
        groupItem.expanded = true;
        expandGroupAncestors(eventItem.groupId);
      }
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
    if (eventItem.parentEventId) {
      eventItem.expanded = false;
      if (state.openEditorId === eventItem.id) {
        state.openEditorId = null;
      }
    }
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
  const folderField = createField(t("folder"), groupSelect);
  const folderRelationHint = document.createElement("p");
  folderRelationHint.className = "editor-meta editor-inline-hint";
  folderRelationHint.textContent = t("folder_relation_hint");

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

  const folderRelationRow = document.createElement("div");
  folderRelationRow.className = "field-row year-fields";
  folderRelationRow.append(
    folderField,
    relationField,
  );

  editor.append(
    createField(t("title"), titleInput),
    yearRow,
    checkboxLabel,
    displayRow,
    createColorField(t("color_value"), colorInput, applyEventColorChange),
    createField(t("description"), descriptionArea),
    folderRelationRow,
    folderRelationHint,
    createField(t("category"), categoryInput),
    zoomRow,
    relationRow,
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

function isGroupAncestorOrSelf(groupId, targetGroupId) {
  let currentGroupId = targetGroupId;
  while (currentGroupId) {
    if (currentGroupId === groupId) return true;
    currentGroupId = getGroupById(currentGroupId)?.parentGroupId ?? null;
  }
  return false;
}

function isEventAncestorOrSelf(eventId, targetEventId) {
  let currentEventId = targetEventId;
  while (currentEventId) {
    if (currentEventId === eventId) return true;
    currentEventId = getEventById(currentEventId)?.parentEventId ?? null;
  }
  return false;
}

function getOpenEditorEvent() {
  return state.openEditorId ? getEventById(state.openEditorId) : null;
}

function getActiveContextGroupId() {
  const openEditorEvent = getOpenEditorEvent();
  if (openEditorEvent?.groupId) return openEditorEvent.groupId;
  if (state.openGroupEditorId) return state.openGroupEditorId;
  if (state.activeContextGroupId && hasOpenGroupBranch(state.activeContextGroupId)) {
    return state.activeContextGroupId;
  }
  return null;
}

function getTopLevelEventIdWithinGroup(eventId, groupId) {
  let currentEvent = getEventById(eventId);
  if (!currentEvent || currentEvent.groupId !== groupId) return null;
  while (currentEvent.parentEventId) {
    const parentEvent = getEventById(currentEvent.parentEventId);
    if (!parentEvent || parentEvent.groupId !== groupId) break;
    currentEvent = parentEvent;
  }
  return currentEvent.id;
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
  row.draggable = true;
  row.addEventListener("dragstart", (event) => {
    state.browserDragEventId = eventItem.id;
    state.browserDragChartId = null;
    state.browserDragGroupId = null;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", eventItem.id);
  });
  row.addEventListener("dragend", () => {
    state.browserDragEventId = null;
    state.browserDragChartId = null;
    row.classList.remove("is-dragging");
  });
  row.addEventListener("dragover", (event) => {
    if (state.browserDragChartId) {
      if (!canDropChartOnEvent(state.browserDragChartId, eventItem.id)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("is-drop-target");
      return;
    }
    if (!canDropEventOnEvent(state.browserDragEventId, eventItem.id)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("is-drop-target");
  });
  row.addEventListener("drop", (event) => {
    if (state.browserDragChartId) {
      const chartId = state.browserDragChartId || event.dataTransfer.getData("text/plain");
      if (!canDropChartOnEvent(chartId, eventItem.id)) return;
      event.preventDefault();
      event.stopPropagation();
      const draggedChart = getChartById(chartId);
      if (!draggedChart) return;
      moveChartToGroup(draggedChart.id, eventItem.groupId);
      draggedChart.parentEventId = eventItem.id;
      eventItem.expanded = true;
      expandGroupAncestors(eventItem.groupId);
      state.browserDragChartId = null;
      renderEventList();
      drawTimeline();
      return;
    }
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
  const childCharts = getChildChartsForEvent(eventItem.id);
  const hasChildEvents = childEvents.length > 0;
  const hasChildCharts = childCharts.length > 0;
  const contextOpen = eventItem.expanded && (hasChildEvents || hasChildCharts);
  const controlsMuted = muted;
  if (contextOpen) item.classList.add("is-context-open");
  row.draggable = !controlsMuted;

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
  toggleButton.disabled = !(hasChildEvents || hasChildCharts) || muted;
  toggleButton.setAttribute("aria-label", (hasChildEvents || hasChildCharts) ? t("show_child_events") : "");
  toggleButton.textContent = (hasChildEvents || hasChildCharts) ? (eventItem.expanded ? "▾" : "▸") : "";
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!(hasChildEvents || hasChildCharts)) return;
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
    state.openChartEditorId = null;
    state.openEditorId = state.openEditorId === eventItem.id ? null : eventItem.id;
    state.activeContextGroupId = eventItem.groupId ?? null;
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
    chartItems.forEach((candidate) => {
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

  if (eventItem.expanded && hasChildCharts) {
    const chartChildren = document.createElement("div");
    chartChildren.className = "group-children";
    childCharts.forEach((chartItem) => {
      chartChildren.appendChild(createChartBrowserItem(chartItem, {
        child: true,
        depth: depth + 1,
        muted,
      }));
    });
    item.appendChild(chartChildren);
  }

  return item;
}

function createGroupInlineEditor(groupItem) {
  const editor = document.createElement("div");
  editor.className = "event-inline-editor group-inline-editor";
  editor.dataset.groupId = groupItem.id;
  const rerenderGroupEditor = ({ redrawTimeline = true } = {}) => {
    const scrollTop = ui.editorPanel?.scrollTop ?? 0;
    renderEventList();
    if (redrawTimeline) drawTimeline();
    requestAnimationFrame(() => {
      if (ui.editorPanel) ui.editorPanel.scrollTop = scrollTop;
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

  const forceSettingsCheckbox = document.createElement("input");
  forceSettingsCheckbox.type = "checkbox";
  forceSettingsCheckbox.checked = groupItem.forceSettings === true;
  forceSettingsCheckbox.addEventListener("change", () => {
    groupItem.forceSettings = forceSettingsCheckbox.checked;
    rerenderGroupEditor();
  });

  const forceSettingsField = document.createElement("label");
  forceSettingsField.className = "field checkbox-field";
  const forceSettingsText = document.createElement("span");
  forceSettingsText.textContent = t("folder_force_settings");
  forceSettingsField.append(forceSettingsCheckbox, forceSettingsText);

  const zoomRow = document.createElement("div");
  zoomRow.className = "field-row year-fields";
  zoomRow.append(
    createField(t("standard_visible_from"), zoomMinSelect),
    createField(t("until").toLowerCase(), zoomMaxSelect),
  );

  editor.append(
    createField(t("folder_name"), titleInput),
    forceSettingsField,
    zoomRow,
    laneField,
    createColorField(t("folder_color_value"), colorInput, applyGroupColorChange),
  );
  return editor;
}

function buildEventHierarchy(groupId, parentEventId = null, depth = 0, inheritedMuted = false) {
  const directChildren = getEventsForGroup(groupId)
    .filter((eventItem) => (eventItem.parentEventId ?? null) === parentEventId);
  const openEditorEvent = getOpenEditorEvent();
  const activeChildId = openEditorEvent && openEditorEvent.groupId === groupId
    ? directChildren.find((eventItem) => isEventAncestorOrSelf(eventItem.id, openEditorEvent.id))?.id ?? null
    : null;

  return directChildren.flatMap((eventItem) => {
    const ownMuted = inheritedMuted || (activeChildId != null && activeChildId !== eventItem.id);
    return [
      { eventItem, depth, muted: ownMuted },
      ...(eventItem.expanded ? buildEventHierarchy(groupId, eventItem.id, depth + 1, ownMuted) : []),
    ];
  });
}

function createGroupBrowserItem(groupItem, options = {}) {
  const { muted = false, loadingState = null } = options;
  const openEditorEvent = getOpenEditorEvent();
  const activeContextGroupId = getActiveContextGroupId();
  const hasExplicitNestedFocus = Boolean(openEditorEvent || state.openGroupEditorId);
  const container = document.createElement("div");
  container.className = "group-browser-item";
  if (groupItem.parentGroupId) container.classList.add("is-child-group");
  if (muted) container.classList.add("is-focus-muted");
  container.style.setProperty("--tree-depth", String(Math.max(0, getGroupDepth(groupItem.id) - 1)));

  const row = document.createElement("div");
  row.className = "group-row";
  row.draggable = !muted;
  row.addEventListener("dragstart", (event) => {
    if (muted) {
      event.preventDefault();
      return;
    }
    state.browserDragGroupId = groupItem.id;
    state.browserDragEventId = null;
    state.browserDragChartId = null;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", groupItem.id);
  });
  row.addEventListener("dragend", () => {
    state.browserDragGroupId = null;
    state.browserDragChartId = null;
    row.classList.remove("is-dragging");
  });
  row.addEventListener("dragover", (event) => {
    if (state.browserDragGroupId) {
      if (!canDropGroupOnGroup(state.browserDragGroupId, groupItem.id)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("is-drop-target");
      return;
    }
    if (state.browserDragChartId) {
      if (!canDropChartOnGroup(state.browserDragChartId, groupItem.id)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("is-drop-target");
      return;
    }
    if (!canDropEventOnGroup(state.browserDragEventId, groupItem.id)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("is-drop-target");
  });
  row.addEventListener("drop", (event) => {
    if (state.browserDragGroupId) {
      const draggedGroupId = state.browserDragGroupId || event.dataTransfer.getData("text/plain");
      if (!canDropGroupOnGroup(draggedGroupId, groupItem.id)) return;
      event.preventDefault();
      const draggedGroup = getGroupById(draggedGroupId);
      if (!draggedGroup) return;
      moveGroupTreeToGroup(draggedGroup.id, groupItem.id);
      groupItem.expanded = true;
      expandGroupAncestors(groupItem.id);
      state.activeContextGroupId = draggedGroup.id;
      state.browserDragGroupId = null;
      renderEventList();
      drawTimeline();
      return;
    }
    if (state.browserDragChartId) {
      const chartId = state.browserDragChartId || event.dataTransfer.getData("text/plain");
      if (!canDropChartOnGroup(chartId, groupItem.id)) return;
      event.preventDefault();
      const chartItem = getChartById(chartId);
      if (!chartItem) return;
      moveChartToGroup(chartItem.id, groupItem.id);
      chartItem.parentEventId = null;
      groupItem.expanded = true;
      expandGroupAncestors(groupItem.id);
      state.browserDragChartId = null;
      renderEventList();
      drawTimeline();
      return;
    }
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
  const directChartEntries = getChartsForGroup(groupItem.id).filter((chartItem) => chartItem.parentEventId == null);
  const hasVisibleChildren = directChildGroups.length > 0 || directEventEntries.length > 0 || directChartEntries.length > 0;
  const contextOpen = groupItem.expanded && hasVisibleChildren;
  const contextChildGroupId = activeContextGroupId
    && activeContextGroupId !== groupItem.id
    && isGroupAncestorOrSelf(groupItem.id, activeContextGroupId)
    ? directChildGroups.find((childGroupItem) => isGroupAncestorOrSelf(childGroupItem.id, activeContextGroupId))?.id ?? null
    : null;
  const activeChildGroupId = contextChildGroupId ?? null;
  const activeChildEventId = openEditorEvent && openEditorEvent.groupId === groupItem.id
    ? getTopLevelEventIdWithinGroup(openEditorEvent.id, groupItem.id)
    : null;
  const hasDeeperActiveFocus = activeChildGroupId != null || activeChildEventId != null;
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
    if (groupItem.expanded) {
      state.activeContextGroupId = groupItem.id;
    } else {
      const openEditorEvent = getOpenEditorEvent();
      if (openEditorEvent?.groupId && isGroupAncestorOrSelf(groupItem.id, openEditorEvent.groupId)) {
        state.openEditorId = null;
      }
      if (state.openGroupEditorId && isGroupAncestorOrSelf(groupItem.id, state.openGroupEditorId)) {
        state.openGroupEditorId = null;
      }
      if (state.activeContextGroupId && isGroupAncestorOrSelf(groupItem.id, state.activeContextGroupId)) {
        state.activeContextGroupId = null;
      }
    }
    renderEventList();
  });

  const main = document.createElement("div");
  main.className = "group-row-main";
  main.classList.toggle("is-disabled", muted);

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
  addSubgroupButton.disabled = muted || !contextOpen || hasDeeperActiveFocus;
  addSubgroupButton.textContent = t("add_subfolder");
  addSubgroupButton.addEventListener("click", () => {
    const newGroup = createEmptyGroup(groupItem.id);
    eventGroups.push(newGroup);
    groupItem.expanded = true;
    state.openEditorId = null;
    state.openGroupEditorId = newGroup.id;
    state.activeContextGroupId = newGroup.id;
    renderEventList();
    focusEditorNameField("group", { reveal: true, behavior: "auto" });
  });

  const propertiesButton = document.createElement("button");
  propertiesButton.type = "button";
  propertiesButton.className = "group-row-export group-row-properties";
  const propertiesOpen = state.openGroupEditorId === groupItem.id;
  const propertiesMuted = !propertiesOpen && (muted || contextOpen);
  if (propertiesOpen) {
    propertiesButton.classList.add("is-active");
  }
  propertiesButton.disabled = propertiesMuted;
  propertiesButton.classList.toggle("is-muted", propertiesMuted);
  propertiesButton.textContent = "⚙";
  propertiesButton.setAttribute("aria-label", t("folder_properties"));
  propertiesButton.addEventListener("click", () => {
    const isClosing = state.openGroupEditorId === groupItem.id;
    state.openEditorId = null;
    state.openChartEditorId = null;
    state.openGroupEditorId = isClosing ? null : groupItem.id;
    state.activeContextGroupId = isClosing
      ? (groupItem.expanded ? groupItem.id : null)
      : groupItem.id;
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
    for (let index = chartItems.length - 1; index >= 0; index -= 1) {
      if (descendantIds.has(chartItems[index].groupId)) {
        if (state.openChartEditorId === chartItems[index].id) state.openChartEditorId = null;
        if (state.activeChartId === chartItems[index].id) state.activeChartId = null;
        chartItems.splice(index, 1);
      }
    }
    for (let index = eventGroups.length - 1; index >= 0; index -= 1) {
      if (descendantIds.has(eventGroups[index].id)) {
        eventGroups.splice(index, 1);
      }
    }
    if (!chartItems.length) {
      state.showYAxis = false;
    }
    renderEpochMenu();
    renderEventList();
    renderSearchResults();
    updateSelectionPanel();
    drawTimeline();
  });

  row.append(checkWrap, toggleButton, main, source, addSubgroupButton, propertiesButton, exportButton, deleteButton);
  container.appendChild(row);

  if (loadingState) {
    container.appendChild(createInlineLoadingBody(loadingState));
  }

  if (state.openGroupEditorId === groupItem.id) {
    container.appendChild(createGroupInlineEditor(groupItem));
  }

  if (groupItem.expanded) {
    const children = buildEventHierarchy(groupItem.id);
    const childGroups = directChildGroups;
    const childList = document.createElement("div");
    childList.className = "group-children";
    if (childGroups.length === 0 && children.length === 0 && directChartEntries.length === 0) {
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
      directChartEntries.forEach((chartItem) => {
        const chartMuted = activeChildGroupId != null || activeChildEventId != null;
        try {
          childList.appendChild(createChartBrowserItem(chartItem, {
            child: true,
            depth: 1,
            muted: chartMuted,
          }));
        } catch {
          childList.appendChild(createChartBrowserFallbackItem(chartItem, {
            child: true,
            depth: 1,
            muted: chartMuted,
          }));
        }
      });
    }
    container.appendChild(childList);
  }

  return container;
}

function createChartInlineEditor(chartItem) {
  normalizeChartItem(chartItem);
  const editor = document.createElement("div");
  editor.className = "chart-inline-editor";
  editor.dataset.chartId = chartItem.id;

  const rerenderEditor = ({ redrawTimeline = true } = {}) => {
    const scrollTop = ui.editorPanel?.scrollTop ?? 0;
    renderEventList();
    renderChartResults();
    if (redrawTimeline) drawTimeline();
    requestAnimationFrame(() => {
      if (ui.editorPanel) ui.editorPanel.scrollTop = scrollTop;
    });
  };

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.dataset.editorNameField = "chart";
  titleInput.value = chartItem.title;
  titleInput.addEventListener("change", () => {
    chartItem.title = titleInput.value.trim() || chartItem.title;
    rerenderEditor();
  });

  const colorInput = document.createElement("input");
  colorInput.type = "text";
  colorInput.value = chartItem.color;
  colorInput.placeholder = t("example_group_color");
  const applyColorChange = (value = colorInput.value) => {
    chartItem.color = String(value).trim() || "#c96f4a";
    rerenderEditor();
  };
  colorInput.addEventListener("change", () => {
    applyColorChange(colorInput.value);
  });

  const sourceInput = document.createElement("input");
  sourceInput.type = "text";
  sourceInput.value = chartItem.sourceTitle;
  sourceInput.addEventListener("change", () => {
    chartItem.sourceTitle = sourceInput.value.trim();
    rerenderEditor({ redrawTimeline: false });
  });

  const groupSelect = document.createElement("select");
  groupSelect.appendChild(createSelectOption("", t("no_folder_assigned"), chartItem.groupId == null));
  getAssignableGroups().forEach((groupItem) => {
    groupSelect.appendChild(createSelectOption(groupItem.id, groupItem.title, chartItem.groupId === groupItem.id));
  });
  groupSelect.addEventListener("change", () => {
    chartItem.groupId = groupSelect.value || null;
    if (!chartItem.groupId) {
      chartItem.parentEventId = null;
    } else {
      expandGroupAncestors(chartItem.groupId);
    }
    rerenderEditor();
  });

  const relationParentSelect = document.createElement("select");
  relationParentSelect.appendChild(createSelectOption("", t("relation_none"), chartItem.parentEventId == null));
  getAssignableParentEventsForChart(chartItem).forEach((candidate) => {
    relationParentSelect.appendChild(createSelectOption(candidate.id, candidate.title, chartItem.parentEventId === candidate.id));
  });
  relationParentSelect.addEventListener("change", () => {
    chartItem.parentEventId = relationParentSelect.value || null;
    rerenderEditor({ redrawTimeline: false });
  });

  const axisLabelInput = document.createElement("input");
  axisLabelInput.type = "text";
  axisLabelInput.value = chartItem.yAxisLabel;
  axisLabelInput.addEventListener("change", () => {
    chartItem.yAxisLabel = axisLabelInput.value.trim();
    const nextGroupMembers = getChartsInAxisGroup(chartItem, chartItems);
    const normalizedOffset = nextGroupMembers.find((candidate) => candidate.id !== chartItem.id)?.yOffsetPx;
    if (Number.isFinite(normalizedOffset)) {
      setChartAxisGroupOffset(chartItem, normalizedOffset);
    }
    rerenderEditor();
  });

  const descriptionArea = document.createElement("textarea");
  descriptionArea.rows = 4;
  descriptionArea.value = chartItem.description;
  descriptionArea.addEventListener("change", () => {
    chartItem.description = descriptionArea.value.trim();
    rerenderEditor({ redrawTimeline: false });
  });

  const lineStyleSelect = document.createElement("select");
  lineStyleSelect.append(
    createSelectOption("solid", t("line_solid"), chartItem.lineStyle === "solid"),
    createSelectOption("dotted", t("line_dotted"), chartItem.lineStyle === "dotted"),
  );
  lineStyleSelect.addEventListener("change", () => {
    chartItem.lineStyle = lineStyleSelect.value === "dotted" ? "dotted" : "solid";
    rerenderEditor();
  });

  const displayModeSelect = document.createElement("select");
  displayModeSelect.append(
    createSelectOption("background", t("chart_display_events"), chartItem.displayMode === "background"),
    createSelectOption("mixed", t("chart_display_mixed"), chartItem.displayMode === "mixed"),
    createSelectOption("foreground", t("chart_display_focus"), chartItem.displayMode === "foreground"),
  );
  displayModeSelect.addEventListener("change", () => {
    chartItem.displayMode = displayModeSelect.value;
    rerenderEditor();
  });

  const axisCheckbox = document.createElement("input");
  axisCheckbox.type = "checkbox";
  axisCheckbox.checked = chartItem.yAxisEnabled !== false;
  axisCheckbox.addEventListener("change", () => {
    chartItem.yAxisEnabled = axisCheckbox.checked;
    if (state.activeChartId === chartItem.id) {
      state.showYAxis = axisCheckbox.checked;
      updateChartStripControls();
    }
    rerenderEditor();
  });
  const axisLabel = document.createElement("label");
  axisLabel.className = "field checkbox-field";
  const axisText = document.createElement("span");
  axisText.textContent = t("chart_show_axis");
  axisLabel.append(axisText, axisCheckbox);

  const relationField = createField(t("relation"), relationParentSelect);
  const folderField = createField(t("folder"), groupSelect);
  const folderRelationHint = document.createElement("p");
  folderRelationHint.className = "editor-meta editor-inline-hint";
  folderRelationHint.textContent = t("folder_relation_hint");

  const updateRelationEditorState = () => {
    const hasGroup = Boolean(chartItem.groupId);
    relationParentSelect.disabled = !hasGroup;
    relationField.classList.toggle("is-disabled", !hasGroup);
  };
  updateRelationEditorState();

  const folderRelationRow = document.createElement("div");
  folderRelationRow.className = "field-row year-fields";
  folderRelationRow.append(
    folderField,
    relationField,
  );

  editor.append(
    createField(t("title"), titleInput),
    createColorField(t("color_value"), colorInput, applyColorChange),
    createField(t("chart_source"), sourceInput),
    folderRelationRow,
    folderRelationHint,
    createField(t("chart_axis_label"), axisLabelInput),
    createField(t("description"), descriptionArea),
    createField(t("chart_line_style"), lineStyleSelect),
    createField(t("chart_display_mode"), displayModeSelect),
    axisLabel,
  );

  return editor;
}

function createChartBrowserItem(chartItem, options = {}) {
  const { muted = false, child = false, depth = 0 } = options;
  const item = document.createElement("div");
  item.className = "event-browser-item chart-browser-item";
  if (child) item.classList.add("is-child");
  if (state.openChartEditorId === chartItem.id) item.classList.add("is-open");
  if (muted) item.classList.add("is-focus-muted");
  item.style.setProperty("--tree-depth", String(depth));

  const row = document.createElement("div");
  row.className = "event-row chart-row";
  row.draggable = !muted;
  row.addEventListener("dragstart", (event) => {
    if (muted) {
      event.preventDefault();
      return;
    }
    state.browserDragChartId = chartItem.id;
    state.browserDragEventId = null;
    state.browserDragGroupId = null;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", chartItem.id);
  });
  row.addEventListener("dragend", () => {
    state.browserDragChartId = null;
    state.browserDragEventId = null;
    state.browserDragGroupId = null;
    row.classList.remove("is-dragging");
  });

  const visibilityToggle = document.createElement("input");
  visibilityToggle.type = "checkbox";
  visibilityToggle.checked = chartItem.visible !== false;
  visibilityToggle.addEventListener("change", () => {
    chartItem.visible = visibilityToggle.checked;
    if (chartItem.visible && !state.activeChartId) {
      state.activeChartId = chartItem.id;
      state.showYAxis = chartItem.yAxisEnabled !== false;
    }
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });

  const checkWrap = document.createElement("label");
  checkWrap.className = "event-row-check";
  checkWrap.appendChild(visibilityToggle);

  const legend = document.createElement("span");
  legend.className = "chart-legend-line";
  legend.style.color = chartItem.color;

  const main = document.createElement("div");
  main.className = "event-row-main chart-row-main";
  main.addEventListener("click", () => {
    state.openEditorId = null;
    state.openGroupEditorId = null;
    state.openChartEditorId = state.openChartEditorId === chartItem.id ? null : chartItem.id;
    state.activeChartId = chartItem.id;
    state.showYAxis = chartItem.yAxisEnabled !== false;
    state.activeContextGroupId = chartItem.groupId ?? null;
    if (chartItem.groupId) {
      expandGroupAncestors(chartItem.groupId);
    }
    if (chartItem.parentEventId) {
      expandEventAncestors(chartItem.parentEventId);
      const parentEvent = getEventById(chartItem.parentEventId);
      if (parentEvent) parentEvent.expanded = true;
    }
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });

  const title = document.createElement("strong");
  title.textContent = chartItem.title;
  const source = document.createElement("span");
  source.className = "event-description";
  source.textContent = chartItem.sourceTitle || t("chart_source_none");
  const meta = document.createElement("small");
  meta.className = "event-description";
  meta.textContent = tf("chart_points_count", { count: chartItem.points.length });
  const axisHint = document.createElement("span");
  axisHint.className = "event-description";
  axisHint.textContent = chartItem.yAxisLabel || chartItem.sourceMetric || t("chart_axis_label_none");
  main.append(title, source, meta, axisHint);

  const range = document.createElement("span");
  range.className = "event-row-date chart-row-date";
  range.textContent = getChartPointRangeLabel(chartItem.points);

  const actions = document.createElement("div");
  actions.className = "chart-row-actions";
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "event-row-delete";
  removeButton.textContent = "X";
  removeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const chartIndex = chartItems.findIndex((candidate) => candidate.id === chartItem.id);
    if (chartIndex >= 0) chartItems.splice(chartIndex, 1);
    if (state.openChartEditorId === chartItem.id) state.openChartEditorId = null;
    if (state.activeChartId === chartItem.id) state.activeChartId = chartItems[0]?.id ?? null;
    if (!chartItems.length) state.showYAxis = false;
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });
  actions.append(removeButton);

  row.append(checkWrap, legend, main, range, actions);
  item.appendChild(row);
  if (state.openChartEditorId === chartItem.id) {
    try {
      item.appendChild(createChartInlineEditor(chartItem));
    } catch {
      item.classList.remove("is-open");
      if (state.openChartEditorId === chartItem.id) {
        state.openChartEditorId = null;
      }
    }
  }
  return item;
}

function createChartBrowserFallbackItem(chartItem, options = {}) {
  const { muted = false, child = false, depth = 0 } = options;
  const item = document.createElement("div");
  item.className = "event-browser-item chart-browser-item";
  if (child) item.classList.add("is-child");
  if (state.openChartEditorId === chartItem.id) item.classList.add("is-open");
  if (muted) item.classList.add("is-focus-muted");
  item.style.setProperty("--tree-depth", String(depth));

  const row = document.createElement("div");
  row.className = "event-row";
  row.draggable = !muted;
  row.addEventListener("dragstart", (event) => {
    if (muted) {
      event.preventDefault();
      return;
    }
    state.browserDragChartId = chartItem.id;
    state.browserDragEventId = null;
    state.browserDragGroupId = null;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", chartItem.id);
  });
  row.addEventListener("dragend", () => {
    state.browserDragChartId = null;
    state.browserDragEventId = null;
    state.browserDragGroupId = null;
    row.classList.remove("is-dragging");
  });

  const checkWrap = document.createElement("label");
  checkWrap.className = "event-row-check";
  const visibilityToggle = document.createElement("input");
  visibilityToggle.type = "checkbox";
  visibilityToggle.checked = chartItem.visible !== false;
  visibilityToggle.disabled = muted;
  visibilityToggle.addEventListener("change", () => {
    chartItem.visible = visibilityToggle.checked;
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });
  checkWrap.appendChild(visibilityToggle);

  const legend = document.createElement("span");
  legend.className = "chart-legend-line";
  legend.style.color = chartItem.color;

  const main = document.createElement("button");
  main.type = "button";
  main.className = "event-row-main";
  main.disabled = muted;
  main.addEventListener("click", () => {
    state.openEditorId = null;
    state.openGroupEditorId = null;
    state.openChartEditorId = state.openChartEditorId === chartItem.id ? null : chartItem.id;
    state.activeChartId = chartItem.id;
    state.showYAxis = chartItem.yAxisEnabled !== false;
    state.activeContextGroupId = chartItem.groupId ?? null;
    if (chartItem.groupId) {
      expandGroupAncestors(chartItem.groupId);
    }
    if (chartItem.parentEventId) {
      expandEventAncestors(chartItem.parentEventId);
      const parentEvent = getEventById(chartItem.parentEventId);
      if (parentEvent) parentEvent.expanded = true;
    }
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });

  const title = document.createElement("strong");
  title.textContent = String(chartItem?.title || "Chart");
  const source = document.createElement("span");
  source.textContent = String(chartItem?.sourceTitle || "Chart");
  main.append(title, source);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "event-row-delete";
  removeButton.textContent = "X";
  removeButton.disabled = muted;
  removeButton.addEventListener("click", () => {
    const chartIndex = chartItems.findIndex((candidate) => candidate.id === chartItem.id);
    if (chartIndex >= 0) chartItems.splice(chartIndex, 1);
    if (state.openChartEditorId === chartItem.id) state.openChartEditorId = null;
    if (state.activeChartId === chartItem.id) state.activeChartId = chartItems[0]?.id ?? null;
    if (!chartItems.length) state.showYAxis = false;
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
  });

  row.append(checkWrap, legend, main, removeButton);
  item.appendChild(row);
  if (state.openChartEditorId === chartItem.id) {
    try {
      item.appendChild(createChartInlineEditor(chartItem));
    } catch (error) {
      const warning = document.createElement("p");
      warning.className = "event-row-warning";
      warning.textContent = `Chart-Editorfehler: ${error?.message || "unbekannt"}`;
      item.appendChild(warning);
    }
  }
  return item;
}

function renderEventList() {
  sanitizeEventHierarchy();
  ui.eventList.replaceChildren();
  const browserGroups = getBrowserGroups();
  const ungroupedEvents = getUngroupedEvents();
  const ungroupedCharts = getUngroupedCharts();
  chartItems.forEach(normalizeChartItem);
  const openEditorEvent = getOpenEditorEvent();
  const activeContextGroupId = getActiveContextGroupId();
  const activeRootGroupId = activeContextGroupId
    ? browserGroups.find((groupItem) => isGroupAncestorOrSelf(groupItem.id, activeContextGroupId))?.id ?? null
    : null;
  const activeUngroupedEventId = openEditorEvent && !openEditorEvent.groupId
    ? getTopLevelEventIdWithinGroup(openEditorEvent.id, null)
    : null;
  ui.eventBrowserInfo.textContent = `${tf("browser_info", { events: timelineEvents.length, folders: browserGroups.length })}${chartItems.length ? `, ${chartItems.length} ${t("chart_browser_label")}` : ""}`;

  if (timelineEvents.length === 0 && browserGroups.length === 0 && chartItems.length === 0 && !state.folderImportLoading) {
    ui.editorEmptyState.hidden = false;
    const emptyState = document.createElement("p");
    emptyState.className = "event-description";
    emptyState.textContent = t("browser_empty");
    ui.eventList.appendChild(emptyState);
    return;
  }

  ui.editorEmptyState.hidden = true;
  browserGroups.forEach((groupItem) => {
    const muted = activeRootGroupId != null || activeUngroupedEventId != null
      ? activeRootGroupId !== groupItem.id
      : false;
    const loadingState = state.folderImportLoading?.groupId === groupItem.id
      ? state.folderImportLoading
      : null;
    ui.eventList.appendChild(createGroupBrowserItem(groupItem, { muted, loadingState }));
  });

  ungroupedEvents.forEach((eventItem) => {
    const muted = activeRootGroupId != null || activeUngroupedEventId != null
      ? activeUngroupedEventId !== eventItem.id
      : false;
    ui.eventList.appendChild(createEventBrowserItem(eventItem, { muted }));
  });

  try {
    ungroupedCharts.forEach((chartItem) => {
      const muted = (activeRootGroupId != null || activeUngroupedEventId != null)
        ? true
        : (state.openChartEditorId != null && state.openChartEditorId !== chartItem.id);
      try {
        ui.eventList.appendChild(createChartBrowserItem(chartItem, { muted }));
      } catch {
        ui.eventList.appendChild(createChartBrowserFallbackItem(chartItem, { muted }));
      }
    });
  } catch (error) {
    const errorHint = document.createElement("p");
    errorHint.className = "event-row-warning";
    errorHint.textContent = `Chart-Browserfehler: ${error?.message || "unbekannt"}`;
    ui.eventList.appendChild(errorHint);
  }
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
  const matchingEvents = timelineEvents.filter((eventItem) => eventItem.sourceId === result.id);
  const hasEnabledMatch = matchingEvents.some((eventItem) => eventItem.enabled !== false);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = hasEnabledMatch;
  checkbox.disabled = state.pendingAdds.has(result.id);
  checkbox.addEventListener("change", async () => {
    if (!checkbox.checked) {
      const needsConfirmation = matchingEvents.some((eventItem) => eventHasLibraryRelations(eventItem));
      if (needsConfirmation) {
        const confirmed = await confirmDeleteFromLibrary();
        if (!confirmed) {
          checkbox.checked = true;
          return;
        }
      }
      const matchingIds = new Set(matchingEvents.map((eventItem) => eventItem.id));
      if (matchingIds.has(state.selectedEventId)) {
        state.selectedEventId = null;
      }
      if (matchingIds.has(state.openEditorId)) {
        state.openEditorId = null;
      }
      for (let index = timelineEvents.length - 1; index >= 0; index -= 1) {
        if (timelineEvents[index].sourceId === result.id) {
          timelineEvents.splice(index, 1);
        }
      }
      updateSelectionPanel();
      ui.searchStatus.textContent = tf("result_added", { title: result.label });
      renderEventList();
      renderSearchResults();
      drawTimeline();
      return;
    }
    if (matchingEvents.length > 0) {
      matchingEvents.forEach((eventItem) => {
        eventItem.enabled = true;
      });
      ui.searchStatus.textContent = tf("result_added", { title: result.label });
      renderEventList();
      renderSearchResults();
      drawTimeline();
      return;
    }
    state.pendingAdds.add(result.id);
    checkbox.disabled = true;
    setSearchLoadingState({
      visible: true,
      text: tf("loading_result", { title: result.label }),
      progress: 18,
    });
    let eventItem = null;
    try {
      eventItem = await addWikidataResult(result, ({ text, progress }) => {
        setSearchLoadingState({ visible: true, text, progress });
      });
    } finally {
      state.pendingAdds.delete(result.id);
    }
    if (eventItem) {
        setSearchLoadingState({
          visible: true,
          text: t("loading_update_view"),
          progress: 92,
        });
        ui.searchStatus.textContent = tf("result_added", { title: eventItem.title });
        state.openGroupEditorId = null;
        state.openEditorId = eventItem.id;
        selectEvent(eventItem.id, true);
        renderEventList();
        scrollToDetails("auto");
        focusEditorNameField("event", { reveal: true, behavior: "auto" });
        setSearchLoadingState({
          visible: true,
          text: tf("result_added", { title: eventItem.title }),
          progress: 100,
        });
        hideSearchLoading(180);
    } else {
      checkbox.checked = false;
      checkbox.disabled = false;
      ui.searchStatus.textContent = tf("result_no_years", { title: result.label });
      hideSearchLoading(180);
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
    hideSearchLoading();
    setFolderImportLoading({
      visible: true,
      title: file.name,
      text: tf("loading_read_file", { title: file.name }),
      progress: 12,
    });
    await waitForNextPaint();
    const fileContent = await file.text();
    setFolderImportLoading({
      visible: true,
      title: file.name,
      text: t("loading_parse_file"),
      progress: 34,
    });
    await waitForNextPaint();
    const payload = JSON.parse(fileContent);
    setFolderImportLoading({
      visible: true,
      title: payload.title ?? file.name,
      text: tf("loading_import_folder", { title: payload.title ?? file.name }),
      progress: 52,
      groupId: null,
    });
    await waitForNextPaint();
    await importFolderPayload(payload, ({ title, text, progress, groupId }) => {
      setFolderImportLoading({
        visible: true,
        title: title ?? payload.title ?? file.name,
        text,
        progress,
        groupId: groupId ?? null,
      });
    });
    setFolderImportLoading({
      visible: true,
      title: payload.title ?? file.name,
      text: t("loading_update_view"),
      progress: 100,
      groupId: state.folderImportLoading?.groupId ?? null,
    });
    await waitForNextPaint();
    window.setTimeout(() => {
      setFolderImportLoading({ visible: false });
    }, 180);
  } catch {
    ui.eventBrowserInfo.textContent = t("import_failed");
    window.setTimeout(() => {
      setFolderImportLoading({ visible: false });
    }, 180);
  } finally {
    event.target.value = "";
  }
}

function renderChartResults() {
  if (!ui.chartSearchResults) return;
  ui.chartSearchResults.replaceChildren();
  if (state.chartSearchResults.length) {
    state.chartSearchResults.forEach((result) => {
      const card = document.createElement("div");
      card.className = "chart-result-card";

      const hasImportedVariant = Boolean(findImportedChartBySource("owid", result.slug, getDefaultOwidEntity(result)));
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = hasImportedVariant;

      const title = document.createElement("strong");
      title.textContent = result.title;

      const source = document.createElement("span");
      source.className = "event-description";
      source.textContent = t("chart_source_owid");

      const range = document.createElement("small");
      range.className = "chart-result-meta";
      range.textContent = result.rangeLabel || t("chart_date_range_unknown");

      const variant = document.createElement("small");
      variant.className = "chart-result-meta";
      variant.textContent = result.variantName || result.subtitle || "";

      const subtitle = document.createElement("small");
      subtitle.className = "event-description";
      subtitle.textContent = result.subtitle || "";

      const entitySelect = document.createElement("select");
      const entityOptions = result.availableEntities.length ? result.availableEntities : [""];
      entityOptions.forEach((entityName, index) => {
        const option = document.createElement("option");
        option.value = entityName;
        option.textContent = entityName || t("chart_entity_auto");
        option.selected = (entityName || "") === getDefaultOwidEntity(result) || (!entityName && index === 0);
        entitySelect.appendChild(option);
      });

      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.className = "secondary-button";
      const syncImportButtonLabel = () => {
        const existing = findImportedChartBySource("owid", result.slug, entitySelect.value);
        checkbox.checked = Boolean(existing);
        importButton.textContent = existing ? t("chart_open_library") : t("chart_import_remote");
      };
      syncImportButtonLabel();
      entitySelect.addEventListener("change", syncImportButtonLabel);
      checkbox.addEventListener("change", () => {
        const existing = findImportedChartBySource("owid", result.slug, entitySelect.value);
        if (!checkbox.checked) {
          if (existing) {
            const chartIndex = chartItems.findIndex((candidate) => candidate.id === existing.id);
            if (chartIndex >= 0) chartItems.splice(chartIndex, 1);
            if (state.openChartEditorId === existing.id) state.openChartEditorId = null;
            if (state.activeChartId === existing.id) state.activeChartId = chartItems[0]?.id ?? null;
            if (!chartItems.length) state.showYAxis = false;
            updateChartStripControls();
            renderEventList();
            renderChartResults();
            drawTimeline();
          }
          return;
        }
        handleChartSearchImport(result, entitySelect.value);
      });
      importButton.addEventListener("click", () => {
        const existing = findImportedChartBySource("owid", result.slug, entitySelect.value);
        if (existing) {
          openChartInLibrary(existing);
          return;
        }
        handleChartSearchImport(result, entitySelect.value);
      });

      const actions = document.createElement("div");
      actions.className = "chart-result-actions";
      actions.append(
        checkbox,
        createField(t("chart_entities"), entitySelect),
        importButton,
      );

      card.append(title, source, range);
      if (variant.textContent) card.appendChild(variant);
      if (subtitle.textContent && subtitle.textContent !== variant.textContent) card.appendChild(subtitle);
      card.appendChild(actions);
      ui.chartSearchResults.appendChild(card);
    });
    return;
  }

  if (state.chartSearchQuery) {
    const hint = document.createElement("p");
    hint.className = "event-description";
    hint.textContent = t("chart_search_no_results");
    ui.chartSearchResults.appendChild(hint);
    return;
  }

  if (!chartItems.length) {
    const hint = document.createElement("p");
    hint.className = "event-description";
    hint.textContent = t("chart_import_hint");
    ui.chartSearchResults.appendChild(hint);
    return;
  }

  chartItems.forEach((chartItem) => {
    const card = document.createElement("div");
    card.className = "chart-result-card";
    const title = document.createElement("strong");
    title.textContent = chartItem.title;
    const source = document.createElement("span");
    source.className = "event-description";
    source.textContent = chartItem.sourceTitle || t("chart_source_none");
    const meta = document.createElement("small");
    meta.className = "event-description";
    meta.textContent = tf("chart_points_count", { count: chartItem.points.length });
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.textContent = t("chart_open_library");
    button.addEventListener("click", () => openChartInLibrary(chartItem));
    card.append(title, source, meta, button);
    ui.chartSearchResults.appendChild(card);
  });
}

function importChartPayload(payload) {
  const chartPayloads = parseChartImportPayload(payload);
  if (!chartPayloads.length) {
    throw new Error("invalid-chart-payload");
  }
  const importedCharts = chartPayloads.map((chartPayload) => {
    const chartItem = {
      ...createEmptyChart(),
      ...chartPayload,
    };
    normalizeChartItem(chartItem);
    chartItems.push(chartItem);
    return chartItem;
  });
  return importedCharts;
}

async function handleImportChartFile(event) {
  const [file] = Array.from(event.target.files ?? []);
  if (!file) return;

  try {
    const payload = JSON.parse(await file.text());
    const importedCharts = importChartPayload(payload);
    const importedChart = importedCharts[0];
    if (importedChart) {
      state.activeChartId = importedChart.id;
      state.openChartEditorId = null;
      state.showYAxis = importedChart.yAxisEnabled !== false;
      ui.chartStatus.textContent = tf("chart_status_imported", { title: importedChart.title });
    }
    updateChartStripControls();
    renderEventList();
    renderChartResults();
    drawTimeline();
    scrollToDetails("auto");
  } catch {
    if (ui.chartStatus) ui.chartStatus.textContent = t("chart_import_failed");
  } finally {
    event.target.value = "";
  }
}

function handleChartSearchInputChange() {
  if (!ui.chartSearchInput) return;
  state.chartSearchQuery = ui.chartSearchInput.value.trim();
  if (state.chartSearchQuery) return;
  state.chartSearchResults = [];
  if (ui.chartStatus) ui.chartStatus.textContent = chartItems.length ? t("chart_status_default") : t("chart_search_default");
  renderChartResults();
}

async function handleChartSearchSubmit(event) {
  event.preventDefault();
  const query = ui.chartSearchInput?.value.trim() ?? "";
  state.chartSearchQuery = query;
  if (!query) {
    state.chartSearchResults = [];
    if (ui.chartStatus) ui.chartStatus.textContent = chartItems.length ? t("chart_status_default") : t("chart_search_default");
    renderChartResults();
    return;
  }

  if (state.chartSearchSource !== "owid") {
    if (ui.chartStatus) {
      const sourceLabel = state.chartSearchSource === "worldbank"
        ? t("chart_source_worldbank")
        : state.chartSearchSource === "eurostat"
          ? t("chart_source_eurostat")
          : t("chart_source_oecd");
      ui.chartStatus.textContent = tf("chart_source_coming_soon", { source: sourceLabel });
    }
    state.chartSearchResults = [];
    renderChartResults();
    return;
  }

  if (ui.chartStatus) {
    ui.chartStatus.textContent = tf("chart_search_loading", {
      query,
      source: t("chart_source_owid"),
    });
  }
  try {
    state.chartSearchResults = await searchOwidCharts(query);
    if (ui.chartStatus) {
      ui.chartStatus.textContent = state.chartSearchResults.length
        ? tf("chart_search_results_found", { count: state.chartSearchResults.length })
        : t("chart_search_no_results");
    }
    renderChartResults();
    state.chartSearchResults.forEach((result) => {
      hydrateChartSearchRange(result).then(() => {
        renderChartResults();
      });
    });
  } catch {
    state.chartSearchResults = [];
    if (ui.chartStatus) ui.chartStatus.textContent = t("chart_search_failed");
  }
  renderChartResults();
}

function handleSearchInputChange() {
  if (!ui.searchInput || ui.searchInput.value.trim()) return;
  hideSearchLoading();
  state.searchResults = [];
  ui.searchStatus.textContent = t("search_default");
  renderSearchResults();
}

function handleSourcesSearchInputChange() {
  if (!ui.sourcesSearchInput || ui.sourcesSearchInput.value.trim()) return;
  if (ui.sourcesStatus) ui.sourcesStatus.textContent = t("sources_search_default");
  if (ui.sourcesResults) ui.sourcesResults.replaceChildren();
}

function handleSourcesSearchSubmit(event) {
  event.preventDefault();
  if (!ui.sourcesStatus) return;
  const sourceLabel = state.sourcesSearchSource === "wikisource"
    ? t("source_wikisource")
    : state.sourcesSearchSource === "crossref"
      ? t("source_crossref")
      : t("source_dataverse");
  ui.sourcesStatus.textContent = tf("sources_search_coming_soon", { source: sourceLabel });
  if (ui.sourcesResults) ui.sourcesResults.replaceChildren();
}

function suppressWorkspaceStripInteraction(event) {
  event.stopPropagation();
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
      || eventItem.category === "Äon"
      || eventItem.category === "Ära"
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

async function addWikidataResult(result, onProgress = null) {
  const existing = timelineEvents.find((eventItem) => eventItem.sourceId === result.id);

  try {
    const entity = await fetchWikidataEntity(result.id);
    if (!entity) return null;
    const importedEvent = buildEventFromWikidata(result.id, entity, result);
    if (typeof onProgress === "function") {
      onProgress({
        text: tf("loading_processing_result", { title: importedEvent.title || result.label }),
        progress: 62,
      });
    }

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
      if (typeof onProgress === "function") {
        onProgress({
          text: t("loading_update_view"),
          progress: 84,
        });
      }
      return existing;
    }

    timelineEvents.push(importedEvent);
    if (typeof onProgress === "function") {
      onProgress({
        text: t("loading_update_view"),
        progress: 84,
      });
    }
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
  ui.searchInput?.addEventListener("input", handleSearchInputChange);
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
    state.openChartEditorId = null;
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
    state.openChartEditorId = null;
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
  ui.importChartButton?.addEventListener("click", () => {
    ui.importChartInput?.click();
  });
  ui.importChartInput?.addEventListener("change", handleImportChartFile);
  ui.chartSearchForm?.addEventListener("submit", handleChartSearchSubmit);
  ui.chartSearchInput?.addEventListener("input", handleChartSearchInputChange);
  ui.chartSourceSelect?.addEventListener("change", () => {
    state.chartSearchSource = ui.chartSourceSelect?.value || "owid";
    state.chartSearchResults = [];
    if (ui.chartStatus) {
      ui.chartStatus.textContent = state.chartSearchSource === "owid"
        ? t("chart_search_default")
        : tf("chart_source_coming_soon", {
          source: state.chartSearchSource === "worldbank"
            ? t("chart_source_worldbank")
            : state.chartSearchSource === "eurostat"
              ? t("chart_source_eurostat")
              : t("chart_source_oecd"),
        });
    }
    renderChartResults();
  });
  ui.eventSourceSelect?.addEventListener("change", () => {
    state.eventSearchSource = ui.eventSourceSelect?.value || "wikidata";
  });
  ui.sourcesSearchForm?.addEventListener("submit", handleSourcesSearchSubmit);
  ui.sourcesSearchInput?.addEventListener("input", handleSourcesSearchInputChange);
  ui.sourcesSourceSelect?.addEventListener("change", () => {
    state.sourcesSearchSource = ui.sourcesSourceSelect?.value || "wikisource";
    if (ui.sourcesStatus) ui.sourcesStatus.textContent = t("sources_search_default");
    if (ui.sourcesResults) ui.sourcesResults.replaceChildren();
  });
  ui.modeEventsButton?.addEventListener("click", () => {
    state.activeDataMode = state.activeDataMode === "events" ? null : "events";
    updateDataModeUi();
  });
  ui.modeChartsButton?.addEventListener("click", () => {
    state.activeDataMode = state.activeDataMode === "charts" ? null : "charts";
    updateDataModeUi();
  });
  ui.modeSourcesButton?.addEventListener("click", () => {
    state.activeDataMode = state.activeDataMode === "sources" ? null : "sources";
    updateDataModeUi();
  });
  ["pointerdown", "pointerup", "click", "dblclick", "wheel"].forEach((eventName) => {
    ui.toggleChartsButton?.addEventListener(eventName, suppressWorkspaceStripInteraction);
    ui.toggleYAxisButton?.addEventListener(eventName, suppressWorkspaceStripInteraction);
  });
  ui.toggleChartsButton?.addEventListener("click", () => {
    state.chartDisplayMode = state.chartDisplayMode === "events" ? "mixed" : "events";
    updateChartStripControls();
    drawTimeline();
  });
  ui.toggleYAxisButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    state.showYAxis = !state.showYAxis;
    updateChartStripControls();
    drawTimeline();
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
  renderChartResults();
  renderSearchResults();
  drawTimeline();
}

init();
