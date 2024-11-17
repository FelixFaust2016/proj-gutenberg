import { useState, useEffect } from "react";
import {
  Button,
  DefaultScreens,
  Header,
  Loader,
  SearchBar,
} from "../../components";
import { shortenSentence } from "../../utils/shorten-sentence";
import {
  backButtonIcon,
  errorStateImg,
  rightArrowIcon,
  searchIll,
} from "../../assets";

import app from "../../firebase-config";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { getMiddleWords } from "../../utils/middlewords";
import axios from "axios";

export const BookLookup = () => {
  const [metadata, setMetadata] = useState("");
  const [error, setError] = useState(null);
  const [bookId, setBookId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedBooks, setSaved] = useState([]);
  const [bookText, setBookText] = useState("");
  const [language, setLanguage] = useState("");

  const navigate = useNavigate();

  const fetchCollection = async () => {
    setIsLoading(true);
    const db = getDatabase(app);
    const dbRef = ref(db, "collection/books");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setSaved(Object.values(snapshot.val()));
    } else {
      setError("error");
    }
    setIsLoading(false);
  };

  const languageDetect = async () => {
    // setLoading(true);
    const bookLimit = getMiddleWords(bookText);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/papluca/xlm-roberta-base-language-detection",
        { inputs: bookLimit },
        {
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_REACT_OPENAI_SECRET_KEY
            }`,
          },
        }
      );
      setLanguage(response.data[0][0].label);
    } catch (error) {
      console.error("Error generating summary:", error);
      setLanguage("error.");
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  useEffect(() => {
    const idExists = savedBooks.some((item) => item.bookId === bookId);

    setIsSaved(idExists);
  }, [metadata]);

  const saveData = async () => {
    setIsSaving(true);
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "collection/books"));
    set(newDocRef, {
      ...metadata,
      bookText: bookText,
      bookId: bookId,
      language: language,
    })
      .then(() => {
        setIsSaved(true);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setIsSaving(false);
        navigate("/")
      });
  };

  useEffect(() => {
    if (language) {
      saveData();
    }
  }, [language]);

  const handleSetBookId = (e) => {
    setBookId(e.target.value);
  };

  const fetchBookText = async () => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const bookTextUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;

    setError(false);
    setIsLoading(true);
    try {
      const response = await fetch(proxyUrl + bookTextUrl);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const html = await response.text();

      setBookText(html);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const fetchMetadata = async () => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const metadataUrl = `https://www.gutenberg.org/ebooks/${bookId}`;

    setError(false);
    setIsLoading(true);
    try {
      const response = await fetch(proxyUrl + metadataUrl);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const title = doc.querySelector("h1")
        ? doc.querySelector("h1").innerText
        : "Title not found";
      const img = doc.querySelector("#cover img")
        ? doc.querySelector(".cover-art")
        : "image not found";
      const author = doc.querySelector('[itemprop="creator"]')
        ? doc.querySelector('[itemprop="creator"]').innerText
        : "Author not found";
      const summary = Array.from(doc.querySelectorAll("tr"))
        .find((tr) => {
          const th = tr.querySelector("th");
          return th && th.innerText === "Summary";
        })
        ?.querySelector("td")?.innerText;

      setMetadata({
        title,
        author,
        img: img.src,
        summary,
      });
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  console.log(error);

  const fetchData = (e) => {
    e.preventDefault();
    fetchMetadata();
    fetchBookText();
  };

  return (
    <div>
      <Header>
        <div className="px-5 md:px-10 lg:px-10 block md:flex lg:flex items-center h-full gap-2">
          <Button
            btnText={"Back to Home"}
            icon={backButtonIcon}
            isSecondary
            onClick={() => navigate("/")}
            styles={"flex-row-reverse"}
          />
          <form
            onSubmit={fetchData}
            className="flex justify-center items-center gap-3 h-full flex-1 mt-2 md:mt-0 lg:mt-0"
          >
            <SearchBar
              onChange={handleSetBookId}
              value={bookId}
              disabled={isLoading || isSaving}
              required
              placeholder={"Search for Book ID"}
            />
            <Button type="submit" btnText={"Search"} />
          </form>
        </div>
      </Header>
      <div className="flex items-center justify-center bg-gray-light h-full md:h-screen lg:h-screen px-5 py-10 md:py-0">
        {error ? (
          <div className="h-screen flex justify-center items-center">
            <DefaultScreens
              imgStyles={"h-56"}
              img={error === "404" ? searchIll : errorStateImg}
              title={
                error === "404"
                  ? "Not a Gutenberg valid ID"
                  : "An Error Occured"
              }
              text={
                error === "404"
                  ? "Please enter a valid Gutenberg ID to see a valid book!"
                  : "Please Contact Administrator!"
              }
            />
          </div>
        ) : isLoading ? (
          <div className="h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : metadata ? (
          <div className="max-w-screen-lg flex flex-col md:flex-row lg:flex-row items-center h-full gap-10 mt-36 md:mt-0">
            <div className="flex justify-center w-55 h-96">
              <img
                className="w-full h-full"
                src={metadata?.img}
                alt="book image"
              />
            </div>
            <div className="flex-1">
              <p className="text-3xl">{metadata.title}</p>
              <p>By {metadata.author}</p>
              <p className="mt-10">
                {metadata.summary && shortenSentence(metadata.summary, 100)}
              </p>
              <div className="flex gap-3 mt-7">
                <Button
                  onClick={languageDetect}
                  btnText={
                    isSaving ? "Saving..." : isSaved ? "Saved" : "Save Book"
                  }
                  icon={!isSaved && rightArrowIcon}
                  disabled={isSaved || isLoading}
                />
                <Button
                  onClick={() =>
                    navigate("/read-book", {
                      state: {
                        author: metadata.author,
                        title: metadata.title,
                        bookText: bookText,
                        language: language,
                      },
                    })
                  }
                  styles={"px-5"}
                  isSecondaryWithPadding
                  btnText={"Read Book"}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen flex justify-center items-center">
            <DefaultScreens
              imgStyles={"h-56"}
              img={searchIll}
              title={"No Results at the Moment"}
              text={"Search for valid ID to see Book Information"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
