function Notifcation({ errorMsg }) {
  return (
    <div className="h-full w-full relative flex items-end justify-between">
      <div className=" p-3  rounded-md flex items-center gap-3 shadow font-semibold text-lgbg-white ">
        <img src="/Error.svg" alt="Error" />
        <p>{errorMsg}</p>
      </div>
    </div>
  );
}

export default Notifcation;
