// src/contexts/SlotsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { CURRENT_DASHBOARD_VIEW, ID } from "../utils/constants";

export const SlotsContext = createContext({});

export const SlotsProvider = ({ children }) => {
  const [slots, setSlots] = useState({
    available_slots: [],
    upcoming_coaching_slots: [],
    upcoming_tutoring_slots: [],
    past_coaching_slots: []
  });

  const fetchSlots = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/slots?${CURRENT_DASHBOARD_VIEW}=${ID}`);
      const data = await response.json();
      console.log('fetchSlots()', data)
      setSlots(data.data);
    } catch (error) {
      console.error('Error:', error);
    }

  }

  useEffect(() => {
    fetchSlots()
  }, []);

  const getSlotById = (id) => {
    for (let key in slots) {
      const foundSlot = slots[key].find(slot => slot.id === id);
      if (foundSlot) {
        return foundSlot;
      }
    }
    return null;
  };


  return (
    <SlotsContext.Provider value={{ slots, setSlots, getSlotById }}>
      {children}
    </SlotsContext.Provider>
  );
};
