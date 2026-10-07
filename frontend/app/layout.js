export const metadata = {
  title: 'DevOps App',
  description: 'Aplicação Fullstack com Docker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}