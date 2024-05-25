import { getExercisePerformance } from "@/server/actions/exercisePerformances.action";

export default async function TrainingPage({
  params,
}: {
  params: { id: string };
}) {
  const training = await getExercisePerformance(params.id);

  return (
    <div className="max-w-screen-xl m-auto min-h-screen py-20">
      <div className="chat chat-start py-28 max-w-screen-xl m-auto">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://img6.arthub.ai/64eca2b6-b8a0.webp"
            />
          </div>
        </div>
        <div className="chat-bubble">{training.assessment}</div>
      </div>

      <div className="stats shadow w-full">
        <div className="stat place-items-center">
          <div className="stat-title">Score</div>
          <div className="stat-value">{training.points}/100</div>
          <div className="stat-desc">AI evaluation of your training</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Time to rest</div>
          <div className="stat-value text-secondary">
            {training.hoursToRest}h
          </div>
          <div className="stat-desc text-secondary">
            Time you should set aside for rest
          </div>
        </div>
      </div>
    </div>
  );
}
