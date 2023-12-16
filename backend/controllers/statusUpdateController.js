const StatusUpdate = require('../models/StatusUpdate');
const User = require('../models/User');

exports.createStatusUpdate = async (req, res) => {
    console.log("req.user:", req.user);
    const { text, imageUrl } = req.body;
    
    const userId = req.user.id;
    if (!text && !imageUrl) {
        return res.status(400).json({ message: 'Content or image is required' });
    }
    console.log("userId:", userId);
    try {
        const statusUpdate = new StatusUpdate({
            user: userId,
            text,
            imageUrl
        });
        console.log("Status update to be saved:", statusUpdate);
        await statusUpdate.save();
        res.status(201).json({ message: 'Status update created successfully', statusUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

    
exports.updateStatusUpdate = async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;

    try {
        const statusUpdate = await StatusUpdate.findById(id);
        if (!statusUpdate) {
            return res.status(404).json({ message: 'Status update not found' });
        }

        if (statusUpdate.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        statusUpdate.text = text || statusUpdate.text;
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

        if (statusUpdate.user?.toString() !== req.user?.id?.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await StatusUpdate.findByIdAndDelete(id);
        res.json({ message: 'Status update deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

    
exports.getAllStatusUpdates = async (req, res) => {
    try {
        const statusUpdates = await StatusUpdate.find()
                                                 .populate('user', 'username') // 这里填充用户名
                                                 .sort({ createdAt: -1 });
        res.json(statusUpdates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getStatusUpdatesForUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = await StatusUpdate.find({ user: user._id }).sort({ timestamp: -1 });
        res.json(updates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};