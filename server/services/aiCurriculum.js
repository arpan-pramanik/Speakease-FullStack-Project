const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

const generateAndSeedCurriculum = async (languageId, languageName) => {
  console.log(`[AI Curriculum] Initiating dynamic generation for ${languageName}...`);

  const prompt = `
You are a master linguist and language teacher. Your task is to generate a comprehensive, culturally-specific introductory curriculum for a student learning ${languageName}.
Return the curriculum exactly as a JSON object containing an array named "lessons". Generate 3 to 5 lessons.

{
  "lessons": [
    {
      "title": "A language and culture specific title, e.g. for Japanese: 'Greetings & Bowing' or for French: 'Parisian Basics'",
      "description": "Short description.",
      "vocabulary": [
        {"word": "Concept/English", "translation": "Target language translation"} // exactly 5 words
      ],
      "grammarNotes": [
        {"title": "Note Title", "explanation": "Grammar rule", "examples": ["Example 1 in target lang"]}
      ],
      "quiz": [
        // EXACTLY 5 questions, one of EACH of the following types:
        {
          "questionType": "multiple-choice",
          "question": "Translate 'Hello' into ${languageName}",
          "options": ["wrong1", "correct", "wrong2"],
          "correctAnswer": "correct",
          "explanation": "Why it is correct"
        },
        {
          "questionType": "true-false",
          "question": "The word for X is Y.",
          "options": ["True", "False"],
          "correctAnswer": "True",
          "explanation": "Reasoning"
        },
        {
          "questionType": "fill-blank",
          "question": "Translate the concept exactly.",
          "options": [],
          "correctAnswer": "exact target word",
          "explanation": "Rule"
        },
        {
          "questionType": "form-sentence",
          "question": "Form the sentence: 'I am happy'",
          "options": ["target", "lang", "words", "shuffled", "extra"],
          "correctAnswer": "target lang words", // properly ordered
          "explanation": "Grammar assembly"
        },
        {
          "questionType": "matching",
          "question": "Match the pairs",
          "options": ["Dog:Perro", "Cat:Gato", "Bird:Pajaro"], // format: English:Target
          "correctAnswer": "Dog:Perro,Cat:Gato,Bird:Pajaro",
          "explanation": "Vocab match"
        }
      ]
    }
  ]
}
`;

  try {
    const res = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      console.error('[AI Curriculum] API error', res.status);
      throw new Error('Failed to generate curriculum from API');
    }

    const data = await res.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) throw new Error('Empty AI response');

    const parsedData = JSON.parse(textResponse);
    const curriculumArray = parsedData.lessons || [];

    let order = 1;
    for (const lessonData of curriculumArray) {
      const newLesson = await Lesson.create({
        title: lessonData.title,
        description: lessonData.description,
        languageId: languageId,
        difficulty: order === 1 ? 'Beginner' : 'Intermediate',
        order: order,
        content: {
          vocabulary: lessonData.vocabulary || [],
          grammarNotes: lessonData.grammarNotes || []
        },
        estimatedMinutes: 10,
        xpReward: 20
      });

      if (lessonData.quiz && Array.isArray(lessonData.quiz)) {
        // Ensure options are populated properly to avoid crash
        const sanitizedQuestions = lessonData.quiz.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
          points: 10
        }));

        await Quiz.create({
          lessonId: newLesson._id,
          title: `${lessonData.title} Quiz`,
          questions: sanitizedQuestions,
          totalPoints: sanitizedQuestions.length * 10
        });
      }
      order++;
    }

    console.log(`[AI Curriculum] Successfully generated and seeded ${curriculumArray.length} unique lessons for ${languageName}!`);
    return true;
  } catch (error) {
    console.error('[AI Curriculum] Error during generation sequence:', error);
    return false;
  }
};

module.exports = { generateAndSeedCurriculum };
