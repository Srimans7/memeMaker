import React, { Component } from 'react'
import { Image, Transformer, Group } from 'react-konva';
import CloseButton from "./CloseButton"
export default class AddedImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      selected: true,
    }
    this.deleteRef = React.createRef();
  }

  componentDidMount() {

    this.loadImage();

  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  handleSelect = () => {

    this.handleSelected()

    if (this.state.selected === true) {
     
      this.props.selectedImage(this.props.index);
    }
    else {
      this.props.selectedImage(null);
    }
  }

  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = this.props.src;
    this.image.height = 200;
    this.image.width = 200;

    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
   
  }
  handleSelected = () => {
    this.setState(state => ({
      selected: !state.selected
    }))
  }
  render() {
    return (
      <React.Fragment>
        <Group draggable
          onClick={() => this.handleSelect()}
          onTouchStart={() => this.handleSelect()}
          ref={node => {
            this.imageNode = node;
          }}
        >

          <Image
            image={this.state.image}
            {...this.props.properties}
          />
        </Group>
        {this.state.selected &&
          <Group>

            
            <CloseButton deleteRef={this.deleteRef} delete={this.props.deleteImage} />
          </Group>
        }


      </React.Fragment>
    )
  }
}
