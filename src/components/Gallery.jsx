import { useReducer, useState, useEffect, useCallback, useMemo } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";

const STORAGE_KEY = "photo-gallery-favourites";

// Reducer: decides how the favourites list changes for each action
function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      if (state.includes(action.id)) {
        // Already a favourite -> remove it
        return state.filter((id) => id !== action.id);
      }
      // Not a favourite yet -> add it
      return [...state, action.id];
    default:
      return state;
  }
}

// Initializer: restores favourites from localStorage when the app loads
function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    loadFavourites
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Save favourites to localStorage every time they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  // useCallback: keeps the same function between renders
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // useMemo: only re-filters when photos or searchTerm change
  const filteredPhotos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(term));
  }, [photos, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p className="font-semibold">Failed to load photos</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by author name..."
        className="mx-auto mb-8 block w-full max-w-md rounded-full border border-gray-300 bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
      />

      {filteredPhotos.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No photos found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const isFavourite = favourites.includes(photo.id);

            return (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={`https://picsum.photos/id/${photo.id}/400/300`}
                  alt={`Photo by ${photo.author}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="flex items-center justify-between px-4 py-3">
                  <p className="truncate pr-2 text-sm font-medium text-gray-800">
                    {photo.author}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "TOGGLE_FAVOURITE", id: photo.id })
                    }
                    aria-label={
                      isFavourite ? "Remove from favourites" : "Add to favourites"
                    }
                    className={`cursor-pointer rounded-full p-1.5 transition duration-200 hover:scale-110 ${
                      isFavourite
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFavourite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Gallery;