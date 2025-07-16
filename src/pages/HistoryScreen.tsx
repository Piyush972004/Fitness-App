
import React from 'react';
import { Calendar, Clock, Trophy, TrendingUp, Zap } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HistoryScreen: React.FC = () => {
  const { completedWorkouts } = useWorkout();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStats = () => {
    const totalWorkouts = completedWorkouts.length;
    const totalTime = completedWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalExercises = completedWorkouts.reduce((sum, workout) => sum + workout.exercisesCompleted, 0);
    
    const thisWeek = completedWorkouts.filter(workout => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workout.completedAt > weekAgo;
    }).length;

    return { totalWorkouts, totalTime, totalExercises, thisWeek };
  };

  const stats = getStats();

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...completedWorkouts].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Progress</h1>
          <p className="text-xl text-gray-300">Track your fitness journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Workouts</p>
                  <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Time</p>
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.totalTime)}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Exercises Done</p>
                  <p className="text-2xl font-bold text-white">{stats.totalExercises}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout History */}
        <Card className="bg-black/40 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Workout History
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your recent workout sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-white mb-2">No workouts yet</h3>
                <p className="text-gray-400 mb-6">Start your first workout to see your progress here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{workout.workoutName}</h4>
                        <p className="text-sm text-gray-400">{formatDate(workout.completedAt)}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-medium">{formatDuration(workout.duration)}</p>
                      <p className="text-sm text-gray-400">{workout.exercisesCompleted} exercises</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryScreen;
