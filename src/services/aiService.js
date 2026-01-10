// Service to generate summaries using AI (Gemini) or heuristic fallback

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateSmartSummary = async (emails, tasks) => {
    // Prepare the context
    const emailContext = emails.length > 0
        ? emails.map(e => `- [Email] From: ${e.from}, Subject: ${e.subject}
  Snippet: ${e.snippet}`).join('\n')
        : 'No emails received today.';

    const taskContext = tasks.length > 0
        ? tasks.map(t => `- [Task] ${t.title} (Priority: ${t.priority})`).join('\n')
        : 'No tasks pending for today.';

    const prompt = `
    You are a helpful personal assistant. 
    Please provide a concise, encouraging summary of "My Day" based on the following emails received today and tasks on my list.
    Highlight any urgent items (Important emails or High Priority tasks).
    
    Current Date: ${new Date().toLocaleDateString()}
    
    Today's Emails:
    ${emailContext}
    
    Today's Tasks:
    ${taskContext}
    
    Summary:
    `;

    // 1. Try Gemini API if key is present
    if (GEMINI_API_KEY) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Gemini API request failed');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI Summarization failed, falling back to basic summary:', error);
            // Fallthrough to basic summary
        }
    }

    // 2. Fallback Heuristic Summary
    return generateBasicSummary(emails, tasks);
};

const generateBasicSummary = (emails, tasks) => {
    const importantTasks = tasks.filter(t => t.priority === 1).length;
    const emailCount = emails.length;
    
    let summary = `Good day! You have ${tasks.length} task(s) on your agenda`;
    
    if (importantTasks > 0) {
        summary += `, including ${importantTasks} high priority item(s).`;
    } else {
        summary += ".";
    }

    if (emailCount > 0) {
        summary += ` You've also received ${emailCount} email(s) today that might need your attention.`;
        summary += `\n\nRecent emails:\n${emails.slice(0, 3).map(e => `• ${e.subject}`).join('\n')}`;
    } else {
        summary += ` Your inbox is currently quiet for the day.`;
    }
    
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        summary += `\n\n(Note: Add VITE_GEMINI_API_KEY to your .env file to enable intelligent AI summarization.)`;
    }

    return summary;
};
