import { AddTrainingForm } from "@/components/add-training-form";
import Link from "next/link";

export default function AddTrainingPage() {
  return (
    <>
      <div className=" min-h-screen max-w-6xl m-auto w-full py-20 prose">
        <div className="p-8">
          <h1 className="m-0">Training</h1>
          <h2>{new Date().toDateString()}</h2>
          <AddTrainingForm />
        </div>
      </div>
    </>
  );
}
