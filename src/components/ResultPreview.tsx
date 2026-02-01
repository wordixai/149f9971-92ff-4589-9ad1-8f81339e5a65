import { useState, useEffect } from "react";
import { Wand2, Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface ResultPreviewProps {
  originalImage: string | null;
  selectedStyle: string | null;
  isProcessing: boolean;
  onGenerate: () => void;
}

// Mock generated images for demo
const mockResults: Record<string, string> = {
  casual: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop",
  formal: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop",
  sporty: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=700&fit=crop",
  vintage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
  streetwear: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=700&fit=crop",
  elegant: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=700&fit=crop",
};

export function ResultPreview({ originalImage, selectedStyle, isProcessing, onGenerate }: ResultPreviewProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isProcessing && selectedStyle) {
      // Simulate AI generation
      const timer = setTimeout(() => {
        setGeneratedImage(mockResults[selectedStyle] || mockResults.casual);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, selectedStyle]);

  const canGenerate = originalImage && selectedStyle && !isProcessing;

  const handleDownload = () => {
    if (generatedImage) {
      window.open(generatedImage, '_blank');
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-primary" />
        AI 换装效果
      </h3>

      <div className="glass-card p-6">
        {!originalImage || !selectedStyle ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Wand2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {!originalImage ? "请先上传照片" : "请选择服装风格"}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              完成后点击生成按钮查看效果
            </p>
          </div>
        ) : isProcessing ? (
          <div className="h-80 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <Wand2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-foreground font-medium mt-6">AI 正在生成中...</p>
            <p className="text-muted-foreground text-sm mt-2">请稍候，这可能需要几秒钟</p>
          </div>
        ) : generatedImage ? (
          <div className="animate-scale-in">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-center">原图</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-center">换装效果</p>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onGenerate}
                variant="outline"
                className="flex-1 border-border/50 hover:border-primary/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新生成
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                下载图片
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-6">已准备就绪，点击生成查看效果</p>
            <Button
              onClick={onGenerate}
              disabled={!canGenerate}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-sm transition-all duration-300 px-8"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              生成换装效果
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
