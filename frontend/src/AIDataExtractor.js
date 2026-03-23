export const AIDataExtractor = (() => {
  async function extractReceiptData(imageFile) {
    if (!imageFile || !imageFile.type.startsWith('image/')) {
      console.error('Invalid input: Please provide a valid image file.');
      return null;
    }

    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const base64Image = await fileToBase64(imageFile);

    const systemPrompt = `
      You are a highly accurate data extractor for the SpendQuest app.
      I will provide an image of a receipt or bill.
      Your task is to extract and return exactly one JSON object with the following fields:
      - "amount": numeric total
      - "category": main category (e.g., "Groceries")
      - "date": YYYY-MM-DD
      - "type": "debit" or "credit"
      - "description": short text describing the transaction

      Rules:
      1. Return valid JSON only.
      2. If a field cannot be determined, use null.
      3. Amount should be a number. Type: "debit" or "credit".
      `;

    const userPrompt = "Extract the data from this receipt image.";

    const payload = {
      contents: [{
        parts: [
          { text: userPrompt },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ]
      }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            amount: { type: "NUMBER" },
            category: { type: "STRING" },
            date: { type: "STRING" },
            type: { type: "STRING" },
            description: { type: "STRING" }
          },
          propertyOrdering: ["amount", "category", "date", "type", "description"]
        }
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) return JSON.parse(content);
      console.error('No content found in API response.');
      return null;
    } catch (err) {
      console.error('Error during data extraction:', err);
      return null;
    }
  }

  return { extractReceiptData };
})();
