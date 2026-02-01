import { useState } from "react";
import { Wand2, Download, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface ResultPreviewProps {
  originalImage: string | null;
  selectedStyle: string | null;
  clothingImage: string | null;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export function ResultPreview({
  originalImage,
  selectedStyle,
  clothingImage,
  isProcessing,
  onProcessingChange,
}: ResultPreviewProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = originalImage && clothingImage && !isProcessing;

  const handleGenerate = async () => {
    if (!originalImage || !clothingImage) return;

    setError(null);
    onProcessingChange(true);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('virtual-try-on', {
        body: {
          personImage: originalImage,
          clothingImage: clothingImage,
        }
      });

      if (invokeError) {
        throw invokeError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.image) {
        setGeneratedImage(data.image);
        toast.success("换装生成成功！");
      } else {
        throw new Error("未能生成换装图片，请重试");
      }
    } catch (err) {
      console.error("Virtual try-on error:", err);
      const errorMessage = err instanceof Error ? err.message : "换装失败，请重试";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      onProcessingChange(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // For base64 images, create a download link
      if (generatedImage.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `ai-try-on-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(generatedImage, '_blank');
      }
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-primary" />
        AI 换装效果
      </h3>

      <div className="glass-card p-6">
        {!originalImage || !clothingImage ? (
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
            <p className="text-muted-foreground text-sm mt-2">请稍候，这可能需要 10-30 秒</p>
          </div>
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium">{error}</p>
            <Button
              onClick={handleGenerate}
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
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
                onClick={() => {
                  handleReset();
                  handleGenerate();
                }}
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
              onClick={handleGenerate}
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
