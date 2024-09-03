declare module 'sooner' {
  interface ToastOptions {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
  }

  export function toast(options: ToastOptions): void;
}