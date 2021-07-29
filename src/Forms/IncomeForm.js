import React from 'react';

// import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const IncomeForm = (props) => {
    return (
        <Grid container>
            <form onSubmit={props.formSubmitHandler}>
                <Grid item>
                    <TextField label="From" variant="outlined" margin="normal" value={props.incomeForm.from} onChange={e => props.setIncomeForm({ ...props.incomeForm, from: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="To" variant="outlined" margin="normal" value={props.incomeForm.to} onChange={e => props.setIncomeForm({ ...props.incomeForm, to: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="Comment" variant="outlined" margin="normal" value={props.incomeForm.comment} onChange={e => props.setIncomeForm({ ...props.incomeForm, comment: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="Date" variant="outlined" margin="normal" value={props.incomeForm.date} onChange={e => props.setIncomeForm({ ...props.incomeForm, date: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="Amount" variant="outlined" margin="normal" value={props.incomeForm.amount} onChange={e => props.setIncomeForm({ ...props.incomeForm, amount: e.target.value })} />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="primary" >Add Income</Button>
                </Grid>
            </form>
        </Grid>
    )
};

export default IncomeForm;