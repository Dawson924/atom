import _ from 'lodash';

export function flattenAndDeduplicate(arr: any, nestedArrayField: string | number, uniqBy: _.ValueIteratee<string>) {
    return _.uniqBy(
        _.flatMap(arr, obj => obj[nestedArrayField] || []),
        uniqBy
    );
}
