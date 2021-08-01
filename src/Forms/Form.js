import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';



const Form = (props) => {
    let form = Object.keys(props.form).map(formKey => {
        return <Grid item>
            <TextField label={formKey} variant="outlined" margin="normal" value={props.form[formKey]} onChange={e => props.updateForm(e, formKey)} />
        </Grid>
    })

    return (
        <Grid container>
            <form onSubmit={props.formSubmitHandler}>
                {form}
                <Button type="submit" variant="contained" color={props.btnColor}>Add {props.btnName}</Button>
            </form>
        </Grid>
    )
};

export default Form;