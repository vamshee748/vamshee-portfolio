import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Head from 'next/head';

export default function App({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>Vamshee Bhatt — Software Developer</title>
        <meta name="description" content="Software developer specializing in cloud infrastructure, full-stack systems, and performance engineering." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>" />
      </Head>
      <div className="grid-bg" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
      <Footer />
    </>
  );
}
