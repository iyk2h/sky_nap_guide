"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlightsActions, useFlightsValue } from "./layout";
import { getAirportInfos } from "../api/airportInfo/AirportInfo";
import FlightHistoryLayout from "../components/FlightHistoryLayout";
import MyButton from "../components/MyButton";
import { useAirportInfosActions } from "../AirportProvider";
import { LoadingIcon } from "../utils/icon/Icon";

export default function Flights() {
  const router = useRouter();
  const flights = useFlightsValue();

  const [airportInfos, setAirportInfos] = useState([]);

  const cancelHandle = () => {
    router.back();
  };

  const { setAirportInfo } = useAirportInfosActions();

  const { removeFlight } = useFlightsActions();

  const [loadings, setLoadings] = useState(false);

  const hasDuplicate = (history, key) => {
    return history.some((entry) => entry.key === key);
  };

  const confirmHandle = async () => {
    if (flights.length === 0) {
      alert("비행을 추가해 주세요.");
      return;
    }

    setLoadings(true);

    const airport = await Promise.all(
      flights.map((info) => getAirportInfos(info.key, info.response))
    );

    const key = `${airport[0].departureInfo.datetime}_${airport
      .map((info) => info.arrivalInfo.city)
      .join(" -> ")}_${airport[flights.length - 1].arrivalInfo.city}`;

    if (hasDuplicate(airportInfos, key)) {
      alert("중복된 여행입니다. 다시 확인해주세요.");
      setLoadings(false);
      return;
    }

    setAirportInfo(airport);

    const newHistory = [...airportInfos, { key, airport }];

    const sortedHistory = newHistory.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });

    localStorage.setItem("airportInfos", JSON.stringify(sortedHistory));
    setAirportInfos(sortedHistory);
    router.replace("/nap");
  };

  useEffect(() => {
    const storedAirports = localStorage.getItem("airportInfos");
    if (storedAirports) {
      setAirportInfos(JSON.parse(storedAirports));
    }
  }, []);

  useEffect(() => {
    if (flights.length === 0) {
      router.replace("/flights/input");
    }
  }, [flights]);

  const addFlight = () => {
    router.push("/flights/input");
  };

  return (
    <div className="px-4">
      <>
        <section>
          {flights.length > 0 && (
            <div>
              {flights.length > 1 ? (
                <FlightHistoryLayout
                  title="flights"
                  history={flights}
                  onConfirm={removeFlight}
                  onClickTitle={"삭제"}
                />
              ) : (
                <FlightHistoryLayout
                  title="flights"
                  history={flights}
                  onConfirm={() => {}}
                />
              )}
            </div>
          )}

          {flights.length <= 3 && (
            <div
              className="bg-gray-100 text-center py-3 my-3 rounded-xl text-lg cursor-pointer"
              onClick={addFlight}
            >
              비행 추가 하기
            </div>
          )}
        </section>
        <section className="">
          {loadings ? (
            <div className="flex justify-center items-center py-5">
              <div className="mr-3 mb-1">
                <LoadingIcon />
              </div>
            </div>
          ) : (
            <div className="flex justify-between my-3">
              <div className="flex items-start">
                <MyButton text="취소" onClick={cancelHandle} />
              </div>
              <div className="flex items-end">
                <MyButton text="확인" onClick={confirmHandle} />
              </div>
            </div>
          )}
        </section>
      </>
    </div>
  );
}
