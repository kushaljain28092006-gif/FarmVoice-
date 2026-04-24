export interface AIResult {
  crop: string;
  problem: string;
  solution: string;
  tips: string[];
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export async function generateFarmingAdvice(query: string, language: string, image?: ImageData): Promise<AIResult> {
  // Offline Safety Net Check
  if (!navigator.onLine) {
    return {
      crop: language === 'en' ? 'Offline Mode' : language === 'hi' ? 'ऑफ़लाइन मोड' : 'ऑफलाइन मोड',
      problem: language === 'en' ? 'No internet connection' : language === 'hi' ? 'कोई इंटरनेट कनेक्शन नहीं' : 'इंटरनेट कनेक्शन नाही',
      solution: language === 'en' ? 'No internet! We saved your question for later.' : language === 'hi' ? 'कोई इंटरनेट नहीं! हमने आपके प्रश्न को बाद के लिए सहेज लिया है।' : 'इंटरनेट नाही! आम्ही तुमचा प्रश्न नंतरसाठी सेव्ह केला आहे.',
      tips: language === 'en' ? ['Check your connection', 'Questions will sync automatically'] : language === 'hi' ? ['अपना कनेक्शन जांचें', 'प्रश्न स्वतः सिंक हो जाएंगे'] : ['तुमचे कनेक्शन तपासा', 'प्रश्न आपोआप सिंक होतील']
    };
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("No Gemini API Key found. Returning mock data.");
    return getMockFallback(query || 'Image Upload', language);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let prompt = `You are an expert farming assistant. 
The user is asking a farming question in ${language}. 
Give me a 1-sentence answer on how to fix the problem, and tell me the name of the medicine to buy.
You must respond ONLY with a valid JSON object matching this schema exactly:
{
  "crop": "Name of the crop the user is talking about (in ${language})",
  "problem": "Short description of the problem (in ${language})",
  "solution": "1-sentence answer on how to fix it and the medicine to buy (in ${language})",
  "tips": ["Tip 1", "Tip 2", "Tip 3"] // 3 short tips in ${language}
}`;

  if (image) {
    prompt += `\n\nThe user has uploaded an image of their crop. Analyze the image to diagnose the disease, pest, or general problem.`;
  }
  
  if (query) {
    prompt += `\nUser Query: "${query}"`;
  }

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64
        }
      });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error("No text found in API response");
    }

    return JSON.parse(textResult) as AIResult;

  } catch (error: any) {
    console.error("Error generating AI advice:", error);
    return getMockFallback(query, language, error.message); // Pass the error message to the fallback
  }
}

function getMockFallback(query: string, language: string, errorMsg?: string): AIResult {
  const errorDescription = errorMsg ? `Error: ${errorMsg}` : 
    (language === 'en' ? 'Could not connect to AI' :
     language === 'hi' ? 'एआई से कनेक्ट नहीं हो सका' :
     'एआयशी कनेक्ट होऊ शकलो नाही');

  return {
    crop: language === 'en' ? 'Crop' : language === 'hi' ? 'फसल' : 'पीक',
    problem: errorDescription, // Display the actual error on the UI!
    solution: language === 'en' ? `We received your query: "${query}", but the AI is offline. Please check your API key.` :
              language === 'hi' ? `हमें आपकी क्वेरी मिली: "${query}", लेकिन एआई ऑफ़लाइन है। कृपया अपनी एपीआई कुंजी जांचें।` :
              `आम्हाला तुमची क्वेरी मिळाली: "${query}", परंतु एआय ऑफलाइन आहे. कृपया तुमची एपीआय की तपासा.`,
    tips: language === 'en' ? ['Check internet connection', 'Verify .env file', 'Try again later'] : 
          language === 'hi' ? ['इंटरनेट कनेक्शन जांचें', '.env फ़ाइल सत्यापित करें', 'बाद में पुनः प्रयास करें'] : 
          ['इंटरनेट कनेक्शन तपासा', '.env फाईल तपासा', 'नंतर पुन्हा प्रयत्न करा']
  };
}
