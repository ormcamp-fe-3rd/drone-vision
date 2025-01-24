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

  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [rollSpeed, setRollSpeed] = useState(0);
  const [pitchSpeed, setPitchSpeed] = useState(0);
  const [yawSpeed, setYawSpeed] = useState(0);

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
    // Todo
  };

  const updateAttitudeData = (data: {
    roll: number;
    pitch: number;
    yaw: number;
    rollSpeed: number;
    pitchSpeed: number;
    yawSpeed: number;
  }) => {
    setRoll(data.roll);
    setPitch(data.pitch);
    setYaw(data.yaw);
    setRollSpeed(data.rollSpeed);
    setPitchSpeed(data.pitchSpeed);
    setYawSpeed(data.yawSpeed);
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
            onAttitudeChange={updateAttitudeData}
          />
        </div>
        <div className="absolute right-8 top-8 z-10 flex max-h-[90%] flex-col gap-4">
          <SelectFlightLog
            value={selectedFlight}
            onSelect={setSelectedFlight}
          />
          <div
            className={`${isStatusOpen ? "block" : "hidden"} overflow-hidden`}
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
            <AttitudePanel
              roll={roll}
              pitch={pitch}
              yaw={yaw}
              rollSpeed={rollSpeed}
              pitchSpeed={pitchSpeed}
              yawSpeed={yawSpeed}
            />
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 w-2/3 min-w-80 -translate-x-1/2">
          <FlightProgressBar
            progress={progress}
            setProgress={setProgress}
            allTimestamps={allTimestamps}
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
