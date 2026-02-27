import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { events, familyMembers } from '../services/api';
import { Event, FamilyMember } from '../types';
import EventForm from '../components/EventForm';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events_, setEvents] = useState<Event[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, familyRes] = await Promise.all([
          events.getAll(),
          familyMembers.getAll(),
        ]);
        setEvents(eventsRes.data);
        setFamily(familyRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEvent = () => {
    setEditEvent(undefined);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await events.delete(eventId);
      // Refresh events
      const eventsRes = await events.getAll();
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSuccess = async () => {
    const eventsRes = await events.getAll();
    setEvents(eventsRes.data);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => events_.filter(e => 
    isSameDay(new Date(e.start_time), day)
  );

  const getMemberColor = (id?: string) => {
    const member = family.find(m => m.id === id);
    return member?.color || '#6366f1';
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary-400" />
          Calendar
        </h2>
        <button 
          onClick={handleAddEvent}
          className="p-2 bg-primary-500 rounded-lg"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-dark-border rounded-lg">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-dark-border rounded-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array(monthStart.getDay()).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-start p-1 transition-all ${
                  isToday(day) 
                    ? 'bg-primary-500/20 border-2 border-primary-500' 
                    : isSelected 
                      ? 'bg-primary-500/10 border border-primary-500'
                      : 'hover:bg-dark-border'
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday(day) ? 'text-primary-400' : 
                  !isSameMonth(day, currentDate) ? 'text-gray-600' : 'text-white'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getMemberColor(e.family_member_id) }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card rounded-2xl border border-dark-border p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          <div className="space-y-3">
            {getEventsForDay(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events scheduled</p>
            ) : (
              getEventsForDay(selectedDate).map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border group"
                >
                  <div 
                    className="w-2 h-full rounded-full"
                    style={{ backgroundColor: getMemberColor(event.family_member_id), minHeight: '40px' }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.all_day ? 'All day' : `${event.start_time} - ${event.end_time || ''}`}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="p-1.5 bg-dark-card rounded-lg hover:bg-dark-border"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1.5 bg-dark-card rounded-lg hover:bg-dark-border"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Event Form */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSuccess={handleFormSuccess}
        editEvent={editEvent}
        defaultDate={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : undefined}
      />
    </div>
  );
}
