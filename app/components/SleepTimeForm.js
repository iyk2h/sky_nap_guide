import { useEffect, useState } from "react";

const SleepTimeForm = () => {
  const [sleepTime, setSleepTime] = useState("21:00");
  const [wakeUpTime, setWakeUpTime] = useState("08:00");

  useEffect(() => {
    localStorage.setItem(
      "sleepTime",
      JSON.stringify({ sleepTime, wakeUpTime })
    );
  }, [sleepTime, wakeUpTime]);

  return (
    <div>
      <section className="flex justify-between items-center mt-4 ml-6">
        <div>
          <h2 className="text-2xl font-bold pt-2">평소 취침 시간</h2>
          <div className="input_box">
            <input
              className="text-2xl font-bold bg-gray-200 rounded-lg px-2 py-1 cursor-pointer"
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="ml-5">
          <h2 className="text-2xl font-bold pt-2 pr-1">평소 기상 시간</h2>
          <div className="input_box">
            <input
              className="text-2xl font-bold bg-gray-200 rounded-lg px-2 py-1 cursor-pointer"
              type="time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              required
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SleepTimeForm;
