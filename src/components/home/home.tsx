import ChatGlobal from "../chatGlobal/chatGlobal";
import Sidebar from "../sidebar/sidebar";


export default function Home() {
  return (
    <div className='flex '>
      <div className='w-[80%] border  '>
        <ChatGlobal />
      </div>
      <aside className='w-[20%] border-l border-gray-500 '> 
        <Sidebar />
      </aside>
      
    </div>
  )
}
