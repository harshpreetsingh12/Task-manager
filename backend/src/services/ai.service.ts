

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ITask } from "../models/Task.model";
import { CONF } from "../config/var";
import Groq from "groq-sdk";
import { ITask } from "../models/Task.model";

export class AIService {
  private client: Groq;

  constructor() {
    this.client = new Groq({ apiKey: CONF.GROQ_API_KEY });
  }

  async generateDailyBriefing(tasks: ITask[]): Promise<string> {
    const taskListString = tasks
      .map((t, i) => `${i + 1}. ${t.title} [Priority: ${t.priority}]`)
      .join("\n");

    const prompt = `
      System: You are a professional productivity coach.
      User Tasks for Today:
      ${taskListString}

      Instruction: Provide a friendly, concise 3-sentence daily briefing. 
      Highlight high-priority items and be encouraging.
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: CONF.GROQ_MODELS,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });
      return completion.choices[0].message.content!;
    } catch (error) {
      console.error("Groq API Error:", error);
      throw new Error("Failed to communicate with AI service.");
    }
  }
}

// export class AIService {
//   private genAI: GoogleGenerativeAI;
//   private model: any;

//   constructor() {
//     this.genAI = new GoogleGenerativeAI(CONF.GEMINI_API_KEY!);
//     this.model = this.genAI.getGenerativeModel({ model: CONF.MODEL_NAME_GEMINI });
//   }

//   /**
//    * Generates a plain-English briefing based on task data
//    */
//   async generateDailyBriefing(tasks: ITask[]): Promise<string> {
//     const taskListString = tasks
//       .map((t, i) => `${i + 1}. ${t.title} [Priority: ${t.priority}]`)
//       .join("\n");

//     const prompt = `
//       System: You are a professional productivity coach.
//       User Tasks for Today:
//       ${taskListString}

//       Instruction: Provide a friendly, concise 3-sentence daily briefing. 
//       Highlight high-priority items and be encouraging.
//     `;
//     // LLM Call
//     try {
//       const result = await this.model.generateContent(prompt);
//       const response = await result.response;
//       return response.text();
//     } catch (error) {
//       console.error("Gemini API Error:", error);
//       throw new Error("Failed to communicate with AI service.");
//     }
//   }
// }

export const aiService = new AIService();
