"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlightsActions, useFlightsValue } from "./layout";
import { getAirportInfos } from "../../api/airportInfo/AirportInfo";
import FlightHistoryLayout from "../../components/FlightHistoryLayout";
import MyButton from "../../components/MyButton";
import { useAirportInfosActions } from "../AirportProvider";
import { CloseIcon, LoadingIcon, SearchIcon } from "../../utils/icon/Icon";
import { useTranslations } from "next-intl";

export default function Flights() {
  const t = useTranslations("Flights");
  const router = useRouter();
  const flights = useFlightsValue();

  const [airportInfos, setAirportInfos] = useState([]);

  const resetFlights = () => {
    if (flights.length > 0) {
      removeFlightAll();
    }
  };

  const { setAirportInfo } = useAirportInfosActions();

  const { removeFlight, addFlight, removeFlightAll } = useFlightsActions();

  const [loadings, setLoadings] = useState(false);

  const hasDuplicate = (history, key) => {
    return history.some((entry) => entry.key === key);
  };

  const confirmHandle = async () => {
    if (flights.length === 0) {
      alert(t("empty_flight"));
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
      alert(t("duplicate_travel"));
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

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("flightHistory");
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      const today = new Date();

      const filteredHistory = parsedHistory.filter((item) => {
        const keyDate = new Date(
          item.key.substring(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
        );
        return keyDate >= today;
      });

      setHistory(filteredHistory);
    }
  }, []);

  const addResponse = (key, response) => {
    addFlight(key, response);

    const updatedFlights = history.filter((item) => item.key !== key);
    const newHistory = [{ key, response }, ...updatedFlights.slice(0, 11)];

    localStorage.setItem("flightHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  return (
    <div className="px-2">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">{t("myflights")}</div>
        <div
          className="flex p-1 mx-1 cursor-pointer rounded-full hover:bg-gray-200"
          onClick={() => {
            router.back();
          }}
        >
          <CloseIcon />
        </div>
      </div>
      {flights.length <= 3 && (
        <div
          className="flex gap-2 bg-gray-100 rounded-xl p-2 px-2 mt-1 mb-2 cursor-pointer"
          onClick={() => {
            router.push("/flights/input");
          }}
        >
          <SearchIcon />
          <p className="text-gray-600">{t("search_flight")}</p>
        </div>
      )}
      <>
        <section>
          {flights.length > 0 && (
            <div>
              <FlightHistoryLayout
                title={t("flights")}
                history={flights}
                onConfirm={() => {}}
                hover={false}
              />
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
                <MyButton text={t("cancel")} onClick={resetFlights} />
              </div>
              <div className="flex items-end">
                <MyButton text={t("done")} onClick={confirmHandle} />
              </div>
            </div>
          )}
        </section>
      </>
      <div className="flex text-lg font-bold mt-8">{t("recent_view_list")}</div>

      <div className="mt-2">
        <section className="px-2">
          {history.length > 0 ? (
            <div>
              <FlightHistoryLayout history={history} onConfirm={addResponse} />
            </div>
          ) : (
            <></>
          )}
        </section>
      </div>
    </div>
  );
}
