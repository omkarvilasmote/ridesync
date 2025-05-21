import React, { useEffect, useState } from 'react';

const Popup = ({ message, color, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        visible && (
            <div
                className="fixed top-[105px] right-5 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm animate-slide-in-out z-50 "
                style={{ backgroundColor: color }}
            >
                <p className="m-0">{message}</p>
            </div>
        )
    );
};

export default Popup;
