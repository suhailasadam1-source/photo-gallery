import { useEffect, useState } from "react";

const API_URL = "https://picsum.photos/v2/list?limit=30";

function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchPhotos() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!isCancelled) {
          setPhotos(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong while fetching photos.");
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;