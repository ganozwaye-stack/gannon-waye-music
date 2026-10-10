import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { GALAXY } from './setfree-hero/GalaxyBackdrop';
import { HEART_ART } from './setfree-hero/HeartPlanet';
import './galaxy-depth.css';

// Existing approved assets are displayed intact. No generated face, crop,
// colour filter, lettering overlay, WebGL scene or canvas particle engine.
export function GalaxyDepthBackdrop() {
  const reduced = useReducedMotion();
  return <div className="gw-depth-wallpaper" aria-hidden="true" data-testid="galaxy-depth-backdrop">
    <motion.img src={GALAXY} alt="" draggable="false" decoding="async"
      animate={reduced ? {scale:1.04} : {scale:[1.04,1.075,1.04]}}
      transition={reduced ? {duration:0} : {duration:70,repeat:Infinity,ease:'easeInOut'}}
      className="gw-depth-wallpaper-image" />
    <div className="gw-depth-shade" />
  </div>;
}

export function GalaxyDepthPlanet() {
  const reduced = useReducedMotion();
  const [finePointer,setFinePointer] = useState(false);
  const px=useMotionValue(0), py=useMotionValue(0);
  const x=useSpring(px,{stiffness:45,damping:22}), y=useSpring(py,{stiffness:45,damping:22});
  const foregroundX=useTransform(x,value=>value*14), foregroundY=useTransform(y,value=>value*10);
  const distantX=useTransform(x,value=>value*-5), distantY=useTransform(y,value=>value*-3);
  useEffect(()=>{
    const query=window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const refresh=()=>setFinePointer(query.matches);
    refresh();query.addEventListener('change',refresh);
    return ()=>query.removeEventListener('change',refresh);
  },[]);
  const parallax=finePointer&&!reduced;
  useEffect(()=>{if(!parallax){px.set(0);py.set(0);}},[parallax,px,py]);
  const move=event=>{
    const rect=event.currentTarget.getBoundingClientRect();
    px.set(Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5)));
    py.set(Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5)));
  };
  return <div className="gw-depth-stage" data-testid="galaxy-depth-stage" data-parallax={parallax?'enabled':'disabled'} data-reduced-motion={reduced?'true':'false'}
    onPointerMove={parallax?move:undefined} onPointerLeave={parallax?()=>{px.set(0);py.set(0);}:undefined}>
    <motion.div className="gw-distant-orbit" aria-hidden="true" style={{x:parallax?distantX:0,y:parallax?distantY:0}} />
    <motion.div className="gw-depth-planet-plane" data-testid="galaxy-depth-foreground" style={{x:parallax?foregroundX:0,y:parallax?foregroundY:0}}>
      <motion.div className="gw-depth-float" data-testid="galaxy-depth-float"
        animate={reduced?{y:0}:{y:[0,-8,0]}} transition={reduced?{duration:0}:{duration:12,repeat:Infinity,ease:'easeInOut'}}>
        <div className="gw-depth-orbit gw-depth-orbit-back" aria-hidden="true" />
        <img src={HEART_ART} alt="Gannon Waye’s face inside the original Set Free heart artwork" draggable="false" fetchPriority="high" decoding="async" className="gw-depth-heart" data-testid="galaxy-depth-heart" />
        <div className="gw-depth-orbit gw-depth-orbit-front" aria-hidden="true" />
        <span className="gw-depth-satellite" aria-hidden="true" />
      </motion.div>
    </motion.div>
  </div>;
}
