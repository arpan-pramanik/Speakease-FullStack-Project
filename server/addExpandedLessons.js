const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Language = require('./models/Language');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/speakease';

// Authentic Translations for the massive language base
const translations = {
    'Spanish': {
        hello: 'Hola', goodbye: 'Adiós', thanks: 'Gracias',
        water: 'Agua',
        happy: 'Estoy feliz',
        appleSentence: ['Yo', 'como', 'una', 'manzana', 'el', 'niño'], appleAnswer: 'Yo como una manzana',
        dog: 'Perro', cat: 'Gato', bird: 'Pájaro'
    },
    'French': {
        hello: 'Bonjour', goodbye: 'Au revoir', thanks: 'Merci',
        water: 'Eau',
        happy: 'Je suis heureux',
        appleSentence: ['Je', 'mange', 'une', 'pomme', 'le', 'garçon'], appleAnswer: 'Je mange une pomme',
        dog: 'Chien', cat: 'Chat', bird: 'Oiseau'
    },
    'Hindi': {
        hello: 'Namaste', goodbye: 'Alvida', thanks: 'Dhanyavad',
        water: 'Pani',
        happy: 'Main khush hoon',
        appleSentence: ['Main', 'ek', 'seb', 'khata', 'hoon', 'tu'], appleAnswer: 'Main ek seb khata hoon',
        dog: 'Kutta', cat: 'Billi', bird: 'Chidiya'
    },
    'Bengali': {
        hello: 'Nomoshkar', goodbye: 'Biday', thanks: 'Dhonnobad',
        water: 'Jol',
        happy: 'Ami anondito',
        appleSentence: ['Ami', 'ekti', 'apel', 'khai', 'tumi', 'shey'], appleAnswer: 'Ami ekti apel khai',
        dog: 'Kukur', cat: 'Biral', bird: 'Pakhi'
    },
    'Tamil': {
        hello: 'Vanakkam', goodbye: 'Poitu varen', thanks: 'Nandri',
        water: 'Thanneer', happy: 'Naan magizhchiyaaga irukkiren',
        appleSentence: ['Naan', 'oru', 'apple', 'sappidugiren', 'neengal', 'avan'], appleAnswer: 'Naan oru apple sappidugiren',
        dog: 'Naay', cat: 'Poonai', bird: 'Paravai'
    },
    'Telugu': {
        hello: 'Namaskaram', goodbye: 'Velli vasthanu', thanks: 'Dhanyavadalu',
        water: 'Neelu', happy: 'Nenu santhoshanga unnanu',
        appleSentence: ['Nenu', 'oka', 'apple', 'thintunnanu', 'meer', 'atanu'], appleAnswer: 'Nenu oka apple thintunnanu',
        dog: 'Kukka', cat: 'Pilli', bird: 'Pakshi'
    },
    'Marathi': {
        hello: 'Namaskar', goodbye: 'Yeto', thanks: 'Aabhari ahe',
        water: 'Pani', happy: 'Mi anandi ahe',
        appleSentence: ['Mi', 'ek', 'safarachand', 'khato', 'tu', 'to'], appleAnswer: 'Mi ek safarachand khato',
        dog: 'Kutra', cat: 'Manjar', bird: 'Pakshi'
    },
    'German': {
        hello: 'Hallo', goodbye: 'Tschüss', thanks: 'Danke',
        water: 'Wasser', happy: 'Ich bin glücklich',
        appleSentence: ['Ich', 'esse', 'einen', 'Apfel', 'der', 'Junge'], appleAnswer: 'Ich esse einen Apfel',
        dog: 'Hund', cat: 'Katze', bird: 'Vogel'
    },
    'Italian': {
        hello: 'Ciao', goodbye: 'Addio', thanks: 'Grazie',
        water: 'Acqua', happy: 'Sono felice',
        appleSentence: ['Io', 'mangio', 'una', 'mela', 'il', 'ragazzo'], appleAnswer: 'Io mangio una mela',
        dog: 'Cane', cat: 'Gatto', bird: 'Uccello'
    },
    'Japanese': {
        hello: 'Konnichiwa', goodbye: 'Sayonara', thanks: 'Arigato',
        water: 'Mizu', happy: 'Watashi wa shiawase desu',
        appleSentence: ['Watashi', 'wa', 'ringo', 'o', 'tabemasu', 'kare'], appleAnswer: 'Watashi wa ringo o tabemasu',
        dog: 'Inu', cat: 'Neko', bird: 'Tori'
    },
    'Korean': {
        hello: 'Annyeonghaseyo', goodbye: 'Annyeonghi gaseyo', thanks: 'Gamsahamnida',
        water: 'Mul', happy: 'Na-neun haengbokhada',
        appleSentence: ['Na', 'neun', 'sagwa', 'reul', 'meogneunda', 'neo'], appleAnswer: 'Na neun sagwa reul meogneunda',
        dog: 'Gae', cat: 'Goyangi', bird: 'Sae'
    },
    'Mandarin': {
        hello: 'Nǐ hǎo', goodbye: 'Zàijiàn', thanks: 'Xièxiè',
        water: 'Shuǐ', happy: 'Wǒ hěn kāixīn',
        appleSentence: ['Wǒ', 'chī', 'yīgè', 'píngguǒ', 'tā', 'nǐ'], appleAnswer: 'Wǒ chī yīgè píngguǒ',
        dog: 'Gǒu', cat: 'Māo', bird: 'Niǎo'
    },
    'Russian': {
        hello: 'Privet', goodbye: 'Poka', thanks: 'Spasibo',
        water: 'Voda', happy: 'Ya schastliv',
        appleSentence: ['Ya', 'yem', 'yabloko', 'on', 'ty', 'mysh'], appleAnswer: 'Ya yem yabloko',
        dog: 'Sobaka', cat: 'Koshka', bird: 'Ptitsa'
    },
    'Arabic': {
        hello: 'Marhaba', goodbye: 'Ma al-salama', thanks: 'Shukran',
        water: 'Maa', happy: 'Ana saeed',
        appleSentence: ['Ana', 'akul', 'tuffaha', 'huwa', 'hiya', 'kalb'], appleAnswer: 'Ana akul tuffaha',
        dog: 'Kalb', cat: 'Qitt', bird: 'Taer'
    },
    'Portuguese': {
        hello: 'Olá', goodbye: 'Tchau', thanks: 'Obrigado',
        water: 'Água', happy: 'Eu estou feliz',
        appleSentence: ['Eu', 'como', 'uma', 'maçã', 'ele', 'menino'], appleAnswer: 'Eu como uma maçã',
        dog: 'Cachorro', cat: 'Gato', bird: 'Pássaro'
    },
    // The fallback generator
    'Fallback': {
        hello: 'Hello', goodbye: 'Goodbye', thanks: 'Thanks',
        water: 'Water', happy: 'I am happy',
        appleSentence: ['I', 'eat', 'an', 'apple', 'banana', 'the'], appleAnswer: 'I eat an apple',
        dog: 'Dog', cat: 'Cat', bird: 'Bird'
    }
};

