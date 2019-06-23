const initialState = {
    profile:null,
    profiles:null,
    loading:false
}

export default function(state = initialState , action){
    
    switch(action.type){
        case 'GET_PROFILE':
            return{
                ...state,
                profile:action.payload,
                loading:false
            };
        
        case 'GET_PROFILES':
            return{
                ...state,
                profiles:action.payload,
                loading:false
            };

        case 'LOADING_PROFILE':
            return{
                ...state,
                loading:true
            };
        
        case 'CLEAR_CONNECTED_PROFILE':
            return{
                ...state,
                profile:null
            }

        default:
            return state;
    }
}