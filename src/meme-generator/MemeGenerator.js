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
    images: {
      stage1: [],
      stage2: [],
    },
    backgroundImageSrc: null,
    backgroundImageName: null,
    templateName: null,
    selectedText: null,
    selectedTextarea: null,
    selectedImage: null,
    selectedStage: "stage1", // Initial stage selection
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

  addImage = (e) => {
    const files = e.target.files;
    const selectedStage = this.state.selectedStage;
  
    if (files.length > 0) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const fileName = files[0].name;
  
        const newImage = {
          properties: {
            x: 40,
            y: 50,
          },
          src: e.target.result,
          name: fileName,
        };
  
        this.setState((state) => {
          const updatedStageImages = [
            ...state.images[selectedStage],
            newImage,
          ];
  
          updatedStageImages.sort((a, b) => a.name.localeCompare(b.name));
  
          return {
            images: {
              ...state.images,
              [selectedStage]: updatedStageImages,
            },
            selectedImage: updatedStageImages.length - 1,
          };
        });
      };
  
      reader.readAsDataURL(files[0]);
    }
  };
  
  
  
  // Other methods...

  selectStage = (e, n) => {
    this.setState({ selectedStage: n });
    this.addImage(e);
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
          

        <Col
            id="canvasDiv"
            md={8}
            style={{
              border: '1px solid #ced4da',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '600px',
            }}
          >
            <Row>
              <label className="btn btn-outline-primary  col m-2">
                Add Plate
                <FormFile onChange={(e) => this.addBackground(e)} hidden />
              </label>
              <label className="btn btn-outline-primary col m-2 d-flex">
                <span className="m-auto">Add Food (Stage 2)</span>
                <FormFile onChange={(e) => this.selectStage(e,'stage2')} hidden />
              </label>
              <label className="btn btn-outline-primary col m-2 d-flex">
                <span className="m-auto">Add Food (Stage 1)</span>
                <FormFile onChange={(e) => this.selectStage(e,'stage1')} hidden />
              </label>
            </Row>
            <Row>
              <Col className="pt-2">
                <div className="d-flex">
                  <Stage
                    className="justify-content-center mb-5"
                    width={stageWidth / 2}
                    height={stageHeight}
                    style={{
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                    ref={(node) => {
                      this.stageRef = node;
                    }}
                  >
                    <Layer>
  <CanvasImage
    src={backgroundImageSrc ? backgroundImageSrc : src}
    width={stageWidth}
    triggerCors={triggerCors}
    height={stageHeight}
    draggable={true}
  />
  {images.stage1 &&
    images.stage1.map((image, index) => (
      <AddedImage
        src={image.src}
        properties={image.properties}
        key={index}
        index={index}
        selectedImage={this.selectImage}
        deleteImage={this.deleteImage}
        draggable={true}
      />
    ))}
</Layer>

                  </Stage>

                  <Stage
                    className="justify-content-center mb-5"
                    width={stageWidth / 2}
                    height={stageHeight}
                    style={{
                      border: '1px solid #ced4da',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                    ref={(node) => {
                      this.stageRef = node;
                    }}
                  >
                    <Layer>
  <CanvasImage
    src={backgroundImageSrc ? backgroundImageSrc : src}
    width={stageWidth}
    triggerCors={triggerCors}
    height={stageHeight}
    draggable={true}
  />
  {images.stage2 &&
    images.stage2.map((image, index) => (
      <AddedImage
        src={image.src}
        properties={image.properties}
        key={index}
        index={index}
        selectedImage={this.selectImage}
        deleteImage={this.deleteImage}
        draggable={true}
      />
    ))}
</Layer>

                  </Stage>
                </div>
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
