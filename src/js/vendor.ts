/*
 * @Author: xieshengyong
 * @Date: 2021-01-13 17:29:44
 * @LastEditTime: 2021-08-26 18:56:57
 * @LastEditors: xieshengyong
 */

/** The animate() method */
// import './app/util/fx';
/** Animated show, hide, toggle, and fade*() methods. */
// import './app/util/fx_methods';

import 'howler';

import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

import * as PIXI from 'pixi.js';

import * as PixiFilters from 'pixi-filters';
import * as Particles from 'pixi-particles';

window.PIXI = PIXI;

window.gsap = gsap;
window.PixiPlugin = PixiPlugin;

window.Particles = Particles;
window.PixiFilters = PixiFilters;
