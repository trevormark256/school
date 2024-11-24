import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Tooltip } from 'react-tooltip';  // Import Tooltip from the new API
import './allcalender.css';  // Custom styles

const localizer = momentLocalizer(moment);

const YearlyCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/school/allevents');
      const formattedEvents = response.data.map(event => ({
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Custom event render component to show tooltips
  const EventComponent = ({ event }) => (
    <span data-tooltip-id={`tooltip-${event.title}`} data-tooltip-content={event.title}>
      {event.title.length > 10 ? `${event.title.substring(0, 7)}...` : event.title} {/* Truncate long titles */}
      <Tooltip id={`tooltip-${event.title}`} /> {/* Tooltip component */}
    </span>
  );

  // Array of months to display
  const months = Array.from({ length: 12 }, (_, i) => ({
    start: new Date(2024, i, 1),
    end: new Date(2024, i + 1, 0),
    name: moment().month(i).format('MMMM'), // Get month name
  }));

  return (
    <div className="container mt-5">
      <h2 className="text-center">Yearly Event Calendar</h2>
      <div className="calendar-grid">
        {months.map((month, index) => (
          <div key={index} className="month-container">
            <h3 className="text-center">{month.name}</h3>
            <Calendar
              localizer={localizer}
              events={events.filter(event => moment(event.start).month() === index)} // Filter events for the current month
              startAccessor="start"
              endAccessor="end"
              style={{ height: 300 }} // Adjust height as needed
              defaultView="month"
              views={['month']} // Show month view for each calendar
              date={new Date(2024, index, 1)} // Set the current date to the month being rendered
              toolbar={false} // Hide the toolbar for each calendar
              components={{
                event: EventComponent, // Use custom event component
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearlyCalendar;
