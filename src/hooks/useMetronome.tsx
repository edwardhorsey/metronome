import { loadAudioBufferFromUrl } from '@lib/sampleHelpers';
import { useState, useEffect, useRef, useCallback } from 'react';
import useStateRef from '@hooks/useStateRef';

const SCHEDULE_AHEAD_TIME = 0.2;
const LOOKAHEAD = 50;

interface MetronomeState {
    tempo: number;
    isPlaying: boolean;
    sample: AudioBuffer | undefined;
}

interface SchedulerRef {
    current16th: number;
    nextNoteTime: number;
    timerID?: ReturnType<typeof setTimeout>;
}

interface UseMetronome {
    audioContext: AudioContext;
    isPlaying: boolean;
    tempo: number;
    start: () => void;
    stop: () => void;
    updateTempo: (tempo: number) => void;
    updateSample: (sample: AudioBuffer) => void;
}

export default function useMetronome(): UseMetronome {
    const [audioContext] = useState(() => new AudioContext());
    const [state, setState, stateRef] = useStateRef<MetronomeState>(() => ({
        tempo: 90,
        isPlaying: false,
        sample: undefined,
    }));
    const schedulerRef = useRef<SchedulerRef>({
        current16th: 0,
        nextNoteTime: 0,
        timerID: undefined,
    });

    useEffect(() => {
        const loadInitialSample = async () => {
            const audioBuffer = await loadAudioBufferFromUrl(audioContext, 'sounds/ableton-metronome.wav');

            setState((state) => ({ ...state, sample: audioBuffer }));
        };

        loadInitialSample();
    }, [audioContext, setState]);

    const generateNextNotes = () => {
        if (!stateRef.current) return;

        const singleQuarterNote = 60.0 / stateRef.current.tempo;
        const single16thNote = singleQuarterNote / 4;

        schedulerRef.current.current16th += 1;
        schedulerRef.current.nextNoteTime += single16thNote;

        if (schedulerRef.current.current16th === 16) {
            schedulerRef.current.current16th = 0;
        }
    };

    const scheduleNotes = () => {
        if ([0, 4, 8, 12].includes(schedulerRef.current.current16th) && stateRef.current?.sample) {
            const sampleSource = audioContext.createBufferSource();

            // Play sample
            sampleSource.buffer = stateRef.current.sample;
            sampleSource.connect(audioContext.destination);
            sampleSource.start(schedulerRef.current.nextNoteTime);
        }
    };

    const scheduler = () => {
        while (schedulerRef.current.nextNoteTime < audioContext.currentTime + SCHEDULE_AHEAD_TIME) {
            scheduleNotes();
            generateNextNotes();
        }

        schedulerRef.current.timerID = setTimeout(scheduler, LOOKAHEAD);
    };

    const start = () => {
        if (typeof schedulerRef.current.timerID !== 'undefined') {
            return;
        }

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        schedulerRef.current.nextNoteTime = audioContext.currentTime;

        scheduler();

        setState((state) => ({ ...state, isPlaying: true }));
    };

    const stop = () => {
        clearTimeout(schedulerRef.current.timerID);
        schedulerRef.current.timerID = undefined;

        schedulerRef.current.current16th = 0;
        schedulerRef.current.nextNoteTime = 0;

        setState((state) => ({ ...state, isPlaying: false }));
    };

    const updateTempo = useCallback(
        (tempo: number) => {
            setState((state) => ({ ...state, tempo }));
        },
        [setState],
    );

    const updateSample = useCallback(
        (sample: AudioBuffer) => {
            setState((state) => ({ ...state, sample }));
        },
        [setState],
    );

    return {
        audioContext,
        isPlaying: state.isPlaying,
        tempo: state.tempo,
        start,
        stop,
        updateTempo,
        updateSample,
    };
}
