
export function parseCSV<T>(csvText: string): T[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(','); // Simple split, assumes no commas in values
        const obj: any = {};
        header.forEach((key, index) => {
            const value = values[index]?.trim().replace(/"/g, '') || '';
            if (value === '') {
                 obj[key] = undefined;
            } else if (!isNaN(Number(value))) {
                obj[key] = Number(value);
            } else {
                obj[key] = value;
            }
        });
        return obj as T;
    });

    return data;
}
