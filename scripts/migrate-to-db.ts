
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Schedule from '../models/Schedule';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Data files to migrate
const YEARS = ['2025', '2026'];

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected.');

        for (const year of YEARS) {
            const filePath = path.join(__dirname, `../data/${year}.json`);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}, skipping...`);
                continue;
            }

            console.log(`Reading data from ${year}.json...`);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContent);

            if (!Array.isArray(data)) {
                console.warn(`Invalid data format in ${year}.json, expected array.`);
                continue;
            }

            console.log(`Found ${data.length} records for ${year}.`);

            // Upsert: Create or Update based on (year, index)
            let count = 0;
            for (const item of data) {
                await Schedule.findOneAndUpdate(
                    { year, index: item.index },
                    { ...item, year }, // Ensure year is in the doc
                    { upsert: true, new: true }
                );
                count++;
            }
            console.log(`Imported ${count} records for ${year}.`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
