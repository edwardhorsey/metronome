import { calculateAverageTempo } from '@lib/tempoHelpers';
import { useState, useRef } from 'react';
import Button from '@components/Button';

interface TapTempoProps {
    updateTempo: (tempo: number) => void;
}

export default function TapTempo({ updateTempo }: TapTempoProps) {
    const [isTapping, setIsTapping] = useState(false);
    const [tappedValues, setTappedValues] = useState<number[]>([]);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

    const handleTap = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        if (tappedValues.length < 4) {
            // Show keep tapping message
            setIsTapping(true);
        } else {
            // Calculate average tempo and update metronome
            setIsTapping(false);

            const averageTempo = calculateAverageTempo(tappedValues);
            updateTempo(averageTempo);
        }

        // Store the 5 latest tapped values
        setTappedValues((tappedValues) => [...tappedValues.slice(-4), new Date().getTime()]);

        timeoutIdRef.current = setTimeout(() => {
            setIsTapping(false);
            setTappedValues([]);
            timeoutIdRef.current = undefined;
        }, 3_000);
    };

    return (
        <Button className="h-16 w-36" onClick={handleTap}>
            {isTapping ? 'Keep tapping...' : 'Tap'}
        </Button>
    );
}
