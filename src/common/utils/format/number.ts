// @ts-ignore
import shortNumber from 'short-number';

const number = {
    format(number: number) {
        return shortNumber(number);
    }
};

export { number };
