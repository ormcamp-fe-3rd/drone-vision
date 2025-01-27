"use client";

import Sidebar from "@/components/common/Sidebar";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import MapView from "@/components/map/MapView";
import ControlPanel from "@/components/map/ControlPanel";
import { useEffect, useState } from "react";
import useSidebarStore from "@/store/useSidebar";
import useResizePanelControl from "@/hooks/useResizePanelControl";
import SelectFlightLog from "@/components/map/SelectFlightLog";
import useData from "@/store/useData";
import { INITIAL_POSITION } from "@/constants";

export default function MapPage() {
  const { isSidebarOpen } = useSidebarStore();
  const { isStatusOpen, setIsStatusOpen, isAttitudeOpen, setIsAttitudeOpen } =
    useResizePanelControl();
  const { selectedOperationId } = useData();
  const [selectedFlight, setSelectedFlight] = useState(selectedOperationId[0]);
  const [progress, setProgress] = useState(0);
  const [operationTimestamps, setOperationTimestamps] = useState<
    Record<string, number[]>
  >({});
  const [allTimestamps, setAllTimestamps] = useState<number[]>([]);
  const [operationStartPoint, setOperationStartPoint] =
    useState<Record<string, [number, number]>>();
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    INITIAL_POSITION.LAT,
    INITIAL_POSITION.LNG,
  ]);

  useEffect(() => {
    setSelectedFlight(selectedOperationId[0]);
    setProgress(0);
  }, [selectedOperationId]);

  useEffect(() => {
    const allTimestamps = Object.values(operationTimestamps).flat();
    setAllTimestamps(allTimestamps.sort((a, b) => a - b));
  }, [operationTimestamps]);

  const toggleStatusPanel = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const toggleAttitudePanel = () => {
    setIsAttitudeOpen(!isAttitudeOpen);
  };

  const zoomToDrone = () => {
    if (operationStartPoint && operationStartPoint[selectedFlight]) {
      const [lat, lng] = operationStartPoint[selectedFlight];
      setMapPosition([lat, lng]);
    } else {
      console.warn(`Start point not found for ID: ${selectedFlight}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div
        className={`${isSidebarOpen ? "md:block" : "md:hidden"} z-20 md:absolute`}
      >
        <Sidebar />
      </div>
      <div className="relative h-full min-w-[344px] flex-1 border-red-600">
        <div className="h-full">
          <MapView
            progress={progress}
            operationTimestamps={operationTimestamps}
            setOperationTimestamps={setOperationTimestamps}
            allTimestamps={allTimestamps}
            onMarkerClick={setSelectedFlight}
            operationStartPoint={operationStartPoint}
            setOperationStartPoint={setOperationStartPoint}
            mapPosition={mapPosition}
            setMapPosition={setMapPosition}
          />
        </div>
        <div className="absolute right-8 top-8 z-10 flex max-h-[90%] flex-col gap-4">
          <SelectFlightLog
            value={selectedFlight}
            onSelect={setSelectedFlight}
          />
          <div
            className={`${isStatusOpen ? "block" : "hidden"} overflow-hidden overflow-y-scroll rounded-[30px]`}
          >
            <StatusPanel
              progress={progress}
              allTimestamps={allTimestamps}
              operationTimestamps={operationTimestamps}
              selectedOperationId={selectedOperationId}
              selectedFlight={selectedFlight}
            />
          </div>
          <div className={`${isAttitudeOpen ? "block" : "hidden"}`}>
            <AttitudePanel />
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 flex w-2/3 min-w-80 -translate-x-1/2 flex-col gap-1">
          <FlightProgressBar
            progress={progress}
            setProgress={setProgress}
            allTimestamps={allTimestamps}
            operationTimestamps={operationTimestamps}
            setSelectedFlight={setSelectedFlight}
          />
          <div className="flex justify-center">
            <ControlPanel
              onFlightInfoClick={toggleStatusPanel}
              onAttitudeClick={toggleAttitudePanel}
              onZoomClick={zoomToDrone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
