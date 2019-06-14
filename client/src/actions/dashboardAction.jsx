import axios from 'axios';

export const searchProteinBy = (by,data, history) => dispatch =>{
    console.log('inside search action..')
    console.log(history);
    history.push('/showdata');
    axios.post('/api/profile/'+by+'/',data).then(res =>{
        dispatch({
            type: 'RESET',
            payload: {}
        })    
    })
};