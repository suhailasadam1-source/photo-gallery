import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Photo Gallery
        </h1>
        <Gallery />
      </div>
    </div>
  );
}

export default App;