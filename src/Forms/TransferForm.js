import React from 'react';

// import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';



const TransferForm = (props) => {
    return (
        <Grid container>
            <form onSubmit={props.formSubmitHandler}>
                <Grid item>
                    <TextField label="From" variant="outlined" margin="normal" />
                </Grid>
                <Grid item>
                    <TextField label="To" variant="outlined" margin="normal" />
                </Grid>
                <Grid item>
                    <TextField label="Comment" variant="outlined" margin="normal" />
                </Grid>
                <Grid item>
                    <TextField label="Date" variant="outlined" margin="normal" />
                </Grid>
                <Grid item>
                    <TextField label="Amount" variant="outlined" margin="normal" />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="secondary" >Transfer</Button>
                </Grid>
            </form>
        </Grid>
    )
};

export default TransferForm;