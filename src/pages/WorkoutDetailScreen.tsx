
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, CheckCircle, ArrowLeft } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const WorkoutDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, completeWorkout } = useWorkout();
  const { toast } = useToast();
  
  const workout = workouts.find(w => w.id === id);
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (workout && !isStarted) {
      setTimeRemaining(workout.exercises[0].duration);
    }
  }, [workout, isStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      handleNextExercise();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleStart = () => {
    setIsStarted(true);
    setIsRunning(true);
    setWorkoutStartTime(new Date());
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleNextExercise = () => {
    if (!workout) return;
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workout.exercises[nextIndex].duration);
      setIsRunning(true);
    } else {
      handleWorkoutComplete();
    }
  };

  const handleWorkoutComplete = () => {
    if (!workout || !workoutStartTime) return;
    
    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000);
    
    completeWorkout(workout.id, totalDuration, workout.exercises.length);
    
    toast({
      title: "Workout Complete! 🎉",
      description: `Great job completing ${workout.name}!`,
    });
    
    navigate('/history');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!workout) return 0;
    return ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  };

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="bg-black/40 backdrop-blur-lg border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-white">Workout not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Workouts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Progress */}
        <Card className="bg-black/40 backdrop-blur-lg border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
              <span>{Math.round(getProgress())}% Complete</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <Card className="bg-black/40 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">
              {currentExercise.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">{currentExercise.description}</p>
            
            {/* Timer */}
            <div className="mb-8">
              <div className="text-6xl font-bold text-white mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-gray-400">
                {isRunning ? 'Time remaining' : isStarted ? 'Paused' : 'Ready to start'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isStarted ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Workout
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isRunning ? 'Pause' : 'Resume'}
                  </Button>
                  
                  <Button
                    onClick={handleNextExercise}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {currentExerciseIndex === workout.exercises.length - 1 ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Finish
                      </>
                    ) : (
                      <>
                        <SkipForward className="mr-2 h-5 w-5" />
                        Next
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="bg-black/40 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    index === currentExerciseIndex
                      ? 'bg-purple-600/30 border border-purple-600/50'
                      : index < currentExerciseIndex
                      ? 'bg-green-600/20 border border-green-600/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < currentExerciseIndex
                        ? 'bg-green-600 text-white'
                        : index === currentExerciseIndex
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {index < currentExerciseIndex ? '✓' : index + 1}
                    </div>
                    <span className={index < currentExerciseIndex ? 'text-green-300' : 'text-white'}>
                      {exercise.name}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {formatTime(exercise.duration)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutDetailScreen;
