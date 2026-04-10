import {
  MessageSquare,
  FileText,
  HardDrive,
  Brain,
  MessageCircle,
  Sparkles,
  FileSearch,
  Share,
} from "lucide-react";

function FeatureList() {
  const features = [
    {
      icon: MessageSquare,
      title: "100 messages/day",
      desc: "Daily AI conversations",
    },
    {
      icon: FileText,
      title: "10 docs/month",
      desc: "Upload & analyze files",
    },
    {
      icon: HardDrive,
      title: "50 MB storage",
      desc: "Secure cloud storage",
    },
    {
      icon: Brain,
      title: "AI learning sets",
      desc: "Generate study material",
    },
    {
      icon: MessageCircle,
      title: "Document chat",
      desc: "Ask questions instantly",
    },
    {
      icon: FileSearch,
      title: "Insight extraction",
      desc: "Key data auto-detected",
    },
    {
      icon: Sparkles,
      title: "AI summaries",
      desc: "Multiple summary styles",
    },
    {
      icon: Share,
      title: "Sharable links",
      desc: "Share your content",
    },
  ];

  return (
    <div className="relative z-10 flex-1 flex flex-col justify-center px-4 pb-5">
      <div className="text-[10px] tracking-[0.2em] text-primary mb-5 font-sans">
        FREE PLAN INCLUDES
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 border border-white/6 rounded-sm bg-white/2 hover:border-primary/20 hover:bg-primary/3 transition"
            >
              <Icon
                size={16}
                className="text-primary mt-0.5 shrink-0 opacity-90"
              />

              <div className="leading-tight">
                <div className="text-[13px] font-serif">{item.title}</div>
                <div className="text-[11px] text-text/40 font-sans">
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[12px] text-text/30 font-sans leading-[1.6] border-t border-text/8 pt-4">
        Upgrade anytime for higher limits, more storage, and advanced features.
      </p>
    </div>
  );
}

export default FeatureList;
