import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-center',
      style: {
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
}; 