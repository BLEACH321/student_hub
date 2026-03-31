const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.summarizeNotes = async (notes) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return "This is a mock summary. Please provide a valid OpenAI API key in the .env file to get real summaries.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful study assistant. Summarize the following notes concisely." },
        { role: "user", content: notes }
      ],
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error('AI Error:', err);
    throw new Error('Failed to summarize notes');
  }
};

exports.generateStudyPlan = async (tasks) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return "This is a mock study plan. Please provide a valid OpenAI API key in the .env file to get real study plans.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful study assistant. Create a prioritized study plan based on these tasks." },
        { role: "user", content: JSON.stringify(tasks) }
      ],
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error('AI Error:', err);
    throw new Error('Failed to generate study plan');
  }
};
