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

// 🚀 3. Analyze and Optimize a Resume against target keywords
export const optimizeResume = async (req, res, next) => {
    try {
        const { resumeId, targetJobDescription, targetKeywords } = req.body;

        if (!resumeId || !targetKeywords || !Array.isArray(targetKeywords)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a valid resumeId and an array of targetKeywords.'
            });
        }

        // 1. Locate the specific resume and verify ownership
        const resume = mockResumeDatabase.find(r => r.id === resumeId && r.userId === req.user.id);

        if (!resume) {
            return res.status(404).json({
                status: 'fail',
                message: 'Resume not found or you do not have permission to access it.'
            });
        }

        // 2. Optimization Engine: Calculate text matches cleanly
        const currentSkills = resume.skillsDetected.map(s => s.toLowerCase());
        const matchedKeywords = targetKeywords.filter(keyword => 
            currentSkills.includes(keyword.toLowerCase())
        );
        
        const missingKeywords = targetKeywords.filter(keyword => 
            !currentSkills.includes(keyword.toLowerCase())
        );

        // Calculate direct matching percentage
        const matchScore = targetKeywords.length > 0 
            ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) 
            : 0;

        // 3. Generate dynamic tailoring recommendations based on score levels
        let recommendation = "";
        if (matchScore >= 80) {
            recommendation = "Excellent match! Your resume is highly optimized for this target role.";
        } else if (matchScore >= 50) {
            recommendation = `Good baseline, but you should explicitly weave in these missing skills: ${missingKeywords.join(', ')}.`;
        } else {
            recommendation = `Critical gap detected. Strongly consider restructuring your experience to prominently highlight: ${missingKeywords.join(', ')}.`;
        }

        // 4. Save analysis details directly back onto the specific record item
        resume.lastAnalysis = {
            matchScore: `${matchScore}%`,
            targetJobDescription: targetJobDescription || "Not provided",
            matchedKeywords,
            missingKeywords,
            recommendation,
            analyzedAt: new Date().toISOString()
        };

        res.status(200).json({
            status: 'success',
            message: 'Resume analysis and optimization metrics generated.',
            data: {
                analysis: resume.lastAnalysis
            }
        });

    } catch (error) {
        next(error);
    }
};