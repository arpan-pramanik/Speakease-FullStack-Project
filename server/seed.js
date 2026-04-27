const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Language = require('./models/Language');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Progress = require('./models/Progress');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Language.deleteMany({});
        await Lesson.deleteMany({});
        await Quiz.deleteMany({});
        await Progress.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@speakease.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin user created: admin@speakease.com / admin123');

        // Create demo user
        const demoUser = await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'testuser123',
            role: 'user',
            streakDays: 7,
            totalXP: 250
        });
        console.log('Demo user created: testuser@example.com / testuser123');

        // Create Languages
        const spanish = await Language.create({
            languageName: 'Spanish',
            code: 'ES',
            level: 'Beginner',
            description: 'Learn Spanish — the second most spoken language in the world. Perfect for travel, work, and connecting with over 500 million speakers globally.',
            icon: '🇪🇸',
            totalLessons: 5
        });

        const french = await Language.create({
            languageName: 'French',
            code: 'FR',
            level: 'Beginner',
            description: 'Discover the language of love, diplomacy, and culture. French is spoken across 5 continents by over 300 million people.',
            icon: '🇫🇷',
            totalLessons: 4
        });

        const japanese = await Language.create({
            languageName: 'Japanese',
            code: 'JP',
            level: 'Beginner',
            description: 'Explore the fascinating world of Japanese. From anime to business, Japanese opens doors to a unique and rich culture.',
            icon: '🇯🇵',
            totalLessons: 4
        });

        const german = await Language.create({
            languageName: 'German',
            code: 'DE',
            level: 'Beginner',
            description: 'Learn the language of engineering, philosophy, and culture. German is spoken by over 100 million native speakers in Europe.',
            icon: '🇩🇪',
            totalLessons: 2
        });

        const italian = await Language.create({
            languageName: 'Italian',
            code: 'IT',
            level: 'Beginner',
            description: 'Discover la bella lingua — the language of art, music, fashion, and cuisine. Spoken by 85 million people worldwide.',
            icon: '🇮🇹',
            totalLessons: 2
        });

        const korean = await Language.create({
            languageName: 'Korean',
            code: 'KO',
            level: 'Beginner',
            description: 'Explore the language of K-pop, K-dramas, and a vibrant tech culture. Korean has its own elegant alphabet, Hangul.',
            icon: '🇰🇷',
            totalLessons: 2
        });

        const mandarin = await Language.create({
            languageName: 'Mandarin Chinese',
            code: 'ZH',
            level: 'Beginner',
            description: 'Learn the most spoken language on Earth. Mandarin Chinese opens doors to a 5,000-year-old civilization and global business.',
            icon: '🇨🇳',
            totalLessons: 2
        });

        console.log('Languages created: Spanish, French, Japanese, German, Italian, Korean, Mandarin');

        // ===================== SPANISH LESSONS =====================
        const spLesson1 = await Lesson.create({
            title: 'Greetings & Introductions',
            description: 'Learn how to say hello, introduce yourself, and basic courtesies in Spanish.',
            languageId: spanish._id,
            difficulty: 'Beginner',
            order: 1,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah', example: '¡Hola! ¿Cómo estás?', exampleTranslation: 'Hello! How are you?' },
                    { word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWEH-nohs DEE-ahs', example: 'Buenos días, señor.', exampleTranslation: 'Good morning, sir.' },
                    { word: 'Buenas tardes', translation: 'Good afternoon', pronunciation: 'BWEH-nahs TAR-dehs', example: 'Buenas tardes, ¿cómo está?', exampleTranslation: 'Good afternoon, how are you?' },
                    { word: 'Buenas noches', translation: 'Good evening/night', pronunciation: 'BWEH-nahs NOH-chehs', example: 'Buenas noches, hasta mañana.', exampleTranslation: 'Good night, see you tomorrow.' },
                    { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-DYOHS', example: '¡Adiós, amigo!', exampleTranslation: 'Goodbye, friend!' },
                    { word: 'Por favor', translation: 'Please', pronunciation: 'pohr fah-VOHR', example: 'Un café, por favor.', exampleTranslation: 'A coffee, please.' },
                    { word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-syahs', example: 'Muchas gracias por tu ayuda.', exampleTranslation: 'Thank you very much for your help.' },
                    { word: 'De nada', translation: "You're welcome", pronunciation: 'deh NAH-dah', example: '—Gracias. —De nada.', exampleTranslation: "—Thank you. —You're welcome." }
                ],
                grammarNotes: [
                    { title: 'Formal vs Informal', explanation: 'Spanish has formal (usted) and informal (tú) ways to address people. Use "usted" with strangers and elders, "tú" with friends.', examples: ['¿Cómo estás? (informal)', '¿Cómo está usted? (formal)'] }
                ]
            }
        });

        const spLesson2 = await Lesson.create({
            title: 'Numbers & Counting',
            description: 'Master numbers 1-20, counting, and basic math vocabulary in Spanish.',
            languageId: spanish._id,
            difficulty: 'Beginner',
            order: 2,
            estimatedMinutes: 12,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: 'Uno', translation: 'One', pronunciation: 'OO-noh', example: 'Tengo uno.', exampleTranslation: 'I have one.' },
                    { word: 'Dos', translation: 'Two', pronunciation: 'dohs', example: 'Dos cafés, por favor.', exampleTranslation: 'Two coffees, please.' },
                    { word: 'Tres', translation: 'Three', pronunciation: 'trehs', example: 'Hay tres libros.', exampleTranslation: 'There are three books.' },
                    { word: 'Cuatro', translation: 'Four', pronunciation: 'KWAH-troh', example: 'Cuatro personas.', exampleTranslation: 'Four people.' },
                    { word: 'Cinco', translation: 'Five', pronunciation: 'SEEN-koh', example: 'Son cinco dólares.', exampleTranslation: "It's five dollars." },
                    { word: 'Diez', translation: 'Ten', pronunciation: 'dyehs', example: 'Diez minutos más.', exampleTranslation: 'Ten more minutes.' },
                    { word: 'Veinte', translation: 'Twenty', pronunciation: 'BAYN-teh', example: 'Tengo veinte años.', exampleTranslation: "I'm twenty years old." },
                    { word: 'Cien', translation: 'One hundred', pronunciation: 'syehn', example: 'Cien por ciento.', exampleTranslation: 'One hundred percent.' }
                ]
            }
        });

        const spLesson3 = await Lesson.create({
            title: 'Colors & Descriptions',
            description: 'Learn color names and descriptive adjectives in Spanish.',
            languageId: spanish._id,
            difficulty: 'Beginner',
            order: 3,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Rojo', translation: 'Red', pronunciation: 'ROH-hoh', example: 'La manzana es roja.', exampleTranslation: 'The apple is red.' },
                    { word: 'Azul', translation: 'Blue', pronunciation: 'ah-SOOL', example: 'El cielo es azul.', exampleTranslation: 'The sky is blue.' },
                    { word: 'Verde', translation: 'Green', pronunciation: 'BEHR-deh', example: 'La hierba es verde.', exampleTranslation: 'The grass is green.' },
                    { word: 'Amarillo', translation: 'Yellow', pronunciation: 'ah-mah-REE-yoh', example: 'El sol es amarillo.', exampleTranslation: 'The sun is yellow.' },
                    { word: 'Negro', translation: 'Black', pronunciation: 'NEH-groh', example: 'El gato negro.', exampleTranslation: 'The black cat.' },
                    { word: 'Blanco', translation: 'White', pronunciation: 'BLAHN-koh', example: 'La nieve es blanca.', exampleTranslation: 'The snow is white.' },
                    { word: 'Grande', translation: 'Big', pronunciation: 'GRAHN-deh', example: 'La casa es grande.', exampleTranslation: 'The house is big.' },
                    { word: 'Pequeño', translation: 'Small', pronunciation: 'peh-KEH-nyoh', example: 'El perro es pequeño.', exampleTranslation: 'The dog is small.' }
                ],
                grammarNotes: [
                    { title: 'Adjective Agreement', explanation: 'In Spanish, adjectives must agree in gender and number with the noun they describe.', examples: ['El gato negro (masculine)', 'La gata negra (feminine)', 'Los gatos negros (plural)'] }
                ]
            }
        });

        const spLesson4 = await Lesson.create({
            title: 'Food & Drinks',
            description: 'Learn vocabulary for common foods, drinks, and ordering at restaurants.',
            languageId: spanish._id,
            difficulty: 'Beginner',
            order: 4,
            estimatedMinutes: 15,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: 'Agua', translation: 'Water', pronunciation: 'AH-gwah', example: 'Un vaso de agua, por favor.', exampleTranslation: 'A glass of water, please.' },
                    { word: 'Café', translation: 'Coffee', pronunciation: 'kah-FEH', example: 'Me gusta el café.', exampleTranslation: 'I like coffee.' },
                    { word: 'Pan', translation: 'Bread', pronunciation: 'pahn', example: 'Quiero pan con mantequilla.', exampleTranslation: 'I want bread with butter.' },
                    { word: 'Pollo', translation: 'Chicken', pronunciation: 'POH-yoh', example: 'El pollo está delicioso.', exampleTranslation: 'The chicken is delicious.' },
                    { word: 'Arroz', translation: 'Rice', pronunciation: 'ah-ROHS', example: 'Arroz con frijoles.', exampleTranslation: 'Rice with beans.' },
                    { word: 'Fruta', translation: 'Fruit', pronunciation: 'FROO-tah', example: 'Me gustan las frutas.', exampleTranslation: 'I like fruits.' },
                    { word: 'La cuenta', translation: 'The bill', pronunciation: 'lah KWEHN-tah', example: 'La cuenta, por favor.', exampleTranslation: 'The bill, please.' },
                    { word: 'Delicioso', translation: 'Delicious', pronunciation: 'deh-lee-SYOH-soh', example: '¡Está delicioso!', exampleTranslation: "It's delicious!" }
                ]
            }
        });

        const spLesson5 = await Lesson.create({
            title: 'Family & Relationships',
            description: 'Learn words for family members and relationships in Spanish.',
            languageId: spanish._id,
            difficulty: 'Intermediate',
            order: 5,
            estimatedMinutes: 12,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: 'Familia', translation: 'Family', pronunciation: 'fah-MEE-lyah', example: 'Mi familia es grande.', exampleTranslation: 'My family is big.' },
                    { word: 'Madre/Mamá', translation: 'Mother/Mom', pronunciation: 'MAH-dreh / mah-MAH', example: 'Mi mamá cocina muy bien.', exampleTranslation: 'My mom cooks very well.' },
                    { word: 'Padre/Papá', translation: 'Father/Dad', pronunciation: 'PAH-dreh / pah-PAH', example: 'Mi papá trabaja mucho.', exampleTranslation: 'My dad works a lot.' },
                    { word: 'Hermano/a', translation: 'Brother/Sister', pronunciation: 'ehr-MAH-noh/nah', example: 'Tengo dos hermanos.', exampleTranslation: 'I have two brothers.' },
                    { word: 'Hijo/a', translation: 'Son/Daughter', pronunciation: 'EE-hoh/hah', example: 'Es mi hija.', exampleTranslation: 'She is my daughter.' },
                    { word: 'Abuelo/a', translation: 'Grandfather/Grandmother', pronunciation: 'ah-BWEH-loh/lah', example: 'Mi abuela tiene 80 años.', exampleTranslation: 'My grandmother is 80 years old.' },
                    { word: 'Amigo/a', translation: 'Friend', pronunciation: 'ah-MEE-goh/gah', example: 'Ella es mi mejor amiga.', exampleTranslation: 'She is my best friend.' },
                    { word: 'Esposo/a', translation: 'Husband/Wife', pronunciation: 'ehs-POH-soh/sah', example: 'Te presento a mi esposa.', exampleTranslation: 'Let me introduce you to my wife.' }
                ]
            }
        });

        // ===================== FRENCH LESSONS =====================
        const frLesson1 = await Lesson.create({
            title: 'Salutations — Greetings',
            description: 'Learn basic French greetings and polite expressions.',
            languageId: french._id,
            difficulty: 'Beginner',
            order: 1,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Bonjour', translation: 'Hello / Good morning', pronunciation: 'bohn-ZHOOR', example: 'Bonjour, comment allez-vous?', exampleTranslation: 'Hello, how are you?' },
                    { word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bohn-SWAHR', example: 'Bonsoir, madame.', exampleTranslation: 'Good evening, madam.' },
                    { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR', example: 'Au revoir et bonne journée!', exampleTranslation: 'Goodbye and have a nice day!' },
                    { word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE', example: 'Merci beaucoup!', exampleTranslation: 'Thank you very much!' },
                    { word: "S'il vous plaît", translation: 'Please', pronunciation: 'seel voo PLEH', example: "Un café, s'il vous plaît.", exampleTranslation: 'A coffee, please.' },
                    { word: 'Excusez-moi', translation: 'Excuse me', pronunciation: 'ehk-skew-ZAY mwah', example: 'Excusez-moi, où est la gare?', exampleTranslation: 'Excuse me, where is the station?' },
                    { word: 'Oui / Non', translation: 'Yes / No', pronunciation: 'wee / nohn', example: 'Oui, je comprends.', exampleTranslation: 'Yes, I understand.' },
                    { word: 'Comment vous appelez-vous?', translation: 'What is your name?', pronunciation: 'koh-MAHN vooz ah-play-VAY voo', example: 'Bonjour, comment vous appelez-vous?', exampleTranslation: 'Hello, what is your name?' }
                ]
            }
        });

        const frLesson2 = await Lesson.create({
            title: 'Les Nombres — Numbers',
            description: 'Learn numbers and counting in French.',
            languageId: french._id,
            difficulty: 'Beginner',
            order: 2,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Un', translation: 'One', pronunciation: 'uhn', example: "J'ai un frère.", exampleTranslation: 'I have one brother.' },
                    { word: 'Deux', translation: 'Two', pronunciation: 'duh', example: 'Deux croissants.', exampleTranslation: 'Two croissants.' },
                    { word: 'Trois', translation: 'Three', pronunciation: 'twah', example: 'Il y a trois chats.', exampleTranslation: 'There are three cats.' },
                    { word: 'Quatre', translation: 'Four', pronunciation: 'katr', example: 'Quatre saisons.', exampleTranslation: 'Four seasons.' },
                    { word: 'Cinq', translation: 'Five', pronunciation: 'sank', example: 'Cinq minutes.', exampleTranslation: 'Five minutes.' },
                    { word: 'Dix', translation: 'Ten', pronunciation: 'dees', example: 'Dix euros.', exampleTranslation: 'Ten euros.' },
                    { word: 'Vingt', translation: 'Twenty', pronunciation: 'van', example: "J'ai vingt ans.", exampleTranslation: "I'm twenty years old." },
                    { word: 'Cent', translation: 'One hundred', pronunciation: 'sahn', example: 'Cent pour cent.', exampleTranslation: 'One hundred percent.' }
                ]
            }
        });

        const frLesson3 = await Lesson.create({
            title: 'La Nourriture — Food',
            description: 'Learn food and dining vocabulary in French.',
            languageId: french._id,
            difficulty: 'Beginner',
            order: 3,
            estimatedMinutes: 12,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: 'Le pain', translation: 'Bread', pronunciation: 'luh pahn', example: "J'achète du pain.", exampleTranslation: 'I buy bread.' },
                    { word: 'Le fromage', translation: 'Cheese', pronunciation: 'luh froh-MAZH', example: 'Le fromage français est délicieux.', exampleTranslation: 'French cheese is delicious.' },
                    { word: 'Le vin', translation: 'Wine', pronunciation: 'luh vahn', example: 'Un verre de vin rouge.', exampleTranslation: 'A glass of red wine.' },
                    { word: "L'eau", translation: 'Water', pronunciation: 'loh', example: "Une bouteille d'eau.", exampleTranslation: 'A bottle of water.' },
                    { word: 'Le poulet', translation: 'Chicken', pronunciation: 'luh poo-LEH', example: 'Du poulet rôti.', exampleTranslation: 'Roasted chicken.' },
                    { word: 'La salade', translation: 'Salad', pronunciation: 'lah sah-LAHD', example: 'Une salade verte.', exampleTranslation: 'A green salad.' },
                    { word: "L'addition", translation: 'The bill', pronunciation: 'lah-dee-SYOHN', example: "L'addition, s'il vous plaît.", exampleTranslation: 'The bill, please.' },
                    { word: 'Délicieux', translation: 'Delicious', pronunciation: 'day-lee-SYUH', example: "C'est délicieux!", exampleTranslation: "It's delicious!" }
                ]
            }
        });

        const frLesson4 = await Lesson.create({
            title: 'La Famille — Family',
            description: 'Learn family vocabulary in French.',
            languageId: french._id,
            difficulty: 'Intermediate',
            order: 4,
            estimatedMinutes: 10,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: 'La mère', translation: 'Mother', pronunciation: 'lah mehr', example: 'Ma mère est gentille.', exampleTranslation: 'My mother is kind.' },
                    { word: 'Le père', translation: 'Father', pronunciation: 'luh pehr', example: 'Mon père travaille ici.', exampleTranslation: 'My father works here.' },
                    { word: 'Le frère', translation: 'Brother', pronunciation: 'luh frehr', example: "J'ai un frère aîné.", exampleTranslation: 'I have an older brother.' },
                    { word: 'La sœur', translation: 'Sister', pronunciation: 'lah suhr', example: 'Ma sœur est étudiante.', exampleTranslation: 'My sister is a student.' },
                    { word: 'Les enfants', translation: 'Children', pronunciation: 'layz ahn-FAHN', example: "Les enfants jouent dehors.", exampleTranslation: 'The children play outside.' },
                    { word: 'Le grand-père', translation: 'Grandfather', pronunciation: 'luh grahn-PEHR', example: 'Mon grand-père a 90 ans.', exampleTranslation: 'My grandfather is 90.' },
                    { word: "L'ami / L'amie", translation: 'Friend', pronunciation: 'lah-MEE', example: "C'est mon meilleur ami.", exampleTranslation: 'He is my best friend.' },
                    { word: 'Le mari / La femme', translation: 'Husband / Wife', pronunciation: 'luh mah-REE / lah fahm', example: 'Voici ma femme.', exampleTranslation: 'This is my wife.' }
                ]
            }
        });

        // ===================== JAPANESE LESSONS =====================
        const jpLesson1 = await Lesson.create({
            title: 'あいさつ — Greetings',
            description: 'Learn essential Japanese greetings used daily.',
            languageId: japanese._id,
            difficulty: 'Beginner',
            order: 1,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'こんにちは', translation: 'Hello', pronunciation: 'Konnichiwa', example: 'こんにちは、元気ですか？', exampleTranslation: 'Hello, how are you?' },
                    { word: 'おはようございます', translation: 'Good morning', pronunciation: 'Ohayou gozaimasu', example: 'おはようございます、先生。', exampleTranslation: 'Good morning, teacher.' },
                    { word: 'こんばんは', translation: 'Good evening', pronunciation: 'Konbanwa', example: 'こんばんは、お元気ですか？', exampleTranslation: 'Good evening, are you well?' },
                    { word: 'さようなら', translation: 'Goodbye', pronunciation: 'Sayounara', example: 'さようなら、また明日。', exampleTranslation: 'Goodbye, see you tomorrow.' },
                    { word: 'ありがとうございます', translation: 'Thank you', pronunciation: 'Arigatou gozaimasu', example: 'ありがとうございます！', exampleTranslation: 'Thank you very much!' },
                    { word: 'すみません', translation: 'Excuse me / Sorry', pronunciation: 'Sumimasen', example: 'すみません、トイレはどこですか？', exampleTranslation: 'Excuse me, where is the restroom?' },
                    { word: 'はい / いいえ', translation: 'Yes / No', pronunciation: 'Hai / Iie', example: 'はい、分かりました。', exampleTranslation: 'Yes, I understand.' },
                    { word: 'お名前は？', translation: 'What is your name?', pronunciation: 'Onamae wa?', example: 'お名前は何ですか？', exampleTranslation: 'What is your name?' }
                ]
            }
        });

        const jpLesson2 = await Lesson.create({
            title: '数字 — Numbers',
            description: 'Learn to count in Japanese.',
            languageId: japanese._id,
            difficulty: 'Beginner',
            order: 2,
            estimatedMinutes: 10,
            xpReward: 25,
            content: {
                vocabulary: [
                    { word: '一 (いち)', translation: 'One', pronunciation: 'Ichi', example: '一つください。', exampleTranslation: 'One, please.' },
                    { word: '二 (に)', translation: 'Two', pronunciation: 'Ni', example: '二人です。', exampleTranslation: "It's two people." },
                    { word: '三 (さん)', translation: 'Three', pronunciation: 'San', example: '三匹の猫。', exampleTranslation: 'Three cats.' },
                    { word: '四 (よん)', translation: 'Four', pronunciation: 'Yon', example: '四時です。', exampleTranslation: "It's four o'clock." },
                    { word: '五 (ご)', translation: 'Five', pronunciation: 'Go', example: '五分待ってください。', exampleTranslation: 'Please wait five minutes.' },
                    { word: '十 (じゅう)', translation: 'Ten', pronunciation: 'Juu', example: '十円です。', exampleTranslation: "It's ten yen." },
                    { word: '百 (ひゃく)', translation: 'One hundred', pronunciation: 'Hyaku', example: '百パーセント。', exampleTranslation: 'One hundred percent.' },
                    { word: '千 (せん)', translation: 'One thousand', pronunciation: 'Sen', example: '千円札。', exampleTranslation: 'A 1000 yen bill.' }
                ]
            }
        });

        const jpLesson3 = await Lesson.create({
            title: '食べ物 — Food & Drink',
            description: 'Learn food and drink vocabulary in Japanese.',
            languageId: japanese._id,
            difficulty: 'Beginner',
            order: 3,
            estimatedMinutes: 12,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: '水 (みず)', translation: 'Water', pronunciation: 'Mizu', example: '水をください。', exampleTranslation: 'Water, please.' },
                    { word: 'お茶 (おちゃ)', translation: 'Tea', pronunciation: 'Ocha', example: 'お茶を飲みます。', exampleTranslation: 'I drink tea.' },
                    { word: 'ご飯 (ごはん)', translation: 'Rice / Meal', pronunciation: 'Gohan', example: 'ご飯を食べましょう。', exampleTranslation: "Let's eat rice." },
                    { word: '寿司 (すし)', translation: 'Sushi', pronunciation: 'Sushi', example: '寿司が好きです。', exampleTranslation: 'I like sushi.' },
                    { word: 'ラーメン', translation: 'Ramen', pronunciation: 'Raamen', example: 'ラーメンは美味しいです。', exampleTranslation: 'Ramen is delicious.' },
                    { word: '魚 (さかな)', translation: 'Fish', pronunciation: 'Sakana', example: '魚を食べます。', exampleTranslation: 'I eat fish.' },
                    { word: '美味しい (おいしい)', translation: 'Delicious', pronunciation: 'Oishii', example: 'とても美味しいです！', exampleTranslation: "It's very delicious!" },
                    { word: 'いただきます', translation: 'Bon appétit (before eating)', pronunciation: 'Itadakimasu', example: 'いただきます！', exampleTranslation: "Let's eat! (before meal)" }
                ]
            }
        });

        const jpLesson4 = await Lesson.create({
            title: '家族 — Family',
            description: 'Learn Japanese words for family members.',
            languageId: japanese._id,
            difficulty: 'Intermediate',
            order: 4,
            estimatedMinutes: 10,
            xpReward: 30,
            content: {
                vocabulary: [
                    { word: '家族 (かぞく)', translation: 'Family', pronunciation: 'Kazoku', example: '家族は五人です。', exampleTranslation: 'My family has five members.' },
                    { word: 'お母さん (おかあさん)', translation: 'Mother', pronunciation: 'Okaasan', example: 'お母さんは料理が上手です。', exampleTranslation: 'Mother is good at cooking.' },
                    { word: 'お父さん (おとうさん)', translation: 'Father', pronunciation: 'Otousan', example: 'お父さんは会社員です。', exampleTranslation: 'Father is an office worker.' },
                    { word: '兄 (あに) / 姉 (あね)', translation: 'Older brother / Older sister', pronunciation: 'Ani / Ane', example: '兄は大学生です。', exampleTranslation: 'My older brother is a university student.' },
                    { word: '弟 (おとうと) / 妹 (いもうと)', translation: 'Younger brother / Younger sister', pronunciation: 'Otouto / Imouto', example: '妹は高校生です。', exampleTranslation: 'My younger sister is a high school student.' },
                    { word: 'おじいさん', translation: 'Grandfather', pronunciation: 'Ojiisan', example: 'おじいさんは元気です。', exampleTranslation: 'Grandfather is well.' },
                    { word: 'おばあさん', translation: 'Grandmother', pronunciation: 'Obaasan', example: 'おばあさんが大好きです。', exampleTranslation: 'I love grandmother.' },
                    { word: '友達 (ともだち)', translation: 'Friend', pronunciation: 'Tomodachi', example: '友達と遊びます。', exampleTranslation: 'I hang out with friends.' }
                ]
            }
        });

        // ===================== GERMAN LESSONS =====================
        const deLesson1 = await Lesson.create({
            title: 'Begrüßungen — Greetings',
            description: 'Learn essential German greetings and introductions.',
            languageId: german._id, difficulty: 'Beginner', order: 1, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh', example: 'Hallo, wie geht es Ihnen?', exampleTranslation: 'Hello, how are you?' },
                    { word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'GOO-ten MOR-gen', example: 'Guten Morgen, Herr Schmidt.', exampleTranslation: 'Good morning, Mr. Schmidt.' },
                    { word: 'Auf Wiedersehen', translation: 'Goodbye', pronunciation: 'owf VEE-der-zay-en', example: 'Auf Wiedersehen und schönen Tag!', exampleTranslation: 'Goodbye and have a nice day!' },
                    { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-keh', example: 'Danke schön!', exampleTranslation: 'Thank you very much!' },
                    { word: 'Bitte', translation: 'Please / You\'re welcome', pronunciation: 'BIT-teh', example: 'Ein Kaffee, bitte.', exampleTranslation: 'A coffee, please.' },
                    { word: 'Entschuldigung', translation: 'Excuse me / Sorry', pronunciation: 'ent-SHOOL-dee-goong', example: 'Entschuldigung, wo ist der Bahnhof?', exampleTranslation: 'Excuse me, where is the train station?' },
                ]
            }
        });
        const deLesson2 = await Lesson.create({
            title: 'Zahlen — Numbers',
            description: 'Learn to count in German.',
            languageId: german._id, difficulty: 'Beginner', order: 2, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Eins', translation: 'One', pronunciation: 'eyns' }, { word: 'Zwei', translation: 'Two', pronunciation: 'tsvey' },
                    { word: 'Drei', translation: 'Three', pronunciation: 'dry' }, { word: 'Vier', translation: 'Four', pronunciation: 'feer' },
                    { word: 'Fünf', translation: 'Five', pronunciation: 'fuenf' }, { word: 'Zehn', translation: 'Ten', pronunciation: 'tsehn' },
                ]
            }
        });

        // ===================== ITALIAN LESSONS =====================
        const itLesson1 = await Lesson.create({
            title: 'Saluti — Greetings',
            description: 'Learn basic Italian greetings.',
            languageId: italian._id, difficulty: 'Beginner', order: 1, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Ciao', translation: 'Hello / Bye', pronunciation: 'CHOW', example: 'Ciao, come stai?', exampleTranslation: 'Hi, how are you?' },
                    { word: 'Buongiorno', translation: 'Good morning', pronunciation: 'bwon-JOR-no', example: 'Buongiorno, signora.', exampleTranslation: 'Good morning, ma\'am.' },
                    { word: 'Arrivederci', translation: 'Goodbye', pronunciation: 'ah-ree-veh-DEHR-chee', example: 'Arrivederci e buona giornata!', exampleTranslation: 'Goodbye and have a good day!' },
                    { word: 'Grazie', translation: 'Thank you', pronunciation: 'GRAH-tsyeh', example: 'Grazie mille!', exampleTranslation: 'Thanks a million!' },
                    { word: 'Per favore', translation: 'Please', pronunciation: 'pehr fah-VOH-reh', example: 'Un caffè, per favore.', exampleTranslation: 'A coffee, please.' },
                    { word: 'Scusa', translation: 'Excuse me', pronunciation: 'SKOO-zah', example: 'Scusa, dov\'è la stazione?', exampleTranslation: 'Excuse me, where is the station?' },
                ]
            }
        });
        const itLesson2 = await Lesson.create({
            title: 'Numeri — Numbers',
            description: 'Learn to count in Italian.',
            languageId: italian._id, difficulty: 'Beginner', order: 2, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: 'Uno', translation: 'One', pronunciation: 'OO-noh' }, { word: 'Due', translation: 'Two', pronunciation: 'DOO-eh' },
                    { word: 'Tre', translation: 'Three', pronunciation: 'treh' }, { word: 'Quattro', translation: 'Four', pronunciation: 'KWAH-troh' },
                    { word: 'Cinque', translation: 'Five', pronunciation: 'CHEEN-kweh' }, { word: 'Dieci', translation: 'Ten', pronunciation: 'DYEH-chee' },
                ]
            }
        });

        // ===================== KOREAN LESSONS =====================
        const koLesson1 = await Lesson.create({
            title: '인사 — Greetings',
            description: 'Learn essential Korean greetings.',
            languageId: korean._id, difficulty: 'Beginner', order: 1, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: '안녕하세요', translation: 'Hello', pronunciation: 'An-nyeong-ha-se-yo', example: '안녕하세요, 잘 지내세요?', exampleTranslation: 'Hello, how are you?' },
                    { word: '감사합니다', translation: 'Thank you', pronunciation: 'Gam-sa-ham-ni-da', example: '도와주셔서 감사합니다.', exampleTranslation: 'Thank you for helping.' },
                    { word: '안녕히 가세요', translation: 'Goodbye', pronunciation: 'An-nyeong-hi ga-se-yo', example: '안녕히 가세요!', exampleTranslation: 'Goodbye! (to someone leaving)' },
                    { word: '네 / 아니요', translation: 'Yes / No', pronunciation: 'Ne / A-ni-yo', example: '네, 알겠습니다.', exampleTranslation: 'Yes, I understand.' },
                    { word: '죄송합니다', translation: 'I\'m sorry', pronunciation: 'Joe-song-ham-ni-da', example: '죄송합니다, 늦어서.', exampleTranslation: 'I\'m sorry for being late.' },
                ]
            }
        });
        const koLesson2 = await Lesson.create({
            title: '숫자 — Numbers',
            description: 'Learn to count in Korean.',
            languageId: korean._id, difficulty: 'Beginner', order: 2, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: '하나', translation: 'One', pronunciation: 'Ha-na' }, { word: '둘', translation: 'Two', pronunciation: 'Dul' },
                    { word: '셋', translation: 'Three', pronunciation: 'Set' }, { word: '넷', translation: 'Four', pronunciation: 'Net' },
                    { word: '다섯', translation: 'Five', pronunciation: 'Da-seot' }, { word: '열', translation: 'Ten', pronunciation: 'Yeol' },
                ]
            }
        });

        // ===================== MANDARIN LESSONS =====================
        const zhLesson1 = await Lesson.create({
            title: '问候 — Greetings',
            description: 'Learn essential Mandarin Chinese greetings.',
            languageId: mandarin._id, difficulty: 'Beginner', order: 1, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: '你好', translation: 'Hello', pronunciation: 'Nǐ hǎo', example: '你好！你好吗？', exampleTranslation: 'Hello! How are you?' },
                    { word: '谢谢', translation: 'Thank you', pronunciation: 'Xiè xie', example: '非常谢谢！', exampleTranslation: 'Thank you very much!' },
                    { word: '再见', translation: 'Goodbye', pronunciation: 'Zài jiàn', example: '再见，明天见！', exampleTranslation: 'Goodbye, see you tomorrow!' },
                    { word: '请', translation: 'Please', pronunciation: 'Qǐng', example: '请坐。', exampleTranslation: 'Please sit down.' },
                    { word: '对不起', translation: 'Sorry', pronunciation: 'Duì bù qǐ', example: '对不起，我迟到了。', exampleTranslation: 'Sorry, I\'m late.' },
                    { word: '是 / 不是', translation: 'Yes / No', pronunciation: 'Shì / Bù shì', example: '是的，我是学生。', exampleTranslation: 'Yes, I am a student.' },
                ]
            }
        });
        const zhLesson2 = await Lesson.create({
            title: '数字 — Numbers',
            description: 'Learn to count in Mandarin Chinese.',
            languageId: mandarin._id, difficulty: 'Beginner', order: 2, estimatedMinutes: 10, xpReward: 25,
            content: {
                vocabulary: [
                    { word: '一', translation: 'One', pronunciation: 'Yī' }, { word: '二', translation: 'Two', pronunciation: 'Èr' },
                    { word: '三', translation: 'Three', pronunciation: 'Sān' }, { word: '四', translation: 'Four', pronunciation: 'Sì' },
                    { word: '五', translation: 'Five', pronunciation: 'Wǔ' }, { word: '十', translation: 'Ten', pronunciation: 'Shí' },
                ]
            }
        });

        console.log('All lessons created (including new languages)');

        // ===================== QUIZZES =====================
        const allLessons = [spLesson1, spLesson2, spLesson3, spLesson4, spLesson5,
            frLesson1, frLesson2, frLesson3, frLesson4,
            jpLesson1, jpLesson2, jpLesson3, jpLesson4];

        const quizData = {
            [spLesson1._id]: {
                title: 'Greetings Quiz',
                questions: [
                    { question: 'What is the Spanish word for "Hello"?', options: ['Hola', 'Bonjour', 'Ciao', 'Hallo'], correctAnswer: 'Hola', explanation: '"Hola" is the universal Spanish greeting.', points: 10 },
                    { question: 'How do you say "Good morning" in Spanish?', options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Buen viaje'], correctAnswer: 'Buenos días', explanation: '"Buenos días" literally means "good days".', points: 10 },
                    { question: 'What does "Gracias" mean?', options: ['Please', 'Sorry', 'Thank you', 'Hello'], correctAnswer: 'Thank you', explanation: '"Gracias" means "thank you". "Muchas gracias" = "thank you very much".', points: 10 },
                    { question: 'How do you say "Goodbye" in Spanish?', options: ['Hola', 'Gracias', 'Adiós', 'Por favor'], correctAnswer: 'Adiós', explanation: '"Adiós" is the common way to say goodbye.', points: 10 },
                    { question: '"Por favor" means:', options: ['Thank you', 'Please', 'Sorry', 'Hello'], correctAnswer: 'Please', explanation: '"Por favor" literally means "as a favor".', points: 10 }
                ]
            },
            [spLesson2._id]: {
                title: 'Numbers Quiz',
                questions: [
                    { question: 'What is "cinco" in English?', options: ['Three', 'Four', 'Five', 'Six'], correctAnswer: 'Five', explanation: '"Cinco" = 5.', points: 10 },
                    { question: 'How do you say "ten" in Spanish?', options: ['Diez', 'Doce', 'Dos', 'Dice'], correctAnswer: 'Diez', explanation: '"Diez" is 10 in Spanish.', points: 10 },
                    { question: '"Tres" means:', options: ['One', 'Two', 'Three', 'Thirty'], correctAnswer: 'Three', explanation: '"Tres" = 3.', points: 10 },
                    { question: 'What is "twenty" in Spanish?', options: ['Doce', 'Veinte', 'Treinta', 'Quince'], correctAnswer: 'Veinte', explanation: '"Veinte" = 20.', points: 10 },
                    { question: '"Uno" means:', options: ['One', 'Only', 'United', 'None'], correctAnswer: 'One', explanation: '"Uno" = 1.', points: 10 }
                ]
            },
            [spLesson3._id]: {
                title: 'Colors Quiz',
                questions: [
                    { question: 'What is "rojo" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 'Red', explanation: '"Rojo" = red.', points: 10 },
                    { question: 'How do you say "blue" in Spanish?', options: ['Rojo', 'Azul', 'Verde', 'Blanco'], correctAnswer: 'Azul', explanation: '"Azul" = blue.', points: 10 },
                    { question: '"Verde" means:', options: ['Yellow', 'Red', 'Green', 'White'], correctAnswer: 'Green', explanation: '"Verde" = green.', points: 10 },
                    { question: '"Grande" means:', options: ['Grand', 'Big', 'Small', 'Green'], correctAnswer: 'Big', explanation: '"Grande" = big or large.', points: 10 },
                    { question: 'What is "white" in Spanish?', options: ['Negro', 'Blanco', 'Azul', 'Rojo'], correctAnswer: 'Blanco', explanation: '"Blanco" = white.', points: 10 }
                ]
            },
            [spLesson4._id]: {
                title: 'Food & Drinks Quiz',
                questions: [
                    { question: 'What is "agua" in English?', options: ['Sugar', 'Water', 'Wine', 'Milk'], correctAnswer: 'Water', explanation: '"Agua" = water.', points: 10 },
                    { question: '"Pollo" means:', options: ['Pork', 'Fish', 'Chicken', 'Beef'], correctAnswer: 'Chicken', explanation: '"Pollo" = chicken.', points: 10 },
                    { question: 'How do you ask for the bill?', options: ['La mesa', 'La cuenta', 'La comida', 'La carta'], correctAnswer: 'La cuenta', explanation: '"La cuenta, por favor" = "The bill, please".', points: 10 },
                    { question: '"Delicioso" means:', options: ['Difficult', 'Delightful', 'Delicious', 'Dense'], correctAnswer: 'Delicious', explanation: '"Delicioso" = delicious.', points: 10 }
                ]
            },
            [spLesson5._id]: {
                title: 'Family Quiz',
                questions: [
                    { question: 'What is "madre" in English?', options: ['Father', 'Mother', 'Sister', 'Brother'], correctAnswer: 'Mother', explanation: '"Madre" = mother, "mamá" = mom.', points: 10 },
                    { question: '"Hermano" means:', options: ['Friend', 'Brother', 'Son', 'Uncle'], correctAnswer: 'Brother', explanation: '"Hermano" = brother, "hermana" = sister.', points: 10 },
                    { question: 'How do you say "friend" in Spanish?', options: ['Amigo', 'Hermano', 'Primo', 'Hijo'], correctAnswer: 'Amigo', explanation: '"Amigo/amiga" = friend.', points: 10 },
                    { question: '"Abuelo" means:', options: ['Uncle', 'Father', 'Grandfather', 'Cousin'], correctAnswer: 'Grandfather', explanation: '"Abuelo" = grandfather, "abuela" = grandmother.', points: 10 }
                ]
            },
            [frLesson1._id]: {
                title: 'French Greetings Quiz',
                questions: [
                    { question: 'What does "Bonjour" mean?', options: ['Goodbye', 'Hello', 'Thank you', 'Please'], correctAnswer: 'Hello', explanation: '"Bonjour" = Hello / Good day.', points: 10 },
                    { question: 'How do you say "Thank you" in French?', options: ['Bonjour', 'Merci', 'Oui', 'Non'], correctAnswer: 'Merci', explanation: '"Merci" = Thank you, "Merci beaucoup" = Thank you very much.', points: 10 },
                    { question: '"Au revoir" means:', options: ['Hello', 'Please', 'Goodbye', 'Excuse me'], correctAnswer: 'Goodbye', explanation: '"Au revoir" literally means "until seeing again".', points: 10 },
                    { question: 'How do you say "Please" in French?', options: ['Merci', "S'il vous plaît", 'Excusez-moi', 'Bonjour'], correctAnswer: "S'il vous plaît", explanation: '"S\'il vous plaît" literally means "if it pleases you".', points: 10 }
                ]
            },
            [frLesson2._id]: {
                title: 'French Numbers Quiz',
                questions: [
                    { question: 'What is "trois" in English?', options: ['Two', 'Three', 'Thirteen', 'Thirty'], correctAnswer: 'Three', explanation: '"Trois" = 3.', points: 10 },
                    { question: 'How do you say "five" in French?', options: ['Quatre', 'Cinq', 'Six', 'Cinque'], correctAnswer: 'Cinq', explanation: '"Cinq" = 5.', points: 10 },
                    { question: '"Dix" means:', options: ['Two', 'Six', 'Ten', 'Twelve'], correctAnswer: 'Ten', explanation: '"Dix" = 10.', points: 10 },
                    { question: '"Vingt" means:', options: ['Twelve', 'Fifteen', 'Twenty', 'Twenty-five'], correctAnswer: 'Twenty', explanation: '"Vingt" = 20.', points: 10 }
                ]
            },
            [frLesson3._id]: {
                title: 'French Food Quiz',
                questions: [
                    { question: 'What is "le fromage"?', options: ['Bread', 'Cheese', 'Wine', 'Salad'], correctAnswer: 'Cheese', explanation: '"Le fromage" = cheese. France has over 400 types!', points: 10 },
                    { question: 'How do you say "water" in French?', options: ['Le vin', "L'eau", 'Le lait', 'Le jus'], correctAnswer: "L'eau", explanation: '"L\'eau" = water.', points: 10 },
                    { question: '"Le pain" means:', options: ['Pain', 'Bread', 'Chicken', 'Salad'], correctAnswer: 'Bread', explanation: '"Le pain" = bread, a staple in France.', points: 10 },
                    { question: 'How do you ask for the bill in French?', options: ["L'addition", 'La carte', 'Le menu', 'La table'], correctAnswer: "L'addition", explanation: '"L\'addition, s\'il vous plaît" = "The bill, please."', points: 10 }
                ]
            },
            [frLesson4._id]: {
                title: 'French Family Quiz',
                questions: [
                    { question: 'What is "la mère" in English?', options: ['Mother', 'Father', 'Sister', 'Mayor'], correctAnswer: 'Mother', explanation: '"La mère" = mother.', points: 10 },
                    { question: '"Le frère" means:', options: ['Father', 'Brother', 'Friend', 'Son'], correctAnswer: 'Brother', explanation: '"Le frère" = brother.', points: 10 },
                    { question: 'How do you say "children" in French?', options: ['Les parents', 'Les amis', 'Les enfants', 'Les frères'], correctAnswer: 'Les enfants', explanation: '"Les enfants" = the children.', points: 10 },
                    { question: '"La sœur" means:', options: ['Daughter', 'Mother', 'Sister', 'Wife'], correctAnswer: 'Sister', explanation: '"La sœur" = sister.', points: 10 }
                ]
            },
            [jpLesson1._id]: {
                title: 'Japanese Greetings Quiz',
                questions: [
                    { question: 'What does "こんにちは" mean?', options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], correctAnswer: 'Hello', explanation: '"こんにちは" (Konnichiwa) = Hello.', points: 10 },
                    { question: 'How do you say "Thank you" in Japanese?', options: ['すみません', 'さようなら', 'ありがとうございます', 'こんばんは'], correctAnswer: 'ありがとうございます', explanation: '"ありがとうございます" (Arigatou gozaimasu) = Thank you.', points: 10 },
                    { question: '"おはようございます" means:', options: ['Good night', 'Good morning', 'Good evening', 'Goodbye'], correctAnswer: 'Good morning', explanation: '"おはようございます" is the polite form of "good morning".', points: 10 },
                    { question: '"すみません" means:', options: ['Thank you', 'Hello', 'Excuse me', 'Goodbye'], correctAnswer: 'Excuse me', explanation: '"すみません" can mean both "excuse me" and "sorry".', points: 10 }
                ]
            },
            [jpLesson2._id]: {
                title: 'Japanese Numbers Quiz',
                questions: [
                    { question: 'What is "さん" (三) in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 'Three', explanation: '三 (さん/san) = 3.', points: 10 },
                    { question: 'How do you say "five" in Japanese?', options: ['四', '五', '六', '七'], correctAnswer: '五', explanation: '五 (ご/go) = 5.', points: 10 },
                    { question: '"じゅう" (十) means:', options: ['Five', 'Seven', 'Ten', 'Twelve'], correctAnswer: 'Ten', explanation: '十 (じゅう/juu) = 10.', points: 10 },
                    { question: '"ひゃく" (百) means:', options: ['Ten', 'Fifty', 'One hundred', 'One thousand'], correctAnswer: 'One hundred', explanation: '百 (ひゃく/hyaku) = 100.', points: 10 }
                ]
            },
            [jpLesson3._id]: {
                title: 'Japanese Food Quiz',
                questions: [
                    { question: 'What is "水" (みず)?', options: ['Tea', 'Water', 'Milk', 'Juice'], correctAnswer: 'Water', explanation: '水 (みず/mizu) = water.', points: 10 },
                    { question: '"美味しい" means:', options: ['Beautiful', 'Delicious', 'Expensive', 'Hot'], correctAnswer: 'Delicious', explanation: '美味しい (おいしい/oishii) = delicious.', points: 10 },
                    { question: 'What does "いただきます" mean?', options: ['Thank you', "Let's eat", 'Goodbye', 'Excuse me'], correctAnswer: "Let's eat", explanation: '"いただきます" is said before eating, like "bon appétit".', points: 10 },
                    { question: '"ご飯" (gohan) means:', options: ['Fish', 'Noodles', 'Rice/Meal', 'Bread'], correctAnswer: 'Rice/Meal', explanation: '"ご飯" can mean both "rice" and "meal".', points: 10 }
                ]
            },
            [jpLesson4._id]: {
                title: 'Japanese Family Quiz',
                questions: [
                    { question: 'What is "お母さん"?', options: ['Father', 'Mother', 'Sister', 'Grandmother'], correctAnswer: 'Mother', explanation: '"お母さん" (okaasan) = mother (polite form).', points: 10 },
                    { question: '"友達" means:', options: ['Family', 'Brother', 'Friend', 'Teacher'], correctAnswer: 'Friend', explanation: '"友達" (tomodachi) = friend.', points: 10 },
                    { question: '"家族" means:', options: ['House', 'Family', 'Home', 'Country'], correctAnswer: 'Family', explanation: '"家族" (kazoku) = family.', points: 10 },
                    { question: 'What is "お父さん"?', options: ['Mother', 'Grandfather', 'Uncle', 'Father'], correctAnswer: 'Father', explanation: '"お父さん" (otousan) = father (polite form).', points: 10 }
                ]
            }
        };

        for (const [lessonId, data] of Object.entries(quizData)) {
            await Quiz.create({ lessonId, ...data });
        }
        console.log('All quizzes created');

        // Create progress for demo user
        await Progress.create({
            userId: demoUser._id,
            completedLessons: [
                { lessonId: spLesson1._id, xpEarned: 25 },
                { lessonId: spLesson2._id, xpEarned: 30 }
            ],
            quizScores: [
                { quizId: null, lessonId: spLesson1._id, score: 40, totalPoints: 50, percentage: 80, passed: true }
            ],
            streakDays: 7,
            longestStreak: 7,
            totalXP: 250,
            badges: [
                { name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
                { name: '3-Day Streak', description: 'Learn for 3 days in a row', icon: '🔥' }
            ],
            currentLanguage: spanish._id
        });

        // Update demo user selected language
        await User.findByIdAndUpdate(demoUser._id, { selectedLanguage: spanish._id });

        console.log('Demo user progress created');
        console.log('\n✅ Seed completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin:  admin@speakease.com / admin123');
        console.log('   User:   testuser@example.com / testuser123\n');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
