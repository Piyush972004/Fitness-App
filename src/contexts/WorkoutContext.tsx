
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  icon: string;
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  workoutName: string;
  completedAt: Date;
  duration: number; // total time in seconds
  exercisesCompleted: number;
}

interface WorkoutContextType {
  workouts: Workout[];
  completedWorkouts: CompletedWorkout[];
  completeWorkout: (workoutId: string, duration: number, exercisesCompleted: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

const PREDEFINED_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Full Body Blast',
    description: 'Complete full-body workout targeting all major muscle groups',
    icon: '💪',
    exercises: [
      { id: '1', name: 'Jumping Jacks', duration: 30, description: 'Warm up with jumping jacks' },
      { id: '2', name: 'Push-ups', duration: 45, description: 'Standard push-ups for upper body' },
      { id: '3', name: 'Squats', duration: 45, description: 'Bodyweight squats for legs' },
      { id: '4', name: 'Plank', duration: 60, description: 'Hold plank position for core' },
      { id: '5', name: 'Burpees', duration: 30, description: 'Full body explosive movement' },
      { id: '6', name: 'Mountain Climbers', duration: 30, description: 'Cardio and core exercise' },
    ],
  },
  {
    id: '2',
    name: 'Cardio Burn',
    description: 'High-intensity cardio workout to burn calories fast',
    icon: '🔥',
    exercises: [
      { id: '7', name: 'High Knees', duration: 30, description: 'Run in place with high knees' },
      { id: '8', name: 'Jumping Jacks', duration: 45, description: 'Classic cardio exercise' },
      { id: '9', name: 'Butt Kicks', duration: 30, description: 'Kick heels to glutes' },
      { id: '10', name: 'Burpees', duration: 45, description: 'Full body cardio blast' },
      { id: '11', name: 'Sprint in Place', duration: 30, description: 'Maximum intensity running' },
      { id: '12', name: 'Star Jumps', duration: 30, description: 'Explosive star-shaped jumps' },
    ],
  },
  {
    id: '3',
    name: 'Strength Boost',
    description: 'Build muscle and strength with bodyweight exercises',
    icon: '🏋️',
    exercises: [
      { id: '13', name: 'Push-ups', duration: 60, description: 'Upper body strength building' },
      { id: '14', name: 'Squats', duration: 60, description: 'Lower body power' },
      { id: '15', name: 'Lunges', duration: 45, description: 'Single leg strength' },
      { id: '16', name: 'Pike Push-ups', duration: 45, description: 'Shoulder focused push-ups' },
      { id: '17', name: 'Wall Sit', duration: 60, description: 'Isometric leg exercise' },
      { id: '18', name: 'Tricep Dips', duration: 45, description: 'Target tricep muscles' },
    ],
  },
];

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts] = useState<Workout[]>(PREDEFINED_WORKOUTS);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    // Load completed workouts from localStorage
    const saved = localStorage.getItem('completedWorkouts');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      const withDates = parsed.map((cw: any) => ({
        ...cw,
        completedAt: new Date(cw.completedAt),
      }));
      setCompletedWorkouts(withDates);
    }
  }, []);

  const completeWorkout = (workoutId: string, duration: number, exercisesCompleted: number) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const completedWorkout: CompletedWorkout = {
      id: Date.now().toString(),
      workoutId,
      workoutName: workout.name,
      completedAt: new Date(),
      duration,
      exercisesCompleted,
    };

    const updated = [...completedWorkouts, completedWorkout];
    setCompletedWorkouts(updated);
    localStorage.setItem('completedWorkouts', JSON.stringify(updated));
  };

  return (
    <WorkoutContext.Provider value={{ workouts, completedWorkouts, completeWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
