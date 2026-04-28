const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Language = require('./models/Language');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/speakease';

const loadCurriculum = (langName) => {
    try {
        const filePath = path.join(__dirname, 'data', 'curriculum', `${langName.toLowerCase()}.json`);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        return null;
    } catch (err) {
        console.error(`Error loading curriculum for ${langName}:`, err);
        return null;
    }
};

const runSeed = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected for Production Seeding...');

        // Clear existing lessons and quizzes to avoid duplicates
        await Lesson.deleteMany({});
        await Quiz.deleteMany({});
        console.log('Cleared existing lessons and quizzes.');

        const languages = await Language.find();
        
        let totalLessonsInserted = 0;
        let totalQuizzesInserted = 0;

        for (const lang of languages) {
            console.log(`Processing language: ${lang.languageName}...`);
            
            const curriculum = loadCurriculum(lang.languageName);
            
            if (curriculum) {
                // We have authentic JSON data for this language
                let order = 1;
                for (const module of curriculum) {
                    // Create Lesson
                    const newLesson = new Lesson({
                        title: module.title,
                        description: module.description,
                        languageId: lang._id,
                        difficulty: module.difficulty || 'Beginner',
                        order: order++,
                        content: module.content,
                        estimatedMinutes: 10,
                        xpReward: 25,
                        isPublished: true
                    });
                    
                    const savedLesson = await newLesson.save();
                    totalLessonsInserted++;

                    // Create Quiz
                    const newQuiz = new Quiz({
                        lessonId: savedLesson._id,
                        title: `${module.title} Trial`,
                        questions: module.quiz.questions,
                        passingScore: 70
                    });

                    await newQuiz.save();
                    totalQuizzesInserted++;
                }

                // Update language document with total lessons
                lang.totalLessons = curriculum.length;
                await lang.save();
                console.log(`✅ Loaded ${curriculum.length} authentic modules for ${lang.languageName}`);
            } else {
                // Set totalLessons to 0 for languages without curriculum yet
                lang.totalLessons = 0;
                await lang.save();
                console.log(`⚠️ No curriculum found for ${lang.languageName}. Skipping.`);
            }
        }

        console.log('\n=======================================');
        console.log('🏁 SEEDING COMPLETE');
        console.log(`Total Lessons Inserted: ${totalLessonsInserted}`);
        console.log(`Total Quizzes Inserted: ${totalQuizzesInserted}`);
        console.log('=======================================');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

runSeed();
