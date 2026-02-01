import { useState, useRef } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { ImageUploader } from "../components/ImageUploader";
import { StyleSelector } from "../components/StyleSelector";
import { ResultPreview } from "../components/ResultPreview";

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = () => {
    if (uploadedImage && selectedStyle) {
      setIsProcessing(true);
      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Header />

      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection onGetStarted={scrollToEditor} />
      </div>

      {/* Editor Section */}
      <section ref={editorRef} className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Style Selection */}
          <div className="space-y-8">
            <ImageUploader
              onImageSelect={setUploadedImage}
              currentImage={uploadedImage}
            />
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
            />
          </div>

          {/* Right Column - Result Preview */}
          <div>
            <ResultPreview
              originalImage={uploadedImage}
              selectedStyle={selectedStyle}
              isProcessing={isProcessing}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/50">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-gradient">为什么选择我们</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI 智能换装",
              description: "采用先进的深度学习算法，精准识别人体姿态，实现自然逼真的换装效果",
              icon: "🤖"
            },
            {
              title: "多样风格选择",
              description: "从休闲到正装，从运动到晚宴，涵盖各种场合的服装风格供你选择",
              icon: "👗"
            },
            {
              title: "即时预览",
              description: "无需漫长等待，几秒钟内即可看到换装效果，轻松找到最适合你的风格",
              icon: "⚡"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center animate-fade-up glow-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 AI 换装. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}
