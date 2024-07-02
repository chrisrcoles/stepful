import React, { useState, useEffect } from 'react';
import Input from '../input/input';
import Button from '../form-button';
import { API_URL, API_VERSION, MIN_DATE_CONSTRAINT } from "../../utils/constants";
import {convertToUTC} from "../../utils/helpers";

const AddAvailabilitySlot = ({ onHandleCoachAddAvailableSlot }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minDate, setMinDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  const bookSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const coach_id = process.env.NEXT_PUBLIC_COACH_ID;
    const { start_time, end_time } = convertToUTC(date, startTime, endTime);
    const slotData = { start_time, end_time, coach_id };

    try {
      const response = await fetch(`${API_URL}${API_VERSION}/slots/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slotData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setSuccess('Successfully created time slot');
        setDate('');
        setStartTime('');
        setEndTime('');
        onHandleCoachAddAvailableSlot(data);
      } else {
        console.error('Error:', response.statusText);
        setError(response.statusText);
      }
    } catch (e) {
      console.error('Error:', e);
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Add Availability Slot</h2>
      <form className="space-y-4" onSubmit={bookSlot}>
        <Input
          label="Date"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={MIN_DATE_CONSTRAINT ? minDate : null}
        />
        <Input
          label="Start Time"
          id="start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="End Time"
          id="end-time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-red-500 text-sm">
            {success}
          </div>
        )}
        <Button
          disabled={ (!startTime || !endTime || !date) }
          type="submit"
          label="Save"
        />
      </form>
    </div>
  );
};

export default AddAvailabilitySlot;
