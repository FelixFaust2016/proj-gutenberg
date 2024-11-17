export const DefaultScreens = ({ img, imgStyles, text, title }) => {
  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className={imgStyles}>
        <img className="w-full h-full object-contain" src={img} alt="" />
      </div>

     <p className="mt-4 text-center text-2xl">{title}</p>
     <p className="text-sm mt-3 text-center">{text}</p>
    </div>
  );
};
