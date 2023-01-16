'use client';
import useMetronome from '@hooks/useMetronome';
import Button from '@components/Button';
import SoundPicker from '@components/SoundPicker';
import TapTempo from '@components/TapTempo';

export default function Metronome() {
    const { isPlaying, tempo, updateTempo, audioContext, updateSample, stop, start } = useMetronome();

    return (
        <div className="flex flex-col gap-5 w-72 xs:w-80">
            <h1 className="text-5xl">Metronome</h1>
            <h2 className="text-4xl">Tempo: {tempo}</h2>
            <Button
                onClick={() => {
                    isPlaying ? stop() : start();
                }}
            >
                {isPlaying ? 'Stop' : 'Start'}
            </Button>
            <input
                className="px-1"
                type="range"
                min={30}
                max={300}
                value={tempo}
                onChange={(event) => {
                    const value = Number(event.currentTarget.value);

                    updateTempo(value);
                }}
            />
            <div className="flex justify-between items-center">
                <TapTempo updateTempo={updateTempo} />
                <SoundPicker audioContext={audioContext} updateSample={updateSample} />
            </div>
        </div>
    );
}
