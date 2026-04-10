import { BookOpen, Brain, Lightbulb, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

function LearninSetEmpy() {
  const router = useRouter();

  return (
    <div className="border border-white/8 rounded-lg px-6 py-12 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-serif text-text/80 mb-2">
        No Learning Sets Yet
      </h3>

      {/* Description */}
      <p className="text-[13px] text-text/50 font-sans max-w-md mx-auto leading-relaxed mb-6">
        You haven&apos;t created any learning sets yet. Build your first set to
        start studying smarter with AI-powered tools.
      </p>

      {/* How it works */}
      <div className="max-w-2xl mx-auto mb-6">
        <h4 className="text-[10px] tracking-[0.15em] text-primary mb-4 font-sans">
          HOW TO GET STARTED
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              step: "1",
              icon: <Plus className="w-4 h-4" color="#E0B530" />,
              title: "Create",
              description: "Create a new learning set",
            },
            {
              step: "2",
              icon: <Brain className="w-4 h-4" color="#E0B530" />,
              title: "Study",
              description: "Add cards & study material",
            },
            {
              step: "3",
              icon: <Sparkles className="w-4 h-4" color="#E0B530" />,
              title: "Master",
              description: "Track your progress",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-primary/30 hover:bg-white/8 transition-all duration-200"
            >
              <div className="text-[9px] tracking-[0.12em] text-primary/50 mb-2 font-sans">
                STEP {item.step}
              </div>

              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                {item.icon}
              </div>
              <h5 className="text-[13px] font-serif text-text/90 mb-1">
                {item.title}
              </h5>
              <p className="text-[11px] text-text/40 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-5">
        <button
          onClick={() => router.push("/dashboard/learning-sets")}
          className="px-6 py-2 bg-primary text-black text-[11px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          CREATE LEARNING SET
        </button>
      </div>

      {/* Info box */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg max-w-lg mx-auto">
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5">
            <Lightbulb size={16} color="#C9A227" />
          </span>
          <div className="text-left flex-1">
            <p className="text-[11px] text-text/60 font-sans leading-[1.6]">
              <strong className="text-text/80">Pro Tip:</strong> Learning sets
              with AI-generated flashcards help you retain information up to 3×
              faster than passive reading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearninSetEmpy;
