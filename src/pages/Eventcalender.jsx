import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.css';  // Custom CSS for tooltips and events
import axios from 'axios'; // For making API calls

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventIcon, setEventIcon] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  
  // Available icons
  const icons = [
    { value: '🎉', label: 'Celebration' },
    { value: '📅', label: 'Meeting' },
    { value: '📚', label: 'Study' },
    { value: '🏅', label: 'Achievement' }
  ];

  // Fetch events from API on component load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/school/allevents');
      const formattedEvents = response.data.map(event => ({
        title: event.title,
        date: event.date,
        icon: event.icon,
      }));
      setEvents(formattedEvents);
      console.log("all events", formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle form submission to add events
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (eventTitle && eventDate && eventIcon) {
      try {
        await axios.post('http://localhost:5000/school/addevent', {
          title: eventTitle,
          date: eventDate,
          icon: eventIcon
        });
        fetchEvents();
        setEventTitle('');
        setEventDate('');
        setEventIcon('');
      } catch (error) {
        console.error('Error adding event:', error);
      }
    } else {
      alert('Please fill in all the fields');
    }
  };

  // Function to handle showing the tooltip on hover
  const handleEventMouseEnter = (info) => {
    const eventTitle = info.event.title;
    const eventIcon = info.event.extendedProps.icon; // Get the icon from the event props
    const rect = info.el.getBoundingClientRect();
    setTooltipContent(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>{eventIcon}</span>
        <span>{eventTitle}</span>
      </div>
    );
    setTooltipPosition({
      top: rect.top + window.scrollY - 30, // Adjust vertical position if necessary
      left: rect.left + window.scrollX,
    });
  };

  // Function to render event icons and title
  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-content">
       <div className="event-title">{eventInfo.event.title}</div>
        <span style={{ fontSize: '1.5rem', marginLeft: '1px' }}>
          {eventInfo.event.extendedProps.icon}
        </span>
      </div>
    );
  };


  const handleEventMouseLeave = () => {
    setTooltipContent('');  // Clear the tooltip content
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center">Add Events to Calendar</h2>

      {/* Form to add events */}
      <form className="mb-4" onSubmit={handleAddEvent}>
        <div className="form-group mb-3">
          <label>Event Title</label>
          <input 
            type="text" 
            className="form-control" 
            value={eventTitle} 
            onChange={(e) => setEventTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group mb-3">
          <label>Event Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={eventDate} 
            onChange={(e) => setEventDate(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group mb-3">
          <label>Event Icon</label>
          <select 
            className="form-control" 
            value={eventIcon} 
            onChange={(e) => setEventIcon(e.target.value)} 
            required
          >
            <option value="">Select an Icon</option>
            {icons.map(icon => (
              <option key={icon.value} value={icon.value}>{icon.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>

      {/* Calendar Display */}
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          eventMouseEnter={handleEventMouseEnter}
          eventContent={renderEventContent}
          eventMouseLeave={handleEventMouseLeave}

        />
      </div>

      {/* Tooltip for event hover */}
      {tooltipContent && (
        <div 
          className="calendar-tooltip" 
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
