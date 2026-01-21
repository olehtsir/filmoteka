const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = "mini_kinopoisk_simple_v1";

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
   const [movies, setMovies] = useState(loadMovies);

   const [title, setTitle] = useState("");
   const [search, setSearch] = useState("");
   const [sortBy, setSortBy] = useState("newest");

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
   }, [movies]);

   function addMovie(e) {
      e.preventDefault();
      const t = title.trim();
      if (!t) return;

      setMovies((prev) => [
         {
            id: uid(),
            title: t,
            status: "planned",
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

      const newTitle = prompt("Нова назва фільму:", movie.title);
      if (newTitle === null) return;

      const t = newTitle.trim();
      if (!t) return;

      setMovies((prev) =>
         prev.map((m) => (m.id === id ? { ...m, title: t } : m)),
      );
   }

   function clearAll() {
      if (!confirm("Очистити всю фільмотеку?")) return;
      setMovies([]);
   }

   // пошук + сортування
   const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();

      let list = movies.filter((m) => m.title.toLowerCase().includes(q));

      if (sortBy === "newest") {
         list.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortBy === "title") {
         list.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "rating") {
         list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return list;
   }, [movies, search, sortBy]);

   const planned = filtered.filter((m) => m.status === "planned");
   const watched = filtered.filter((m) => m.status === "watched");

   const plannedCount = movies.filter((m) => m.status === "planned").length;
   const watchedCount = movies.filter((m) => m.status === "watched").length;

   return (
      <>
         <section className="panel">
            <form className="row" onSubmit={addMovie}>
               <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введи назву фільму..."
               />
               <button type="submit">Додати</button>
               <button type="button" className="danger" onClick={clearAll}>
                  Очистити
               </button>
            </form>

            <div className="row" style={{ marginTop: 10 }}>
               <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Пошук..."
               />

               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
               >
                  <option value="newest">Сортування: нові</option>
                  <option value="title">Сортування: назва</option>
                  <option value="rating">Сортування: рейтинг</option>
               </select>

               <div className="small" style={{ alignSelf: "center" }}>
                  👀 Хочу: <b>{plannedCount}</b> • ✅ Переглянуто:{" "}
                  <b>{watchedCount}</b>
               </div>
            </div>
         </section>

         <main className="grid">
            <MovieList
               title="👀 Хочу подивитись"
               items={planned}
               onToggle={toggleStatus}
               onRemove={removeMovie}
               onRate={setRating}
               onEdit={editTitle}
               empty="Додай фільм у “Хочу подивитись”."
            />

            <MovieList
               title="✅ Переглянуто"
               items={watched}
               onToggle={toggleStatus}
               onRemove={removeMovie}
               onRate={setRating}
               onEdit={editTitle}
               empty="Поки переглянутих фільмів немає."
            />
         </main>
      </>
   );
}

function MovieList({
   title,
   items,
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
                        <span>Оцінка:</span>
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
                           ? "✅ В переглянуті"
                           : "👀 В хочу"}
                     </button>

                     <button className="secondary" onClick={() => onEdit(m.id)}>
                        ✏️ Редагувати
                     </button>

                     <button className="danger" onClick={() => onRemove(m.id)}>
                        Видалити
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
