/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','sap/ui/dt/ElementOverlay','sap/ui/dt/OverlayRegistry','sap/ui/dt/Selection','sap/ui/dt/ElementDesignTimeMetadata','sap/ui/dt/ElementUtil','sap/ui/dt/OverlayUtil','./library'],function(M,E,O,S,a,b,c){"use strict";var D=M.extend("sap.ui.dt.DesignTime",{metadata:{library:"sap.ui.dt",properties:{selectionMode:{type:"sap.ui.dt.SelectionMode",defaultValue:sap.ui.dt.SelectionMode.Single},designTimeMetadata:{type:"object"}},associations:{rootElements:{type:"sap.ui.core.Element",multiple:true}},aggregations:{plugins:{type:"sap.ui.dt.Plugin",multiple:true}},events:{elementOverlayCreated:{parameters:{elementOverlay:{type:"sap.ui.dt.ElementOverlay"}}},elementOverlayDestroyed:{parameters:{elementOverlay:{type:"sap.ui.dt.ElementOverlay"}}},selectionChange:{parameters:{selection:{type:"sap.ui.dt.Overlay[]"}}},syncing:{},synced:{},syncedPureOverlays:{},syncFailed:{}}}});D.prototype.init=function(){this._iOverlaysPending=0;this._oSelection=this.createSelection();this._oSelection.attachEvent("change",function(e){this.fireSelectionChange({selection:e.getParameter("selection")});},this);this._collectOverlaysDuringSyncing();};D.prototype._collectOverlaysDuringSyncing=function(){this._aOverlaysCreatedInLastBatch=[];this.attachSyncing(function(){this._aOverlaysCreatedInLastBatch=[];}.bind(this));this.attachElementOverlayCreated(function(e){var n=e.getParameter("elementOverlay");this._aOverlaysCreatedInLastBatch.push(n);}.bind(this));this.attachSyncedPureOverlays(function(){var p=this.getPlugins();this._aOverlaysCreatedInLastBatch.forEach(function(o){p.forEach(function(P){P.callElementOverlayRegistrationMethods(o);});});this.fireSynced();this._aOverlaysCreatedInLastBatch=[];}.bind(this));};D.prototype.exit=function(){delete this._iOverlaysPending;delete this._aOverlaysCreatedInLastBatch;this._destroyAllOverlays();this._oSelection.destroy();};D.prototype.createSelection=function(){return new S();};D.prototype.getSelection=function(){return this._oSelection.getSelection();};D.prototype.setSelectionMode=function(m){this.setProperty("selectionMode",m);this._oSelection.setMode(m);return this;};D.prototype.getPlugins=function(){return this.getAggregation("plugins")||[];};D.prototype.addPlugin=function(p){p.setDesignTime(this);this.addAggregation("plugins",p);return this;};D.prototype.insertPlugin=function(p,i){p.setDesignTime(this);this.insertAggregation("plugins",p,i);return this;};D.prototype.removePlugin=function(p){this.getPlugins().forEach(function(C){if(C===p){p.setDesignTime(null);return;}});this.removeAggregation("plugins",p);return this;};D.prototype.removeAllPlugins=function(){this.getPlugins().forEach(function(p){p.setDesignTime(null);});this.removeAllAggregation("plugins");return this;};D.prototype.getRootElements=function(){return this.getAssociation("rootElements")||[];};D.prototype.getDesignTimeMetadata=function(){return this.getProperty("designTimeMetadata")||{};};D.prototype.getDesignTimeMetadataFor=function(e){var C=e;var d=this.getDesignTimeMetadata();if(e.getMetadata){C=e.getMetadata().getName();}return d[C];};D.prototype.addRootElement=function(r){this.addAssociation("rootElements",r);var R=this._createElementOverlay(b.getElementInstance(r));this.attachEventOnce("synced",function(){R.placeInOverlayContainer();});return this;};D.prototype.removeRootElement=function(r){this.removeAssociation("rootElements",r);this._destroyOverlaysForElement(b.getElementInstance(r));return this;};D.prototype.removeAllRootElement=function(){this.removeAssociation("rootElements");this._destroyAllOverlays();return this;};D.prototype.createElementOverlay=function(e,i){return new E({inHiddenTree:i,element:e});};D.prototype.getElementOverlays=function(){var e=[];this._iterateRootElements(function(r){e=e.concat(this._getAllElementOverlaysIn(r));},this);return e;};D.prototype._createElementOverlay=function(e,i){e=b.fixComponentContainerElement(e);var o=O.getOverlay(e);if(e&&!e.bIsDestroyed&&!o){if(this._iOverlaysPending===0){this.fireSyncing();}this._iOverlaysPending++;o=this.createElementOverlay(e,i);if(o){o.attachRequestElementOverlaysForAggregation(this._onRequestElementOverlaysForAggregation,this);o.attachElementModified(this._onElementModified,this);o.attachDestroyed(this._onElementOverlayDestroyed,this);o.attachSelectionChange(this._onElementOverlaySelectionChange,this);}b.loadDesignTimeMetadata(e).then(function(d){if(!e||e.bIsDestroyed){return;}var m=d||{};jQuery.extend(true,m,this.getDesignTimeMetadataFor(e));var f=new a({libraryName:e.getMetadata().getLibraryName(),data:m});o.setDesignTimeMetadata(f);this.fireElementOverlayCreated({elementOverlay:o});}.bind(this)).catch(function(d){jQuery.sap.log.error("exception occured in sap.ui.dt.DesignTime._createElementOverlay",d.stack||d);if(d instanceof Error){this.fireSyncFailed();}}.bind(this)).then(function(){this._iOverlaysPending--;if(this._iOverlaysPending===0){this.fireSyncedPureOverlays();}}.bind(this));}return o;};D.prototype.createOverlay=function(e){return this._createElementOverlay(e);};D.prototype._destroyOverlaysForElement=function(e){var o=O.getOverlay(e);if(o){o.destroy();}};D.prototype._destroyAllOverlays=function(){this._iterateRootElements(function(r){this._destroyOverlaysForElement(r);},this);};D.prototype._createChildOverlaysForAggregation=function(e,A){var o=e.getAggregationOverlay(A);var d=e.getElementInstance();var C=b.getAggregation(d,A);b.iterateOverElements(C,function(f){this._createElementOverlay(f,o.isInHiddenTree());}.bind(this));};D.prototype._onRequestElementOverlaysForAggregation=function(e){var o=e.getSource();var A=e.getParameter("name");this._createChildOverlaysForAggregation(o,A);};D.prototype._onElementOverlayDestroyed=function(e){var o=e.getSource();if(o.getSelected()){this._oSelection.remove(o);}this.fireElementOverlayDestroyed({overlay:o});};D.prototype._onElementOverlaySelectionChange=function(e){var o=e.getSource();var s=e.getParameter("selected");this._oSelection.set(o,s);};D.prototype._onElementModified=function(e){var p=e.getParameters();if(p.type==="addOrSetAggregation"||p.type==="insertAggregation"){this._onElementOverlayAddAggregation(p.value,p.target,p.name);}else if(p.type==="setParent"){setTimeout(function(){if(!this.bIsDestroyed){this._checkIfOverlayShouldBeDestroyed(p.target);}}.bind(this),0);}};D.prototype._onElementOverlayAddAggregation=function(C,p,A){var P=O.getOverlay(p);var o=P.getAggregationOverlay(A);if(C instanceof sap.ui.core.Element){var d=O.getOverlay(C);if(!d){var i=P.getAggregationOverlay(A).isInHiddenTree();this._createElementOverlay(C,i);}else{o.addChild(d);}}};D.prototype._checkIfOverlayShouldBeDestroyed=function(e,p){var o=O.getOverlay(e);if(o&&(!this._isElementInRootElements(e)||e.sParentAggregationName==="dependents")){o.destroy();}};D.prototype._isElementInRootElements=function(e){var f=false;this._iterateRootElements(function(r){if(b.hasAncestor(e,r)){f=true;return false;}});return f;};D.prototype._iterateRootElements=function(s,o){var r=this.getRootElements();r.forEach(function(R){var d=b.getElementInstance(R);s.call(o||this,d);},this);};D.prototype._getAllElementOverlaysIn=function(e){var d=[];var o=O.getOverlay(e);if(o){c.iterateOverlayElementTree(o,function(C){d.push(C);});}return d;};return D;},true);
