import React, { useContext, useState } from 'react';
import AddAvailabilitySlot from '../../../components/availability-slot/index';
import Table from "../../../components/table";
import { SlotsContext } from "../../../contexts/slots-context";
import { ADD, AVAILABLE, COACHES, PAST, UPCOMING } from "../../../utils/constants";

const CoachDashboard = () => {
  const [activeCoachTab, setActiveCoachTab] = useState('available');
  const { slots, setSlots } = useContext(SlotsContext);

  const handleCoachAddAvailableSlot = (newSlot) => {
    setSlots({
      ...slots,
      available_slots: [...slots.available_slots, newSlot]
    });
  }
  const renderContent = () => {
    if (activeCoachTab === AVAILABLE) {
      return (
        <Table
          id={AVAILABLE}
          headers={["Start Time", "End Time"]}
          data={slots.available_slots}
          currentTab={activeCoachTab}
          dashboardType={COACHES}
        />
      );
    } else if (activeCoachTab === UPCOMING) {
      return (
        <Table
          id={UPCOMING}
          headers={["Coach Name", "Start Time", "End Time", "Phone Number"]}
          data={slots.upcoming_coaching_slots}
          currentTab={activeCoachTab}
          dashboardType={COACHES}
        />
      );
    } else if (activeCoachTab === PAST) {
      return (
        <Table
          id={PAST}
          headers={["Student Name", "Start Time", "End Time", "Score", "Notes"]}
          data={slots.past_coaching_slots}
          currentTab={activeCoachTab}
          dashboardType={COACHES}
        />
      );
    } else if (activeCoachTab === ADD) {
      return <AddAvailabilitySlot id="active" onHandleCoachAddAvailableSlot={handleCoachAddAvailableSlot}/>;
    } else {
      return <div></div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mt-6 mb-6">Coach Dashboard</h1>
      <div>
      </div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeCoachTab === 'available' ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveCoachTab(AVAILABLE)}
        >
          Available Slots
        </button>

        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeCoachTab === 'upcoming' ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveCoachTab(UPCOMING)}
        >
          Upcoming Slots
        </button>
        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeCoachTab === 'past' ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveCoachTab(PAST)}
        >
          Past Slots
        </button>
        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeCoachTab === 'add' ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveCoachTab(ADD)}
        >
          Add Slot
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default CoachDashboard;
