#!/bin/sh

# Wait for the database to be ready
while ! pg_isready -h "$RDS_DB_SERVICE" -p "$RDS_DB_PORT" -U "$RDS_DB_USERNAME"; do
  echo "Waiting for database to be ready..."
  sleep 1
done

# Apply database migrations
python manage.py migrate

# Start the Django development server
exec python manage.py runserver 0.0.0.0:8000
