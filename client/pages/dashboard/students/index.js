import React, { useContext, useState } from 'react';
import Table from "../../../components/table";
import { SlotsContext } from "../../../contexts/slots-context";
import { AVAILABLE, STUDENTS, UPCOMING } from "../../../utils/constants";


const StudentDashboard = () => {
  const [activeStudentTab, setActiveStudentTab] = useState('available');
  const { slots } = useContext(SlotsContext);

  const renderContent = () => {
    if (activeStudentTab === AVAILABLE) {
      return (
        <Table
          id={AVAILABLE}
          headers={["Coach Name", "Start Time", "End Time"]}
          data={slots.available_slots}
          currentTab={activeStudentTab}
          dashboardType={STUDENTS}
        />
      );
    } else if (activeStudentTab === UPCOMING) {
      return (
        <Table
          id={UPCOMING}
          headers={["Coach Name", "Start Time", "End Time", "Coach Phone Number"]}
          data={slots.upcoming_tutoring_slots}
          currentTab={activeStudentTab}
          dashboardType={STUDENTS}
        />
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mt-6 mb-6">Student Dashboard</h1>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeStudentTab === AVAILABLE ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveStudentTab(AVAILABLE)}
        >
          Available Slots
        </button>

        <button
          className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeStudentTab === UPCOMING ? 'text-blue-500 border-b-2 font-medium border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveStudentTab(UPCOMING)}
        >
          Upcoming Slots
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StudentDashboard;
