/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','./Control','./Component','./Core','./library'],function(M,C,a,b,l){"use strict";var c=l.ComponentLifecycle;var d=C.extend("sap.ui.core.ComponentContainer",{metadata:{library:"sap.ui.core",properties:{name:{type:"string",defaultValue:null},url:{type:"sap.ui.core.URI",defaultValue:null},handleValidation:{type:"boolean",defaultValue:false},settings:{type:"object",defaultValue:null},propagateModel:{type:"boolean",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},lifecycle:{type:"sap.ui.core.ComponentLifecycle",defaultValue:c.Legacy}},associations:{component:{type:"sap.ui.core.UIComponent",multiple:false}}}});function s(o,v,S,D){var e=typeof v==="string"?b.getComponent(v):v;var O=o.getComponentInstance();if(O!==e){if(O){O.setContainer(undefined);if(D){O.destroy();}else{o._propagateProperties(true,O,M._oEmptyPropagatedProperties,true);}}o.setAssociation("component",e,S);e=o.getComponentInstance();if(e){e.setContainer(o);o.propagateProperties();o.propagateProperties(false);}}}d.prototype.getComponentInstance=function(){var e=this.getComponent();return e&&b.getComponent(e);};d.prototype.setComponent=function(v,S){s(this,v,S,this.getLifecycle()===c.Container);return this;};d.prototype.onBeforeRendering=function(){var o=this.getComponentInstance();if(!o){var n=this.getName();if(n){var f=function createAndSetComponent(){o=sap.ui.component({name:n,url:this.getUrl(),handleValidation:this.getHandleValidation(),settings:this.getSettings()});this.setComponent(o,true);}.bind(this);var O=a.getOwnerComponentFor(this);if(O){O.runAsOwner(f);}else{f();}}}if(o&&o.onBeforeRendering){o.onBeforeRendering();}};d.prototype.onAfterRendering=function(){var o=this.getComponentInstance();if(o&&o.onAfterRendering){o.onAfterRendering();}};d.prototype.exit=function(){s(this,undefined,true,this.getLifecycle()!==c.Application);};d.prototype.propagateProperties=function(n){var o=this.getComponentInstance();if(o&&this.getPropagateModel()){this._propagateProperties(n,o);C.prototype.propagateProperties.apply(this,arguments);}};d.prototype._propagateContextualSettings=function(){var o=this.getComponentInstance();if(o){o._applyContextualSettings(this._getContextualSettings());}};return d;});
