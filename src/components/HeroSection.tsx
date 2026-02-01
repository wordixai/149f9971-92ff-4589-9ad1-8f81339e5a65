import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI 驱动的智能换装体验</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">用 AI 重新定义</span>
          <br />
          <span className="text-gradient animate-gradient">你的时尚风格</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          上传你的照片，选择心仪的服装风格，让 AI 为你呈现完美的换装效果。
          无需试穿，即刻预览无限可能。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-sm transition-all duration-300 px-8"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            开始体验
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-card hover:border-primary/50 transition-all duration-300"
          >
            了解更多
          </Button>
        </div>
      </div>
    </section>
  );
}
