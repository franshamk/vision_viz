/*
 * File: app/view/DynamicList.js
 *
 * This file was generated by Sencha Architect version 3.0.0.
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

Ext.define('MyApp.view.DynamicList', {
    extend: 'Ext.dataview.NestedList',
    alias: 'widget.mynestedlist15',

    config: {
        html: 'hello hello hello',
        id: 'vblock-list',
        store: 'VblockTreeStore',
        updateTitleText: false,
        useTitleAsBackText: false,
        toolbar: {
            xtype: 'toolbar',
            docked: 'top',
            itemId: 'header-bar',
            layout: {
                pack: 'center',
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'spacer',
                    flex: 1
                },
                {
                    xtype: 'image',
                    height: 40,
                    width: 256,
                    src: 'resources/images/vblock-nav-logo.png'
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    itemId: 'show-nav-sheet-button',
                    width: 45,
                    iconCls: 'more'
                }
            ]
        },
        listeners: [
            {
                fn: 'onLevelLoaded',
                event: 'levelloaded'
            }
        ]
    },

    onLevelLoaded: function(self, list, index, target, record, e , eventOptions) {
        var me = this,
            store = list.getStore(),
            node = store.getAt(index);
        
        me.fireEvent('itemtap', this, list, index, target, record, e);
        if (node.isLeaf()) {
            me.fireEvent('leafitemtap', this, list, index, target, record, e);
            me.goToLeaf(node);
        }
        else {
            this.goToNode(node);
        }
    },

    onItemTap: function(list, index, target, record, e) {
        MyApp.app.getController('VblockRESTController').onDynListItemTap(this, list, index, target, record, e);
        
        
    }

});