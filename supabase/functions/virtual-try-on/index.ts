import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface VirtualTryOnRequest {
  personImage: string;
  clothingImage: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const { personImage, clothingImage }: VirtualTryOnRequest = await req.json();

    if (!personImage) {
      return new Response(
        JSON.stringify({ error: "请上传人物照片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!clothingImage) {
      return new Response(
        JSON.stringify({ error: "请选择服装图片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing virtual try-on request...");

    const prompt = `You are a professional virtual try-on AI assistant. I'm providing you with two images:

1. First image: A photo of a person
2. Second image: A clothing item/garment

Your task is to generate a realistic image showing the person from image 1 wearing the clothing from image 2.

Requirements:
- Preserve the person's face, body shape, pose, skin tone, and hair exactly as they appear
- Replace only their current clothing with the garment from image 2
- The clothing should fit naturally on the person's body proportions
- Maintain realistic lighting, shadows, and fabric draping
- Keep the same background as the original person photo
- The result should look like a natural photograph, not an obvious edit
- Generate ONLY the final image without any text explanation`;

    const response = await fetch("https://www.needware.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        modalities: ["text", "image"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: personImage
              },
              {
                type: "image_url",
                image_url: clothingImage
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后重试" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 服务配额已用尽" }),
          { status: 402, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      throw new Error(`AI处理失败: ${errorText}`);
    }

    const result = await response.json();

    let generatedImageUrl: string | null = null;
    let textContent: string | null = null;

    const messageContent = result.choices?.[0]?.message?.content;

    if (Array.isArray(messageContent)) {
      for (const part of messageContent) {
        if (part.type === 'image_url' && part.image_url?.url) {
          generatedImageUrl = part.image_url.url;
        } else if (part.type === 'text') {
          textContent = part.text;
        }
      }
    } else if (typeof messageContent === 'string') {
      const base64Match = messageContent.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      const urlMatch = messageContent.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);

      if (base64Match) {
        generatedImageUrl = base64Match[0];
      } else if (urlMatch) {
        generatedImageUrl = urlMatch[0];
      }
      textContent = messageContent;
    }

    console.log("Virtual try-on completed successfully");

    // 包装响应 - 返回简洁的格式
    const virtualTryOnResponse = {
      resultImage: generatedImageUrl,
      message: generatedImageUrl ? "换装效果生成成功" : "未能生成图片，请重试",
    };

    return new Response(JSON.stringify(virtualTryOnResponse), {
      status: generatedImageUrl ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });

  } catch (error: any) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "换装处理失败，请重试" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
