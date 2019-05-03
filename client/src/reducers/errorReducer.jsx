const initialState = {

}

export default function (state = initialState, action){
    switch(action.type){
        case 'ERRORS':
            return action.payload

        case 'RESET_ERRORS':
            return {};
                    
        default: return state;
    }
}