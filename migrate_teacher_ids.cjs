const mongoose = require('mongoose');

// Schema definitions for the migration
const CaseSchema = new mongoose.Schema({
  targetType: String,
  teacher: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const MemberSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const DisciplineCase = mongoose.model('DisciplineCase', CaseSchema);
const Member = mongoose.model('Member', MemberSchema);

async function migrate() {
  try {
    await mongoose.connect('mongodb+srv://Discipline_platform:Discipline_platform@cluster0.sacsbu4.mongodb.net/');
    console.log('CONNECTED TO DB');

    // 1. Find all teacher portal cases
    const teacherCases = await DisciplineCase.find({ targetType: 'teacher' });
    console.log(`Found ${teacherCases.length} teacher portal cases.`);

    let updatedCount = 0;
    for (const caseDoc of teacherCases) {
      if (!caseDoc.teacher) {
        console.log(`- Case ${caseDoc._id} has no teacher ID. Skipping.`);
        continue;
      }

      // Check if this ID belongs to a Member instead of a User
      const member = await Member.findById(caseDoc.teacher);
      if (member && member.user) {
        console.log(`- Migrating Case ${caseDoc._id}: Member ID ${caseDoc.teacher} -> User ID ${member.user}`);
        caseDoc.teacher = member.user;
        await caseDoc.save();
        updatedCount++;
      } else {
        console.log(`- Case ${caseDoc._id}: Teacher ID ${caseDoc.teacher} already correctly points to a User or Member not found.`);
      }
    }

    console.log(`MIGRATION COMPLETE. Updated ${updatedCount} cases.`);
    process.exit(0);
  } catch (err) {
    console.error('MIGRATION FAILED:', err);
    process.exit(1);
  }
}

migrate();
