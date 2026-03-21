import { createLimiter } from "./express-limiter.js";

export const rateLimiters = {
  // Auth
  login: createLimiter(5, "10 m", "login"),
  register: createLimiter(3, "10 m", "register"),
  refreshToken: createLimiter(20, "1 m", "refreshToken"),
  logout: createLimiter(30, "1 m", "logout"),
  oauthLogin: createLimiter(10, "1 m", "oauthLogin"),
  fetchMe: createLimiter(30, "1 m", "fetchMe"),

  // User read
  fetchUsersAdmin: createLimiter(10, "1 m", "fetchUsersAdmin"),
  fetchUser: createLimiter(30, "1 m", "fetchUser"),

  // User write
  updateUser: createLimiter(10, "1 m", "updateUser"),
  deleteUser: createLimiter(5, "1 m", "deleteUser"),

  // Dashboard
  fetchDashboardOverview: createLimiter(15, "1 m", "fetchDashboardOverview"),

  // Document read
  fetchDocuments: createLimiter(20, "1 m", "fetchDocuments"),
  fetchSingleDocument: createLimiter(30, "1 m", "fetchSingleDocument"),
  getDocumentsByUserPaginated: createLimiter(
    15,
    "1 m",
    "getDocumentsByUserPaginated",
  ),

  // Document write
  uploadDocument: createLimiter(5, "1 m", "uploadDocument"),
  reprocessDocument: createLimiter(5, "1 m", "reprocessDocument"),
  updateDocument: createLimiter(10, "1 m", "updateDocument"),
  deleteDocument: createLimiter(5, "1 m", "deleteDocument"),

  // Summary read
  fetchSummary: createLimiter(30, "1 m", "fetchSummary"),
  getSummaryByDocumentPaginated: createLimiter(
    15,
    "1 m",
    "getSummaryByDocumentPaginated",
  ),
  getSummaryByUserPaginated: createLimiter(
    15,
    "1 m",
    "getSummaryByUserPaginated",
  ),

  // Summary write
  createSummary: createLimiter(5, "1 m", "createSummary"),
  updateSummary: createLimiter(10, "1 m", "updateSummary"),
  deleteSummary: createLimiter(5, "1 m", "deleteSummary"),

  // Folder read
  fetchFoldersAdmin: createLimiter(10, "1 m", "fetchFoldersAdmin"),
  getFoldersByUserPaginated: createLimiter(
    15,
    "1 m",
    "getFoldersByUserPaginated",
  ),
  getFoldersByUser: createLimiter(20, "1 m", "getFoldersByUser"),
  fetchFolder: createLimiter(30, "1 m", "fetchFolder"), // optional

  // Folder write
  createFolder: createLimiter(10, "1 m", "createFolder"),
  updateFolder: createLimiter(10, "1 m", "updateFolder"),
  deleteFolder: createLimiter(5, "1 m", "deleteFolder"),

  // Usage read
  fetchUsage: createLimiter(20, "1 m", "fetchUsage"),
  fetchUsageAdmin: createLimiter(10, "1 m", "fetchUsageAdmin"),
  getUsageByUserAndMonth: createLimiter(15, "1 m", "getUsageByUserAndMonth"),
  getLastSixMonthsUsage: createLimiter(15, "1 m", "getLastSixMonthsUsage"),

  // Usage write
  createUsage: createLimiter(20, "1 m", "createUsage"),
  updateUsage: createLimiter(10, "1 m", "updateUsage"),
  deleteUsage: createLimiter(5, "1 m", "deleteUsage"),
  deleteUsageByUser: createLimiter(5, "1 m", "deleteUsageByUser"),

  // Chat read
  getChatByDocument: createLimiter(15, "1 m", "getChatByDocument"),
  getChatByUserPaginated: createLimiter(15, "1 m", "getChatByUserPaginated"),

  // Chat write
  initChatForDocument: createLimiter(5, "1 m", "initChatForDocument"),
  createChat: createLimiter(10, "1 m", "createChat"),

  // Message read
  getMessagesByChatPaginated: createLimiter(
    15,
    "1 m",
    "getMessagesByChatPaginated",
  ),

  // Message write
  deleteMessagesByChatId: createLimiter(5, "1 m", "deleteMessagesByChatId"),

  // Global Chat Read
  getGlobalChatByUser: createLimiter(15, "1 m", "getGlobalChatByUser"),

  // Global Chat Write
  initGlobalChat: createLimiter(5, "1 m", "initGlobalChat"),
  createGlobalChat: createLimiter(10, "1 m", "createGlobalChat"),
  deleteGlobalChatByUser: createLimiter(5, "1 m", "deleteGlobalChatByUser"),

  // Global Message Read
  getGlobalMessagesByChatPaginated: createLimiter(
    15,
    "1 m",
    "getGlobalMessagesByChatPaginated",
  ),

  // Global Message Write
  deleteGlobalMessagesByChatAndUser: createLimiter(
    5,
    "1 m",
    "deleteGlobalMessagesByChatAndUser",
  ),

  // Document Share Read
  getDocumentShareByToken: createLimiter(15, "1 m", "getDocumentShareByToken"),
  getDocumentShareById: createLimiter(15, "1 m", "getDocumentShareById"),
  getDocumentSharesByUserIdPaginated: createLimiter(
    15,
    "1 m",
    "getDocumentSharesByUserIdPaginated",
  ),

  // Document Share Write
  createDocumentShare: createLimiter(10, "1 m", "createDocumentShare"),
  updateDocumentShare: createLimiter(10, "1 m", "updateDocumentShare"),
  deleteDocumentShare: createLimiter(5, "1 m", "deleteDocumentShare"),
};
