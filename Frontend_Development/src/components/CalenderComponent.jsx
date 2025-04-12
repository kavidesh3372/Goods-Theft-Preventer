import { useEffect, useState } from "react";
import DatesMatrix from "./DatesMatrixComponent";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";

const generateDates = (month, year) => {
  const calendar = [[]];
  const startDay = new Date(year, month, 1);
  const endDay = new Date(year, month + 1, 0);

  let week = 0;

  for (let i = 0; i < startDay.getDay(); i++) {
    calendar[week].push(null);
  }

  for (let i = 1; i <= endDay.getDate(); i++) {
    if (calendar[week].length === 7) {
      week++;
      calendar[week] = [];
    }
    calendar[week].push(i);
  }

  while (calendar[week].length < 7) {
    calendar[week].push(null);
  }

  return calendar;
};

const Calendar = ({ setSelectedDate }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [dates, setDates] = useState(generateDates(currentMonth, currentYear));
  const [yearInput, setYearInput] = useState(currentYear);

  useEffect(() => {
    setYearInput(currentYear);
  }, [currentYear]);

  const handleClickForward = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = (prevMonth + 1) % 12;
      return newMonth;
    });
  };

  const handleClickBackward = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = (prevMonth - 1 + 12) % 12;
      return newMonth;
    });
  };

  useEffect(() => {
    setDates(generateDates(currentMonth, currentYear));
  }, [currentMonth, currentYear]);

  const handleYearInputChange = (e) => {
    setYearInput(e.target.value);
  };

  const handleYearInputBlur = () => {
    const newYear = parseInt(yearInput, 10);
    if (!isNaN(newYear) && newYear > 0) {
      setCurrentYear(newYear);
    } else {
      setYearInput(currentYear); 
    }
  };

  const handleYearInputFocus = () => {
    setYearInput(currentYear);
  };

  const handleDateClick = (day) => {
    if (day) {
      const date = `${day} ${months[currentMonth]} ${currentYear}`;
      setSelectedDate(date);
    }
  };

  return (
    <div className="border border-gray-400 mt-10 p-6 rounded-lg">
      <div className="flex justify-between text-black">
        <button type="button" className="flex items-center flex-row">
          <RiArrowLeftSLine onClick={handleClickBackward} className="mt-1 mr-2" />
          {months[currentMonth]}
          <RiArrowRightSLine onClick={handleClickForward} className="mt-1 ml-2" />
        </button>
        <input className="bg-transparent w-12 focus:outline-none text-black text-center" value={yearInput} onChange={handleYearInputChange} onBlur={handleYearInputBlur} onFocus={handleYearInputFocus}/>
      </div>
      <div className="flex text-black mt-3">
        <div className="w-16 text-center">Sun</div>
        <div className="w-16 text-center">Mon</div>
        <div className="w-16 text-center">Tue</div>
        <div className="w-16 text-center">Wed</div>
        <div className="w-16 text-center">Thu</div>
        <div className="w-16 text-center">Fri</div>
        <div className="w-16 text-center">Sat</div>
      </div>
      <DatesMatrix dates={dates} onDateClick={handleDateClick} />
    </div>
  );
};

export default Calendar;
