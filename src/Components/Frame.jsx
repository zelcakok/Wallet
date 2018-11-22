import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Frame extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentWillUnMount(){

  }

  render(){
    return (
      <Card style={{margin:"5%"}}>
        <CardMedia
          style={{width:"auto"}}
          component="img"
          alt="Image"
          image="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Lizard
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
      </Card>
    )
  }
}
export default Frame;
