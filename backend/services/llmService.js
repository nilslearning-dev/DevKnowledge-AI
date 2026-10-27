
const generateAnswer = async (question, context) => {
  const response = await fetch(
    "http://localhost:9931/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Answer the user's question using only the provided context.
If the answer is not available in the context, clearly say that you don't know.

Context:
${context}`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Local AI server error: ${response.status}`);
  }

  const data = await response.json();

  return data.choices[0].message.content;
};

export default generateAnswer;
