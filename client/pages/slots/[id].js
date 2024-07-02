import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SlotsContext } from "../../contexts/slots-context";
import Link from "next/link";
import { API_URL, API_VERSION, AVAILABLE, COACHES, PAST, STUDENTS } from "../../utils/constants";

const SlotDetail = () => {
  const router = useRouter();
  const { id, dashboard, currentTab } = router.query;
  const [updated, setUpdated] = useState(false);

  const { getSlotById, setSlots, slots } = useContext(SlotsContext);
  const slot = getSlotById(id)

  useEffect(() => {
    if (updated) {
      console.log('callback hit()')
      console.log(slots);
      setUpdated(false);
    }
  }, [updated, slots]);


  const handleCoachEditPastSlot = (updatedSlot) => {
    console.log('handleCoachEditPastSlot')
    setSlots(prevSlots => ({
      ...prevSlots,
      past_coaching_slots: prevSlots.past_coaching_slots.map(slot => slot.id === updatedSlot.id ? Object.assign({}, slot, updatedSlot) : slot)
    }));
    setUpdated(true);
  };


  const handleStudentBookSlot = () => {
    setSlots({
      ...slots,
      upcoming_tutoring_slots: [...slots.upcoming_tutoring_slots, slot],
      available_slots: slots.available_slots.filter(availableSlot => availableSlot.id !== slot.id)
    });
  }


  const renderContent = () => {
    if (dashboard === STUDENTS && currentTab === AVAILABLE) {
      return (
        <StudentSlotBookingDetail
          slot={slot}
          setSlots={setSlots}
          slots={slots}
          onHandleStudentBookSlot={handleStudentBookSlot}
        />
      )
    }

    if (dashboard === COACHES && currentTab === PAST) {
      return (
        <CoachPastSlotEditDetail
          slot={slot}
          setSlots={setSlots}
          slots={slots}
          onHandleCoachEditPastSlot={handleCoachEditPastSlot}
        />
      )
    }
  }

  const renderTitle = () => {
    if (dashboard === STUDENTS && currentTab === AVAILABLE) {
      return `Book Your Slot`
    }

    if (dashboard === COACHES && currentTab === PAST) {
      return `Rate Your Slot`
    }
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex items-center mt-6 mb-6">
        <Link href={`/dashboard/${dashboard}`}>
          <a className="flex items-center text-blue-500 hover:text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </Link>
        <h1 className="text-3xl font-bold ml-4">{renderTitle()}</h1>
      </div>
      {renderContent()}
    </div>
  );
};

const CoachPastSlotEditDetail = ({ slot, onHandleCoachEditPastSlot }) => {
  const [score, setScore] = useState(slot?.satisfaction || slot?.feedback_satisfaction || '');
  const [notes, setNotes] = useState(slot?.notes || slot?.feedback_notes || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const SATISFACTION_SCORES = [1, 2, 3, 4, 5]
  const updateSlot = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/v1/slots/${slot.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          satisfaction: score,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('updated data', data)
        onHandleCoachEditPastSlot(data)
        setSuccess('Successfully updated time slot')
        router.push(`/dashboard/coaches`);
      } else {
        console.error('Error:', response.statusText);
        setError(response.statusText)
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
      {slot ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Coaching Session</h2>
          <p><strong>Date:</strong> {new Date(slot.start_time).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(slot.start_time).toLocaleTimeString()} - {new Date(slot.end_time).toLocaleTimeString()}</p>
          <form onSubmit={updateSlot} className="space-y-4">
            <div>
              <label className="block text-gray-700">Score:</label>
              <select value={score} onChange={(e) => setScore(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">Select Score</option>
                {SATISFACTION_SCORES.map((score) => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Notes:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="4"
              ></textarea>
            </div>
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
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">Submit Feedback</button>
          </form>
        </>
      ) : (
        <p>Slot not found</p>
      )}
    </div>
  );
};

const StudentSlotBookingDetail = ({ slot, onHandleStudentBookSlot }) => {
  const router = useRouter();
  const { id } = router.query;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bookSession = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}${API_VERSION}/slots/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: process.env.NEXT_PUBLIC_STUDENT_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Successfully created time slot');

        onHandleStudentBookSlot(data.data)
        await router.push(`/dashboard/students`);
      } else {
        console.error('Error:', response.statusText);
        setError(response.statusText)
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold mb-4">Coaching Session Details</h2>
      {slot ? (
        <>
          <p><strong>Coach:</strong> {slot.coach_name} ({slot.coach_phone_number})</p>
          <p><strong>Date:</strong> {new Date(slot.start_time).toLocaleDateString()}</p>
          <p>
            <strong>Time:</strong> {new Date(slot.start_time).toLocaleTimeString()} - {new Date(slot.end_time).toLocaleTimeString()}
          </p>
          {success && <p className="text-green-500">{success}</p>}
          {success && <p className="text-green-500">{error}</p>}
          <button onClick={(e) => bookSession(e)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">Confirm Session
          </button>
        </>
      ) : (
        <p>Slot not found</p>
      )}
    </div>
  )
}

export default SlotDetail;


