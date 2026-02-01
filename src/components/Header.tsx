import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground">AI 换装</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            功能特点
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            使用教程
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            定价方案
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            登录
          </a>
          <a
            href="#"
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            免费试用
          </a>
        </div>
      </div>
    </header>
  );
}
