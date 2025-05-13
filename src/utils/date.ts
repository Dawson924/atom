import { format } from 'date-fns';

const UTC_STRING_FORMAT = 'EEE, dd MMM yyyy HH:mm:ss';

const toUTCStringPretty = (date: string) => {
    return format(new Date(date), UTC_STRING_FORMAT);
};

export { UTC_STRING_FORMAT, toUTCStringPretty };
