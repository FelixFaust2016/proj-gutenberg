import { Link } from "react-router-dom";
import { shortenSentence } from "../utils/shorten-sentence";

export const Card = ({ data, onDelete }) => {
  return (
    <div className="w-full shadow-lg p-3 rounded">
      <div className="w-full h-44 overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={data.img}
          alt=""
        />
      </div>
      <p className="text-md mt-3 font-bold">{data.title}</p>
      <p className="mt-3 text-md text-sm mb-4">
        {shortenSentence(data.summary, 10)}
      </p>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link className="underline text-link" to={"/read-book"} state={data}>
          Read Book
        </Link>

      </div>
    </div>
  );
};
