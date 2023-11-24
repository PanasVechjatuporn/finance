
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export const SelectionFields = (data) => {
    const mockData = data.data;
    const dateObjects = mockData.map(item => new Date(item.date));
  
    let selectOption = [];
    dateObjects.forEach(element => {
      selectOption.push(
        element.toISOString().slice(0, 7)
      );
    });
  
    const [startDate, setStartDate] = useState(selectOption[0]);
    const [endDate, setEndDate] = useState(selectOption[selectOption.length - 1]);
    const [sumAmount, setSumAmount] = useState(0);
  
    useEffect(() => {
      handleDateChange(startDate, endDate);
    }, [startDate, endDate]);
  
    const handleDateChange = (start, end) => {
  
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);
  
      // Calculate the sum of income for objects within the specified date range
      const calculatedSum = mockData
        .filter(item => {
          const [itemYear, itemMonth] = item.date.split('-').map(Number);
          return (
            itemYear > startYear || (itemYear === startYear && itemMonth >= startMonth)
          ) && (
            itemYear < endYear || (itemYear === endYear && itemMonth <= endMonth)
          );
        })
        .reduce((sum, item) => sum + parseInt(item.income, 10), 0);
  
      // Update the state with the calculated sum
      setSumAmount(calculatedSum);
    };
  
    const handleStartDateChange = (selectedDate) => {
      setStartDate(selectedDate);
      if (selectOption.indexOf(selectedDate) > selectOption.indexOf(endDate)) {
        setEndDate(selectedDate);
      }
    };
  
    const handleEndDateChange = (selectedDate) => {
      setEndDate(selectedDate);
      if (selectOption.indexOf(selectedDate) < selectOption.indexOf(startDate)) {
        setStartDate(selectedDate);
      }
    };
  
    return (
      <div>
        <div>
          <label>From</label>
          <select value={startDate} onChange={(e) => handleStartDateChange(e.target.value)}>
            {selectOption.map((date) => (
              <option key={date} value={date} disabled={date >= endDate}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>To</label>
          <select value={endDate} onChange={(e) => handleEndDateChange(e.target.value)}>
            {selectOption.map((date) => (
              <option key={date} value={date} disabled={date <= startDate}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Amount of Income</label>
          <p>{sumAmount}</p>
        </div>
      </div>
    );
  }


export default SelectionFields