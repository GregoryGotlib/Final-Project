import axios from 'axios';

export const getProfile = () => dispatch =>{
    dispatch(loadingProfile());
    axios.get('/api/profile').then(res =>
        dispatch({
            type:'GET_PROFILE',
            payload:res.data
        })
    ).catch(error=>
        dispatch({
            type:'GET_PROFILE',
            payload:{}
        })
    );
};

export const getProfiles = () => dispatch =>{
    dispatch(loadingProfile());
    axios.get('/api/profile/all').then(res =>
        dispatch({
            type:'GET_PROFILES',
            payload:res.data
        })
    ).catch(error=>
        dispatch({
            type:'GET_PROFILES',
            payload:null
        })
    );
};

export const createProfile = (data, history) => dispatch =>{
    console.log('inside create profile..')
    console.log(data);
    console.log(history);
    axios.post('/api/profile',data).then(res =>{
        history.push('/profiledash');
    }).catch(error=>{
        console.log(error.response.data)
        dispatch({
            type:'ERRORS',
            payload:error.response.data
        })
    });
};

export const getProfilebyRoute = (data) => dispatch =>{
    console.log('inside getProfileByRoute..');
    dispatch(loadingProfile());
            axios.get(`/api/profile/route/${data}`).then(res =>{
            dispatch({
                type: 'GET_PROFILE',
                payload: res.data
            })
        }).catch(error=>{
            dispatch({
                type:'ERRORS',
                payload: null
              })
        });
};
/*
export const uploadImage = (data,history) => dispatch =>{

    console.log('inside imageUpload action');

    axios.post('/api/profile/img_data',data).then(res=>{
        history.push('/dashboard');
    }).catch(error=>{
        console.log('Received an error with image upload')
        dispatch({
            type:'ERRORS',
            payload:error.response.data
        })
    });
};

export const deleteImage = (imageID) => dispatch =>{
    if(window.confirm('You sure you want to delete this image?')){
        axios.delete(`/api/profile/img_data/${imageID}`).then(res =>{
            console.log('inside delete image action...')
            dispatch({
                type: 'GET_PROFILE',
                payload: res.data
            })
        }).catch(error=>{
            dispatch({
                type:'ERRORS',
                payload: error.response.data
              })
        });
    }
};
*/
// Delete Account and Profile totaly
export const deleteAccount = () => dispatch =>{
    if(window.confirm('You sure you want to delete your account?')){
        axios.delete('/api/profile').then(res =>{
            dispatch({
                type: 'DECODED_USER',
                payload: {}
            })
        }).catch(error=>{
            dispatch({
                type:'ERRORS',
                payload: error.response.data
              })
        });
    }
};

// Set spinner gif when connecting
export const loadingProfile = ()=>{
    return{
        type:'LOADING_PROFILE'
    };
};

// Set user profile to null on disconnection 
export const clearConnectedProfile = ()=>{
    return{
        type:'CLEAR_CONNECTED_PROFILE'
    };
};

