import "./globals.css";
export const metadata = {
  title: "ITSP Team Making",
  description: "Created by ITC Web Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative bg-white font-sans">
        <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#ffffff_40%,#e9d5ff_100%)]"/>
        {children}
      </body>
    </html>
  );
}
