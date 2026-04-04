import UserScore, {
  IUserScore,
  IUserScoreInput,
} from "../models/user-score.js";

export const createUserScore = async (data: IUserScoreInput) => {
  const userScore = await UserScore.create(data);
  return userScore;
};

export const getUserScore = async (userId: string, learningSetId: string) => {
  const userScore = await UserScore.findOne({
    userId,
    learningSetId,
  }).lean<IUserScore>();

  return userScore;
};

export const updateUserScore = async (
  userId: string,
  learningSetId: string,
  data: Partial<IUserScoreInput>,
) => {
  const userScore = await UserScore.findOneAndUpdate(
    { userId, learningSetId },
    { $set: data },
    { returnDocument: "after" },
  ).lean<IUserScore>();

  return userScore;
};

export const deleteUserScore = async (
  userId: string,
  learningSetId: string,
) => {
  return await UserScore.findOneAndDelete({
    userId,
    learningSetId,
  }).lean<IUserScore>();
};
