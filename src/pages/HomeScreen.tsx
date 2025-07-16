
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Zap } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useWorkout();

  const handleStartWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  const formatDuration = (exercises: any[]) => {
    const totalSeconds = exercises.reduce((sum, ex) => sum + ex.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ready to Sweat?</h1>
          <p className="text-xl text-gray-300">Choose your workout and let's get started!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className="bg-black/40 backdrop-blur-lg border-white/20 hover:bg-black/50 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{workout.icon}</div>
                  <div className="flex items-center space-x-1 text-purple-400">
                    <Clock size={16} />
                    <span className="text-sm">{formatDuration(workout.exercises)}</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-white">{workout.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {workout.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{workout.exercises.length} exercises</span>
                    <div className="flex items-center space-x-1">
                      <Zap size={14} />
                      <span>Beginner-Friendly</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Exercises:</h4>
                    <div className="flex flex-wrap gap-1">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <span
                          key={exercise.id}
                          className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full"
                        >
                          {exercise.name}
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="text-xs bg-gray-600/30 text-gray-300 px-2 py-1 rounded-full">
                          +{workout.exercises.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleStartWorkout(workout.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
