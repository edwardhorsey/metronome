export function calculateAverageTempo(timestampArray: number[]) {
    const tempos = [];

    for (let i = 1; i < timestampArray.length; i++) {
        const elapsedTimeBetweenTaps = timestampArray[i] - timestampArray[i - 1];
        const tempo = 60_000 / elapsedTimeBetweenTaps;

        tempos.push(tempo);
    }

    return Math.floor(tempos.reduce((acc, tempos) => acc + tempos) / tempos.length);
}
