/*
 * File: app/controller/NavSheetController.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.controller.NavSheetController', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            navSheet: '#vblock-nav-sheet',
            componentView: '#spacetree-container',
            vblockList: '#vblock-list'
        },

        control: {
            "toolbar > #show-nav-sheet-button": {
                tap: 'onButtonTap'
            },
            "nestedlist": {
                itemtap: 'onNestedlistItemTap',
                back: 'onNestedlistBack'
            }
        }
    },

    onButtonTap: function(button, e, eOpts) {
        //history.pushState();
        //this.getNavSheet().show();

        this.getApplication().getController('VblockXMLController').fetchVBlockXML("https://fm-sim-nimsoft.internal.superna.net:8443/fm/about");
    },

    onNestedlistItemTap: function(nestedlist, list, index, target, record, e, eOpts) {
        history.pushState();
        this.doSelectionChange(record.id);
    },

    onNestedlistBack: function(nestedlist, node, lastActiveList, detailCardActive, eOpts) {
        console.log(node);

        history.back();
        return false;
    },

    redrawComponentView: function(node) {
        var json = this.getJSONFromTreeStore(node);

        if(!this.currentRoot || this.currentRoot != json.id) {
            this.currentRoot = json.id;
            this.redrawSpaceTree(json);
        }

        //emulate a click on the selected node.
        this.currentTree.onClick(node.internalId);

    },

    getJSONFromTreeStore: function(targetNode) {
        function convert(node) {

            var data = {
                id: node.internalId,
                name: node.raw.text,
                data: {
                    type: node.raw.type
                },
                children: []
            };
            node.childNodes.forEach(function(child) {
                data.children.push(convert(child));
            });

            return data;
        }

        //bubble up the tree to get the root node associated with this click.
        var root;

        targetNode.bubble(function(treenode) {
            root = treenode;
            if (root.raw.type == "Vblock") {
                return false;
            }
        });

        return convert(root);
    },

    redrawSpaceTree: function(json) {
        var component = this.getComponentView();

        component.removeAll(true, true); 

        function randomString() {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            return randomstring;
        }

        var divid = randomString();
        var divA = document.createElement("div");
        divA.setAttribute("id", divid);
        var width = component.element.getWidth();
        var height = component.element.getHeight();
        var offset = (width / 2) - 10;

        divA.style.width =  width + "px";
        divA.style.height = height + "px";


        component.add({
            xtype: 'panel',
            id: 'panel_' + divid,
            width: component.getWidth(),
            height: component.getHeight(),
            contentEl: divA
        });

        var labelType, useGradients, nativeTextSupport, animate;

        var me = this;

        var st = new $jit.ST({
            //id of viz container element
            injectInto: divid,
            //set duration for the animation
            duration: 400,
            //set animation transition type
            transition: $jit.Trans.Quart.easeInOut,
            //set distance between node and its children
            levelDistance: 15,
            offsetX: offset,
            //set only one level to show
            levelsToShow: 1,
            //enable panning
            Navigation: {
                enable:true,
                panning:true
            },
            Tips: {  
                enable: true,  
                type: 'HTML',  
                offsetX: 15,  
                offsetY: 15,  
                onShow: function(tip, node) { 
                    tip.innerHTML = '<div style="background-color:#d0d0d0;padding:3px">' + node.name + '</div>';  
                }  
            },
            Events: {
                enable: true,  
                onRightClick: function(node, eventInfo, e) { 
                    st.onClick(node.id);
                    me.setSelectedNode(node.id);
                    var node2 = me.getNodeFromId(node.id);
                    me.getController('ContextMenuController').showContextMenu(node2, e);
                }
            },

            //set node and edge styles
            //set overridable=true for styling individual
            //nodes or edges

            Node: {
                height: 60,
                width: 160,
                align: 'left',
                type: 'rectangle',
                color: '#aaa',
                overridable: true,
                lineWidth: 1
            },

            Edge: {
                type: 'bezier',
                overridable: true
            },

            //This method is called on DOM label creation.
            //Use this method to add event handlers and styles to
            //your node.
            onCreateLabel: function(label, node){
                label.id = node.id;
                var iconPath = me.getIconPath(node.data.type);

                var labelText = node.name;
                if(labelText.length > 15) {

                    labelText = labelText.slice(0, 15) + '...';
                }


                label.innerHTML = '<div> <img style="margin-left:3px;width:48px;height:48px;vertical-align:middle" src="' + iconPath + '"/><span style="margin-left:5px;font-size:0.6em">' + labelText + '</span></div>';
                label.onclick = function(){
                    st.onClick(node.id);
                };

                //set label styles
                var style = label.style;
                //style.width = 60 + 'px';
                //style.height = 17 + 'px';            
                style.cursor = 'pointer';
                //style.color = '#333';
                //style.fontSize = '0.8em';
                style.textAlign= 'center';
                style.paddingTop = '6px';
            },

            //This method is called right before plotting
            //a node. It's useful for changing an individual node
            //style properties before plotting it.
            //The data properties prefixed with a dollar
            //sign will override the global node style properties.
            onBeforePlotNode: function(node){
                //add some color to the nodes in the path between the
                //root node and the selected node.
                if (node.selected) {
                    node.data.$color = "#c1ddf1";
                } else {
                    delete node.data.$color;
                    //if the node belongs to the last plotted level
                    if(!node.anySubnode("exist")) {
                        //count children number
                        var count = 0;
                        node.eachSubnode(function(n) { count++; });
                        //assign a node color based on
                        //how many children it has
                        node.data.$color = (count > 0 ) ? "#e2eff8" : "#f0f0f0";                                
                    } 
                }
            },

            //This method is called right before plotting
            //an edge. It's useful for changing an individual edge
            //style properties before plotting it.
            //Edge data proprties prefixed with a dollar sign will
            //override the Edge global style properties.
            onBeforePlotLine: function(adj){
                if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                    adj.data.$color = "#eed";
                    adj.data.$lineWidth = 3;
                }
                else {
                    delete adj.data.$color;
                    delete adj.data.$lineWidth;
                }
            }
        });

        this.currentTree = st;
        //load json data
        this.currentTree.loadJSON(json);
        //compute node positions and layout
        this.currentTree.compute();
        //optional: make a translation of the tree
        //this.currentTree.geom.translate(new $jit.Complex(-200, 0), "current");
    },

    getNodeFromId: function(id) {
        var store =  Ext.getStore('VblockTreeStore');
        return store.getNodeById(id);
    },

    doSelectionChange: function(id) {
        var node = this.getNodeFromId(id);
        this.redrawComponentView(node);

    },

    getIconPath: function(nodeType) {
        if(!nodeType) {
            return 'resources/icons/vblock2.png';
        }

        var node = nodeType.toLowerCase();
        if(node == 'vblock') {
            return 'resources/icons/vblock2.png';
        }
        if(node == 'domain') {
            return 'resources/icons/domain2.png';
        }
        if(node == 'ucs') {
            return 'resources/icons/ucs2.png';
        }
        if(node == 'blade') {
            return 'resources/icons/blade.png';
        }
        if(node == 'chassis') {
            return 'resources/icons/chassis.png';
        }
        if(node == 'vm') {
            return 'resources/icons/vm2.png';
        }

        return 'resources/icons/error.png';
    },

    showVblockImage: function() {
        var panel = this.getComponentView();

        panel.removeAll(true, true);

        panel.add({
            xtype: 'image',
            flex: 1,
            src: 'resources/images/vblock-large.png'
        });


    },

    launch: function() {
        var me = this;
        window.addEventListener('popstate', function () {

            // if we're backing out of the flyout, then just close it.
            var nav = me.getNavSheet();
            if(!nav.isHidden()) {
                nav.hide();
                return;
            }

            // otherwise, scroll back in the list.
            var vblockList = me.getVblockList();  
            if (vblockList) {
                var node = vblockList.getLastNode(),
                    detailCard = vblockList.getDetailCard(),
                    detailCardActive = detailCard && vblockList.getActiveItem() == detailCard,
                    lastActiveList = vblockList.getLastActiveList();
                vblockList.doBack(vblockList, node, lastActiveList, detailCardActive);

                // if this one has a parent, go up the chain
                var parent = node.parentNode;

                // if the parent is defined, and it's not the root (i.e. it has its own parent)
                // then bubble back.  
                if(parent && parent.parentNode) {
                    me.doSelectionChange(parent.id);
                } else {
                    me.currentRoot = null;
                    me.showVblockImage();
                }
            }
        }, false);
    }

});