import { useNavigate } from "react-router-dom";
import { bgurl, emptyImg, errorStateImg, rightBlackIcon } from "../../assets";
import {
  Button,
  Card,
  DefaultScreens,
  Header,
  Loader,
  SearchBar,
} from "../../components";
import { Fragment, useEffect, useState } from "react";

import app from "../../firebase-config";
import { getDatabase, ref, get } from "firebase/database";

export const SavedBooks = () => {
  const navigate = useNavigate();

  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchCollection = async () => {
    setIsLoading(true);
    const db = getDatabase(app);
    const dbRef = ref(db, "collection/books");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setSavedItems(Object.values(snapshot.val()));
    } else {
      setSavedItems([])
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchArray = savedItems.filter((item) => {
        if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return item;
        }
      });

      setSavedItems(searchArray);
    } else {
      fetchCollection();
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <>
      <Header>
        <div className="w-full h-full px-5 md:px-10 flex justify-end items-center">
          <Button
            onClick={() => navigate("/book-lookup")}
            btnText={"Find Books"}
            icon={rightBlackIcon}
            isSecondary
          />
        </div>
      </Header>
      <div className={`bg-gray-light w-full h-56 mt-20 relative`}>
        <div className="w-full h-full px-5 md:px-0 z-10 bg-black bg-opacity-45 top-0 left-0s absolute flex items-center justify-center flex-col gap-3">
          <p className="text-center text-white text-2xl font-semibold">
            Search for Saved Book Title
          </p>
          <SearchBar
            onChange={handleChange}
            value={searchTerm}
            placeholder={"Search for Title"}
            disabled={isLoading}
          />
        </div>
        <img
          className="w-full h-full object-cover drop-shadow"
          src={bgurl}
          alt=""
        />
      </div>
      <div className="max-w-screen-lg m-auto py-10 px-5 lg:px-0 h-full w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <Loader />
          </div>
        ) : savedItems.length > 0 ? (
          <>
            <h2 className="text-2xl">Saved Books</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-5 mt-5">
              {savedItems.map((item) => (
                <Fragment key={item.bookId}>
                  <Card data={item} />
                </Fragment>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center mt-20">
            <DefaultScreens
              imgStyles={"h-56"}
              img={emptyImg}
              title={"No Saved Book(s)"}
              text={"Results are empty"}
            />
          </div>
        )}
      </div>
    </>
  );
};
