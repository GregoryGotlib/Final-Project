const initialState = {
    byID:'',
    byName:'',
    bySeq:''
}

export default function(state = initialState , action){
    switch(action.type){
        case 'RESET':
            return state
        default:
            return state;
    }
}