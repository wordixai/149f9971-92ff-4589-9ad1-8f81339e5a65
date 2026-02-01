import { useState } from "react";
import { Shirt, Check } from "lucide-react";

interface Style {
  id: string;
  name: string;
  image: string;
  description: string;
}

const styles: Style[] = [
  {
    id: "casual",
    name: "休闲风格",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    description: "轻松自在的日常穿搭",
  },
  {
    id: "formal",
    name: "正装商务",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    description: "专业干练的职场风范",
  },
  {
    id: "sporty",
    name: "运动时尚",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
    description: "活力四射的运动装扮",
  },
  {
    id: "vintage",
    name: "复古经典",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop",
    description: "优雅怀旧的复古韵味",
  },
  {
    id: "streetwear",
    name: "街头潮流",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop",
    description: "前卫个性的街头文化",
  },
  {
    id: "elegant",
    name: "优雅晚装",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
    description: "华丽高贵的晚宴造型",
  },
];

interface StyleSelectorProps {
  selectedStyle: string | null;
  onStyleSelect: (styleId: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shirt className="w-5 h-5 text-primary" />
        选择服装风格
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {styles.map((style, index) => (
          <div
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`
              glass-card overflow-hidden cursor-pointer transition-all duration-300 glow-border
              hover:scale-[1.02] animate-fade-up
              ${selectedStyle === style.id ? 'ring-2 ring-primary shadow-glow' : ''}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="relative">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-32 object-cover"
              />
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-foreground text-sm">{style.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
