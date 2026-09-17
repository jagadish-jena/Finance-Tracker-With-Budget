import './globals.css';

export const metadata = {
  title: 'Personal Finance Tracker',
  description: 'Simple monthly personal finance tracker with budgeting'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
