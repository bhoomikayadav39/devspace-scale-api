// controllers/applicationController.js

// Dynamic memory layer for tracking job applications
const mockApplicationDatabase = [];

// 🚀 1. Log a new job application
export const createApplication = async (req, res, next) => {
    try {
        const { companyName, roleTitle, salaryRange, status, appliedResumeId } = req.body;

        if (!companyName || !roleTitle) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide at least a companyName and a roleTitle.'
            });
        }

        const newApplication = {
            id: `app_id_${Math.random().toString(36).substr(2, 9)}`,
            userId: req.user.id, // 🔒 Bound strictly to the authenticated user's ID
            companyName,
            roleTitle,
            salaryRange: salaryRange || 'Not disclosed',
            status: status || 'Applied', // Default tracking state
            appliedResumeId: appliedResumeId || 'None', // Connects application to the resume used
            updatedAt: new Date().toISOString()
        };

        mockApplicationDatabase.push(newApplication);

        res.status(201).json({
            status: 'success',
            message: 'Job application logged successfully.',
            data: { application: newApplication }
        });
    } catch (error) {
        next(error);
    }
};

// 🚀 2. Fetch all applications for the logged-in user
export const getMyApplications = async (req, res, next) => {
    try {
        // Enforce the data privacy boundary
        const userApps = mockApplicationDatabase.filter(app => app.userId === req.user.id);

        res.status(200).json({
            status: 'success',
            results: userApps.length,
            data: { applications: userApps }
        });
    } catch (error) {
        next(error);
    }
};
// Add this function to controllers/applicationController.js

// 🚀 3. Update the status of a specific job application
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params; // We grab the application ID from the URL

        if (!status) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a new status to update.'
            });
        }

        // 1. Locate the app: Check that it exists AND belongs to the logged-in user
        const application = mockApplicationDatabase.find(app => app.id === id && app.userId === req.user.id);

        if (!application) {
            return res.status(404).json({
                status: 'fail',
                message: 'Application not found or access denied.'
            });
        }

        // 2. Perform the update
        application.status = status;
        application.updatedAt = new Date().toISOString();

        res.status(200).json({
            status: 'success',
            message: `Application status updated to '${status}'.`,
            data: { application }
        });
    } catch (error) {
        next(error);
    }
};