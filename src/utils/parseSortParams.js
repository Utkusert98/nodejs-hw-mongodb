import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {

    const isKnowOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder); 
    if(isKnowOrder) return sortOrder; 

    return SORT_ORDER.ASC;
}

const parseSortBy = (sortBy) =>{
    const keyOfUser =[
        '_id',
        'name',
        'phoneNumber',
        'email',
        'contactType',
        'createdAt'
    ]
    if(keyOfUser.includes(sortBy)) return sortBy;

    return '_id';
}

export const parseSortParams = (query) =>{
    const {sortOrder, sortBy}= query;

    const parsedSortOrder = parseSortOrder(sortOrder);

    const parsedSortBy = parseSortBy(sortBy);

     return{
        sortOrder: parsedSortOrder,
        sortBy: parsedSortBy
    };
}