const subtypePrefixMap: Record<string, string> = {
  "vnd.openxmlformats-officedocument.wordprocessingml.document": "application",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "application",
  msword: "application",
  pdf: "application",
  plain: "text",
};

export default subtypePrefixMap;
