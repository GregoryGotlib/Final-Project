import axios from 'axios';

export const searchProteinBy = (by,data, history) => dispatch =>{
    history.push('/showdata');
    axios.post('/api/profile/'+by+'/',data).then(res =>{
        dispatch({
            type: 'RESET',
            payload: {}
        })    
    })
};