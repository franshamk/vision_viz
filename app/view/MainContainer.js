/*
 * File: app/view/MainContainer.js
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

Ext.define('MyApp.view.MainContainer', {
    extend: 'Ext.Container',

    config: {
        id: 'main-container',
        layout: {
            type: 'card'
        },
        items: [
            {
                xtype: 'sheet',
                hidden: true,
                id: 'vblock-nav-sheet',
                left: 0,
                right: 100,
                hideOnMaskTap: true,
                layout: {
                    type: 'vbox'
                },
                enter: 'left',
                exit: 'left',
                stretchY: true,
                items: [
                    {
                        xtype: 'nestedlist',
                        flex: 1,
                        store: 'MyJsonTreeStore'
                    },
                    {
                        xtype: 'list',
                        flex: 1,
                        itemTpl: [
                            '<div>List Item {string}</div>'
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                itemId: 'portrait',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'nestedlist',
                        flex: 1,
                        id: 'vblock-list',
                        store: 'VblockTreeStore',
                        title: 'VBlock Nav',
                        toolbar: {
                            xtype: 'toolbar',
                            itemId: 'header-bar',
                            layout: {
                                pack: 'end',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'spacer'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'show-nav-sheet-button',
                                    ui: 'plain',
                                    width: 45,
                                    iconCls: 'more'
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'panel',
                        flex: 1,
                        itemId: 'spacetree-container',
                        layout: {
                            type: 'vbox'
                        }
                    }
                ]
            },
            {
                xtype: 'container',
                itemId: 'landscape',
                layout: {
                    type: 'hbox'
                }
            }
        ]
    }

});