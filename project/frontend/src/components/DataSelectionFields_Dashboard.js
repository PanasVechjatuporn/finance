
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export const SelectionFields = ({ data, startDate, endDate, onUpdateStartDate, onUpdateEndDate }) => {
    const dateObjects = data.map(item => new Date(item.date));
  
    let selectOption = [];
    dateObjects.forEach(element => {
      selectOption.push(
        element.toISOString().slice(0, 7)
      );
    });
  
    const [sumAmount, setSumAmount] = useState(0);
  
    useEffect(() => {
      handleDateChange(startDate, endDate);
    }, [startDate, endDate]);
  
    const handleDateChange = () => {
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);
      const calculatedSum = data
        .filter(item => {
          const [itemYear, itemMonth] = item.date.split('-').map(Number);
          return (
            itemYear > startYear || (itemYear === startYear && itemMonth >= startMonth)
          ) && (
            itemYear < endYear || (itemYear === endYear && itemMonth <= endMonth)
          );
        })
        .reduce((sum, item) => sum + parseInt(item.income, 10), 0);
  
      setSumAmount(calculatedSum);
      onUpdateStartDate(startDate);
      onUpdateEndDate(endDate);
    };
  
    const handleStartDateChange = (selectedDate) => {
      onUpdateStartDate(selectedDate);
    };
  
    const handleEndDateChange = (selectedDate) => {
      onUpdateEndDate(selectedDate);
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
  };


export default SelectionFields
