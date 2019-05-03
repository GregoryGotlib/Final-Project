import checkInput from '../utilities/checkInput'

const initialState = {
    isAuthenticated: false,
    user:{}
}

export default function (state = initialState , action){
    switch(action.type){
        case 'DECODED_USER':
            return{
                ...state,
                isAuthenticated: !checkInput(action.payload),
                user: action.payload
            }

        default:
             return state;
    }
}