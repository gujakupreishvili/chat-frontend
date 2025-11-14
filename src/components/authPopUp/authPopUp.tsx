type authPopupProps ={
  children:React.ReactNode
}
export default function AuthPopUp({children} :authPopupProps) {
  return (
    <div className="w-full h-screen fixed bg-white/5 backdrop-blur-sm flex items-center justify-center top-0 bottom-0 left-0 right-0 ">
      <div className="bg-gray-400 p-10 rounded-lg shadow-lg md:w-[32%]">
       {children}
      </div>
    </div>
  );
}
