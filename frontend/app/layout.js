import "./globals.css";
export const metadata = {
  title: "Personal Finance Tracker",
  description: "Simple finance tracker",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
