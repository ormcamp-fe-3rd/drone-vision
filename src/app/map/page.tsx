import Sidebar from "@/components/common/Sidebar";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import MapView from "@/components/map/MapView";

export default function MapPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="relative h-[calc(100vh-56px)] flex-1">
        <div className="h-full">
          <MapView />
        </div>
        <div className="absolute right-8 top-8 z-10 w-[280px] rounded-[30px] bg-gray-500">
          <StatusPanel />
        </div>
        <div className="absolute bottom-20 right-8 z-10 size-[280px] rounded-[30px] bg-gray-400">
          <AttitudePanel />
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 w-1/3 -translate-x-1/2">
          <FlightProgressBar />
        </div>
      </div>
    </div>
  );
}
