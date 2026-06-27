// middleware/security.js

/**
 * Recursively cleans text payloads to eliminate HTML tags and MongoDB operators ($)
 * without touching Express 5 read-only internals.
 */
const cleanPayload = (data) => {
    if (typeof data === 'string') {
        return data
            .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '') // Strip script blocks
            .replace(/<\/?[^>]+(>|$)/g, ''); // Strip standard HTML tags
    }
    
    if (data instanceof Object && data !== null) {
        for (const key in data) {
            if (key.startsWith('$') || key.includes('.')) {
                delete data[key]; // Erase dangerous NoSQL keys
            } else {
                data[key] = cleanPayload(data[key]); // Recursively clean child properties
            }
        }
    }
    return data;
};

export const applySecurityShield = (app) => {
    app.use((req, res, next) => {
        if (req.body) {
            req.body = cleanPayload(req.body);
        }
        next();
    });
    console.log('[SECURITY] Custom Express 5 Shield Operational.');
};