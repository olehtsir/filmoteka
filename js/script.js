const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = "mini_kinopoisk_simple_v2";
const LANG_KEY = "mini_kinopoisk_lang_v1";

/* Словник перекладів */
const i18n = {
   uk: {
      appTitle: "🎬 Міні Кінопоіск",
      appSub: "Додавай фільми в “Хочу” та “Переглянуто” і став оцінку.",
      addPlaceholder: "Введи назву фільму...",
      addBtn: "Додати",
      clearBtn: "Очистити",
      searchPlaceholder: "Пошук...",
      sortNewest: "Сортування: нові",
      sortTitle: "Сортування: назва",
      sortRating: "Сортування: рейтинг",
      statsPlanned: "👀 Хочу:",
      statsWatched: "✅ Переглянуто:",
      plannedListTitle: "👀 Хочу подивитись",
      watchedListTitle: "✅ Переглянуто",
      emptyPlanned: "Додай фільм у “Хочу подивитись”.",
      emptyWatched: "Поки переглянутих фільмів немає.",
      rating: "Оцінка:",
      moveToWatched: "✅ В переглянуті",
      moveToPlanned: "👀 В хочу",
      editBtn: "✏️ Редагувати",
      deleteBtn: "Видалити",
      confirmClear: "Очистити всю фільмотеку?",
      promptEdit: "Нова назва фільму:",
      language: "Мова:",
      langUk: "Українська",
      langEn: "English",
      langFr: "Français",
      langRu: "Русский",
   },
   en: {
      appTitle: "🎬 Mini Movie List",
      appSub: "Add movies to “Want to watch” and “Watched” and rate them.",
      addPlaceholder: "Enter movie title...",
      addBtn: "Add",
      clearBtn: "Clear",
      searchPlaceholder: "Search...",
      sortNewest: "Sort: newest",
      sortTitle: "Sort: title",
      sortRating: "Sort: rating",
      statsPlanned: "👀 Want:",
      statsWatched: "✅ Watched:",
      plannedListTitle: "👀 Want to watch",
      watchedListTitle: "✅ Watched",
      emptyPlanned: "Add a movie to “Want to watch”.",
      emptyWatched: "No watched movies yet.",
      rating: "Rating:",
      moveToWatched: "✅ Move to watched",
      moveToPlanned: "👀 Move to want",
      editBtn: "✏️ Edit",
      deleteBtn: "Delete",
      confirmClear: "Clear the whole list?",
      promptEdit: "New movie title:",
      language: "Language:",
      langUk: "Ukrainian",
      langEn: "English",
      langFr: "French",
      langRu: "Russian",
   },
   fr: {
      appTitle: "🎬 Mini Cinéma",
      appSub: "Ajoute des films à “À voir” et “Vus” et note-les.",
      addPlaceholder: "Entrez le titre du film...",
      addBtn: "Ajouter",
      clearBtn: "Tout effacer",
      searchPlaceholder: "Recherche...",
      sortNewest: "Trier : récents",
      sortTitle: "Trier : titre",
      sortRating: "Trier : note",
      statsPlanned: "👀 À voir :",
      statsWatched: "✅ Vus :",
      plannedListTitle: "👀 À voir",
      watchedListTitle: "✅ Vus",
      emptyPlanned: "Ajoute un film dans “À voir”.",
      emptyWatched: "Aucun film vu pour l’instant.",
      rating: "Note :",
      moveToWatched: "✅ Marquer vu",
      moveToPlanned: "👀 Remettre à voir",
      editBtn: "✏️ Modifier",
      deleteBtn: "Supprimer",
      confirmClear: "Effacer toute la liste ?",
      promptEdit: "Nouveau titre du film :",
      language: "Langue :",
      langUk: "Ukrainien",
      langEn: "Anglais",
      langFr: "Français",
      langRu: "Russe",
   },
   ru: {
      appTitle: "🎬 Мини Кинопоиск",
      appSub:
         "Добавляй фильмы в “Хочу посмотреть” и “Просмотрено” и ставь оценку.",
      addPlaceholder: "Введите название фильма...",
      addBtn: "Добавить",
      clearBtn: "Очистить",
      searchPlaceholder: "Поиск...",
      sortNewest: "Сортировка: новые",
      sortTitle: "Сортировка: название",
      sortRating: "Сортировка: рейтинг",
      statsPlanned: "👀 Хочу:",
      statsWatched: "✅ Просмотрено:",
      plannedListTitle: "👀 Хочу посмотреть",
      watchedListTitle: "✅ Просмотрено",
      emptyPlanned: "Добавь фильм в “Хочу посмотреть”.",
      emptyWatched: "Пока нет просмотренных фильмов.",
      rating: "Оценка:",
      moveToWatched: "✅ В просмотренные",
      moveToPlanned: "👀 В хочу",
      editBtn: "✏️ Редактировать",
      deleteBtn: "Удалить",
      confirmClear: "Очистить всю фильмотеку?",
      promptEdit: "Новое название фильма:",
      language: "Язык:",
      langUk: "Украинский",
      langEn: "Английский",
      langFr: "Французский",
      langRu: "Русский",
   },
};

function uid() {
   return (
      crypto?.randomUUID?.() ??
      String(Date.now()) + Math.random().toString(16).slice(2)
   );
}

function loadMovies() {
   const raw = localStorage.getItem(STORAGE_KEY);
   if (!raw) return [];
   try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
   } catch {
      return [];
   }
}

