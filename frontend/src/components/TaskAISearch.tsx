import { showToast } from '@/lib/toast';
import { taskService } from '@/services/task.service';
import React, { useEffect, useRef, useState } from 'react';

const TaskAISearch = () => {
  const [question, setQuestion] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const accumulatedRef = useRef<string>("");
  const renderedRef = useRef<string>("");

  useEffect(() => {
      if (!isStreaming) return;

      let rafId: number;

      const sync = () => {
          if (accumulatedRef.current !== renderedRef.current) {
              renderedRef.current = accumulatedRef.current;
              setSummary(accumulatedRef.current);
          }
          rafId = requestAnimationFrame(sync); 
      };

      rafId = requestAnimationFrame(sync); 

      return () => cancelAnimationFrame(rafId); 
  }, [isStreaming]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSummary(""); // clear previous summary
    accumulatedRef.current=''
    renderedRef.current=''
    
    try {
      if(question.length===0) return showToast.error("Data Error", "Please ask a question to get response.");

      const res = await taskService.getChatResponse(question);

      if (!res.ok) {
        showToast.error("AI Error", "Could not reach the AI coach.");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);

        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;

          const payload = JSON.parse(line.slice(6));
          if (payload.error) {
            showToast.error("AI Error", "Could not reach the AI coach.");
            return;
          }

          if (payload.done) {
            setIsStreaming(false);
            showToast.ai(
              "Briefing Ready",
              "Your AI coach has analyzed your day.",
            );
            return;
          }

          if (payload.chunk) {
            if (!isStreaming) setIsStreaming(true); // start the rAF loop
            setIsGenerating(false);
            accumulatedRef.current += payload.chunk; 
          }
        }
      }
    } catch (err) {
      console.log(err);
      showToast.error("AI Error", "Could not reach the AI coach.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-5">
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          ✨
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Ask AI about your tasks... (e.g. What's left for Smart Search?)"
          className="block w-full pl-11 pr-16 py-4 bg-[#1a1625] border border-purple-900/30 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all shadow-xl"
        />
        <button 
          onClick={handleGenerate}
          className="absolute cursor-pointer right-3 top-2.5 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl transition-colors shadow-lg"
        >
          ➤
          {/* <Send className="h-5 w-5" /> */}
        </button>
      </div>

      {/* Answer Display Area */}
      {(summary || isGenerating) && (
        <div className="mt-4 p-5 bg-[#1a1625]/80 backdrop-blur-md border border-purple-900/20 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">
            {summary}
            {isGenerating && <span className="inline-block w-1.5 h-5 ml-1 bg-purple-500 animate-bounce" />}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskAISearch;