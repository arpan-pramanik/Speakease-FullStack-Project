const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Language = require('./models/Language');

dotenv.config();

const languagesData = [
    // Existing / Core (already covered but good to upsert)
    { languageName: 'Spanish', code: 'ES', icon: '🇪🇸', description: 'Learn Spanish — the second most spoken language in the world.' },
    { languageName: 'French', code: 'FR', icon: '🇫🇷', description: 'Discover the language of love, diplomacy, and culture.' },
    { languageName: 'Japanese', code: 'JP', icon: '🇯🇵', description: 'Explore the fascinating world of Japanese.' },
    { languageName: 'German', code: 'DE', icon: '🇩🇪', description: 'Learn the language of engineering, philosophy, and culture.' },
    { languageName: 'Italian', code: 'IT', icon: '🇮🇹', description: 'Discover la bella lingua — the language of art, music, fashion, and cuisine.' },
    { languageName: 'Korean', code: 'KO', icon: '🇰🇷', description: 'Explore the language of K-pop, K-dramas, and a vibrant tech culture.' },
    { languageName: 'Mandarin Chinese', code: 'ZH', icon: '🇨🇳', description: 'Learn the most spoken language on Earth.' },
    { languageName: 'English', code: 'EN', icon: '🇬🇧', description: 'The global language of business, science, and the internet.' },

    // Indian Languages (22 official + major ones)
    { languageName: 'Hindi', code: 'HI', icon: '🇮🇳', description: 'The most widely spoken language in India, deeply connected to its culture and cinema.' },
    { languageName: 'Bengali', code: 'BN', icon: '🇮🇳', description: 'Spoken in West Bengal and Bangladesh, known for a rich literary heritage.' },
    { languageName: 'Telugu', code: 'TE', icon: '🇮🇳', description: 'A major Dravidian language, widely spoken in Andhra Pradesh and Telangana.' },
    { languageName: 'Marathi', code: 'MR', icon: '🇮🇳', description: 'Spoken predominantly in Maharashtra.' },
    { languageName: 'Tamil', code: 'TA', icon: '🇮🇳', description: 'One of the longest surviving classical languages in the world.' },
    { languageName: 'Urdu', code: 'UR', icon: '🇵🇰', description: 'Known for its beauty and poetry.' },
    { languageName: 'Gujarati', code: 'GU', icon: '🇮🇳', description: 'Native to Gujarat, a language of trade and commerce.' },
    { languageName: 'Kannada', code: 'KN', icon: '🇮🇳', description: 'Spoken in Karnataka, known for its rich history and literature.' },
    { languageName: 'Odia', code: 'OR', icon: '🇮🇳', description: 'A classical language from the state of Odisha.' },
    { languageName: 'Malayalam', code: 'ML', icon: '🇮🇳', description: 'Native language of Kerala, completely palindromic in English!' },
    { languageName: 'Punjabi', code: 'PA', icon: '🇮🇳', description: 'A vibrant language closely associated with Bhangra and a rich cultural heritage.' },
    { languageName: 'Assamese', code: 'AS', icon: '🇮🇳', description: 'Spoken in Northeast India along the Brahmaputra valley.' },
    { languageName: 'Maithili', code: 'MAI', icon: '🇮🇳', description: 'Spoken in Bihar and Nepal.' },
    { languageName: 'Santali', code: 'SAT', icon: '🇮🇳', description: 'An Austroasiatic language spoken by the Santhal people.' },
    { languageName: 'Kashmiri', code: 'KS', icon: '🇮🇳', description: 'Spoken in the beautiful Kashmir Valley.' },
    { languageName: 'Nepali', code: 'NE', icon: '🇳🇵', description: 'The lingua franca of Nepal, also spoken in India and Bhutan.' },
    { languageName: 'Sindhi', code: 'SD', icon: '🇮🇳', description: 'Spoken by the Sindhi diaspora in India and Pakistan.' },
    { languageName: 'Dogri', code: 'DOI', icon: '🇮🇳', description: 'Spoken in Jammu and parts of Himachal Pradesh.' },
    { languageName: 'Konkani', code: 'KOK', icon: '🇮🇳', description: 'The official language of the coastal state of Goa.' },
    { languageName: 'Bodo', code: 'BRX', icon: '🇮🇳', description: 'Spoken by the Bodo people of Assam.' },
    { languageName: 'Sanskrit', code: 'SA', icon: '🇮🇳', description: 'The ancient mother of many modern Indian languages.' },

    // European
    { languageName: 'Portuguese', code: 'PT', icon: '🇵🇹', description: 'Spoken globally, especially in Portugal and Brazil.' },
    { languageName: 'Russian', code: 'RU', icon: '🇷🇺', description: 'The most geographically widespread language of Eurasia.' },
    { languageName: 'Dutch', code: 'NL', icon: '🇳🇱', description: 'Closely related to English and German.' },
    { languageName: 'Polish', code: 'PL', icon: '🇵🇱', description: 'A major Slavic language spoken centrally in Europe.' },
    { languageName: 'Ukrainian', code: 'UK', icon: '🇺🇦', description: 'A beautiful Slavic language spoken mostly in Ukraine.' },
    { languageName: 'Romanian', code: 'RO', icon: '🇷🇴', description: 'A Romance language with complex grammar and history.' },
    { languageName: 'Greek', code: 'EL', icon: '🇬🇷', description: 'One of the oldest recorded living languages.' },
    { languageName: 'Hungarian', code: 'HU', icon: '🇭🇺', description: 'A Uralic language, unique and fascinating in central Europe.' },
    { languageName: 'Czech', code: 'CS', icon: '🇨🇿', description: 'A West Slavic language from the heart of Europe.' },
    { languageName: 'Swedish', code: 'SV', icon: '🇸🇪', description: 'A North Germanic language, spoken in Sweden and parts of Finland.' },
    { languageName: 'Danish', code: 'DA', icon: '🇩🇰', description: 'Known for its distinct phonetic quirks in Northern Europe.' },
    { languageName: 'Finnish', code: 'FI', icon: '🇫🇮', description: 'A beautiful and highly phonetic language.' },
    { languageName: 'Norwegian', code: 'NO', icon: '🇳🇴', description: 'Spoken primarily in Norway.' },
    { languageName: 'Gaelic (Irish)', code: 'GA', icon: '🇮🇪', description: 'The Celtic language of Ireland.' },
    { languageName: 'Welsh', code: 'CY', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', description: 'A Celtic language of Wales.' },
    { languageName: 'Icelandic', code: 'IS', icon: '🇮🇸', description: 'Has changed little since the Vikings settled Iceland.' },

    // Middle East & North Africa
    { languageName: 'Arabic', code: 'AR', icon: '🇸🇦', description: 'A major global language with rich historical and cultural depth.' },
    { languageName: 'Hebrew', code: 'HE', icon: '🇮🇱', description: 'An ancient language revived successfully as a modern spoken language.' },
    { languageName: 'Persian (Farsi)', code: 'FA', icon: '🇮🇷', description: 'The language of Iran, known for its poetry.' },
    { languageName: 'Turkish', code: 'TR', icon: '🇹🇷', description: 'An agglutinative language spoken mainly in Turkey.' },

    // Asia
    { languageName: 'Vietnamese', code: 'VI', icon: '🇻🇳', description: 'A tonal language of Southeast Asia.' },
    { languageName: 'Thai', code: 'TH', icon: '🇹🇭', description: 'Known for its complex script and tonal system.' },
    { languageName: 'Indonesian', code: 'ID', icon: '🇮🇩', description: 'The lingua franca of the Indonesian archipelago.' },
    { languageName: 'Malay', code: 'MS', icon: '🇲🇾', description: 'A major language of Southeast Asia.' },
    { languageName: 'Tagalog', code: 'TL', icon: '🇵🇭', description: 'The foundation of the Filipino national language.' },
    { languageName: 'Khmer', code: 'KM', icon: '🇰🇭', description: 'The official language of Cambodia.' },
    { languageName: 'Lao', code: 'LO', icon: '🇱🇦', description: 'Closely related to Thai, spoken in Laos.' },
    { languageName: 'Burmese', code: 'MY', icon: '🇲🇲', description: 'The language of Myanmar.' },
    { languageName: 'Sinhala', code: 'SI', icon: '🇱🇰', description: 'The native language of the Sinhalese people of Sri Lanka.' },
    { languageName: 'Mongolian', code: 'MN', icon: '🇲🇳', description: 'The official language of Mongolia.' },
    { languageName: 'Uyghur', code: 'UG', icon: '🇨🇳', description: 'A Turkic language spoken in the Xinjiang region.' },
    { languageName: 'Kazakh', code: 'KK', icon: '🇰🇿', description: 'A Turkic language spoken in Kazakhstan.' },
    { languageName: 'Uzbek', code: 'UZ', icon: '🇺🇿', description: 'The main language of Uzbekistan.' },
    { languageName: 'Tajik', code: 'TG', icon: '🇹🇯', description: 'A variety of Persian spoken in Central Asia.' },
    { languageName: 'Kyrgyz', code: 'KY', icon: '🇰🇬', description: 'The official language of Kyrgyzstan.' },
    { languageName: 'Armenian', code: 'HY', icon: '🇦🇲', description: 'An Indo-European language with its own unique alphabet.' },
    { languageName: 'Georgian', code: 'KA', icon: '🇬🇪', description: 'Known for its beautiful bespoke alphabet.' },
    { languageName: 'Azerbaijani', code: 'AZ', icon: '🇦🇿', description: 'A Turkic language spoken in Azerbaijan.' },

    // Africa
    { languageName: 'Swahili', code: 'SW', icon: '🇰🇪', description: 'A Bantu language serving as a lingua franca in East Africa.' },
    { languageName: 'Amharic', code: 'AM', icon: '🇪🇹', description: 'The working language of Ethiopia.' },
    { languageName: 'Yoruba', code: 'YO', icon: '🇳🇬', description: 'A prominent language of West Africa.' },
    { languageName: 'Zulu', code: 'ZU', icon: '🇿🇦', description: 'The most widely spoken home language in South Africa.' },
    { languageName: 'Afrikaans', code: 'AF', icon: '🇿🇦', description: 'A daughter language of Dutch spoken in southern Africa.' },
    { languageName: 'Hausa', code: 'HA', icon: '🇳🇬', description: 'A widely spoken Chadic language.' },
    { languageName: 'Igbo', code: 'IG', icon: '🇳🇬', description: 'Spoken natively by the Igbo people in southeastern Nigeria.' },
    { languageName: 'Somali', code: 'SO', icon: '🇸🇴', description: 'Spoken in the Horn of Africa.' },
    { languageName: 'Oromo', code: 'OM', icon: '🇪🇹', description: 'A Cushitic language spoken in Ethiopia and Kenya.' },
    { languageName: 'Tigrinya', code: 'TI', icon: '🇪🇷', description: 'Spoken in Eritrea and northern Ethiopia.' },
    { languageName: 'Kinyarwanda', code: 'RW', icon: '🇷🇼', description: 'The national language of Rwanda.' },

    // Add more to hit 100
    { languageName: 'Serbian', code: 'SR', icon: '🇷🇸', description: 'A South Slavic language.' },
    { languageName: 'Croatian', code: 'HR', icon: '🇭🇷', description: 'Spoken in Croatia and parts of Bosnia.' },
    { languageName: 'Bosnian', code: 'BS', icon: '🇧🇦', description: 'Spoken primarily in Bosnia and Herzegovina.' },
    { languageName: 'Macedonian', code: 'MK', icon: '🇲🇰', description: 'The official language of North Macedonia.' },
    { languageName: 'Slovak', code: 'SK', icon: '🇸🇰', description: 'The official language of Slovakia.' },
    { languageName: 'Slovenian', code: 'SL', icon: '🇸🇮', description: 'A South Slavic language from Slovenia.' },
    { languageName: 'Albanian', code: 'SQ', icon: '🇦🇱', description: 'An Indo-European language spoken in Albania and Kosovo.' },
    { languageName: 'Bulgarian', code: 'BG', icon: '🇧🇬', description: 'A South Slavic language from Bulgaria.' },
    { languageName: 'Belarusian', code: 'BE', icon: '🇧🇾', description: 'An East Slavic language from Belarus.' },
    { languageName: 'Latvian', code: 'LV', icon: '🇱🇻', description: 'A Baltic language spoken in Latvia.' },
    { languageName: 'Lithuanian', code: 'LT', icon: '🇱🇹', description: 'One of the oldest surviving Indo-European languages.' },
    { languageName: 'Estonian', code: 'ET', icon: '🇪🇪', description: 'A Finnic language closest to Finnish.' },
    { languageName: 'Maltese', code: 'MT', icon: '🇲🇹', description: 'A Semitic language from Malta.' },
    { languageName: 'Basque', code: 'EU', icon: '🇪🇸', description: 'A unique language isolate in the Basque Country.' },
    { languageName: 'Catalan', code: 'CA', icon: '🇪🇸', description: 'A Romance language spoken in Catalonia.' },
    { languageName: 'Galician', code: 'GL', icon: '🇪🇸', description: 'Closely related to Portuguese, spoken in Spain.' },
    { languageName: 'Haitian Creole', code: 'HT', icon: '🇭🇹', description: 'A French-based creole language spoken in Haiti.' },
    { languageName: 'Javanese', code: 'JV', icon: '🇮🇩', description: 'Spoken on the island of Java, Indonesia.' },
    { languageName: 'Sundanese', code: 'SU', icon: '🇮🇩', description: 'Spoken in western Java.' },
    { languageName: 'Madurese', code: 'MAD', icon: '🇮🇩', description: 'Spoken by the Madurese people.' },
    { languageName: 'Fijian', code: 'FJ', icon: '🇫🇯', description: 'An Austronesian language of Fiji.' },
    { languageName: 'Hawaiian', code: 'HAW', icon: '🇺🇸', description: 'The Polynesian language of the Hawaiian Islands.' },
    { languageName: 'Samoan', code: 'SM', icon: '🇼🇸', description: 'A Polynesian language spoken in Samoa.' },
    { languageName: 'Tongan', code: 'TO', icon: '🇹🇴', description: 'The language of Tonga.' },
    { languageName: 'Maori', code: 'MI', icon: '🇳🇿', description: 'The indigenous language of New Zealand.' },
    { languageName: 'Quechua', code: 'QU', icon: '🇵🇪', description: 'An indigenous language family of the Andes.' },
    { languageName: 'Guarani', code: 'GN', icon: '🇵🇾', description: 'One of the official languages of Paraguay.' },
    { languageName: 'Aymara', code: 'AY', icon: '🇧🇴', description: 'Spoken by the Aymara people in the Andes.' },
    { languageName: 'Esperanto', code: 'EO', icon: '🌍', description: 'The most widely spoken constructed international auxiliary language.' },
    { languageName: 'Latin', code: 'LA', icon: '🏛️', description: 'The classical language of the Roman Empire.' }
];

const seedExtended = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for massive language expansion...');

        console.log(`Starting to insert ${languagesData.length} languages...`);

        for (const data of languagesData) {
            await Language.findOneAndUpdate(
                { languageName: data.languageName },
                {
                    $set: {
                        languageName: data.languageName,
                        code: data.code,
                        description: data.description,
                        icon: data.icon,
                        level: 'Beginner'
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log(`✅ Loaded ${languagesData.length} languages successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding languages:', err);
        process.exit(1);
    }
};

seedExtended();
