// Script to check and fix hello.tara4u@gmail.com email in database
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshit0150:harshit0150@cluster0.y5z6n.mongodb.net/tara?retryWrites=true&w=majority&appName=Cluster0';

async function checkAdminEmail() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db('tara');
        const users = db.collection('users');

        // Search for hello.tara4u email (case insensitive)
        console.log('🔍 Searching for hello.tara4u@gmail.com...\n');

        const exactMatch = await users.findOne({ email: 'hello.tara4u@gmail.com' });
        const caseInsensitiveMatch = await users.findOne({
            email: { $regex: /^hello\.tara4u@gmail\.com$/i }
        });
        const partialMatch = await users.findOne({
            email: { $regex: /hello.*tara4u/i }
        });

        console.log('📧 Exact match (hello.tara4u@gmail.com):', exactMatch ? 'FOUND ✅' : 'NOT FOUND ❌');
        if (exactMatch) {
            console.log('   Email in DB:', `"${exactMatch.email}"`);
            console.log('   Email length:', exactMatch.email.length);
            console.log('   Name:', exactMatch.name);
            console.log('   Firebase UID:', exactMatch.firebaseUid);
        }

        console.log('\n📧 Case insensitive match:', caseInsensitiveMatch ? 'FOUND ✅' : 'NOT FOUND ❌');
        if (caseInsensitiveMatch && caseInsensitiveMatch._id.toString() !== exactMatch?._id.toString()) {
            console.log('   Email in DB:', `"${caseInsensitiveMatch.email}"`);
            console.log('   Email length:', caseInsensitiveMatch.email.length);
            console.log('   Name:', caseInsensitiveMatch.name);
            console.log('   Firebase UID:', caseInsensitiveMatch.firebaseUid);
        }

        console.log('\n📧 Partial match (hello*tara4u):', partialMatch ? 'FOUND ✅' : 'NOT FOUND ❌');
        if (partialMatch && (!exactMatch || partialMatch._id.toString() !== exactMatch._id.toString())) {
            console.log('   Email in DB:', `"${partialMatch.email}"`);
            console.log('   Email length:', partialMatch.email.length);
            console.log('   Name:', partialMatch.name);
            console.log('   Firebase UID:', partialMatch.firebaseUid);
        }

        // Check all three admin emails
        console.log('\n\n📋 Checking all admin emails:\n');
        const adminEmails = [
            'harshit0150@gmail.com',
            'hello.tara4u@gmail.com',
            'ruchika.dave91@gmail.com'
        ];

        for (const email of adminEmails) {
            const user = await users.findOne({ email });
            if (user) {
                console.log(`✅ ${email}`);
                console.log(`   Stored as: "${user.email}"`);
                console.log(`   Length: ${user.email.length} (expected: ${email.length})`);
                console.log(`   Match: ${user.email === email ? 'EXACT ✅' : 'MISMATCH ❌'}`);

                // Check for hidden characters
                const hasHiddenChars = user.email.length !== email.length;
                if (hasHiddenChars) {
                    console.log(`   ⚠️  WARNING: Length mismatch! Hidden characters detected.`);
                    console.log(`   Hex: ${Buffer.from(user.email).toString('hex')}`);
                }
                console.log('');
            } else {
                console.log(`❌ ${email} - NOT FOUND IN DATABASE`);
                console.log('');
            }
        }

        // If hello.tara4u email found with issues, offer to fix
        if (partialMatch && partialMatch.email !== 'hello.tara4u@gmail.com') {
            console.log('\n🔧 ISSUE DETECTED!');
            console.log(`   Database has: "${partialMatch.email}"`);
            console.log(`   Should be:    "hello.tara4u@gmail.com"`);
            console.log('\n💡 To fix, run this MongoDB command:');
            console.log(`   db.users.updateOne(`);
            console.log(`     { _id: ObjectId("${partialMatch._id}") },`);
            console.log(`     { $set: { email: "hello.tara4u@gmail.com" } }`);
            console.log(`   )`);

            // Auto-fix option
            console.log('\n🔄 Auto-fixing email...');
            const result = await users.updateOne(
                { _id: partialMatch._id },
                { $set: { email: 'hello.tara4u@gmail.com' } }
            );

            if (result.modifiedCount > 0) {
                console.log('✅ Email fixed successfully!');
                const updated = await users.findOne({ _id: partialMatch._id });
                console.log(`   New email: "${updated.email}"`);
            } else {
                console.log('❌ Failed to fix email');
            }
        }

        // Final verification
        console.log('\n\n🎯 FINAL VERIFICATION:\n');
        const finalCheck = await users.findOne({ email: 'hello.tara4u@gmail.com' });
        if (finalCheck) {
            console.log('✅ hello.tara4u@gmail.com is now correctly stored in database');
            console.log(`   Email: "${finalCheck.email}"`);
            console.log(`   Name: ${finalCheck.name}`);
            console.log(`   Firebase UID: ${finalCheck.firebaseUid}`);
        } else {
            console.log('❌ hello.tara4u@gmail.com still not found with exact match');
            console.log('\n⚠️  MANUAL ACTION REQUIRED:');
            console.log('   1. Check if user exists with different email');
            console.log('   2. Update email manually in MongoDB');
            console.log('   3. Or create new user with correct email');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

checkAdminEmail();
