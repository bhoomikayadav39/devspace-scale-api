// controllers/resumeController.js

// Dynamic memory layer for tracking resume items
const mockResumeDatabase = [];

// 🚀 1. Add a new resume record
export const uploadResumeRecord = async (req, res, next) => {
    try {
        const { fileName, jobTarget, skillsDetected } = req.body;

        if (!fileName || !jobTarget) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a fileName and jobTarget for this resume analysis.'
            });
        }

        const newResume = {
            id: `resume_id_${Math.random().toString(36).substr(2, 9)}`,
            userId: req.user.id, // 🔒 Linked securely to the user from the JWT protect middleware!
            fileName,
            jobTarget,
            skillsDetected: skillsDetected || [],
            uploadedAt: new Date().toISOString()
        };

        mockResumeDatabase.push(newResume);

        res.status(201).json({
            status: 'success',
            message: 'Resume profile tracked and analyzed successfully.',
            data: { resume: newResume }
        });
    } catch (error) {
        next(error);
    }
};

// 🚀 2. Fetch all resumes belonging ONLY to the logged-in user
export const MyResumes = async (req, res, next) => {
    try {
        // Filter the database array so users can never spy on anyone else's uploaded files
        const userResumes = mockResumeDatabase.filter(r => r.userId === req.user.id);

        res.status(200).json({
            status: 'success',
            results: userResumes.length,
            data: { resumes: userResumes }
        });
    } catch (error) {
        next(error);
    }
};