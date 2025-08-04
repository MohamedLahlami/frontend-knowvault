import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface AlertDialogProps {
    message: string;
    open: boolean;
    state: "success" | "error";
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
    onAnimationEnd?: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
                                                     message,
                                                     open,
                                                     state,
                                                     onClose,
                                                     autoClose = true,
                                                     duration = 3000,
                                                     onAnimationEnd,
                                                 }) => {
    const [visible, setVisible] = useState(open);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setVisible(true);
            setTimeout(() => setAnimate(true), 10);

            if (autoClose) {
                const timer = setTimeout(() => {
                    setAnimate(false);
                }, duration);

                return () => clearTimeout(timer);
            }
        } else {
            setAnimate(false);
        }
    }, [open, autoClose, duration]);

    const handleTransitionEnd = () => {
        if (!animate) {
            setVisible(false);
            onClose();
            if (onAnimationEnd) onAnimationEnd();
        }
    };

    if (!visible) return null;

    const config = state === "success"
        ? {
            bgColor: "bg-emerald-500",
            borderColor: "border-emerald-200",
            textColor: "text-emerald-800",
            icon: CheckCircle,
            bgGradient: "from-emerald-50 to-emerald-100",
        }
        : {
            bgColor: "bg-red-500",
            borderColor: "border-red-200",
            textColor: "text-red-800",
            icon: XCircle,
            bgGradient: "from-red-50 to-red-100",
        };

    const IconComponent = config.icon;

    return (
        <div
            className={`fixed inset-0 bg-black transition-all duration-200 ease-out flex items-center justify-center z-50 px-4 ${
                animate ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={() => setAnimate(false)}
            onTransitionEnd={handleTransitionEnd}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full border-2 ${config.borderColor} 
          transition-all duration-200 ease-out transform ${
                    animate
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-4"
                }`}
            >
                <button
                    onClick={() => setAnimate(false)}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150 group"
                >
                    <X size={16} className="text-gray-400 group-hover:text-gray-600" />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${config.bgColor} flex-shrink-0`}>
                            <IconComponent size={20} className="text-white" />
                        </div>
                    </div>

                    <div
                        className={`text-sm leading-relaxed ${config.textColor} bg-gradient-to-br ${config.bgGradient} p-4 rounded-lg border ${config.borderColor}`}
                    >
                        {message}
                    </div>
                </div>

                {autoClose && (
                    <div className="h-1 bg-gray-100 overflow-hidden">
                        <div
                            className={`h-full ${config.bgColor}`}
                            style={{
                                animation: `shrink ${duration}ms linear`,
                            }}
                        />
                    </div>
                )}

                <style>
                    {`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}
                </style>
            </div>
        </div>
    );
};

export default AlertDialog;
