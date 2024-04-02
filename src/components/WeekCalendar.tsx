import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { days, months } from "../utils/constants";
import {
  CalendarView,
  DateItem,
  DateItemNumber,
  DateItemWeekDay,
  DateList,
  DateNextArea,
  DatePrevArea,
  DateTitle,
  DateTitleArea,
  TopDateInfo,
} from "./CalendarItems";
import { TaskContext } from "../contexts/TaskContext";
import moment from "moment";

const WeekCalendar = () => {
  const { getTasksByDate } = useContext(TaskContext);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [listDays, setListDays] = useState<
    { weekday: string; number: number }[]
  >([]);

  const handleSelectDay = (item: number) => {
    setSelectedDay(item);
    const newDate = new Date(selectedYear, selectedMonth, item);
    const newDateFormated = moment(newDate).format("YYYY-MM-DD");

    getTasksByDate(newDateFormated);
  };

  useEffect(() => {
    let daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    let newListDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      let d = new Date(selectedYear, selectedMonth, i);
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? 0 + month : month;
      day = day < 10 ? 0 + day : day;

      newListDays.push({
        status: true,
        weekday: days[d.getDay()],
        number: i,
      });

      setListDays(newListDays);
      setSelectedDay(day);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    let today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setSelectedDay(today.getDate());
  }, []);

  const previousMonthClick = () => {
    let prevDate = new Date(selectedYear, selectedMonth, 1);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setSelectedYear(prevDate.getFullYear());
    setSelectedMonth(prevDate.getMonth());
    setSelectedDay(0);
  };

  const nextMonthClick = () => {
    let nextDate = new Date(selectedYear, selectedMonth, 1);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setSelectedYear(nextDate.getFullYear());
    setSelectedMonth(nextDate.getMonth());
    setSelectedDay(0);
  };

  return (
    <CalendarView>
      <TopDateInfo>
        <DatePrevArea onPress={previousMonthClick}>
          <MaterialIcons name="arrow-back" size={24} color="#fafafa" />
        </DatePrevArea>
        <DateTitleArea>
          <DateTitle>
            {months[selectedMonth]} {selectedYear}
          </DateTitle>
        </DateTitleArea>
        <DateNextArea onPress={nextMonthClick}>
          <MaterialIcons name="arrow-forward" size={24} color="#fafafa" />
        </DateNextArea>
      </TopDateInfo>

      <DateList horizontal={true} showsHorizontalScrollIndicator={false}>
        {listDays.map((item, key) => (
          <DateItem
            key={key}
            onPress={() => handleSelectDay(item.number)}
            style={{
              backgroundColor:
                item.number === selectedDay ? "#3c3147" : "#292d3e",
            }}
          >
            <DateItemWeekDay
              style={{
                color: item.number === selectedDay ? "#ceff27" : "#fafafa",
                fontWeight: item.number === selectedDay ? "bold" : "normal",
              }}
            >
              {item.weekday}
            </DateItemWeekDay>
            <DateItemNumber
              style={{
                color: item.number === selectedDay ? "#ceff27" : "#fafafa",
                fontWeight: item.number === selectedDay ? "bold" : "normal",
              }}
            >
              {item.number}
            </DateItemNumber>
          </DateItem>
        ))}
      </DateList>
    </CalendarView>
  );
};

export default WeekCalendar;
