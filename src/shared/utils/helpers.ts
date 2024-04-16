export class Helpers {
    // We can call the method without instantiating the class.
    static firstLetterUppercase(str: string | undefined): string | undefined {
        if (str) {
            const valueString = str.toLowerCase();
            return valueString
                .split(" ")
                .map(
                    (value: string) =>
                        `${value.charAt(0).toUpperCase()}${value.slice(1).toLocaleLowerCase()}`
                )
                .join(" ");
        }
    }

    static lowerCase(str: string | undefined): string | undefined {
        if (str) return str.toLocaleLowerCase();
    }

    static generateRandomIntegers(lengthOfIntegers: number): number {
        const characters: string = "0123456789";
        let result = " ";

        for (let i = 0; i < lengthOfIntegers; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        return parseInt(result, 10);
    }
}
