export default function StatusPanel() {
  return (
    <div className="flex max-h-full scroll-m-0 flex-col gap-6 overflow-y-scroll py-6 pl-10">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-GPS.svg"></img>
          <div>GPS 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>위도</div>
            <div>위도</div>
          </div>
          <div className="flex-1">
            <div>경도</div>
            <div>경도</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Flight.svg"></img>
          <div>비행 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>속도</div>
            <div>속도</div>
          </div>
          <div className="flex-1">
            <div>방향</div>
            <div>방향</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Altitude.svg"></img>
          <div>고도 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>상대 고도</div>
            <div>상대 고도</div>
          </div>
          <div className="flex-1">
            <div>절대 고도</div>
            <div>절대 고도</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Accuracy.svg"></img>
          <div>정확도</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>수평 정확도</div>
            <div>수평 정확도</div>
          </div>
          <div className="flex-1">
            <div>수직 정확도</div>
            <div>수직 정확도</div>
          </div>
        </div>
      </div>
    </div>
  );
}
