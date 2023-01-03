import { useEffect, useState } from 'react';
import './App.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';



const sx = {
  height: '500px',
  width: 'fit-content',
  borderRadius: '15px'
}

function App() {
  const initialState = localStorage.getItem('prices') ? JSON.parse(localStorage.getItem('prices')) : [];
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const data = async () => {
      const fetched = await fetch(process.env.API_URL);
      const result = await fetched.text();
      let json = JSON.parse(result);
      if (localStorage.getItem('prices')) {
        const storage = JSON.parse(localStorage.getItem('prices'));
        json = json.map((store) => {
          if(store.priceUrl.price < storage[storage.findIndex((oldStore) => oldStore.name === store.name)].priceUrl.price) {
            return {
              ...store,
              priceDelta: Math.floor(((storage[storage.findIndex((oldStore) => oldStore.name === store.name)].priceUrl.price - store.priceUrl.price) / storage[storage.findIndex((oldStore) => oldStore.name === store.name)].priceUrl.price) * 100) * (-1)
            }
          }
          if(store.priceUrl.price > storage[storage.findIndex((oldStore) => oldStore.name === store.name)].priceUrl.price) {
            return {
              ...store,
              priceDelta: Math.floor(((store.priceUrl.price - storage[storage.findIndex((oldStore) => oldStore.name === store.name)].priceUrl.price) / store.priceUrl.price) * 100)
            } 
          }
          return store;
        })
        
      } 
        localStorage.clear();
        json.sort((a, b) => a.priceUrl.price - b.priceUrl.price)
        localStorage.setItem('prices', JSON.stringify(json));
        setState(json);
      
     
    }
    data();
  }, [])
  

  return (
    
  <div className="App">
        <AppBar position="static" sx={{ marginBottom: '10px', backgroundColor: '#DE1B45', opacity: 0.95, color: 'white' }}>
          <Toolbar sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          >
            PIEBALGAS "JUBILEJAS" CENAS
          </Typography>
          </Toolbar>
        </AppBar>
        {state.map(el => {
          return (
          <Card sx={{ maxWidth: 525, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '5px', opacity: 0.95 }} key={el.name}>
            <CardMedia component="img" sx={{ maxWidth: 300, maxHeight: 50, width: 'auto', height: 'auto', marginLeft: 'auto', marginRight: 'auto'}} image={el.priceUrl.img}/>
            <CardContent sx={{display: 'flex'}}>
              <Typography variant='h5' sx={{ display: 'block', fontWeight: 'bold', color: '#118C4F' }}>
              €{el.priceUrl.price}
              </Typography>
              {el.priceDelta ? <Tooltip title="Cenas izmaiņa, kopš pēdējo reizi skatījies cenas"><Typography variant='caption' sx={{ position: 'absolute', marginLeft: '65px', color: el.priceDelta > 0 ? 'red' : '#118C4F' }}>{el.priceDelta > 0 ? `+${el.priceDelta}` : el.priceDelta}%</Typography></Tooltip> : null}
            </CardContent>
            <CardActions>
              <Button sx={{ minWidth: 75, marginLeft: '10px' }} target="_blank" href={el.priceUrl.url}>Iet uz lapu</Button>
            </CardActions>
          </Card>
          )
        })}
      
    
  </div>
   
  );
}

export default App;
