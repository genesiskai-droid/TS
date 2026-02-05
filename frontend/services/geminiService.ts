
import { GoogleGenAI, Type } from "@google/genai";

// Inicialización segura del SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartDiagnosis = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [{
          text: `Actúa como el Core de IA de TechNova Solutions JH&F. 
          Analiza este requerimiento técnico y genera una respuesta JSON estructurada.
          
          Catálogo de Servicios:
          - computo (Laptops, PCs, Servidores)
          - redes (WiFi, Switcheo, Racks)
          - impresion (Plotters, Multifuncionales)
          - seguridad (CCTV, Alarmas)
          - clima_energia (UPS, Pozos a Tierra)
          - software (Licencias, ERP)

          Entrada del Usuario: "${userPrompt}"`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { 
              type: Type.STRING, 
              description: "Diagnóstico técnico preliminar y sugerencia de acción." 
            },
            urgency: { 
              type: Type.STRING, 
              enum: ["Baja", "Normal", "Alta", "Crítica"] 
            },
            category: { 
              type: Type.STRING, 
              enum: ["computo", "redes", "impresion", "seguridad", "clima_energia", "software"] 
            },
            estimatedHours: {
              type: Type.NUMBER,
              description: "Tiempo estimado de intervención en horas."
            }
          },
          required: ["diagnosis", "urgency", "category"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Node Failure:", error);
    return {
      diagnosis: "Error en la red de IA. Por favor, describa manualmente el fallo.",
      urgency: "Normal",
      category: "computo"
    };
  }
};
