import React from "react";
// import {
//   ArcRotateCamera,
//   Vector3,
//   HemisphericLight,
//   MeshBuilder,
//   Color4,
//   Tools,
//   Color3,
//   StandardMaterial,
//   SceneLoader,
// } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import {
  AsciiArtPostProcess,
  DigitalRainPostProcess,
} from "@babylonjs/post-processes";
import "./DefaultPlayground.css";

const onSceneReady = (scene) => {
  //camera
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    0,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.setPosition(new BABYLON.Vector3(0, 0, 5)); /*0,0,13*/
  //transperent canvas
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  //disable zoom
  // camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 16;

  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);
  //light
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 1),
    scene
  );
  light.intensity = 0.8;
  var light2 = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, -1),
    scene
  );
  light2.intensity = 0.7;

  scene.onBeforeCameraRenderObservable.add(() => {
    scene.activeCamera.alpha += 0.002 * scene.getAnimationRatio();
  });

  // scene.environmentTexture = new BABYLON.CubeTexture(
  //   "https://raw.githubusercontent.com/veljko85/environments/gh-pages/environment.env",
  //   scene
  // );
  // scene.environmentIntensity = 0.5;

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://raw.githubusercontent.com/veljko85/GucciSylvieBag/gh-pages/meshes/",
    "torba7.glb",
    scene
  ).then((result) => {
    var torba = result.meshes[0];
    // torba.rotationQuaternion = null;
    if (window.innerWidth > window.innerHeight) {
      scene.activeCamera = scene.cameras[1];
    } else {
      scene.activeCamera = scene.cameras[2];
      scene.activeCamera.position.z = 0.3;
      scene.activeCamera.position.y = 0.01;
    }

    // scene.activeCamera.attachControl(canvas, false);

    scene.animationGroups
      .find((a) => a.name === "teloAction.001")
      .stop(true, 1, 0);

    var frame = 0;
    let oldValue = 0;
    let newValue = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      newValue = window.pageYOffset;
      // console.log(currentScroll);
      scene.beforeRender = function () {
        if (
          window.innerWidth < window.innerHeight &&
          currentScroll < 7100 &&
          currentScroll > 3000
        ) {
          scene.activeCamera.position.z = currentScroll / 10000;
        }
        if (oldValue < newValue) {
          frame = currentScroll * 0.001;
          torba.position.y = -(currentScroll * 0.0001);
          if (currentScroll < 100) {
            scene.animationGroups
              .find((a) => a.name === "teloAction.001")
              .start(false, 1, 0);
          }
        } else if (oldValue > newValue) {
          frame = currentScroll * 0.001;
          torba.position.y = -(currentScroll * 0.0001);
        }
        oldValue = newValue;
        if (window.innerWidth > window.innerHeight) {
          scene.animationGroups
            .find((a) => a.name === "CameraAction")
            .play(true);
          scene.animationGroups
            .find((a) => a.name === "CameraAction")
            .goToFrame(frame);
          scene.animationGroups.find((a) => a.name === "CameraAction").pause();
        } else {
          scene.animationGroups
            .find((a) => a.name === "CameraAction.002")
            .play(true);
          scene.animationGroups
            .find((a) => a.name === "CameraAction.002")
            .goToFrame(frame);
          scene.animationGroups
            .find((a) => a.name === "CameraAction.002")
            .pause();
        }
      };
    });
  });
  // var sphere = BABYLON.MeshBuilder.CreateSphere(
  //   "sphere",
  //   { diameter: 2, segments: 32 },
  //   scene
  // );

  // let postProcess = new AsciiArtPostProcess("AsciiArt", camera);
  // var postProcess = new DigitalRainPostProcess("DigitalRain", camera);
  var postProcess = new DigitalRainPostProcess(
    "DigitalRain",
    scene.activeCamera,
    "10px Monospace"
  );

  // let postProcess = new AsciiArtPostProcess("AsciiArt", camera);

  // BABYLON.SceneLoader.ImportMesh(
  //   "",
  //   "./assets/",
  //   "mask.babylon",
  //   scene,
  //   function (newMeshes) {}
  // );
};

export default () => (
  <div>
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      className="my-canvas"
    />
  </div>
);
