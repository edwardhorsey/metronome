import dynamic from 'next/dynamic';

const Metronome = dynamic(() => import('@components/Metronome'), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="flex-1 py-20 flex flex-col justify-center items-center w-full bg-slate-900 text-white">
            <Metronome />
        </main>
    );
}
