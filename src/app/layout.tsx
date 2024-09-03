import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MySessionProvider from "@/components/Provider/SessionProvider";
import { ThemeProvider } from "@/components/Provider/ThemeProvider";
import { Toaster } from 'sonner';
import { CheckCheckIcon, CheckIcon, InfoIcon, XIcon } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sierraffle",
  description: "Sierra Raffle Entries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <MySessionProvider>
              {children}
              <Toaster
              toastOptions={{
                unstyled: true,
                classNames: {
                  error: 'bg-red-400',
                  success: 'text-green-400',
                  warning: 'text-yellow-400',
                  info: 'bg-blue-400',
                },
              }}
              icons={{
                success: <CheckIcon />,
                info: <InfoIcon />,
                error: <XIcon />,
              }}
               />
            </MySessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
