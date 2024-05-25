"use client";

import { findOrCreateSafeExercise } from "@/server/actions/exercies.action";
import { createSafeExercisePerformance } from "@/server/actions/exercisePerformances.action";
import {
  createSafeWorkoutSession,
  finishSafeWorkoutSession,
} from "@/server/actions/workout-sessions.action";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const AddTrainingForm = () => {
  const router = useRouter();
  const addWorkoutSessionAction = useAction(createSafeWorkoutSession, {
    onSuccess(data) {
      setWorkoutId(data.id);
    },
    onError(error) {
      console.log(error);
    },
  });
  const findOrAddExerciseAction = useAction(findOrCreateSafeExercise, {
    onSuccess(data) {
      setExerciseId(data.id);
    },
    onError(error) {
      console.log(error);
    },
  });
  const addExercisePerformanceAction = useAction(
    createSafeExercisePerformance,
    {
      onSuccess(data) {
        setExerciseReps(0);
        setExerciseWeight(0);
      },
      onError(error) {
        console.log(error);
      },
    },
  );

  const finishWorkoutSessionAction = useAction(finishSafeWorkoutSession, {
    onSuccess(data) {
      router.push(`/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  const session = useSession();
  const [workoutId, setWorkoutId] = useState<string>();
  const [exerciseId, setExerciseId] = useState<string>();
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseWeight, setExerciseWeight] = useState(0);
  const [exerciseReps, setExerciseReps] = useState(0);

  const handleAddWorkoutSession = () => {
    addWorkoutSessionAction.execute({ userId: session.data.user.id });
  };

  const handleFindOrCreateExercise = () => {
    findOrAddExerciseAction.execute({ name: exerciseName });
  };

  const handleFinishOfSeries = () => {
    addExercisePerformanceAction.execute({
      exerciseId,
      reps: exerciseReps,
      weight: exerciseWeight,
      sessionId: workoutId,
    });
  };

  const handleFinishOfWorkout = () => {
    finishWorkoutSessionAction.execute({ sessionId: workoutId });
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className="btn btn-primary"
        disabled={
          addWorkoutSessionAction.status === "executing" ||
          addWorkoutSessionAction.status === "hasSucceeded"
        }
        onClick={() => handleAddWorkoutSession()}
      >
        {addWorkoutSessionAction.status === "hasSucceeded"
          ? "Training Added!"
          : "Start Training"}
      </button>
      {workoutId && (
        <>
          <div className="join">
            <input
              className="input input-bordered join-item"
              placeholder="Exercise"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              disabled={!!exerciseId}
            />
            <button
              className="btn btn-primary join-item rounded-r-full"
              onClick={() => handleFindOrCreateExercise()}
              disabled={!!exerciseId}
            >
              Add!
            </button>
            <button
              className="btn join-item rounded-r-full btn-error"
              onClick={() => {
                setExerciseId("");
                setExerciseName("");
              }}
              disabled={!exerciseId}
            >
              End exercise
            </button>
          </div>
          {exerciseId && (
            <>
              <h3>Selected exercise: {exerciseName}</h3>
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  placeholder="Exercise"
                  value={exerciseWeight}
                  onChange={(e) => setExerciseWeight(Number(e.target.value))}
                  type="number"
                />
                <button className="btn join-item rounded-r-full">
                  Weight in KG
                </button>
              </div>
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  placeholder="Exercise"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(Number(e.target.value))}
                  type="number"
                />
                <button className="btn join-item rounded-r-full">
                  Number of repeats
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleFinishOfSeries()}
              >
                {" "}
                Add results
              </button>
            </>
          )}
        </>
      )}
      <button
        className="btn btn-error"
        disabled={!workoutId}
        onClick={() => handleFinishOfWorkout()}
      >
        {/* Finish */}
        {finishWorkoutSessionAction.status === "idle" ? (
          "Finish training!"
        ) : (
          <span className="loading loading-dots loading-xs"></span>
        )}
      </button>
    </div>
  );
};
