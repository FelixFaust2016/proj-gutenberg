import { useLocation, useNavigate } from "react-router-dom";
import { Button, Header } from "../../components";
import { backButtonIcon } from "../../assets";
import { useEffect } from "react";

export const ReadBook = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, []);

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
          {state.language && (
            <p>
              <strong>Language:</strong> {state.language.toUpperCase()}
            </p>
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
