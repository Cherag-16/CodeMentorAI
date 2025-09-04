import React, { useState } from 'react';

const Calendar = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderCalendar = () => {
    const calendar = [];
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, 4, day); 
      const eventExists = events.some(event => new Date(event.date).getDate() === day);

      calendar.push(
        <div
          key={day}
          className={`p-2 m-1 ${eventExists ? 'bg-blue-400' : ''} cursor-pointer`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }
    return calendar;
  };

  return (
    <div>
      <h2>Calendar</h2>
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
      {selectedDate && (
        <div className="mt-4">
          <h3>Selected Date: {selectedDate.toLocaleDateString()}</h3>
        </div>
      )}
    </div>
  );
};

export default Calendar;
