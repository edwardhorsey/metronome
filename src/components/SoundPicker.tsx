import { wait } from '@lib/misc';
import { loadAudioBufferFromUrl } from '@lib/sampleHelpers';
import { SyntheticEvent, useState } from 'react';
import SpinnerIcon from '@components/SpinnerIcon';
import { baseButtonStyles } from '@components/Button';

interface SoundPickerProps {
    audioContext: AudioContext;
    updateSample: (sound: AudioBuffer) => void;
}

export default function SoundPicker({ audioContext, updateSample }: SoundPickerProps) {
    const [state, setState] = useState({ isLoading: false, error: '' });
    const { isLoading, error } = state;

    const handleChange = async (event: SyntheticEvent<HTMLSelectElement>) => {
        const filepath = event.currentTarget.value;

        if (!filepath) {
            return;
        }

        setState({ isLoading: true, error: '' });

        try {
            const audioBuffer = await loadAudioBufferFromUrl(audioContext, filepath);
            await wait(400);

            updateSample(audioBuffer);

            setState({ isLoading: false, error: '' });
        } catch (error) {
            console.log(error);

            setState({ isLoading: false, error: 'Error loading sample' });
        }
    };

    return (
        <div className="relative flex flex-col">
            <label htmlFor="sample" className="pb-1">
                Sample
                {isLoading && <SpinnerIcon className="inline ml-2 pb-1 w-4 fill-white" />}
            </label>
            <select
                id="sample"
                className={`${baseButtonStyles} p-2 rounded-md`}
                onChange={handleChange}
                disabled={isLoading}
            >
                <option value="/sounds/ableton-metronome.wav">Ableton</option>
                <option value="/sounds/ableton-metronome-up.wav">Ableton Up</option>
                <option value="/sounds/cubase-metronome.wav">Cubase</option>
                <option value="/sounds/cubase-metronome-up.wav">Cubase Up</option>
                <option value="/sounds/fl-studio-metronome.wav">Fl Studio</option>
                <option value="/sounds/fl-studio-metronome-up.wav">Fl Studio Up</option>
                <option value="/sounds/logic-metronome.wav">Logic</option>
                <option value="/sounds/logic-metronome-up.wav">Logic Up</option>
            </select>
            {error && <p className="absolute -bottom-10 right-0 py-2 whitespace-nowrap text-red-500">{error}</p>}
        </div>
    );
}
