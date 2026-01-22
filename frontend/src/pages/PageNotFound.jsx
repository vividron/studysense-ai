import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col gap-3 items-center justify-center text-white">
      <Ghost size={60} />

      <h1 className="text-6xl font-bold">404</h1>

      <p className="text-lg">Oops! Page not found</p>

      <p className="text-sm text-gray-500 mt-1">
        Looks like this page took a day off.
        Even Google gave up searching.
      </p>

      <Link
        to="/"
        className="mt-2 px-4 py-2 rounded-md bg-black text-sm hover:bg-white/10 transition"
      >
        Back to My Activity
      </Link>
    </div>
  );
};

export default PageNotFound;
