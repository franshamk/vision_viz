/*
 * File: app.js
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

//@require @packageOverrides
Ext.Loader.setConfig({

});

Ext.application({
    viewport: {
        itemId: 'viewport'
    },

    models: [
        'TreeModel',
        'VblockModel'
    ],
    stores: [
        'VblockTreeStore',
        'MyJsonTreeStore'
    ],
    views: [
        'MainContainer'
    ],
    controllers: [
        'NavSheetController',
        'AppController',
        'VblockXMLController'
    ],
    name: 'MyApp',

    onViewportOrientationChange: function(viewport, newOrientation, width, height, eOpts) {
        this.getController("AppController").doOrientationChange(newOrientation);

    },

    launch: function() {

        Ext.Viewport.on([
        {
            event: 'orientationchange',
            fn: 'onViewportOrientationChange',
            scope: this
        }
        ]);
        Ext.create('MyApp.view.MainContainer', {fullscreen: true});
    }

});
