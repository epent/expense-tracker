import React from 'react';

import SideBar from './SideBar';
import MainContent from './MainContent';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function App() {
  return (
    <Box>
      <Grid container>
        <Grid item xs={4}>
          <SideBar />
        </Grid>
        <Grid item xs={8}>
          <MainContent />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
