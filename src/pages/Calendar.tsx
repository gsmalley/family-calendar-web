import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { events, tasks, homework, meals, classes, familyMembers } from '../services/api';
import { Event, FamilyMember, Task, Homework, Meal, Class } from '../types';
import EventForm from '../components/EventForm';

interface CalendarItem {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'task' | 'homework' | 'meal' | 'class';
  family_member_id?: string;
  all_day?: boolean;
  start_time?: string;
  end_time?: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events_, setEvents] = useState<Event[]>([]);
  const [tasks_, setTasks] = useState<Task[]>([]);
  const [homework_, setHomework] = useState<Homework[]>([]);
  const [meals_, setMeals] = useState<Meal[]>([]);
  const [classes_, setClasses] = useState<Class[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);

  // Convert all items to a unified calendar items format
  const getCalendarItems = (): CalendarItem[] => {
    const items: CalendarItem[] = [];
    
    // Add events
    events_.forEach(event => {
      items.push({
        id: event.id,
        title: event.title,
        date: event.start_time.split('T')[0],
        type: 'event',
        family_member_id: event.family_member_id,
        all_day: event.all_day,
        start_time: event.start_time,
        end_time: event.end_time
      });
    });
    
    // Add tasks (using due_date)
    tasks_.forEach(task => {
      if (task.due_date) {
        items.push({
          id: task.id,
          title: task.title,
          date: task.due_date,
          type: 'task',
          family_member_id: task.family_member_id
        });
      }
    });
    
    // Add homework (using due_date)
    homework_.forEach(hw => {
      items.push({
        id: hw.id,
        title: `${hw.subject}: ${hw.description || ''}`,
        date: hw.due_date,
        type: 'homework',
        family_member_id: hw.family_member_id
      });
    });
    
    // Add meals (using date)
    meals_.forEach(meal => {
      items.push({
        id: meal.id,
        title: `${meal.meal_type}: ${meal.name}`,
        date: meal.date,
        type: 'meal',
        family_member_id: undefined
      });
    });
    
    // Classes don't have specific dates in the schema, so we'll skip them
    // or could add them based on schedule if needed
    
    return items;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, tasksRes, homeworkRes, mealsRes, classesRes, familyRes] = await Promise.all([
          events.getAll(),
          tasks.getAll(),
          homework.getAll(),
          meals.getAll(),
          classes.getAll(),
          familyMembers.getAll(),
        ]);
        setEvents(eventsRes.data);
        setTasks(tasksRes.data);
        setHomework(homeworkRes.data);
        setMeals(mealsRes.data);
        setClasses(classesRes.data);
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

  const getItemsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return getCalendarItems().filter(item => item.date === dayStr);
  };

  const getMemberColor = (id?: string) => {
    const member = family.find(m => m.id === id);
    return member?.color || '#6366f1';
  };

  // Get color based on item type
  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'event': return '#3b82f6';    // blue
      case 'task': return '#22c55e';     // green
      case 'homework': return '#f59e0b'; // amber
      case 'meal': return '#ec4899';     // pink
      default: return '#6366f1';
    }
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
            const dayItems = getItemsForDay(day);
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
                {dayItems.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {dayItems.slice(0, 3).map((item, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.family_member_id ? getMemberColor(item.family_member_id) : getItemTypeColor(item.type) }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Items */}
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
            {getItemsForDay(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items scheduled</p>
            ) : (
              getItemsForDay(selectedDate).map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border group"
                >
                  <div 
                    className="w-2 h-full rounded-full"
                    style={{ backgroundColor: item.family_member_id ? getMemberColor(item.family_member_id) : getItemTypeColor(item.type), minHeight: '40px' }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.type === 'event' && (item.all_day ? 'All day' : `${item.start_time?.split('T')[1] || ''} - ${item.end_time?.split('T')[1] || ''}`)}
                      {item.type === 'task' && `Task`}
                      {item.type === 'homework' && `Homework`}
                      {item.type === 'meal' && `Meal`}
                      {item.type === 'class' && `Class`}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-dark-border text-gray-400 capitalize">
                    {item.type}
                  </span>
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