function App() {
   const [lang, setLang] = useState(
      () => localStorage.getItem(LANG_KEY) || "uk",
   );
   const [movies, setMovies] = useState(loadMovies);

   const [title, setTitle] = useState("");
   const [search, setSearch] = useState("");
   const [sortBy, setSortBy] = useState("newest"); // newest | title | rating

   const t = (key) => (i18n[lang] && i18n[lang][key]) || i18n.uk[key] || key;

   // save movies
   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
   }, [movies]);

   // save lang + update title
   useEffect(() => {
      localStorage.setItem(LANG_KEY, lang);
      document.title = t("appTitle");
      document.documentElement.lang = lang === "uk" ? "uk" : lang;
   }, [lang]);

   function addMovie(e) {
      e.preventDefault();
      const tt = title.trim();
      if (!tt) return;

      setMovies((prev) => [
         {
            id: uid(),
            title: tt,
            status: "planned", // planned | watched
            rating: 0,
            createdAt: Date.now(),
         },
         ...prev,
      ]);

      setTitle("");
   }

   function removeMovie(id) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
   }

   function toggleStatus(id) {
      setMovies((prev) =>
         prev.map((m) => {
            if (m.id !== id) return m;
            return {
               ...m,
               status: m.status === "planned" ? "watched" : "planned",
            };
         }),
      );
   }

   function setRating(id, rating) {
      const r = Number(rating);
      const safe = Number.isFinite(r) ? Math.max(0, Math.min(10, r)) : 0;

      setMovies((prev) =>
         prev.map((m) => (m.id === id ? { ...m, rating: safe } : m)),
      );
   }

   function editTitle(id) {
      const movie = movies.find((m) => m.id === id);
      if (!movie) return;

      const newTitle = prompt(t("promptEdit"), movie.title);
      if (newTitle === null) return;

      const tt = newTitle.trim();
      if (!tt) return;

      setMovies((prev) =>
         prev.map((m) => (m.id === id ? { ...m, title: tt } : m)),
      );
   }

   function clearAll() {
      if (!confirm(t("confirmClear"))) return;
      setMovies([]);
   }

   const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();

      let list = movies.filter((m) => m.title.toLowerCase().includes(q));

      if (sortBy === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
      if (sortBy === "title")
         list.sort((a, b) => a.title.localeCompare(b.title));
      if (sortBy === "rating")
         list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      return list;
   }, [movies, search, sortBy]);

   const planned = filtered.filter((m) => m.status === "planned");
   const watched = filtered.filter((m) => m.status === "watched");

   const plannedCount = movies.filter((m) => m.status === "planned").length;
   const watchedCount = movies.filter((m) => m.status === "watched").length;

   return (
      <>
         <header className="header">
            <div>
               <h1>{t("appTitle")}</h1>
               <p className="sub">{t("appSub")}</p>
            </div>
         </header>

         <section className="panel">
            <form className="row" onSubmit={addMovie}>
               <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("addPlaceholder")}
               />
               <button type="submit">{t("addBtn")}</button>
               <button type="button" className="danger" onClick={clearAll}>
                  {t("clearBtn")}
               </button>
            </form>

            <div className="row" style={{ marginTop: 10 }}>
               <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
               />

               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
               >
                  <option value="newest">{t("sortNewest")}</option>
                  <option value="title">{t("sortTitle")}</option>
                  <option value="rating">{t("sortRating")}</option>
               </select>

               <div className="langBox">
                  <span className="small">{t("language")}</span>
                  <select
                     value={lang}
                     onChange={(e) => setLang(e.target.value)}
                  >
                     <option value="uk">🇺🇦</option>
                     <option value="en">🇬🇧</option>
                     <option value="fr">🇫🇷</option>
                     <option value="ru">🇷🇺</option>
                  </select>
               </div>

               <div className="small" style={{ alignSelf: "center" }}>
                  {t("statsPlanned")} <b>{plannedCount}</b> •{" "}
                  {t("statsWatched")} <b>{watchedCount}</b>
               </div>
            </div>
         </section>

         <main className="grid">
            <MovieList
               title={t("plannedListTitle")}
               items={planned}
               t={t}
               onToggle={toggleStatus}
               onRemove={removeMovie}
               onRate={setRating}
               onEdit={editTitle}
               empty={t("emptyPlanned")}
            />

            <MovieList
               title={t("watchedListTitle")}
               items={watched}
               t={t}
               onToggle={toggleStatus}
               onRemove={removeMovie}
               onRate={setRating}
               onEdit={editTitle}
               empty={t("emptyWatched")}
            />
         </main>
      </>
   );
}

function MovieList({
   title,
   items,
   t,
   onToggle,
   onRemove,
   onRate,
   onEdit,
   empty,
}) {
   return (
      <section className="listCard">
         <div className="listHead">
            <h2>{title}</h2>
            <span className="badge">{items.length}</span>
         </div>

         {items.length === 0 ? (
            <div className="empty">{empty}</div>
         ) : (
            items.map((m) => (
               <div className="movie" key={m.id}>
                  <div>
                     <div className="title">{m.title}</div>

                     <div className="meta">
                        <span>{t("rating")}</span>
                        <input
                           className="ratingInput"
                           type="number"
                           min="0"
                           max="10"
                           value={m.rating}
                           onChange={(e) => onRate(m.id, e.target.value)}
                        />
                        <span>/10</span>
                     </div>
                  </div>

                  <div className="actions">
                     <button
                        className="secondary"
                        onClick={() => onToggle(m.id)}
                     >
                        {m.status === "planned"
                           ? t("moveToWatched")
                           : t("moveToPlanned")}
                     </button>

                     <button className="secondary" onClick={() => onEdit(m.id)}>
                        {t("editBtn")}
                     </button>

                     <button className="danger" onClick={() => onRemove(m.id)}>
                        {t("deleteBtn")}
                     </button>
                  </div>
               </div>
            ))
         )}
      </section>
   );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
