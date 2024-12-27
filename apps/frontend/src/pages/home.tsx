import DashboardHeader from "@/components/DashboardHeader";
import { MovingLight } from "./login";
import BridgeList from "@/components/BridgeList";


export default function Home(){


return(

    <>
 <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <MovingLight />
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardHeader />
        <main className="mt-8">
          <BridgeList />
        </main>
      </div>
    </div>    </>
)



}