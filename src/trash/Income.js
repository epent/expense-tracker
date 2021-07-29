import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    inputField: {
        display: 'block'
    }
});

const Income = () => {
    const [inputState, setInputState] = useState({
        from: '',
        to: '',
        comment: '',
        date: '',
        amount: ''
    });

    const classes = useStyles();

    const submitHandler = event => {
        event.preventDefault();
        console.log(inputState);
        setInputState({
            from: '',
            to: '',
            comment: '',
            date: '',
            amount: ''
        });
    }

    return (
        <div>
            <Typography
                variant="h3"
                align="center"
                color="primary"
                gutterBottom
            >
                Income
            </Typography>
            <Container>
                <form noValidate autoComplete="off" className={classes.inputField} onSubmit={submitHandler}>
                    <TextField id="outlined-basic" label="From" variant="outlined" value={inputState.from} onChange={e => setInputState({ ...inputState, from: e.target.value })} />
                    <TextField id="outlined-basic" label="To" variant="outlined" value={inputState.to} onChange={e => setInputState({ ...inputState, to: e.target.value })} />
                    <TextField id="outlined-basic" label="Comment" variant="outlined" value={inputState.comment} onChange={e => setInputState({ ...inputState, comment: e.target.value })} />
                    <TextField id="outlined-basic" label="Date" variant="outlined" value={inputState.date} onChange={e => setInputState({ ...inputState, date: e.target.value })} />
                    <TextField id="outlined-basic" label="Amount" variant="outlined" value={inputState.amount} onChange={e => setInputState({ ...inputState, amount: e.target.value })} />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<AddCircleIcon />}
                    >
                        Add income
                    </Button>
                </form>
            </Container>
        </div>
    );
};

export default Income;