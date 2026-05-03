import UserScore, {
  IUserScore,
  IUserScoreInput,
} from "../models/user-score.model.js";

export const createUserScore = async (data: IUserScoreInput) => {
  const userScore = await UserScore.create(data);
  return userScore;
};

export const getUserScoreById = async (id: string) => {
  const userScore = await UserScore.findById(id).lean<IUserScore>();
  return userScore;
};

export const getUserScoreByUserAndLearningSetId = async (
  userId: string,
  learningSetId: string,
) => {
  const userScore = await UserScore.findOne({
    userId,
    learningSetId,
  }).lean<IUserScore>();

  return userScore;
};

export const updateUserScore = async (
  id: string,
  data: Partial<IUserScoreInput>,
) => {
  const userScore = await UserScore.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: "after" },
  ).lean<IUserScore>();

  return userScore;
};

export const deleteUserScore = async (id: string) => {
  const userScore = await UserScore.findByIdAndDelete(id).lean<IUserScore>();

  return userScore;
};
