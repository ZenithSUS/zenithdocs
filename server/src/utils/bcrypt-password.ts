import bycrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = bycrypt.genSaltSync(saltRounds);
  const hash = bycrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bycrypt.compare(password, hash);
};
