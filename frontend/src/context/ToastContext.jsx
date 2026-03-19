import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const createToastId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message = "", type = "info", duration = 3200 }) => {
      const id = createToastId();
      setToasts((previous) => [...previous, { id, title, message, type }]);

      if (duration > 0) {
        window.setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast
    }),
    [toasts, showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex w-full max-w-md flex-col gap-3 px-4 sm:right-4 sm:left-auto sm:mx-0 sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto overflow-hidden rounded-[1.35rem] border p-4 shadow-[0_18px_45px_rgba(24,33,45,0.18)] backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : toast.type === "error"
                  ? "border-red-200 bg-red-50/95 text-red-900"
                  : toast.type === "loading"
                    ? "border-amber-200 bg-amber-50/95 text-amber-900"
                    : "border-[#d9cfba] bg-[#fff9ef]/95 text-[#18212d]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                  toast.type === "success"
                    ? "bg-emerald-500"
                    : toast.type === "error"
                      ? "bg-red-500"
                      : toast.type === "loading"
                        ? "bg-amber-500"
                        : "bg-[#a12c2f]"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold uppercase tracking-[0.18em]">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-2 text-sm leading-6 opacity-80">{toast.message}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-full px-2 py-1 text-xs font-bold uppercase tracking-[0.16em] opacity-70 transition hover:opacity-100"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };
