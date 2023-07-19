import React, { useEffect, useRef } from "react";
import {
  SkeletonRenderer,
  AssetManager,
  AtlasAttachmentLoader,
  SkeletonJson,
  Skeleton,
  AnimationStateData,
  AnimationState,
} from "@esotericsoftware/spine-canvas";

interface SpineProps {
  animation: string;
}

function GameCanvas(props: SpineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationStateRef = useRef<AnimationState | null>(null);
  useEffect(() => {
    async function load() {
      let canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      let context = canvas.getContext("2d");
      let skeletonRenderer = new SkeletonRenderer(context!);
      skeletonRenderer.triangleRendering = true; // Accelerate rendering with WebGL.

      // Load the assets.
      let assetManager = new AssetManager("spine_assets/fish-spine/");
      assetManager.loadText("character.json");
      assetManager.loadTextureAtlas("character.atlas");
      await assetManager.loadAll();

      // Create the texture atlas and skeleton data.
      let atlas = assetManager.require("character.atlas");
      let atlasLoader = new AtlasAttachmentLoader(atlas);
      let skeletonJson = new SkeletonJson(atlasLoader);
      let skeletonData = skeletonJson.readSkeletonData(
        assetManager.require("character.json")
      );

      // Instantiate a new skeleton based on the atlas and skeleton data.
      let skeleton = new Skeleton(skeletonData);
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform();
      let bounds = skeleton.getBoundsRect();

      // Setup an animation state with a default mix of 0.2 seconds.
      var animationStateData = new AnimationStateData(skeleton.data);
      animationStateData.defaultMix = 0.2;
      let animationState = new AnimationState(animationStateData);

      // Set the run animation, looping.
      //animationState.setAnimation(0, anim, true);
      animationState.setAnimation(0, props.animation, true);
      animationStateRef.current = animationState;
      // Start rendering.
      requestAnimationFrame(render);
      let lastFrameTime = Date.now() / 1000;
      function render() {
        if (!canvas || !context) {
          return;
        }
        // Calculate the delta time between this and the last frame in seconds.
        let now = Date.now() / 1000;
        let delta = now - lastFrameTime;
        lastFrameTime = now;

        // Resize the canvas drawing buffer if the canvas CSS width and height changed
        // and clear the canvas.
        if (
          canvas.width !== canvas.clientWidth ||
          canvas.height !== canvas.clientHeight
        ) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Center the skeleton and resize it so it fits inside the canvas.
        skeleton.x = canvas.width / 2;
        skeleton.y = canvas.height - canvas.height * 0.1;
        let scale = (canvas.height / bounds.height) * 0.8;
        skeleton.scaleX = scale;
        skeleton.scaleY = -scale;

        // Update and apply the animation state, update the skeleton's
        // world transforms and render the skeleton.
        animationState.update(delta);
        animationState.apply(skeleton);
        skeleton.updateWorldTransform();
        skeletonRenderer.draw(skeleton);

        requestAnimationFrame(render);
      }
    }

    load();
  }, []);

  useEffect(() => {
    let animationState = animationStateRef.current;
    if (animationState) {
      animationState.setAnimation(0, props.animation, true);
    }
  }, [props.animation]);

  return <canvas ref={canvasRef} id="canvas" />;
}

export default GameCanvas;
