const isZenithDocsQuestion = (question: string): boolean => {
  const keywords = [
    // Original keywords
    "zenithdocs",
    "zenith docs",
    "zenithsus",
    "features",
    "how to use",
    "this app",
    "this platform",
    "this tool",
    "what can you do",
    "what is this",
    "how does this work",
    "document types",
    "file types",
    "max size",
    "maximum size",
    "summary types",
    "upload",
    "supported formats",
    "supported file formats",
    "created by",
    "developed by",
    "document support",

    // About the Platform
    "what is zenithdocs",
    "who created zenithdocs",
    "who developed zenithdocs",
    "what is zenithsus",
    "what can you do on this platform",
    "how does this app work",
    "what is this tool used for",

    // Features
    "what are the features",
    "what features does this platform",
    "explain the features",
    "features available here",
    "features of zenithdocs",

    // Document Types & Limits
    "what file types are supported",
    "what document types can i upload",
    "what are the supported file formats",
    "what is the maximum size",
    "what is the max size",
    "max size allowed",
    "maximum size for",
    "allowed for documents",

    // Summaries
    "what summary types are available",
    "what kind of summaries",
    "summaries can zenithdocs generate",

    // Usage
    "how do i upload",
    "how to upload",
    "what can you do with uploaded files",
  ];

  return keywords.some((kw) => question.toLowerCase().includes(kw));
};

export default isZenithDocsQuestion;
