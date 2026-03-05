export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    next();
};

export const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'superadmin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    next();
};

export const requireSuperAdmin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    if (req.session.role !== 'superadmin') {
        return res.status(403).json({ message: 'Forbidden. Super Admin access required.' });
    }
    next();
};

export const requireDriver = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    if (req.session.role !== 'driver' && req.session.role !== 'superadmin' && req.session.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Driver access required.' });
    }
    next();
};
