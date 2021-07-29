import React from 'react';

// import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';



const ExpenseForm = (props) => {
    return (
        <Grid container>
            <form onSubmit={props.formSubmitHandler}>
                <Grid item>
                    <TextField label="From" variant="outlined" margin="normal" value={props.expenseForm.from} onChange={e => props.setExpenseForm({ ...props.expenseForm, from: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="To" variant="outlined" margin="normal" value={props.expenseForm.to} onChange={e => props.setExpenseForm({ ...props.expenseForm, to: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="Comment" variant="outlined" margin="normal" value={props.expenseForm.comment} onChange={e => props.setExpenseForm({ ...props.expenseForm, comment: e.target.value })} />
                </Grid>
                <Grid item>
                    <TextField label="Date" variant="outlined" margin="normal" value={props.expenseForm.date} onChange={e => props.setExpenseForm({ ...props.expenseForm, date: e.target.value })} />
                </Grid>
                <Grid item >
                    <TextField label="Amount" variant="outlined" margin="normal" value={props.expenseForm.amount} onChange={e => props.setExpenseForm({ ...props.expenseForm, amount: e.target.value })} />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="secondary" >Add Expense</Button>
                </Grid>
            </form>
        </Grid>
    )
};

export default ExpenseForm;