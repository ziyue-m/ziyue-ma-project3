const StatusUpdate = require('../models/StatusUpdate');

exports.createStatusUpdate = async (req, res) => {
    const { text, imageUrl } = req.body;
    if (!text && !imageUrl) {
        return res.status(400).json({ message: 'Content or image is required' });
    }

    try {
        const statusUpdate = new StatusUpdate({
            user: req.user._id,
            text,
            imageUrl
        });

        await statusUpdate.save();
        res.status(201).json({ message: 'Status update created successfully', statusUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

    
exports.updateStatusUpdate = async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    try {
        const statusUpdate = await StatusUpdate.findById(id);
        if (!statusUpdate) {
            return res.status(404).json({ message: 'Status update not found' });
        }

        if (statusUpdate.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        statusUpdate.content = content || statusUpdate.content;
        await statusUpdate.save();
        res.json({ message: 'Status update updated successfully', statusUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStatusUpdate = async (req, res) => {
    const { id } = req.params;

    try {
        const statusUpdate = await StatusUpdate.findById(id);
        if (!statusUpdate) {
            return res.status(404).json({ message: 'Status update not found' });
        }

        if (statusUpdate.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await statusUpdate.remove();
        res.json({ message: 'Status update deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

    
exports.getAllStatusUpdates = async (req, res) => {
    try {
        const statusUpdates = await StatusUpdate.find().sort({ createdAt: -1 });
        res.json(statusUpdates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getStatusUpdatesForUser = async (req, res) => {
    try {
        const updates = await StatusUpdate.find({ username: req.params.username });
        res.json(updates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
