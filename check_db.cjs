const mongoose = require('mongoose');

// Need to define the schema since we can't easily import from ESM to CJS here without issues
const caseSchema = new mongoose.Schema({
  targetType: String,
  teacher: mongoose.Schema.Types.ObjectId,
  student: mongoose.Schema.Types.ObjectId,
  description: String,
}, { timestamps: true });

const DisciplineCase = mongoose.model('DisciplineCase', caseSchema);

async function check() {
  try {
    await mongoose.connect('mongodb+srv://Discipline_platform:Discipline_platform@cluster0.sacsbu4.mongodb.net/');
    console.log('CONNECTED');
    const cases = await DisciplineCase.find({}).lean();
    console.log('TOTAL_CASES:', cases.length);
    const teacherCases = cases.filter(c => c.targetType === 'teacher');
    console.log('TEACHER_CASES:', teacherCases.length);
    if (teacherCases.length > 0) {
      console.log('SAMPLE_TEACHER_CASE:', JSON.stringify(teacherCases[0], null, 2));
    }
    const teacherFieldCases = cases.filter(c => c.teacher);
    console.log('CASES_WITH_TEACHER_FIELD:', teacherFieldCases.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
