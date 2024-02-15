import React, { Component } from "react";
import { Stage, Layer } from "react-konva";
import CanvasImage from "./CanvasImage";
import CanvasText from "./CanvasText";
import AddedImage from "./AddedImage";
import TextProperties from "./TextProperties";
import Download from "./Download";
import Size from "./Size";

import {
  maxStageWidth,
  maxStageHeight,
  stageHeight,
  stageWidth,
} from "../utils/constants";
import { FormFile, Button, Row, Col, Container } from "react-bootstrap";

class MemeGenerator extends Component {
  state = {
    inputs: [],
    images: [],
    backgroundImageSrc: null,
    backgroundImageName: null,
    templateName: null,
    selectedText: null,
    selectedTextarea: null,
    selectedImage: null,
    src: "",
    stageWidth,
    stageHeight,
    triggerCors: false,
    defaultSelect: "",
  };

  componentDidMount() {
    window.document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" && this.state.selectedText != null) {
        this.deleteText();
      }
    });
  }

  addText = () => {
    const inputs = this.state.inputs;
    if (this.state.selectedText != null) {
      inputs[this.state.selectedText].selected = false;
    }
    this.setState((state) => ({
      inputs: [
        ...inputs,
        {
          x: 50,
          y: 50,
          text: "Enter the text",
          fontSize: 25,
          selected: true,
          fontFamily: "Impact",
          fill: "#ffffff",
          strokeWidth: 1.5,
          stroke: "#000000",
          shadowColor: "#000000",
          align: "center",
          padding: 5,
          letterSpacing: 1,
          lineHeight: 1,
          textDecoration: "none",
          verticalAlign: "top",
          opacity: 1,
          shadowOpacity: 1,
          shadowBlur: 0,
        },
      ],
      selectedText: state.inputs.length,
    }));
  };
  addImage = (e) => {
    const files = e.target.files;
  
    if (files.length > 0) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const fileName = files[0].name; // Extract filename from the file object
  
        this.setState((state) => {
          const newImage = {
            properties: {
              x: 40,
              y: 50,
            },
            src: e.target.result,
            name: fileName, // Include the file name in the state
          };
  
          const updatedImages = [...state.images, newImage];
          updatedImages.sort((a, b) => a.name.localeCompare(b.name));
  
          return {
            images: updatedImages,
            selectedImage: updatedImages.length - 1,
          };
        });
      };
  
      reader.readAsDataURL(files[0]);
    }
  };
  
  
 
  selectImage = (index) => {
    this.setState({
      selectedImage: index,
    });
  };

  handleDragEnd = (target, index) => {
    let inputs = this.state.inputs;
  inputs[index].x = target.x();
  inputs[index].y = target.y();
    this.setState({
      inputs,
    });
  };
  deleteImage = () => {
    const id = this.state.selectedImage;
    if (id != null) {
      const images = this.state.images;
      delete images[id];
      this.setState({
        images,
        selectedImage: null,
      });
    } else {
      alert("please select a image");
    }
  };
  addBackground = (e) => {
    const file = e.target.files[0];
    var fr = new FileReader();

    var img = new Image();
    img.onload = () => {
      img.width = 600;
      img.height = 600;
      let stageWidth = img.width;
      let stageHeight = img.height;
      stageWidth = stageWidth > maxStageWidth ? maxStageWidth : stageWidth;
      stageHeight = stageHeight > maxStageHeight ? maxStageHeight : stageHeight;

      this.setState({
        backgroundImageSrc: img.src,
        backgroundImageName: img.name,
        stageWidth,
        stageHeight,
      });
    };
    fr.onload = () => {
      img.name = file.name;
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };
  handleSizeChange = (e) => {
    this.setState({
      [e.target.name]: Number(e.target.value),
    });
  };
  returnDataURL = () => {
    const dataURL = this.stageRef ? this.stageRef.getStage().toDataURL() : null;
    return dataURL;
  };

  render() {
    const {
      src,
      backgroundImageSrc,
      stageWidth,
      stageHeight,
      images,
      inputs,
      selectedText,
      triggerCors,
    } = this.state;
    return (
      <Container className="pl-4 pr-4" fluid>
        <Row>
          

          <Col id="canvasDiv" md={8}   style={{
    border: '1px solid #ced4da', // Add a border
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '600px', // Add a box shadow
    
  }} >
            <Row>
              <label className="btn btn-outline-primary  col m-2">
                Add Plate
                <FormFile onChange={(e) => this.addBackground(e)} hidden />
              </label>
              <label className="btn btn-outline-primary  col m-2 d-flex">
                <span className="m-auto">Add Food</span>
                <FormFile onChange={(e) => this.addImage(e)} hidden />
              </label>
             
            </Row>
            <Row>
              <Col className="pt-2">
               <Stage
  className="justify-content-center mb-5 d-flex"
  width={stageWidth}
  height={stageHeight}
  style={{
    border: '1px solid #ced4da', // Add a border
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add a box shadow
    backgroundColor: '#f8f9fa', // Add a very light grey background color
  }}
  ref={(node) => {
    this.stageRef = node;
  }}
>

                  <Layer
                    ref={(node) => {
                      this.layerRef = node;
                    }}
                  >
                    <CanvasImage
                      src={backgroundImageSrc ? backgroundImageSrc : src}
                      width={stageWidth}
                      triggerCors={triggerCors}
                      height={stageHeight}
                      draggable={true}
                    />
                    {images &&
                      images.map((image, index) => {
                        if (image === undefined) {
                          return null;
                        } else {
                          return (
                            <AddedImage
                              src={image.src}
                              properties={image.properties}
                              key={index}
                              index={index}
                              selectedImage={this.selectImage}
                              deleteImage={this.deleteImage}
                              draggable={true}
                            />
                          );
                        }
                      })}
     
                  </Layer>
                </Stage>
              </Col>
            </Row>
          </Col>

          <Col className="memegenerator-right-col" md={4}>
            
            <Row>
              <Col>
                <Download
                  dataURL={() => this.returnDataURL()}
                  width={stageWidth}
                  height={stageHeight}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MemeGenerator;
