const initialState = {
    byID:'',
    byName:'',
    bySeq:''
}

export default function(state = initialState , action){
    console.log(state)
    switch(action.type){
        case 'RESET':
            return state
        default:
            return state;
    }
}