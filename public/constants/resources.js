const SortOptionMap = enumeration(["AUTHOR", 'DATE', 'RESOURCE_TYPE', 'COURSE']);

const SortOptionPropertyMap = {
    [SortOptionMap.AUTHOR]: 'author',
    [SortOptionMap.DATE]: 'date',
    [SortOptionMap.RESOURCE_TYPE]: 'typeOfResource',
    [SortOptionMap.COURSE]: 'course'

}
