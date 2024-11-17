import { BookLookup, SavedBooks, ReadBook } from "../pages";

export const ROUTES_ARRAY = [
  {
    path: "/",
    element: <SavedBooks />,
  },
  {
    path: "/book-lookup",
    element: <BookLookup />,
  },
  {
    path: "/read-book",
    element: <ReadBook />,
  },
];
