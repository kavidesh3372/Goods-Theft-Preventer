import { useEffect } from "react";

const PopupMessage = ({ message, type = "info", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // auto close in 5s
        return () => clearTimeout(timer);
    }, [onClose]);

    const typeColor = {
        success: "text-green-800 bg-white",
        error: "text-red-800 bg-white",
        info: "text-blue-800 bg-white",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div
                className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-xl border-2 text-center ${typeColor[type]}`}
            >
                <p className="text-lg font-medium mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-all"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default PopupMessage;