const getTranslation = (langName) => {
    return translations[langName] || translations['Fallback'];
};

const generateLessonContent = (langName, topic, number) => {
    const t = getTranslation(langName);
    return {
        vocabulary: [
            { word: `Greeting`, translation: t.hello },
            { word: `Farewell`, translation: t.goodbye },
            { word: `Gratitude`, translation: t.thanks },
            { word: `Animal`, translation: t.dog },
            { word: `Nature`, translation: t.water }
        ],
        grammarNotes: [{
            title: `${topic} Guidelines`,
            explanation: `Focus on mastering these foundational mechanics. Practice spelling and pronunciation for "${t.hello}".`,
            examples: [`${t.hello}!`, `${t.thanks}!`]
        }
        ]
    };
};

const generateQuizForLesson = (lessonId, langName, topic) => {
    const t = getTranslation(langName);

    return {
        lessonId,
        title: `${topic} Assessment`,
        passingScore: 60,
        questions: [
            {
                question: `Translate "Hello" into ${langName}.`,
                questionType: 'multiple-choice',
                options: [t.hello, t.goodbye, t.thanks].sort(() => Math.random() - 0.5),
                correctAnswer: t.hello,
                explanation: `The correct greeting is ${t.hello}.`,
                points: 10
            },
            {
                question: `The literal word for "Water" in ${langName} is "${t.water}".`,
                questionType: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'True',
                explanation: 'A fundamental vocabulary check.',
                points: 10
            },
            {
                question: 'Translate: "I am happy" into the correct phrase.',
                questionType: 'fill-blank',
                options: [],
                correctAnswer: t.happy,
                explanation: `You must remember the exact phrase: ${t.happy}`,
                points: 10
            },
            {
                question: `Form the sentence carefully: "I eat an apple"`,
                questionType: 'form-sentence',
                options: t.appleSentence.sort(() => Math.random() - 0.5),
                correctAnswer: t.appleAnswer,
                explanation: 'Assemble the blocks in the correct grammatical order.',
                points: 15
            },
            {
                question: `Match the English absolute to its ${langName} equivalent:`,
                questionType: 'matching',
                options: [`Dog:${t.dog}`, `Cat:${t.cat}`, `Bird:${t.bird}`].sort(() => Math.random() - 0.5),
                correctAnswer: `Dog:${t.dog},Cat:${t.cat},Bird:${t.bird}`,
                explanation: 'Connect the pairs correctly based on previous lessons.',
                points: 15
            }
        ]
    };
};

