import { useLocation, useNavigate } from "react-router-dom";
import { Button, Header } from "../../components";
import { backButtonIcon } from "../../assets";
import { useEffect, useState } from "react";
import { getMiddleWords } from "../../utils/middlewords";
import axios from "axios";

export const ReadBook = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, []);

  const languageDetect = async () => {
    setLoading(true);
    const bookLimit = getMiddleWords(state.bookText);
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
      alert("There was an error from the server. PLEASE TRY AGAIN!!");
    }
    setLoading(false);
  };

  return (
    <>
      <Header>
        <div className="px-5 md:px-10 flex flex-col md:flex-row items-start md:items-center h-full gap-2">
          <Button
            icon={backButtonIcon}
            isSecondary
            onClick={() => navigate(-1)}
          />
          <p className="text-xl md:2xl font-bold">{state?.title}</p> by{" "}
          {state?.author}
          <div className="flex-1"></div>
          {language ? (
            <p>
              <strong>Language:</strong> {language?.toLocaleUpperCase()}
            </p>
          ) : (
            <Button
              btnText={loading ? "Detecting..." : "Language Detect"}
              onClick={languageDetect}
            />
          )}
        </div>
      </Header>
      <div className="flex items-center justify-center bg-gray-light h-full px-5 md:px-20">
        <div className="max-w-screen-lg w-full flex items-center h-full">
          <pre className="mt-56 md:mt-40 w-full whitespace-pre-wrap">
            {state?.bookText}
          </pre>
        </div>
      </div>
    </>
  );
};
