function Notification({ errorMsg }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-500 text-white p-3 rounded-md shadow-md flex items-center gap-3 font-semibold min-w-[250px]">
        <img src="/Error.svg" alt="Error" className="w-6 h-6" />
        <p>{errorMsg}</p>
      </div>
    </div>
  );
}

export default Notification;
