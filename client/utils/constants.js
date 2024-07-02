const CURRENT_DASHBOARD_VIEW = 'coach'
// const CURRENT_DASHBOARD_VIEW = 'student'

const ID = CURRENT_DASHBOARD_VIEW === 'student' ?
  process.env.NEXT_PUBLIC_STUDENT_ID
  :
  process.env.NEXT_PUBLIC_COACH_ID
;

const AVAILABLE = 'available'
const PAST = 'past'
const UPCOMING = 'upcoming'
const ADD = 'add'
const COACHES = 'coaches'
const STUDENTS = 'students'

const API_URL = `http://localhost:8000/api`
const API_VERSION = `/v1`

const MIN_DATE_CONSTRAINT = false

export {
  CURRENT_DASHBOARD_VIEW,
  ID,
  AVAILABLE,
  PAST,
  UPCOMING,
  ADD,
  COACHES,
  STUDENTS,
  MIN_DATE_CONSTRAINT,
  API_URL,
  API_VERSION
}