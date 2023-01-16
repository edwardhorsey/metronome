import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';

type UseStateRef<S> = [S, Dispatch<SetStateAction<S>>, RefObject<S>];

const useStateRef = <S,>(initialState: S | (() => S)): UseStateRef<S> => {
    const [state, dispatch] = useState(initialState);
    const stateRef = useRef<S>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    return [state, dispatch, stateRef];
};

export default useStateRef;
