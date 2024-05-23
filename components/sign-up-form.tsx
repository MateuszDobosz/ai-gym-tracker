"use client";

import { signUpSchema } from "@/lib/zod";
import { createSafeUser } from "@/server/actions/users.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import * as z from "zod";

export const SignUpForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { execute, status, result } = useAction(createSafeUser, {
    onSuccess(data) {
      router.push("/api/auth/signin");
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    execute(values);
  }

  return (
    <div className="  min-h-80">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-control items-center gap-3 w-full"
      >
        <label className="label">
          <span className="label-text">Your Email</span>
        </label>
        <label className="input-group">
          <input
            type="text"
            className="input input-bordered"
            {...register("email", { required: true })}
          />
        </label>

        <label className="label">
          <span className="label-text">Your password</span>
        </label>
        <label className="input-group">
          <input
            type="password"
            className="input input-bordered"
            {...register("password", { required: true })}
          />
        </label>

        <button className="btn btn-primary" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
};
