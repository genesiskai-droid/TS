import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private client: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent(prompt);
      const response = result.response;

      if (!response) {
        this.logger.error('No response received from Gemini API');
        throw new Error('No response from Gemini API');
      }

      return response.text() ?? '';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error generating content: ${errorMessage}`);
      throw error;
    }
  }
}
