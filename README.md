# Stepful Software Engineering Take-home Challenge

## [Solution Outline](https://github.com/chrisrcoles/stepful/blob/main/docs/CHALLENGE.md)
## [Demo Walkthrough](https://drive.google.com/file/d/19qVhebu_wZMMowqkDiFcLj_XEfJdpO_9/view?usp=sharing)

## Setting up the Application 

1. Ensure you have docker and docker-compose installed on your system. You can get it [here](https://www.docker.com/products/docker-desktop) for windows & mac.

2. Clone the repository.
```shell
your-machine$> git clone https://github.com/chrisrcoles/stepful.git
```

3. Ensure you have the environment variables files set up in your `.env` and `.env.client` file in the root of the project.
```shell
your-machine$> cp .env.example .env
your-machine$> cp .env.client.example .env.client
```

3. Build the docker containers (`server-1`, `client-1`, `db-1`)
```shell
your-machine$> docker-compose up --build
```

4. Visit the client at `http://localhost:3000` and the server at `http://localhost:8000`.

## Helpful Commands to Run 
```sh
docker-compose up --build 
docker-compose down 
docker-compose down --rmi all --volumes --remove-orphans
docker-compose exec server /bin/bash
docker-compose exec client /bin/bash
docker-compose exec db /bin/bash
```

Your changes will automatically reflect in both the server and the client.

You can find your client at
http://localhost:3000
and your server API at
http://localhost:8000

## Running Tests

**Instructions were given to explicitly not create tests for this project.**

### Set Up Data 
1. User Setup: Upon docker-container creation, the database is automatically created and seeded with superuser data.
- See `server/scheduling/migrations/0002_create_superuser.sql` for the superuser data and login credentials.
- Log in to the admin panel at `http://localhost:8000/admin` with the superuser credentials to view the database.

2. Once logged in to the Django admin panel, you can view the database tables and data.
- Create a new user profile for a coach and student. These profiles will be used to create slots and book slots, respectively.

3. Create slots for the coach user profile.
- In the coaches' dashboard (add slot tab), users can create tutorial slots available to be booked  in the coaches dashboard at `http://localhost:3000/dashboard/coaches`.
- This can be done in the Django admin panel or by making a POST request to the `/slots` endpoint with the following payload:
```json
{
    "start_time": "2021-10-10T10:00:00Z",
    "end_time": "2021-10-10T12:00:00Z",
    "coach": 1
}
```

4. Book slots for the student user profile.
- In the students' dashboard (available slots tab), users can book slots for the student in the student dashboard at `http://localhost:3000/dashboard/students`.
- This can be done in the Django admin panel or by making a PUT request to the `/slots/<slot_id>` endpoint with the following payload:
```json
{
    "student_id": 2
}
```

5. Score and add notes to the slot.
- In the coaches' dashboard (upcoming slots tab), users can score and add notes to the slot in the coaches' dashboard at `http://localhost:3000/dashboard/coaches`.-
- This can be done in the Django admin panel or by making a PUT request to the `/slots/<slot_id>` endpoint with the following payload:
```json
{
    "satisfaction": 5,
    "notes": "Great session!"
}
```

### API Endpoints
Response
#### GET /api/v1/slots?student=<student_id>
```json
{
  "data": {
    "available_slots": [
      {
        "id": "3a44e19c-ed41-4a2f-8864-57df92c2662b",
        "coach_id": 1,
        "start_time": "2024-07-09T16:20:00Z",
        "end_time": "2024-07-09T18:20:00Z",
        "coach_name": "coach1",
        "coach_phone_number": "+12025557878"
      }
    ],
    "upcoming_coaching_slots": [],
    "upcoming_tutoring_slots": [
      {
        "id": "d34437de-0ef2-4563-9372-2412d0b0ce73",
        "coach_id": 1,
        "start_time": "2024-06-13T03:15:06Z",
        "end_time": "2024-06-13T03:15:17Z",
        "student_name": "student1",
        "coach_name": "coach1",
        "student_phone_number": "+12029987377", 
        "coach_phone_number": "+12025557878"
      }
    ],
    "past_coaching_slots": []
  }
}
```

#### GET /api/v1/slots?coach=<coach_id>
```json
{
  "data": {
    "available_slots": [
      {
        "id": "3a44e19c-ed41-4a2f-8864-57df92c2662b",
        "coach_id": 1,
        "start_time": "2024-07-09T16:20:00Z",
        "end_time": "2024-07-09T18:20:00Z",
        "coach_name": "coach1",
        "coach_phone_number": "+12025557878"
      }
    ],
    "upcoming_coaching_slots": [
      {
        "id": "c1891920-3dee-4c0a-ada8-3faaf333d5ec",
        "student_id": 2,
        "coach_id": 1,
        "start_time": "2024-07-06T16:11:00Z",
        "end_time": "2024-07-06T18:11:00Z",
        "student_name": "student1",
        "student_phone_number": "+12029987377"
      }
    ],
    "upcoming_tutoring_slots": [],
    "past_coaching_slots": [
      {
        "id": "d34437de-0ef2-4563-9372-2412d0b0ce73",
        "coach_id": 1,
        "start_time": "2024-06-13T03:15:06Z",
        "end_time": "2024-06-13T03:15:17Z",
        "student_name": "student1",
        "feedback_notes": "hi new notes, uppdated",
        "feedback_satisfaction": 1
      }
    ]
  }
}
```

#### POST /api/v1/slots
Request
```json
{
    "coach_id": 1,
    "start_time": "2024-06-27T04:00:00.000Z",
    "end_time": "2024-06-27T08:00:00.000Z"
}
```
Response
```json
{
    "id": "88300313-f2e6-43dd-8fb4-be548ae546f2",
    "coach_id": 1,
    "start_time": "2024-06-27T04:00:00.000Z",
    "end_time": "2024-06-27T08:00:00.000Z"
}
```

#### PUT /api/v1/slots/<slot_id>
Request
```json
{
    "student_id": 2,
    "notes": "New notes here",
    "satisfaction": 4
}
```
Response
```json
{
    "id": "3a44e19c-ed41-4a2f-8864-57df92c2662b",
    "coach_id": 1,
    "start_time": "2024-07-09T16:20:00Z",
    "end_time": "2024-07-09T18:20:00Z",
    "student_id": 2,
    "satisfaction": 4,
    "notes": "New notes here"
}
```


### Using the Dashboards
- The configuration settings for the dashboard can be found in the `client/utils/constants.js` file.
- Set `CURRENT_DASHBOARD_VIEW` to either `coach` or `student` to view the respective dashboard.
- Set `NEXT_PUBLIC_STUDENT_ID` to the student ID you want to mock authorization and authentication as.
- Set `NEXT_PUBLIC_COACH_ID` to the coach ID you want to to mock authorization and authentication as.


### Application Architecture

#### Documentation
- `docs/` - Documentation root

#### Backend Tools: Python 3.12.4/Django 5.0.6/PostgreSQL 13
- `server/` - Django project root
- `server/core` - Main Django app
- `server/scheduling` - Scheduling app
- `server/scheduling/models.py` - Database models
- `server/scheduling/views.py` - API views
- `servers/scheduling/migrations` - Database migrations
- `servers/scheduling/url.py` - API routes
- `server/manage.py` - Django CLI

#### Frontend Tools: React 17.0.2/Typescript/TailwindCSS
- `client/` - React project root
- `client/components` - React components
- `client/pages` - React pages
- `client/pages/dashboard` - Dashboard pages
- `client/pages/slots` - Slot Student and Coach Detail and Edit pages
- `client/src/utils` - Utility functions
- `styles` - CSS styles

#### Project Root
- `.env` - Environment variables for the server
- `.env.client` - Environment variables for the client
- `docker-compose.yml` - Docker-compose file
- `Dockerfile.server` - Dockerfile for the server
- `Dockerfile.client` - Dockerfile for the client
- `entrypoint.sh` - Docker entrypoint script that ensures the server reconnects to the db once it's up

### Assumptions
- Coaches can create slots for any time in the future, regardless if they conflict with current slots
- Students can create slots for any time in the future, regardless if they conflict with current slots 
- No login or authentication is required for the MVP
- No testing is required for the MVP

### Improvements
- Add authentication and authorization
- Deploy the application to a cloud provider
- Unit, integration and end to end tests
- CI/CD pipeline
- Improve API documentation
- Optimize how React app is loading data
- Add more features to the dashboard - most immediately as a student being able to see past booked slots

