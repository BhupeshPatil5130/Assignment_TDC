const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.evaluateMatch = async (customer, matchItem) => {
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini')) {
    matchItem.aiScore = matchItem.score;
    matchItem.aiIntro = "AI evaluation skipped (No API Key). High potential match based on system logic.";
    return matchItem;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Indian Matchmaker. Evaluate compatibility between Customer A and Match B.
Customer A: ${customer.firstName}, Age: ${customer.age}, Income: ${customer.income}, Height: ${customer.height}, Wants Kids: ${customer.wantKids}, Diet: ${customer.diet}, Relocate: ${customer.openToRelocate}.
Match B: ${matchItem.match.firstName}, Age: ${matchItem.match.age}, Income: ${matchItem.match.income}, Height: ${matchItem.match.height}, Wants Kids: ${matchItem.match.wantKids}, Diet: ${matchItem.match.diet}, Relocate: ${matchItem.match.openToRelocate}.
Provide a personalized intro email (2 sentences max) highlighting why they are a great match, and give an AI Compatibility Score out of 100.
Format your output exactly like this:
Score: [number]
Intro: [intro text]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const scoreMatch = text.match(/Score:\s*(\d+)/i);
    const introMatch = text.match(/Intro:\s*(.+)/i);
    
    matchItem.aiScore = scoreMatch ? parseInt(scoreMatch[1]) : matchItem.score;
    matchItem.aiIntro = introMatch ? introMatch[1].trim() : "This looks like a great match based on our advanced algorithms.";
  } catch (error) {
    console.error("AI Error:", error.message);
    matchItem.aiScore = matchItem.score;
    matchItem.aiIntro = "AI evaluation failed. High potential match based on system logic.";
  }

  return matchItem;
};
