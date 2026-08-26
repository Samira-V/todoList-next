import './globals.css';


export const metadata = {
  title: 'Task Management App',
  description: 'Designed with Next.js App Router and Pure CSS Modules',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}