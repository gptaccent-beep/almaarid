import localFont from 'next/font/local';
import './globals.css';

const latinFont = localFont({
  src: [
    {path: '../fonts/tahoma.ttf', weight: '400', style: 'normal'},
    {path: '../fonts/tahomabd.ttf', weight: '700', style: 'normal'}
  ],
  display: 'swap',
  variable: '--font-latin',
  fallback: ['system-ui', 'sans-serif']
});

const arabicFont = localFont({
  src: [{path: '../fonts/arial-unicode-ms.ttf', weight: '400', style: 'normal'}],
  display: 'swap',
  variable: '--font-arabic',
  fallback: ['Tahoma', 'Arial', 'system-ui', 'sans-serif']
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  const initialTheme = 'dark';
  const bootstrapScript = `
    (function () {
      try {
        var locale = location.pathname.split('/')[1];
        if (!/^(ar|fr|en)$/.test(locale)) {
          locale = localStorage.getItem('almaarid-locale') || 'ar';
        }
        var theme = localStorage.getItem('almaarid-theme') || document.cookie.split('; ').find(function (item) {
          return item.indexOf('almaarid_theme=') === 0;
        });
        theme = theme && theme.indexOf('=') > -1 ? theme.split('=')[1] : theme;
        if (!theme) theme = 'dark';
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
      } catch {}
    })();
  `;

  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${latinFont.variable} ${arabicFont.variable} ${initialTheme === 'dark' ? 'dark' : ''}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: bootstrapScript}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