const seedExpandedLessons = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected for Authentic Lesson Generation...');

        // Wipe existing lessons and quizzes to start pristine
        await Lesson.deleteMany({});
        await Quiz.deleteMany({});
        console.log('Cleared existing lessons and quizzes.');

        const languages = await Language.find();
        let totalLessons = 0;
        let totalQuizzes = 0;

        const topics = ['Foundations I', 'Foundations II', 'Phrases', 'Travel', 'Food', 'Family', 'Colors', 'Numbers', 'Time', 'Interrogatives'];

        const lessonBuffer = [];

        for (const lang of languages) {
            for (let i = 0; i < 10; i++) {
                const topic = topics[i];
                lessonBuffer.push({
                    title: topic,
                    description: `Master the absolute essentials of ${topic} in ${lang.name}.`,
                    languageId: lang._id,
                    difficulty: i < 3 ? 'Beginner' : (i < 7 ? 'Intermediate' : 'Advanced'),
                    order: i + 1,
                    content: generateLessonContent(lang.name, topic, i + 1),
                    estimatedMinutes: 5 + i,
                    xpReward: 10 + (i * 5)
                });
            }
        }

        console.log(`Inserting ${lessonBuffer.length} authentic lessons...`);
        const insertedLessons = await Lesson.insertMany(lessonBuffer);
        totalLessons = insertedLessons.length;

        console.log(`Generating quizzes with proper translations for ${totalLessons} lessons...`);
        const quizBuffer = [];
        for (const lesson of insertedLessons) {
            // Find language name
            const langNameMatch = lesson.description.match(/in (.*)\./);
            const langName = langNameMatch ? langNameMatch[1] : 'Fallback';
            const topic = lesson.title;

            const qData = generateQuizForLesson(lesson._id, langName, topic);
            qData.totalPoints = qData.questions.reduce((acc, q) => acc + q.points, 0);
            quizBuffer.push(qData);
        }

        console.log(`Inserting ${quizBuffer.length} authentic quizzes...`);
        await Quiz.insertMany(quizBuffer);
        totalQuizzes = quizBuffer.length;

        console.log(`✅ Success! Generated ${totalLessons} Authentic Lessons and ${totalQuizzes} Quizzes!`);
        process.exit(0);

    } catch (err) {
        console.error('Error seeding mass lessons:', err);
        process.exit(1);
    }
};

seedExpandedLessons();
