import RefreshToken, { IRefreshToken } from "../models/refreshToken.model.js";

/**
 * Creates a new refresh token document with the given data.
 * @param {Partial<IRefreshToken>} data - The data to create the refresh token with.
 * @returns {Promise<IRefreshToken>} The created refresh token document.
 */
export const createRefreshToken = async (data: Partial<IRefreshToken>) => {
  const refreshToken = await RefreshToken.create(data);
  return refreshToken;
};

/**
 * Retrieves a refresh token by its token.
 * @param {string} token - Refresh token
 * @returns {Promise<IRefreshToken | null>} Retrieved refresh token if found, null otherwise
 */
export const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).lean();
  return refreshToken;
};

/**
 * Deletes a refresh token by its ID.
 * @param {string} id - Refresh token ID
 * @returns {Promise<IRefreshToken | null>} Deleted refresh token if found, null otherwise
 */
export const deleteTokenById = async (id: string) => {
  const refreshToken = await RefreshToken.findByIdAndDelete(id).lean();
  return refreshToken;
};

/**
 * Deletes all refresh tokens associated with a given user ID.
 * @param {string} userId - User ID
 * @returns {Promise<IRefreshToken[]>} An array of the deleted refresh tokens
 */
export const deleteTokensByUserId = async (userId: string) => {
  const refreshToken = await RefreshToken.deleteMany({ userId }).lean();
  return refreshToken;
};

/**
 * Deletes a refresh token by user ID and token.
 * @param {string} userId - User ID
 * @param {string} token - Refresh token
 * @returns {Promise<IRefreshToken | null>} Deleted refresh token if found, null otherwise
 */
export const deleteTokenByUserAndToken = async (
  userId: string,
  token: string,
) => {
  const refreshToken = await RefreshToken.findOneAndDelete({ userId, token });
  return refreshToken;
};
