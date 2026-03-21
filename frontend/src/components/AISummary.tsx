'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { taskService } from '@/services/task.service';
import { showToast } from '@/lib/toast';
import { useTypewriter } from '@/hooks/useTypewriter';

export default function AISummary({ tasks }: { tasks: any[] }) {
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const displayText = useTypewriter(summary);

  const handleGenerate = async () => {
    if (tasks.length === 0) {
      showToast.info("No tasks found", "Add some tasks first to get a briefing!");
      return;
    }

    setIsGenerating(true);
    try {
         const formattedDate = format(new Date(), 'yyyy-MM-dd'); //today date
        const response = await taskService.getAISummary(formattedDate);
        if(response.ok){
            setSummary(response.data.summary);
            showToast.ai("Briefing Ready", "Your AI coach has analyzed your day.");
        }
        else{
            showToast.error("AI Error", "Could not reach the AI coach.");
        }
    } catch (err) {
        console.log(err)
        showToast.error("AI Error", "Could not reach the AI coach.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-purple-500/20 bg-zinc-900/40 p-1">
      {/* Animated Gradient Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className="relative bg-zinc-950 rounded-[22px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              AI Daily Briefing
            </h2>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="cursor-pointer text-xs font-semibold px-4 py-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-full hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50"
          >
            {isGenerating ? "Analyzing..." : summary ? "Regenerate" : "Generate Briefing"}
          </button>
        </div>

        <div className="min-h-[60px] flex items-center">
          {isGenerating ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          ) : (
            <p className="text-zinc-300 leading-relaxed font-medium">
              {displayText || "Ready to plan your day? Click generate for your personalized AI briefing."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}