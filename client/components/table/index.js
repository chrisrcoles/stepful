// components/Input.js
import React from 'react';
import Link from "next/link";
import { AVAILABLE, COACHES, PAST, STUDENTS, UPCOMING } from "../../utils/constants";


const Table = ({id, headers, data, currentTab, dashboardType}) => {
  const renderValues = () => {
    return data.map(item => {
      // Student Dashboard - Available Slots - Link to Bookable Slot
      if (currentTab === AVAILABLE && dashboardType === STUDENTS) {
        return (
          <Link
            key={item.id}
            href={{
              pathname: `/slots/${item.id}`,
              query: { dashboard: dashboardType, currentTab }
            }}>
            <tr key={item.id} className="hover:bg-blue-100 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">{item.coach_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
            </tr>
          </Link>
        )
      }
      // Coach Dashboard - Available Slots - No Link
      if (currentTab === AVAILABLE && dashboardType === COACHES) {
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
          </tr>
        )
      }

      // Student Dashboard - Upcoming Slots - No Link
      if (currentTab === UPCOMING && dashboardType === STUDENTS) {
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">{item.coach_name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.coach_phone_number}</td>
          </tr>
        )
      }
      // Coach Dashboard - Upcoming Slots - No Link
      if (currentTab === UPCOMING && dashboardType === COACHES) {
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">{item.student_name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.student_phone_number}</td>
          </tr>
        )
      }

      // Coach Dashboard - Past Slots - Link to Edit Slot Score/Notes
      if (currentTab === PAST && dashboardType === COACHES) {
        console.log('item', item)
        return (
          <Link
            key={item.id}
            href={{
              pathname: `/slots/${item.id}`,
              query: { dashboard: dashboardType, currentTab }
            }}>
            <tr key={item.id} className="hover:bg-blue-100 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">{item.student_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.satisfaction || item.feedback_satisfaction }</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.notes || item.feedback_notes}</td>
            </tr>
          </Link>
        )
      }

      // Student Dashboard - Past Slots - No Link
      if (currentTab === PAST && dashboardType === STUDENTS) {
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">{item.student_name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.start_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.end_time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.feedback_satisfaction}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.feedback_notes}</td>
          </tr>
        )
      }
    })
  }

  return (
    <div key={id} id={id}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          {headers.map(header => (
              <th
                key={header}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}
              </th>
            )
          )}
        </tr>
        </thead>
        <tbody key={id} className="bg-white divide-y divide-gray-200">
        {renderValues()}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
