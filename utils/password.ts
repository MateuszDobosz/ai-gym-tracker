import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};
