import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import SideBar from './SideBar';
import MainContent from './MainContent';
import Expenses from './Expenses';
import Income from './Income';
import Transfers from './Transfers';
import AccountForm from './Forms/AccountForm';
import HistoryLog from './HistoryLog';


import Grid from '@material-ui/core/Grid';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#a5d6a7',
      main: '#43a047',
      dark: '#2e7d32'
    },
    secondary: {
      light: '#ce93d8',
      main: '#ab47bc',
      dark: '#2e7d32'
    },
    action: {
      active: '#ce93d8',
      hover: '#ce93d8'
    }
  }
});

let routes = (
  <Switch>
    <Route path="/home" component={MainContent} />
    <Route path="/accounts" component={AccountForm} />
    <Route path="/expenses" component={Expenses} />
    <Route path="/income" component={Income} />
    <Route path="/transfers" component={Transfers} />
    <Route path="/history" component={HistoryLog} />
  </Switch>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Grid container>
          <Grid item xs={4}>
            <SideBar />
          </Grid>
          <Grid item xs={8}>
            {routes}
          </Grid>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}

export default App;
